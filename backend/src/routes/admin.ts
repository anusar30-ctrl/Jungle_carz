import { Router } from 'express'
import { BookingStatus, CarCategory, Role } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { requireAdmin, requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/stats', requireAuth, requireAdmin, async (_req, res) => {
  const [cars, tourism, bookings, pending, users, admins, revenueAgg] =
    await Promise.all([
      prisma.car.count(),
      prisma.car.count({ where: { category: CarCategory.TOURISM } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: BookingStatus.PENDING } }),
      prisma.user.count(),
      prisma.user.count({ where: { role: Role.ADMIN } }),
      prisma.booking.aggregate({
        _sum: { total: true },
        where: {
          status: {
            in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
          },
        },
      }),
    ])

  return res.json({
    stats: {
      cars,
      tourism,
      bookings,
      pending,
      users,
      admins,
      revenue: revenueAgg._sum.total ?? 0,
    },
  })
})

export default router
