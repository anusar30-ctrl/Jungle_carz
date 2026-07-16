import type { RentalType } from './index'

export type VehicleType =
  | 'hatchback'
  | 'sedan'
  | 'suv'
  | 'luxury'
  | 'muv'
  | 'electric'

export type Transmission = 'automatic' | 'manual'
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid'
export type SortOption =
  | 'recommended'
  | 'price-low'
  | 'price-high'
  | 'popularity'
  | 'newest'
  | 'best-rated'

export type ViewMode = 'grid' | 'list'

export type CarCategory = 'regular' | 'tourism'

export interface SearchParams {
  pickupCity: string
  dropCity: string
  pickupDate: string
  pickupTime: string
  dropDate: string
  dropTime: string
  rentalType: RentalType
  category?: CarCategory
}

export interface CarListing {
  id: string
  brand: string
  model: string
  name: string
  vehicleType: VehicleType
  category?: CarCategory
  /** Manufacturing year — set on all fleet cars */
  year?: number
  transmission: Transmission
  fuel: FuelType
  seats: number
  mileage: string
  rating: number
  reviews: number
  pricePerDay: number
  originalPrice: number
  securityDeposit: number
  images: string[]
  featureChips: string[]
  amenities: {
    ac: boolean
    bluetooth: boolean
    gps: boolean
  }
  badges: ('available' | 'discount' | 'popular')[]
  discountPercent?: number
  tag?: string
  cancellationPolicy: string
  unlimitedKm: boolean
  instantBooking: boolean
  freeCancellation: boolean
  airConditioning: boolean
  bluetoothFeature: boolean
  sunroof: boolean
  popularity: number
  createdAt: string
  locationCity?: string
  locationName?: string
  locationAddress?: string
  latitude?: number
  longitude?: number
}

export interface FilterState {
  priceRange: [number, number]
  vehicleTypes: VehicleType[]
  transmission: Transmission[]
  fuelTypes: FuelType[]
  seats: number[]
  brands: string[]
  minRating: number | null
  driverOption: RentalType | 'all'
  freeCancellation: boolean
  instantBooking: boolean
  unlimitedKm: boolean
  airConditioning: boolean
  bluetooth: boolean
  sunroof: boolean
}
