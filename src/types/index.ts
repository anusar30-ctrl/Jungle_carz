export type RentalType = 'self-drive' | 'with-driver'

export interface NavLink {
  label: string
  href: string
}

export interface City {
  name: string
  landmark: string
}

export interface TrustBadge {
  id: string
  title: string
  description: string
  icon: 'shield' | 'infinity' | 'headset' | 'receipt' | 'zap'
}

export interface BookingFormData {
  rentalType: RentalType
  pickupCity: string
  pickupDate: string
  pickupTime: string
  dropDate: string
  dropTime: string
  promoCode: string
  driverAge: string
}

export interface FormFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  optional?: boolean
}
