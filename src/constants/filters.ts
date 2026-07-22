import type { FilterState, SortOption } from '../types/search'

export const PRICE_MIN = 500
export const PRICE_MAX = 15000

export const DEFAULT_FILTERS: FilterState = {
  priceRange: [PRICE_MIN, PRICE_MAX],
  vehicleTypes: [],
  transmission: [],
  fuelTypes: [],
  seats: [],
  brands: [],
  minRating: null,
  driverOption: 'all',
  freeCancellation: false,
  instantBooking: false,
  unlimitedKm: false,
  airConditioning: false,
  bluetooth: false,
  sunroof: false,
}

export const VEHICLE_TYPES = [
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'muv', label: 'MUV' },
  { value: 'electric', label: 'Electric' },
] as const

export const TRANSMISSIONS = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
] as const

export const FUEL_TYPES = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'cnj', label: 'CNJ' },
] as const

export const SEAT_OPTIONS = [4, 5, 6, 7, 8] as const

export const BRANDS = [
  'Toyota',
  'Hyundai',
  'Honda',
  'Mahindra',
  'Tata',
  'BMW',
  'Mercedes',
  'Audi',
  'Jeep',
  'Kia',
  'Maruti',
] as const

export const RATING_OPTIONS = [
  { value: 4, label: '4+' },
  { value: 4.5, label: '4.5+' },
  { value: 5, label: '5' },
] as const

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-low', label: 'Price Low to High' },
  { value: 'price-high', label: 'Price High to Low' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'newest', label: 'Newest' },
  { value: 'best-rated', label: 'Best Rated' },
]

export const SPECIAL_OFFERS = [
  {
    id: 'weekend',
    title: 'Weekend Deal',
    subtitle: '10% OFF',
    description: 'Book Fri–Sun & save',
    icon: 'gift',
    color: 'from-primary/10 to-secondary/5',
  },
  {
    id: 'long-trip',
    title: 'Long Trip Offer',
    subtitle: 'Free Extra 100 KM',
    description: 'On trips 5+ days',
    icon: 'road',
    color: 'from-accent/10 to-accent/5',
  },
  {
    id: 'festival',
    title: 'Festival Offer',
    subtitle: '₹1000 OFF',
    description: 'Limited time only',
    icon: 'sparkles',
    color: 'from-secondary/10 to-primary/5',
  },
] as const

export const DEFAULT_SEARCH = {
  pickupCity: 'Bangalore',
  dropCity: 'Bangalore',
  pickupDate: '2026-08-20',
  pickupTime: '10:00',
  dropDate: '2026-08-23',
  dropTime: '19:00',
  rentalType: 'self-drive' as const,
}
