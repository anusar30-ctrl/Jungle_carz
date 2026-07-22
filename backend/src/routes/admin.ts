import { Router } from 'express'
import { BookingStatus, CarCategory, Role } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { requireAdmin, requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/stats', requireAuth, requireAdmin, async (_req, res) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [cars, tourism, bookings, pending, guestBookings, users, admins, newUsers7d, revenueAgg, recentSignups, recentBookings] =
    await Promise.all([
      prisma.car.count(),
      prisma.car.count({ where: { category: CarCategory.TOURISM } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: BookingStatus.PENDING } }),
      prisma.booking.count({ where: { isGuest: true } }),
      prisma.user.count(),
      prisma.user.count({ where: { role: Role.ADMIN } }),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.booking.aggregate({
        _sum: { total: true },
        where: {
          status: {
            in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
          },
        },
      }),
      prisma.user.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          email: true,
          fullName: true,
          mobile: true,
          provider: true,
          createdAt: true,
        },
      }),
      prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          user: { select: { email: true, fullName: true } },
        },
      }),
    ])

  return res.json({
    stats: {
      cars,
      tourism,
      bookings,
      pending,
      guestBookings,
      users,
      admins,
      newUsers7d,
      revenue: revenueAgg._sum.total ?? 0,
    },
    recentSignups: recentSignups.map((u) => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      mobile: u.mobile,
      provider: u.provider.toLowerCase(),
      createdAt: u.createdAt.toISOString(),
    })),
    recentBookings: recentBookings.map((b) => ({
      id: b.id,
      reference: b.reference,
      carName: b.carName,
      isGuest: b.isGuest,
      customerName: b.customerName,
      customerEmail: b.customerEmail,
      customerMobile: b.customerMobile,
      accountEmail: b.user?.email,
      total: b.total,
      status: b.status.toLowerCase(),
      createdAt: b.createdAt.toISOString(),
    })),
  })
})

export default router
