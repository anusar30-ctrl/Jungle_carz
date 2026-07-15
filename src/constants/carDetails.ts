import type { CarDetailData } from '../types/carDetails'
import type { CarListing } from '../types/search'

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

const DEFAULT_FEATURES = [
  { id: 'auto', label: 'Automatic', icon: 'settings' },
  { id: 'diesel', label: 'Diesel', icon: 'fuel' },
  { id: 'seats', label: '7 Seats', icon: 'users' },
  { id: 'mileage', label: '17 KMPL', icon: 'gauge' },
  { id: 'sunroof', label: 'Sunroof', icon: 'sun' },
  { id: 'bt', label: 'Bluetooth', icon: 'bluetooth' },
  { id: 'carplay', label: 'Apple CarPlay', icon: 'smartphone' },
  { id: 'android', label: 'Android Auto', icon: 'monitor' },
  { id: 'usb', label: 'USB Charging', icon: 'usb' },
  { id: 'fasttag', label: 'FastTag', icon: 'tag' },
  { id: 'camera', label: 'Reverse Camera', icon: 'camera' },
  { id: 'abs', label: 'ABS', icon: 'shield' },
  { id: 'airbags', label: '6 Airbags', icon: 'airbag' },
  { id: 'gps', label: 'GPS', icon: 'map' },
]

const DEFAULT_INCLUDED = [
  'Unlimited KM',
  'Roadside Assistance',
  'Insurance',
  'FastTag',
  'Cleaning',
  'Sanitized Vehicle',
  '24×7 Support',
]

const DEFAULT_RULES = [
  { text: 'Driver must be above 21 years', allowed: true },
  { text: 'Valid Driving License required', allowed: true },
  { text: 'Return with same fuel level', allowed: true },
  { text: 'Late return charges apply', allowed: false },
  { text: 'Smoking not allowed inside vehicle', allowed: false },
  { text: 'Pets allowed with prior approval', allowed: true },
]

const DEFAULT_FAQS = [
  {
    id: 'deposit',
    question: 'Do I need a security deposit?',
    answer:
      'Yes, a refundable security deposit of ₹5,000 is collected at pickup. It is fully refunded within 5–7 business days after the vehicle is returned in good condition.',
  },
  {
    id: 'extend',
    question: 'Can I extend my trip?',
    answer:
      'Absolutely. You can extend your booking through the app or by calling our support team, subject to vehicle availability. Extension charges apply at the prevailing daily rate.',
  },
  {
    id: 'fuel',
    question: 'Is fuel included?',
    answer:
      'Fuel is not included in the rental price. You receive the car with a full tank and should return it at the same level to avoid refuelling charges.',
  },
  {
    id: 'cancel',
    question: 'What is the cancellation policy?',
    answer:
      'Free cancellation up to 24 hours before pickup. Cancellations within 24 hours incur a 50% charge. No-shows are charged the full first day rental.',
  },
]

const DEFAULT_REVIEWS = [
  {
    id: 'r1',
    name: 'Rahul Sharma',
    avatar: 'RS',
    rating: 5,
    date: '15 Jul 2026',
    verified: true,
    comment:
      'Absolutely loved the XUV700! Smooth drive, spotless interior, and the sunroof made our Goa trip unforgettable. Jungle Carz delivery was on time.',
    images: [img('photo-1549317661-bd32c8ce0db2', 400), img('photo-1519641471654-76ce0107a1bf', 400)],
    helpful: 24,
  },
  {
    id: 'r2',
    name: 'Priya Menon',
    avatar: 'PM',
    rating: 5,
    date: '8 Jul 2026',
    verified: true,
    comment:
      'Perfect family car. Spacious, comfortable, and the ADAS features gave us extra confidence on highways. Will definitely book again!',
    images: [img('photo-1503376780353-7ebb459f45a3', 400)],
    helpful: 18,
  },
  {
    id: 'r3',
    name: 'Arjun Patel',
    avatar: 'AP',
    rating: 4,
    date: '1 Jul 2026',
    verified: true,
    comment:
      'Great car and hassle-free booking. Minor scratch on delivery was documented properly. Support team was very responsive.',
    images: [],
    helpful: 11,
  },
]

function buildDetailFromCar(car: CarListing): CarDetailData {
  const category =
    car.vehicleType.charAt(0).toUpperCase() + car.vehicleType.slice(1)

  return {
    id: car.id,
    brand: car.brand,
    model: car.model,
    name: car.name,
    category,
    year: car.year ?? 2022,
    rating: car.rating,
    reviews: car.reviews,
    pricePerDay: car.pricePerDay,
    originalPrice: car.originalPrice,
    gallery:
      car.images.length > 0
        ? car.images.map((url, i) => ({
            url,
            label:
              ['Exterior', 'Interior', 'Dashboard', 'Side view', 'Rear view'][
                i
              ] ?? `View ${i + 1}`,
          }))
        : [
            {
              url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
              label: 'Exterior',
            },
          ],
    features: DEFAULT_FEATURES.map((f) => ({
      ...f,
      label:
        f.id === 'diesel'
          ? car.fuel.charAt(0).toUpperCase() + car.fuel.slice(1)
          : f.id === 'seats'
            ? `${car.seats} Seats`
            : f.id === 'auto'
              ? car.transmission.charAt(0).toUpperCase() +
                car.transmission.slice(1)
              : f.label,
    })),
    description: {
      intro: `The ${car.name} is a premium ${category.toLowerCase()} that blends commanding road presence with refined comfort — perfect for family getaways and long highway drives.`,
      comfort:
        'Spacious cabin with ventilated seats, dual-zone climate control, and premium upholstery ensure every passenger travels in comfort.',
      performance:
        'Powerful engine with smooth automatic transmission delivers confident acceleration and effortless cruising on any terrain.',
      safety:
        'Equipped with ADAS, 6 airbags, ESP, hill hold assist, and a 5-star safety rating for complete peace of mind.',
      luxury:
        'Panoramic sunroof, wireless charging, premium Sony audio, and ambient lighting create a first-class driving experience.',
    },
    keySpecs: [
      { label: 'Year', value: String(car.year ?? 2022) },
      { label: 'Engine', value: '2.2L mHawk Diesel' },
      { label: 'Power', value: '185 PS' },
      { label: 'Mileage', value: car.mileage },
      { label: 'Transmission', value: car.transmission },
      { label: 'Fuel Tank', value: '60 Litres' },
    ],
    specGroups: [
      {
        id: 'overview',
        title: 'Overview',
        specs: [
          { label: 'Manufactured Year', value: String(car.year ?? 2022) },
          { label: 'Brand', value: car.brand },
          { label: 'Model', value: car.model },
          { label: 'Vehicle Type', value: category },
          { label: 'Seating', value: `${car.seats} Seats` },
        ],
      },
      {
        id: 'engine',
        title: 'Engine & Performance',
        specs: [
          { label: 'Engine', value: '2.2L Turbo Diesel' },
          { label: 'Power', value: '185 PS @ 3500 rpm' },
          { label: 'Torque', value: '420 Nm @ 1600 rpm' },
          { label: 'Top Speed', value: '200 km/h' },
          { label: 'Mileage', value: car.mileage },
        ],
      },
      {
        id: 'dimensions',
        title: 'Dimensions & Capacity',
        specs: [
          { label: 'Length', value: '4695 mm' },
          { label: 'Width', value: '1890 mm' },
          { label: 'Height', value: '1755 mm' },
          { label: 'Boot Space', value: '259 Litres' },
          { label: 'Ground Clearance', value: '200 mm' },
          { label: 'Seating', value: `${car.seats} Seats` },
        ],
      },
      {
        id: 'features',
        title: 'Features & Technology',
        specs: [
          { label: 'Infotainment', value: '10.25" Touchscreen' },
          { label: 'Audio', value: 'Sony 3D Surround' },
          { label: 'Connectivity', value: 'Apple CarPlay & Android Auto' },
          { label: 'ADAS', value: 'Level 2 Autonomous' },
          { label: 'Sunroof', value: car.sunroof ? 'Panoramic' : 'N/A' },
        ],
      },
    ],
    included: DEFAULT_INCLUDED,
    rules: DEFAULT_RULES,
    host: {
      name: 'Jungle Carz',
      verified: true,
      trips: '5000+',
      rating: 4.9,
      responseTime: '5 Minutes',
      avatar: 'JC',
    },
    reviewsList: DEFAULT_REVIEWS,
    faqs: DEFAULT_FAQS,
    similarCarIds: ['3', '8', '12', '10'],
    badges: ['Popular Choice', 'Instant Booking'],
    bookedThisWeek: 18,
    breadcrumb: ['Home', 'Cars', category, car.name],
  }
}

export function buildCarDetail(car: CarListing): CarDetailData {
  return buildDetailFromCar(car)
}

export function getSimilarCars(
  allCars: CarListing[],
  currentId: string,
): CarDetailData[] {
  const current = allCars.find((c) => c.id === currentId)
  return allCars
    .filter(
      (c) =>
        c.id !== currentId &&
        (!current || c.vehicleType === current.vehicleType),
    )
    .slice(0, 4)
    .map(buildDetailFromCar)
}

export const DEFAULT_TRIP = {
  pickupCity: 'Bangalore',
  dropCity: 'Bangalore',
  pickupDate: '2026-08-20',
  dropDate: '2026-08-23',
  pickupTime: '10:00',
  dropTime: '19:00',
  rentalType: 'self-drive' as const,
  days: 3,
}

export function calcPriceBreakdown(
  pricePerDay: number,
  originalPrice: number,
  days: number,
): import('../types/carDetails').PriceBreakdown {
  const basePrice = pricePerDay * days
  const discount = (originalPrice - pricePerDay) * days
  const gst = Math.round(basePrice * 0.18)
  return {
    basePrice,
    discount,
    gst,
    delivery: 0,
    total: basePrice + gst,
    deposit: 5000,
  }
}
