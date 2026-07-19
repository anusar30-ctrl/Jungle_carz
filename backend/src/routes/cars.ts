import { Router, type Request } from 'express'
import { CarCategory, Prisma, type Car } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { requireAdmin, requireAuth, type AuthedRequest } from '../middleware/auth.js'
import type { IdParams } from '../types/express.js'

const router = Router()

function mapCar(car: Car) {
  return {
    id: car.id,
    brand: car.brand,
    model: car.model,
    name: car.name,
    vehicleType: car.vehicleType,
    category: car.category === 'TOURISM' ? 'tourism' : 'regular',
    year: car.year,
    transmission: car.transmission,
    fuel: car.fuel,
    seats: car.seats,
    mileage: car.mileage,
    rating: car.rating,
    reviews: car.reviews,
    pricePerDay: car.pricePerDay,
    originalPrice: car.originalPrice,
    securityDeposit: car.securityDeposit,
    images: car.images as string[],
    featureChips: car.featureChips as string[],
    amenities: car.amenities as { ac: boolean; bluetooth: boolean; gps: boolean },
    badges: car.badges as Array<'available' | 'discount' | 'popular'>,
    discountPercent: car.discountPercent ?? undefined,
    tag: car.tag ?? undefined,
    cancellationPolicy: car.cancellationPolicy,
    unlimitedKm: car.unlimitedKm,
    instantBooking: car.instantBooking,
    freeCancellation: car.freeCancellation,
    airConditioning: car.airConditioning,
    bluetoothFeature: car.bluetoothFeature,
    sunroof: car.sunroof,
    popularity: car.popularity,
    locationCity: car.locationCity ?? undefined,
    locationName: car.locationName ?? undefined,
    locationAddress: car.locationAddress ?? undefined,
    latitude: car.latitude ?? undefined,
    longitude: car.longitude ?? undefined,
    createdAt: car.createdAt.toISOString().slice(0, 10),
  }
}

const carBodySchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  name: z.string().optional(),
  vehicleType: z.string().min(1),
  category: z.enum(['regular', 'tourism']).optional(),
  year: z.number().int().optional(),
  transmission: z.string().min(1),
  fuel: z.string().min(1),
  seats: z.number().int().positive(),
  mileage: z.string().min(1),
  pricePerDay: z.number().int().positive(),
  originalPrice: z.number().int().positive(),
  securityDeposit: z.number().int().nonnegative(),
  images: z.array(z.string()).default([]),
  featureChips: z.array(z.string()).default([]),
  amenities: z
    .object({
      ac: z.boolean(),
      bluetooth: z.boolean(),
      gps: z.boolean(),
    })
    .default({ ac: true, bluetooth: true, gps: true }),
  badges: z.array(z.string()).default(['available']),
  discountPercent: z.number().optional(),
  tag: z.string().optional(),
  cancellationPolicy: z.string().default('Free cancellation up to 24 hrs'),
  unlimitedKm: z.boolean().default(true),
  instantBooking: z.boolean().default(true),
  freeCancellation: z.boolean().default(true),
  airConditioning: z.boolean().default(true),
  bluetoothFeature: z.boolean().default(true),
  sunroof: z.boolean().default(false),
  rating: z.number().optional(),
  reviews: z.number().optional(),
  popularity: z.number().optional(),
  locationCity: z.string().optional(),
  locationName: z.string().optional(),
  locationAddress: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
})

router.get('/', async (req, res) => {
  const category = req.query.category as string | undefined
  const cars = await prisma.car.findMany({
    where:
      category === 'tourism'
        ? { category: CarCategory.TOURISM }
        : category === 'regular'
          ? { category: CarCategory.REGULAR }
          : undefined,
    orderBy: [{ popularity: 'desc' }, { createdAt: 'desc' }],
  })
  return res.json({ cars: cars.map(mapCar) })
})

router.get('/:id', async (req: Request<IdParams>, res) => {
  const { id } = req.params
  const car = await prisma.car.findUnique({ where: { id } })
  if (!car) return res.status(404).json({ error: 'Car not found' })
  return res.json({ car: mapCar(car) })
})

router.post('/', requireAdmin, async (req: AuthedRequest, res) => {
  const parsed = carBodySchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message })
  }

  const data = parsed.data
  const car = await prisma.car.create({
    data: {
      brand: data.brand,
      model: data.model,
      name: data.name || `${data.brand} ${data.model}`,
      vehicleType: data.vehicleType,
      category:
        data.category === 'tourism' ? CarCategory.TOURISM : CarCategory.REGULAR,
      year: data.year ?? new Date().getFullYear(),
      transmission: data.transmission,
      fuel: data.fuel,
      seats: data.seats,
      mileage: data.mileage,
      pricePerDay: data.pricePerDay,
      originalPrice: data.originalPrice,
      securityDeposit: data.securityDeposit,
      images:
        data.images.length > 0
          ? data.images
          : [
              'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
            ],
      featureChips: data.featureChips,
      amenities: data.amenities,
      badges: data.badges,
      discountPercent: data.discountPercent,
      tag: data.tag,
      cancellationPolicy: data.cancellationPolicy,
      unlimitedKm: data.unlimitedKm,
      instantBooking: data.instantBooking,
      freeCancellation: data.freeCancellation,
      airConditioning: data.airConditioning,
      bluetoothFeature: data.bluetoothFeature,
      sunroof: data.sunroof,
      rating: data.rating ?? 4.5,
      reviews: data.reviews ?? 0,
      popularity: data.popularity ?? 70,
      locationCity: data.locationCity,
      locationName: data.locationName,
      locationAddress: data.locationAddress,
      latitude: data.latitude,
      longitude: data.longitude,
    },
  })

  return res.status(201).json({ car: mapCar(car) })
})

router.put('/:id', requireAdmin, async (req: AuthedRequest<IdParams>, res) => {
  const parsed = carBodySchema.partial().safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message })
  }

  const { id } = req.params

  try {
    const data = parsed.data
    const car = await prisma.car.update({
      where: { id },
      data: {
        ...('brand' in data ? { brand: data.brand } : {}),
        ...('model' in data ? { model: data.model } : {}),
        ...('name' in data ? { name: data.name } : {}),
        ...('vehicleType' in data ? { vehicleType: data.vehicleType } : {}),
        ...('category' in data
          ? {
              category:
                data.category === 'tourism'
                  ? CarCategory.TOURISM
                  : CarCategory.REGULAR,
            }
          : {}),
        ...('year' in data ? { year: data.year } : {}),
        ...('transmission' in data ? { transmission: data.transmission } : {}),
        ...('fuel' in data ? { fuel: data.fuel } : {}),
        ...('seats' in data ? { seats: data.seats } : {}),
        ...('mileage' in data ? { mileage: data.mileage } : {}),
        ...('pricePerDay' in data ? { pricePerDay: data.pricePerDay } : {}),
        ...('originalPrice' in data ? { originalPrice: data.originalPrice } : {}),
        ...('securityDeposit' in data
          ? { securityDeposit: data.securityDeposit }
          : {}),
        ...('images' in data ? { images: data.images } : {}),
        ...('featureChips' in data ? { featureChips: data.featureChips } : {}),
        ...('amenities' in data ? { amenities: data.amenities } : {}),
        ...('badges' in data ? { badges: data.badges } : {}),
        ...('discountPercent' in data
          ? { discountPercent: data.discountPercent }
          : {}),
        ...('tag' in data ? { tag: data.tag } : {}),
        ...('cancellationPolicy' in data
          ? { cancellationPolicy: data.cancellationPolicy }
          : {}),
        ...('unlimitedKm' in data ? { unlimitedKm: data.unlimitedKm } : {}),
        ...('instantBooking' in data
          ? { instantBooking: data.instantBooking }
          : {}),
        ...('freeCancellation' in data
          ? { freeCancellation: data.freeCancellation }
          : {}),
        ...('airConditioning' in data
          ? { airConditioning: data.airConditioning }
          : {}),
        ...('bluetoothFeature' in data
          ? { bluetoothFeature: data.bluetoothFeature }
          : {}),
        ...('sunroof' in data ? { sunroof: data.sunroof } : {}),
        ...('locationCity' in data ? { locationCity: data.locationCity } : {}),
        ...('locationName' in data ? { locationName: data.locationName } : {}),
        ...('locationAddress' in data
          ? { locationAddress: data.locationAddress }
          : {}),
        ...('latitude' in data ? { latitude: data.latitude } : {}),
        ...('longitude' in data ? { longitude: data.longitude } : {}),
      },
    })
    return res.json({ car: mapCar(car) })
  } catch {
    return res.status(404).json({ error: 'Car not found' })
  }
})

router.delete('/:id', requireAdmin, async (req: AuthedRequest<IdParams>, res) => {
  const { id } = req.params

  try {
    await prisma.car.delete({ where: { id } })
    return res.json({ ok: true })
  } catch {
    return res.status(404).json({ error: 'Car not found' })
  }
})

export default router
