import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { requireAuth, type AuthedRequest } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, async (req: AuthedRequest, res) => {
  const favorites = await prisma.favorite.findMany({
    where: { userId: req.user!.userId },
    select: { carId: true },
  })
  return res.json({ carIds: favorites.map((f) => f.carId) })
})

router.post('/:carId', requireAuth, async (req: AuthedRequest, res) => {
  const carId = req.params.carId
  const car = await prisma.car.findUnique({ where: { id: carId } })
  if (!car) return res.status(404).json({ error: 'Car not found' })

  await prisma.favorite.upsert({
    where: {
      userId_carId: { userId: req.user!.userId, carId },
    },
    create: { userId: req.user!.userId, carId },
    update: {},
  })

  const favorites = await prisma.favorite.findMany({
    where: { userId: req.user!.userId },
    select: { carId: true },
  })
  return res.json({ carIds: favorites.map((f) => f.carId) })
})

router.delete('/:carId', requireAuth, async (req: AuthedRequest, res) => {
  await prisma.favorite.deleteMany({
    where: { userId: req.user!.userId, carId: req.params.carId },
  })
  const favorites = await prisma.favorite.findMany({
    where: { userId: req.user!.userId },
    select: { carId: true },
  })
  return res.json({ carIds: favorites.map((f) => f.carId) })
})

export default router
