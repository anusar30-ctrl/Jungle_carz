export interface CustomerDetails {
  fullName: string
  email: string
  mobile: string
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface BookingRequest {
  id: string
  reference: string
  userId?: string
  isGuest?: boolean
  accountEmail?: string
  accountName?: string
  carId: string
  carName: string
  carImage: string
  rentalType: 'self-drive' | 'with-driver'
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
  customer: CustomerDetails
  status: BookingStatus
  createdAt: string
}

export interface BookingFormErrors {
  fullName?: string
  email?: string
  mobile?: string
}
