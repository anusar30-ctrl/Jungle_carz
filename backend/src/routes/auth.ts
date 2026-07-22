import { Router } from 'express'
import { z } from 'zod'
import { Provider, Role } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { hashPassword, signToken, verifyPassword } from '../lib/auth.js'
import { verifyGoogleIdToken } from '../lib/googleAuth.js'
import { requireAuth, type AuthedRequest } from '../middleware/auth.js'

const router = Router()

function publicUser(user: {
  id: string
  email: string
  fullName: string
  mobile: string
  provider: Provider
  role: Role
  avatar: string | null
  createdAt: Date
}) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    mobile: user.mobile,
    provider: user.provider.toLowerCase(),
    role: user.role === 'ADMIN' ? 'admin' : 'user',
    avatar: user.avatar ?? undefined,
    createdAt: user.createdAt.toISOString(),
  }
}

const registerSchema = z.object({
  fullName: z.string().min(2).optional(),
  email: z.string().email(),
  mobile: z.string().optional().default(''),
  password: z.string().min(6),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const googleSchema = z.object({
  idToken: z.string().min(1),
})

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message })
  }

  const email = parsed.data.email.toLowerCase()
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' })
  }

  const fullName =
    parsed.data.fullName?.trim() ||
    email.split('@')[0]?.replace(/[._-]+/g, ' ').trim() ||
    'User'
  const mobile = parsed.data.mobile.replace(/\D/g, '')

  const user = await prisma.user.create({
    data: {
      email,
      fullName,
      mobile,
      passwordHash: await hashPassword(parsed.data.password),
      provider: Provider.EMAIL,
      role: Role.USER,
    },
  })

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  })

  return res.status(201).json({ token, user: publicUser(user) })
})

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid email or password' })
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  })

  if (!user?.passwordHash) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const ok = await verifyPassword(parsed.data.password, user.passwordHash)
  if (!ok) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  })

  return res.json({ token, user: publicUser(user) })
})

router.post('/google', async (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(503).json({ error: 'Google sign-in is not configured on the server' })
  }

  const parsed = googleSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid Google sign-in request' })
  }

  try {
    const profile = await verifyGoogleIdToken(parsed.data.idToken)
    const existing = await prisma.user.findUnique({ where: { email: profile.email } })

    const user = existing
      ? await prisma.user.update({
          where: { id: existing.id },
          data: {
            ...(profile.avatar && !existing.avatar ? { avatar: profile.avatar } : {}),
            ...(existing.fullName.trim().length === 0
              ? { fullName: profile.fullName }
              : {}),
          },
        })
      : await prisma.user.create({
          data: {
            email: profile.email,
            fullName: profile.fullName,
            mobile: '',
            provider: Provider.GOOGLE,
            role: Role.USER,
            avatar: profile.avatar,
          },
        })

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return res.json({ token, user: publicUser(user) })
  } catch {
    return res.status(401).json({ error: 'Google sign-in failed. Please try again.' })
  }
})

router.get('/me', requireAuth, async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } })
  if (!user) return res.status(404).json({ error: 'User not found' })
  return res.json({ user: publicUser(user) })
})

router.patch('/me', requireAuth, async (req: AuthedRequest, res) => {
  const fullName = String(req.body.fullName ?? '').trim()
  const mobile = String(req.body.mobile ?? '').replace(/\D/g, '')
  if (fullName.length < 2) {
    return res.status(400).json({ error: 'Full name is required' })
  }

  const user = await prisma.user.update({
    where: { id: req.user!.userId },
    data: { fullName, mobile },
  })

  return res.json({ user: publicUser(user) })
})

export default router
