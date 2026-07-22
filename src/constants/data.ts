import type { City, NavLink, RentalType, TrustBadge } from '../types'

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Self Drive', href: '/search?type=self-drive' },
  { label: 'With Driver', href: '/search?type=with-driver' },
  { label: 'Tourism', href: '/search?category=tourism' },
  { label: 'Offers', href: '#offers' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export const CITIES = [
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Mumbai',
  'Delhi',
  'Pune',
  'Kolkata',
  'Jaipur',
  'Goa',
  'Kochi',
] as const

export const POPULAR_CITIES: City[] = [
  { name: 'Bangalore', landmark: 'Vidhana Soudha' },
  { name: 'Hyderabad', landmark: 'Charminar' },
  { name: 'Chennai', landmark: 'Marina Beach' },
  { name: 'Mumbai', landmark: 'Gateway of India' },
  { name: 'Delhi', landmark: 'India Gate' },
  { name: 'Pune', landmark: 'Shaniwar Wada' },
]

export const DRIVER_AGES = ['21+', '25+', '30+'] as const

export const RENTAL_TYPES: { id: RentalType; label: string }[] = [
  { id: 'self-drive', label: 'Self Drive' },
  { id: 'with-driver', label: 'With Driver' },
]

export const TRUST_BADGES: TrustBadge[] = [
  {
    id: 'sanitized',
    title: '100% Sanitized Cars',
    description: 'Every vehicle deep-cleaned before your trip',
    icon: 'shield',
  },
  {
    id: 'unlimited-kms',
    title: 'Unlimited KMs',
    description: 'Drive without worrying about distance limits',
    icon: 'infinity',
  },
  {
    id: 'roadside',
    title: '24/7 Roadside Assistance',
    description: 'Help is always one call away, day or night',
    icon: 'headset',
  },
  {
    id: 'no-hidden',
    title: 'No Hidden Charges',
    description: 'Transparent pricing with zero surprises',
    icon: 'receipt',
  },
  {
    id: 'instant',
    title: 'Instant Booking',
    description: 'Confirm your ride in under 60 seconds',
    icon: 'zap',
  },
]

export const HERO_STATS = [
  {
    id: 'rating',
    value: '4.9',
    label: '5000+ Happy Customers',
    icon: 'star',
  },
  {
    id: 'fleet',
    value: '150+',
    label: 'Premium Cars',
    icon: 'car',
  },
  {
    id: 'support',
    value: '24/7',
    label: 'Roadside Assistance',
    icon: 'headset',
  },
] as const

export const PHONE_NUMBER = '+91 89714 08780'
export const WHATSAPP_NUMBER = '918971408780'
