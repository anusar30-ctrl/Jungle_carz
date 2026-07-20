import 'dotenv/config'
import { CarCategory, Provider, Role } from '@prisma/client'
import { prisma } from '../src/lib/prisma.js'
import { hashPassword } from '../src/lib/auth.js'
import {
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_INITIAL,
} from '../src/constants/superAdmin.js'

const LOCAL_DEV_ACCOUNTS = [
  {
    email: 'admin@junglecarz.com',
    password: 'admin123',
    fullName: 'Local Admin',
    mobile: '9999999998',
    role: Role.ADMIN,
  },
  {
    email: 'demo@junglecarz.com',
    password: 'demo123',
    fullName: 'Demo User',
    mobile: '9999999997',
    role: Role.USER,
  },
] as const

const DEFAULT_CAR_LOCATION = {
  locationCity: 'Bangalore',
  locationName: 'Koramangala',
  locationAddress: 'Koramangala, Bengaluru, Karnataka 560034',
  latitude: 12.9352,
  longitude: 77.6245,
}

async function upsertUser(account: {
  email: string
  password: string
  fullName: string
  mobile: string
  role: Role
}) {
  const passwordHash = await hashPassword(account.password)
  await prisma.user.upsert({
    where: { email: account.email },
    create: {
      email: account.email,
      passwordHash,
      fullName: account.fullName,
      mobile: account.mobile,
      provider: Provider.EMAIL,
      role: account.role,
    },
    update: {
      passwordHash,
      fullName: account.fullName,
      mobile: account.mobile,
      role: account.role,
    },
  })
}

async function main() {
  await upsertUser({
    email: SUPER_ADMIN_EMAIL,
    password: SUPER_ADMIN_INITIAL.password,
    fullName: SUPER_ADMIN_INITIAL.fullName,
    mobile: SUPER_ADMIN_INITIAL.mobile,
    role: Role.ADMIN,
  })
  console.log('Super admin ready:')
  console.log(`  Email:    ${SUPER_ADMIN_EMAIL}`)
  console.log(`  Password: ${SUPER_ADMIN_INITIAL.password}`)

  for (const account of LOCAL_DEV_ACCOUNTS) {
    await upsertUser(account)
    console.log(`Local account ready: ${account.email} / ${account.password}`)
  }

  const carCount = await prisma.car.count()
  if (carCount === 0) {
    await prisma.car.createMany({
      data: [
        {
          brand: 'Mahindra',
          model: 'XUV700 AX7',
          name: 'Mahindra XUV700 AX7',
          vehicleType: 'suv',
          category: CarCategory.REGULAR,
          year: 2024,
          transmission: 'automatic',
          fuel: 'diesel',
          seats: 7,
          mileage: '15 km/l',
          rating: 4.8,
          reviews: 210,
          pricePerDay: 3999,
          originalPrice: 5200,
          pricePerKm: 83,
          excessKmRate: 7,
          securityDeposit: 5000,
          images: [
            'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
          ],
          featureChips: ['Unlimited KM', 'FastTag Included', 'ABS', 'Airbags'],
          amenities: { ac: true, bluetooth: true, gps: true },
          badges: ['available', 'popular', 'discount'],
          discountPercent: 10,
          tag: 'Best for Family',
          cancellationPolicy: 'Free cancellation up to 24 hrs',
          unlimitedKm: true,
          instantBooking: true,
          freeCancellation: true,
          airConditioning: true,
          bluetoothFeature: true,
          sunroof: true,
          popularity: 98,
          ...DEFAULT_CAR_LOCATION,
        },
        {
          brand: 'Toyota',
          model: 'Innova Crysta',
          name: 'Toyota Innova Crysta — Tourism',
          vehicleType: 'muv',
          category: CarCategory.TOURISM,
          year: 2023,
          transmission: 'automatic',
          fuel: 'diesel',
          seats: 7,
          mileage: '14 km/l',
          rating: 4.8,
          reviews: 280,
          pricePerDay: 4999,
          originalPrice: 6000,
          pricePerKm: 104,
          excessKmRate: 7,
          securityDeposit: 8000,
          images: [
            'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
          ],
          featureChips: ['Tour Package Ready', 'Unlimited KM', 'Family Tours'],
          amenities: { ac: true, bluetooth: true, gps: true },
          badges: ['available', 'popular'],
          tag: 'Tourism Special',
          cancellationPolicy: 'Free cancellation up to 48 hrs',
          unlimitedKm: true,
          instantBooking: true,
          freeCancellation: true,
          airConditioning: true,
          bluetoothFeature: true,
          sunroof: false,
          popularity: 97,
          locationCity: 'Bangalore',
          locationName: 'Indira Nagar',
          locationAddress: 'Indiranagar, Bengaluru, Karnataka 560038',
          latitude: 12.9784,
          longitude: 77.6408,
        },
        {
          brand: 'Maruti',
          model: 'Swift VXI',
          name: 'Maruti Swift VXI',
          vehicleType: 'hatchback',
          category: CarCategory.REGULAR,
          year: 2022,
          transmission: 'manual',
          fuel: 'petrol',
          seats: 5,
          mileage: '22 km/l',
          rating: 4.4,
          reviews: 565,
          pricePerDay: 1699,
          originalPrice: 1800,
          pricePerKm: 35,
          excessKmRate: 7,
          securityDeposit: 2500,
          images: [
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
          ],
          featureChips: ['FastTag Included', 'Music System', 'ABS', 'Airbags'],
          amenities: { ac: true, bluetooth: true, gps: false },
          badges: ['available', 'popular'],
          tag: 'Budget Friendly',
          cancellationPolicy: 'Non-refundable',
          unlimitedKm: false,
          instantBooking: true,
          freeCancellation: false,
          airConditioning: true,
          bluetoothFeature: true,
          sunroof: false,
          popularity: 90,
          locationCity: 'Bangalore',
          locationName: 'BTM Layout',
          locationAddress: 'BTM Layout, Bengaluru, Karnataka 560076',
          latitude: 12.9166,
          longitude: 77.6101,
        },
      ],
    })
  }

  console.log('Seed complete:')
  console.log(`  cars in DB: ${await prisma.car.count()}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
