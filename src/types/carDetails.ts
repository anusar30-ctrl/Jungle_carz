export interface CarSpec {
  label: string
  value: string
}

export interface SpecGroup {
  id: string
  title: string
  specs: CarSpec[]
}

export interface CarFeature {
  id: string
  label: string
  icon: string
}

export interface CarReview {
  id: string
  name: string
  avatar: string
  rating: number
  date: string
  verified: boolean
  comment: string
  images: string[]
  helpful: number
}

export interface HostInfo {
  name: string
  verified: boolean
  trips: string
  rating: number
  responseTime: string
  avatar: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
}

export interface GalleryImage {
  url: string
  label: string
}

export interface TripInfo {
  pickupCity: string
  dropCity: string
  pickupDate: string
  dropDate: string
  pickupTime: string
  dropTime: string
  rentalType: 'self-drive' | 'with-driver'
  days: number
}

export type { PriceBreakdown, KmPackageType, DropLocationMode } from '../utils/pricing'

export interface CarDetailData {
  id: string
  brand: string
  model: string
  name: string
  category: string
  year: number
  rating: number
  reviews: number
  pricePerDay: number
  originalPrice: number
  pricePerKm?: number
  excessKmRate?: number
  securityDeposit?: number
  locationName?: string
  latitude?: number
  longitude?: number
  gallery: GalleryImage[]
  features: CarFeature[]
  description: {
    intro: string
    comfort: string
    performance: string
    safety: string
    luxury: string
  }
  keySpecs: CarSpec[]
  specGroups: SpecGroup[]
  included: string[]
  rules: { text: string; allowed?: boolean }[]
  host: HostInfo
  reviewsList: CarReview[]
  faqs: FAQItem[]
  similarCarIds: string[]
  badges: string[]
  bookedThisWeek: number
  breadcrumb: string[]
}
