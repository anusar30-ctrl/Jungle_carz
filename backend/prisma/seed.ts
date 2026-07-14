import 'dotenv/config'
import { CarCategory, Provider, Role } from '@prisma/client'
import { prisma } from '../src/lib/prisma.js'
import { hashPassword } from '../src/lib/auth.js'

async function main() {
  const adminHash = await hashPassword('admin123')
  const demoHash = await hashPassword('demo123')

  await prisma.user.upsert({
    where: { email: 'admin@junglecarz.com' },
    update: {
      passwordHash: adminHash,
      role: Role.ADMIN,
      fullName: 'Jungle Admin',
    },
    create: {
      email: 'admin@junglecarz.com',
      passwordHash: adminHash,
      fullName: 'Jungle Admin',
      mobile: '9999999999',
      provider: Provider.EMAIL,
      role: Role.ADMIN,
    },
  })

  await prisma.user.upsert({
    where: { email: 'demo@junglecarz.com' },
    update: {
      passwordHash: demoHash,
      role: Role.USER,
      fullName: 'Demo User',
    },
    create: {
      email: 'demo@junglecarz.com',
      passwordHash: demoHash,
      fullName: 'Demo User',
      mobile: '9876543210',
      provider: Provider.EMAIL,
      role: Role.USER,
    },
  })

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
        },
      ],
    })
  }

  console.log('Seed complete:')
  console.log('  admin@junglecarz.com / admin123')
  console.log('  demo@junglecarz.com / demo123')
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
