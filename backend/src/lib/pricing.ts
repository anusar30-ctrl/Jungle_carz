const EARTH_RADIUS_KM = 6371

export const INCLUDED_KM_PER_DAY = 48
export const DROP_LOCATION_EXTRA_PER_KM = 25
export const TRAVEL_CONFIDENCE_FEE = 149
export const UNLIMITED_KM_PREMIUM = 0.2

export type KmPackageType = 'limited' | 'unlimited'
export type DropLocationMode = 'same' | 'different'

interface CarPricingInput {
  pricePerKm?: number | null
  pricePerDay: number
  originalPrice: number
  excessKmRate?: number | null
  securityDeposit?: number | null
}

interface TripPricingInput {
  pickupDate: string
  dropDate: string
  pickupTime: string
  dropTime: string
  days: number
}

interface LocationCoords {
  latitude: number
  longitude: number
}

export interface BookingPricingOptions {
  kmPackage: KmPackageType
  dropLocationMode: DropLocationMode
  pickupCoords?: LocationCoords | null
  dropCoords?: LocationCoords | null
  travelConfidence: boolean
}

function getDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_KM * c
}

export function resolvePricePerKm(car: CarPricingInput): number {
  if (car.pricePerKm && car.pricePerKm > 0) return car.pricePerKm
  return Math.max(1, Math.round(car.pricePerDay / INCLUDED_KM_PER_DAY))
}

export function resolveExcessKmRate(car: CarPricingInput): number {
  if (car.excessKmRate && car.excessKmRate > 0) return car.excessKmRate
  return 7
}

function getTripHours(
  pickupDate: string,
  dropDate: string,
  pickupTime: string,
  dropTime: string,
): number {
  if (!pickupDate || !dropDate) return 0
  const start = new Date(`${pickupDate}T${pickupTime || '10:00'}`)
  const end = new Date(`${dropDate}T${dropTime || '19:00'}`)
  const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
  return Number.isFinite(hours) && hours > 0 ? hours : 0
}

export function getTripBillingDays(
  pickupDate: string,
  dropDate: string,
  pickupTime: string,
  dropTime: string,
  fallbackDays = 1,
): number {
  const hours = getTripHours(pickupDate, dropDate, pickupTime, dropTime)
  if (hours <= 0) return Math.max(1, fallbackDays)
  return Math.max(1, Math.ceil(hours / 24))
}

function calcDropLocationCharge(
  mode: DropLocationMode,
  pickupCoords?: LocationCoords | null,
  dropCoords?: LocationCoords | null,
): { charge: number; distanceKm: number } {
  if (mode === 'same') return { charge: 0, distanceKm: 0 }
  if (
    pickupCoords &&
    dropCoords &&
    Number.isFinite(pickupCoords.latitude) &&
    Number.isFinite(dropCoords.latitude)
  ) {
    const distanceKm = getDistanceKm(
      pickupCoords.latitude,
      pickupCoords.longitude,
      dropCoords.latitude,
      dropCoords.longitude,
    )
    return {
      distanceKm,
      charge: Math.ceil(distanceKm) * DROP_LOCATION_EXTRA_PER_KM,
    }
  }
  return { charge: DROP_LOCATION_EXTRA_PER_KM, distanceKm: 0 }
}

export function calcBookingTotal(
  car: CarPricingInput,
  trip: TripPricingInput,
  options: BookingPricingOptions,
) {
  const pricePerKm = resolvePricePerKm(car)
  const billingDays = getTripBillingDays(
    trip.pickupDate,
    trip.dropDate,
    trip.pickupTime,
    trip.dropTime,
    trip.days,
  )
  const includedKm = INCLUDED_KM_PER_DAY * billingDays
  const limitedPrice = pricePerKm * includedKm
  const kmPackagePrice =
    options.kmPackage === 'unlimited'
      ? Math.round(limitedPrice * (1 + UNLIMITED_KM_PREMIUM))
      : limitedPrice

  const { charge: locationCharge } = calcDropLocationCharge(
    options.dropLocationMode,
    options.pickupCoords,
    options.dropCoords,
  )

  const travelConfidence = options.travelConfidence ? TRAVEL_CONFIDENCE_FEE : 0
  const taxableBase = kmPackagePrice + locationCharge + travelConfidence
  const gst = Math.round(taxableBase * 0.18)

  return {
    pricePerKm,
    includedKm,
    kmPackagePrice,
    locationCharge,
    travelConfidence,
    basePrice: kmPackagePrice,
    gst,
    total: taxableBase + gst,
  }
}
