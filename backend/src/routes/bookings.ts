import { Router } from 'express'
import { BookingStatus, RentalType } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { requireAdmin, requireAuth, type AuthedRequest } from '../middleware/auth.js'

const router = Router()

function mapBooking(b: {
  id: string
  reference: string
  userId: string
  carId: string
  carName: string
  carImage: string
  rentalType: RentalType
  pickupCity: string
  dropCity: string
  pickupDate: string
  dropDate: string
  pickupTime: string
  dropTime: string
  days: number
  pricePerDay: number
  basePrice: number
  gst: number
  total: number
  customerName: string
  customerEmail: string
  customerMobile: string
  status: BookingStatus
  createdAt: Date
}) {
  return {
    id: b.id,
    reference: b.reference,
    userId: b.userId,
    carId: b.carId,
    carName: b.carName,
    carImage: b.carImage,
    rentalType: b.rentalType === 'WITH_DRIVER' ? 'with-driver' : 'self-drive',
    pickupCity: b.pickupCity,
    dropCity: b.dropCity,
    pickupDate: b.pickupDate,
    dropDate: b.dropDate,
    pickupTime: b.pickupTime,
    dropTime: b.dropTime,
    days: b.days,
    pricePerDay: b.pricePerDay,
    basePrice: b.basePrice,
    gst: b.gst,
    total: b.total,
    customer: {
      fullName: b.customerName,
      email: b.customerEmail,
      mobile: b.customerMobile,
    },
    status: b.status.toLowerCase(),
    createdAt: b.createdAt.toISOString(),
  }
}

function makeReference() {
  const num = Math.floor(100000 + Math.random() * 900000)
  return `JC-2026-${String(num).slice(0, 6)}`
}

const createSchema = z.object({
  carId: z.string().min(1),
  rentalType: z.enum(['self-drive', 'with-driver']),
  pickupCity: z.string().min(1),
  dropCity: z.string().min(1),
  pickupDate: z.string().min(1),
  dropDate: z.string().min(1),
  pickupTime: z.string().min(1),
  dropTime: z.string().min(1),
  days: z.number().int().positive(),
  customer: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    mobile: z.string().min(10),
  }),
})

router.get('/mine', requireAuth, async (req: AuthedRequest, res) => {
  const bookings = await prisma.booking.findMany({
    where: { userId: req.user!.userId },
    orderBy: { createdAt: 'desc' },
  })
  return res.json({ bookings: bookings.map(mapBooking) })
})

router.get('/', requireAuth, requireAdmin, async (_req, res) => {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return res.json({ bookings: bookings.map(mapBooking) })
})

router.post('/', requireAuth, async (req: AuthedRequest, res) => {
  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message })
  }

  const car = await prisma.car.findUnique({ where: { id: parsed.data.carId } })
  if (!car) return res.status(404).json({ error: 'Car not found' })

  const basePrice = car.pricePerDay * parsed.data.days
  const gst = Math.round(basePrice * 0.18)
  const total = basePrice + gst

  const booking = await prisma.booking.create({
    data: {
      reference: makeReference(),
      userId: req.user!.userId,
      carId: car.id,
      carName: car.name,
      carImage: (car.images as string[])[0] ?? '',
      rentalType:
        parsed.data.rentalType === 'with-driver'
          ? RentalType.WITH_DRIVER
          : RentalType.SELF_DRIVE,
      pickupCity: parsed.data.pickupCity,
      dropCity: parsed.data.dropCity,
      pickupDate: parsed.data.pickupDate,
      dropDate: parsed.data.dropDate,
      pickupTime: parsed.data.pickupTime,
      dropTime: parsed.data.dropTime,
      days: parsed.data.days,
      pricePerDay: car.pricePerDay,
      basePrice,
      gst,
      total,
      customerName: parsed.data.customer.fullName,
      customerEmail: parsed.data.customer.email,
      customerMobile: parsed.data.customer.mobile.replace(/\D/g, ''),
      status: BookingStatus.PENDING,
    },
  })

  return res.status(201).json({ booking: mapBooking(booking) })
})

router.patch('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const status = String(req.body.status || '').toUpperCase() as BookingStatus
  if (!Object.values(BookingStatus).includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }

  try {
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status },
    })
    return res.json({ booking: mapBooking(booking) })
  } catch {
    return res.status(404).json({ error: 'Booking not found' })
  }
})

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await prisma.booking.delete({ where: { id: req.params.id } })
    return res.json({ ok: true })
  } catch {
    return res.status(404).json({ error: 'Booking not found' })
  }
})

export default router
