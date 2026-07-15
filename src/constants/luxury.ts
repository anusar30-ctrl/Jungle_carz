import landingVideo from '../assets/Landing.mp4'

export const LUXURY_NAV = [
  { label: 'Home', href: '#home' },
  { label: 'Self Drive', href: '/search?type=self-drive' },
  { label: 'With Driver', href: '/search?type=with-driver' },
  { label: 'Tourism', href: '/search?category=tourism' },
  { label: 'Offers', href: '#offers' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const

export const VEHICLE_TYPES = [
  'SUV',
  'Sedan',
  'Luxury',
  'MUV',
  'Hatchback',
  'Electric',
] as const

export const PICKUP_TIMES = [
  '6:00 AM',
  '8:00 AM',
  '10:00 AM',
  '12:00 PM',
  '2:00 PM',
  '4:00 PM',
  '6:00 PM',
  '8:00 PM',
] as const

export const LUXURY_LOCATIONS = [
  'Bangalore',
  'Mumbai',
  'Delhi',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Goa',
  'Jaipur',
] as const

export const FEATURE_BAR_ITEMS = [
  { id: 'verified', label: 'Verified Cars', icon: 'shield' },
  { id: 'support', label: '24×7 Support', icon: 'headset' },
  { id: 'locations', label: '250+ Pickup Locations', icon: 'map' },
  { id: 'rating', label: '4.8/5 Customer Rating', icon: 'star' },
] as const

export const BOOKING_GUARANTEES = [
  { id: 'price', label: 'Best Price Guaranteed', icon: 'tag' },
  { id: 'cancel', label: 'Free Cancellation', icon: 'refresh' },
  { id: 'hidden', label: 'No Hidden Charges', icon: 'eye' },
] as const

export const TRUSTED_BRANDS = [
  'Google',
  'Tripadvisor',
  'Facebook',
  'Trustpilot',
] as const

export const HERO_VIDEO_SRC = landingVideo

/** Frame to hold when SUV stops (seconds) */
export const VIDEO_HOLD_TIME = 4.3

/** Logo reveal begins */
export const INTRO_LOGO_AT = 4.3

/** Logo animation complete */
export const INTRO_LOGO_END = 5.0

/** Hold final frame before fade to black */
export const INTRO_HOLD_END = 6.0

/** Fade to black duration (ms) */
export const INTRO_FADE_MS = 900

/** Landing page fade-in duration (ms) */
export const LANDING_FADE_MS = 1100

export type LuxuryBookingMode = 'self-drive' | 'with-driver' | 'tourism'

export const LUXURY_BOOKING_MODES: { id: LuxuryBookingMode; label: string }[] = [
  { id: 'self-drive', label: 'Self Drive' },
  { id: 'with-driver', label: 'With Driver' },
  { id: 'tourism', label: 'Tourism' },
]
