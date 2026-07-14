import { Router } from 'express'
import { Role } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { requireAdmin, requireAuth, type AuthedRequest } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, requireAdmin, async (_req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      fullName: true,
      mobile: true,
      provider: true,
      role: true,
      createdAt: true,
    },
  })

  return res.json({
    users: users.map((u) => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      mobile: u.mobile,
      provider: u.provider.toLowerCase(),
      role: u.role === 'ADMIN' ? 'admin' : 'user',
      createdAt: u.createdAt.toISOString(),
    })),
  })
})

router.patch('/:id/role', requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
  const role = String(req.body.role || '').toLowerCase()
  if (role !== 'admin' && role !== 'user') {
    return res.status(400).json({ error: 'Invalid role' })
  }

  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role: role === 'admin' ? Role.ADMIN : Role.USER },
    })
    return res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        mobile: user.mobile,
        provider: user.provider.toLowerCase(),
        role: user.role === 'ADMIN' ? 'admin' : 'user',
        createdAt: user.createdAt.toISOString(),
      },
    })
  } catch {
    return res.status(404).json({ error: 'User not found' })
  }
})

router.delete('/:id', requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
  if (req.params.id === req.user!.userId) {
    return res.status(400).json({ error: 'Cannot delete your own account' })
  }

  try {
    await prisma.user.delete({ where: { id: req.params.id } })
    return res.json({ ok: true })
  } catch {
    return res.status(404).json({ error: 'User not found' })
  }
})

export default router
