import { getDistanceKm } from './distance'

export const INCLUDED_KM_PER_DAY = 48
export const DROP_LOCATION_EXTRA_PER_KM = 25
export const TRAVEL_CONFIDENCE_FEE = 149
export const UNLIMITED_KM_PREMIUM = 0.2

export type KmPackageType = 'limited' | 'unlimited'
export type DropLocationMode = 'same' | 'different'

export interface CarPricingInput {
  pricePerKm?: number
  pricePerDay: number
  originalPrice: number
  excessKmRate?: number
  securityDeposit?: number
}

export interface TripPricingInput {
  pickupDate: string
  dropDate: string
  pickupTime: string
  dropTime: string
  days: number
}

export interface LocationCoords {
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

export interface PriceBreakdown {
  pricePerKm: number
  includedKm: number
  billingDays: number
  tripHours: number
  kmPackage: KmPackageType
  kmPackagePrice: number
  excessKmRate: number
  locationCharge: number
  locationDistanceKm: number
  travelConfidence: number
  discount: number
  gst: number
  delivery: number
  basePrice: number
  total: number
  deposit: number
}

export function resolvePricePerKm(car: CarPricingInput): number {
  if (car.pricePerKm && car.pricePerKm > 0) return car.pricePerKm
  return Math.max(1, Math.round(car.pricePerDay / INCLUDED_KM_PER_DAY))
}

export function resolveExcessKmRate(car: CarPricingInput): number {
  if (car.excessKmRate && car.excessKmRate > 0) return car.excessKmRate
  return 7
}

export function getTripHours(
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

/** Billable days from trip dates + times (minimum 1 day). */
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

export function getIncludedKmForTrip(trip: TripPricingInput): number {
  const billingDays = getTripBillingDays(
    trip.pickupDate,
    trip.dropDate,
    trip.pickupTime,
    trip.dropTime,
    trip.days,
  )
  return INCLUDED_KM_PER_DAY * billingDays
}

export function calcDropLocationCharge(
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

export function calcPriceBreakdown(
  car: CarPricingInput,
  trip: TripPricingInput,
  options: BookingPricingOptions,
): PriceBreakdown {
  const pricePerKm = resolvePricePerKm(car)
  const excessKmRate = resolveExcessKmRate(car)
  const billingDays = getTripBillingDays(
    trip.pickupDate,
    trip.dropDate,
    trip.pickupTime,
    trip.dropTime,
    trip.days,
  )
  const tripHours = getTripHours(
    trip.pickupDate,
    trip.dropDate,
    trip.pickupTime,
    trip.dropTime,
  )
  const includedKm = INCLUDED_KM_PER_DAY * billingDays
  const limitedPrice = pricePerKm * includedKm
  const kmPackagePrice =
    options.kmPackage === 'unlimited'
      ? Math.round(limitedPrice * (1 + UNLIMITED_KM_PREMIUM))
      : limitedPrice

  const { charge: locationCharge, distanceKm: locationDistanceKm } =
    calcDropLocationCharge(
      options.dropLocationMode,
      options.pickupCoords,
      options.dropCoords,
    )

  const travelConfidence = options.travelConfidence ? TRAVEL_CONFIDENCE_FEE : 0
  const discount = Math.max(0, car.originalPrice - car.pricePerDay) * billingDays
  const taxableBase = kmPackagePrice + locationCharge + travelConfidence
  const gst = Math.round(taxableBase * 0.18)

  return {
    pricePerKm,
    includedKm,
    billingDays,
    tripHours,
    kmPackage: options.kmPackage,
    kmPackagePrice,
    excessKmRate,
    locationCharge,
    locationDistanceKm,
    travelConfidence,
    discount,
    gst,
    delivery: 0,
    basePrice: kmPackagePrice,
    total: taxableBase + gst,
    deposit: car.securityDeposit ?? 5000,
  }
}
