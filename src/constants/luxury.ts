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

export const PICKUP_LOCATIONS_BY_CITY: Record<
  (typeof LUXURY_LOCATIONS)[number],
  string[]
> = {
  Bangalore: [
    'Kempegowda International Airport',
    'MG Road',
    'Indiranagar',
    'Koramangala',
    'Whitefield',
    'Electronic City',
  ],
  Mumbai: [
    'Chhatrapati Shivaji Airport',
    'Bandra Kurla Complex',
    'Andheri East',
    'Powai',
    'Colaba',
  ],
  Delhi: [
    'Indira Gandhi Airport',
    'Connaught Place',
    'Karol Bagh',
    'Saket',
    'Dwarka',
  ],
  Hyderabad: [
    'Rajiv Gandhi Airport',
    'Hitech City',
    'Banjara Hills',
    'Gachibowli',
    'Secunderabad',
  ],
  Chennai: [
    'Chennai International Airport',
    'T Nagar',
    'OMR',
    'Anna Nagar',
    'Velachery',
  ],
  Pune: [
    'Pune Airport',
    'Hinjewadi',
    'Koregaon Park',
    'Viman Nagar',
    'Kothrud',
  ],
  Goa: [
    'Dabolim Airport',
    'Panaji',
    'Calangute',
    'Margao',
    'Baga Beach',
  ],
  Jaipur: [
    'Jaipur Airport',
    'MI Road',
    'Malviya Nagar',
    'Vaishali Nagar',
    'C-Scheme',
  ],
}

export type SuggestedPickupSpot = {
  name: string
  address: string
  latitude?: number
  longitude?: number
}

export const SUGGESTED_LOCATIONS_BY_CITY: Record<
  (typeof LUXURY_LOCATIONS)[number],
  SuggestedPickupSpot[]
> = {
  Bangalore: [
    {
      name: 'Majestic Bus Stand',
      address:
        'Kempe Gowda Majestic Bus Station, Tank Bund Road, Majestic, Bengaluru, Karnataka 560009',
    },
    {
      name: 'Yeshwanthpur',
      address:
        'Yeshwanthpur Industrial Suburb, Yeswanthpur, Bengaluru, Karnataka 560022',
    },
    {
      name: 'BTM Layout',
      address: 'BTM Layout, Bengaluru, Karnataka 560076',
    },
    {
      name: 'Bengaluru Palace',
      address:
        'Bengaluru Palace, Palace Cross Road, Vasanth Nagar, Bengaluru, Karnataka 560052',
    },
    {
      name: 'Indira Nagar',
      address: 'Indiranagar, Bengaluru, Karnataka 560038',
    },
    {
      name: 'Bellandur',
      address: 'Bellandur, Bengaluru, Karnataka 560103',
    },
    {
      name: 'Kempegowda International Airport',
      address:
        'Kempegowda International Airport, Devanahalli, Bengaluru, Karnataka 560300',
    },
    {
      name: 'Koramangala',
      address: 'Koramangala, Bengaluru, Karnataka 560034',
    },
  ],
  Mumbai: [
    {
      name: 'Chhatrapati Shivaji Airport',
      address: 'Chhatrapati Shivaji Maharaj International Airport, Mumbai, Maharashtra 400099',
    },
    {
      name: 'Bandra Kurla Complex',
      address: 'Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051',
    },
    {
      name: 'Andheri East',
      address: 'Andheri East, Mumbai, Maharashtra 400069',
    },
    {
      name: 'Powai',
      address: 'Powai, Mumbai, Maharashtra 400076',
    },
    {
      name: 'Colaba',
      address: 'Colaba, Mumbai, Maharashtra 400005',
    },
    {
      name: 'Dadar',
      address: 'Dadar, Mumbai, Maharashtra 400028',
    },
  ],
  Delhi: [
    {
      name: 'Indira Gandhi Airport',
      address: 'Indira Gandhi International Airport, New Delhi, Delhi 110037',
    },
    {
      name: 'Connaught Place',
      address: 'Connaught Place, New Delhi, Delhi 110001',
    },
    {
      name: 'Karol Bagh',
      address: 'Karol Bagh, New Delhi, Delhi 110005',
    },
    {
      name: 'Saket',
      address: 'Saket, New Delhi, Delhi 110017',
    },
    {
      name: 'Dwarka',
      address: 'Dwarka, New Delhi, Delhi 110075',
    },
    {
      name: 'Hauz Khas',
      address: 'Hauz Khas, New Delhi, Delhi 110016',
    },
  ],
  Hyderabad: [
    {
      name: 'Rajiv Gandhi Airport',
      address: 'Rajiv Gandhi International Airport, Shamshabad, Hyderabad, Telangana 500409',
    },
    {
      name: 'Hitech City',
      address: 'Hitech City, Hyderabad, Telangana 500081',
    },
    {
      name: 'Banjara Hills',
      address: 'Banjara Hills, Hyderabad, Telangana 500034',
    },
    {
      name: 'Gachibowli',
      address: 'Gachibowli, Hyderabad, Telangana 500032',
    },
    {
      name: 'Secunderabad',
      address: 'Secunderabad, Hyderabad, Telangana 500003',
    },
    {
      name: 'Madhapur',
      address: 'Madhapur, Hyderabad, Telangana 500081',
    },
  ],
  Chennai: [
    {
      name: 'Chennai International Airport',
      address: 'Chennai International Airport, Chennai, Tamil Nadu 600027',
    },
    {
      name: 'T Nagar',
      address: 'T Nagar, Chennai, Tamil Nadu 600017',
    },
    {
      name: 'OMR',
      address: 'Old Mahabalipuram Road, Chennai, Tamil Nadu 600096',
    },
    {
      name: 'Anna Nagar',
      address: 'Anna Nagar, Chennai, Tamil Nadu 600040',
    },
    {
      name: 'Velachery',
      address: 'Velachery, Chennai, Tamil Nadu 600042',
    },
    {
      name: 'Egmore',
      address: 'Egmore, Chennai, Tamil Nadu 600008',
    },
  ],
  Pune: [
    {
      name: 'Pune Airport',
      address: 'Pune Airport, Lohegaon, Pune, Maharashtra 411032',
    },
    {
      name: 'Hinjewadi',
      address: 'Hinjewadi, Pune, Maharashtra 411057',
    },
    {
      name: 'Koregaon Park',
      address: 'Koregaon Park, Pune, Maharashtra 411001',
    },
    {
      name: 'Viman Nagar',
      address: 'Viman Nagar, Pune, Maharashtra 411014',
    },
    {
      name: 'Kothrud',
      address: 'Kothrud, Pune, Maharashtra 411038',
    },
    {
      name: 'Shivaji Nagar',
      address: 'Shivaji Nagar, Pune, Maharashtra 411005',
    },
  ],
  Goa: [
    {
      name: 'Dabolim Airport',
      address: 'Goa International Airport, Dabolim, Goa 403801',
    },
    {
      name: 'Panaji',
      address: 'Panaji, Goa 403001',
    },
    {
      name: 'Calangute',
      address: 'Calangute, Goa 403516',
    },
    {
      name: 'Margao',
      address: 'Margao, Goa 403601',
    },
    {
      name: 'Baga Beach',
      address: 'Baga Beach, Goa 403516',
    },
    {
      name: 'Candolim',
      address: 'Candolim, Goa 403515',
    },
  ],
  Jaipur: [
    {
      name: 'Jaipur Airport',
      address: 'Jaipur International Airport, Jaipur, Rajasthan 302017',
    },
    {
      name: 'MI Road',
      address: 'Mirza Ismail Road, Jaipur, Rajasthan 302001',
    },
    {
      name: 'Malviya Nagar',
      address: 'Malviya Nagar, Jaipur, Rajasthan 302017',
    },
    {
      name: 'Vaishali Nagar',
      address: 'Vaishali Nagar, Jaipur, Rajasthan 302021',
    },
    {
      name: 'C-Scheme',
      address: 'C-Scheme, Jaipur, Rajasthan 302001',
    },
    {
      name: 'Amer Fort',
      address: 'Amer Fort Road, Jaipur, Rajasthan 302028',
    },
  ],
}

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
