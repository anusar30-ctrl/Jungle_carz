import { useMemo } from 'react'
import type { CarListing, FilterState, SortOption } from '../types/search'
import { PRICE_MAX, PRICE_MIN } from '../constants/filters'

function matchesFilters(car: CarListing, filters: FilterState): boolean {
  const [minPrice, maxPrice] = filters.priceRange
  if (car.pricePerDay < minPrice || car.pricePerDay > maxPrice) return false

  if (
    filters.vehicleTypes.length > 0 &&
    !filters.vehicleTypes.includes(car.vehicleType)
  )
    return false

  if (
    filters.transmission.length > 0 &&
    !filters.transmission.includes(car.transmission)
  )
    return false

  if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(car.fuel))
    return false

  if (filters.seats.length > 0) {
    const seatMatch = filters.seats.some((s) =>
      s === 8 ? car.seats >= 8 : car.seats === s,
    )
    if (!seatMatch) return false
  }

  if (filters.brands.length > 0 && !filters.brands.includes(car.brand))
    return false

  if (filters.minRating !== null && car.rating < filters.minRating) return false

  if (filters.freeCancellation && !car.freeCancellation) return false
  if (filters.instantBooking && !car.instantBooking) return false
  if (filters.unlimitedKm && !car.unlimitedKm) return false
  if (filters.airConditioning && !car.airConditioning) return false
  if (filters.bluetooth && !car.bluetoothFeature) return false
  if (filters.sunroof && !car.sunroof) return false

  return true
}

function sortCars(cars: CarListing[], sort: SortOption): CarListing[] {
  const sorted = [...cars]
  switch (sort) {
    case 'price-low':
      return sorted.sort((a, b) => a.pricePerDay - b.pricePerDay)
    case 'price-high':
      return sorted.sort((a, b) => b.pricePerDay - a.pricePerDay)
    case 'popularity':
      return sorted.sort((a, b) => b.popularity - a.popularity)
    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    case 'best-rated':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'recommended':
    default:
      return sorted.sort(
        (a, b) =>
          b.popularity * 0.4 +
          b.rating * 20 -
          (a.popularity * 0.4 + a.rating * 20) +
          (b.pricePerDay - a.pricePerDay) * -0.01,
      )
  }
}

export function filterAndSortCars(
  cars: CarListing[],
  filters: FilterState,
  sort: SortOption,
): CarListing[] {
  const filtered = cars.filter((car) => matchesFilters(car, filters))
  return sortCars(filtered, sort)
}

export function useCarFilters(
  cars: CarListing[],
  filters: FilterState,
  sort: SortOption,
) {
  return useMemo(
    () => filterAndSortCars(cars, filters, sort),
    [cars, filters, sort],
  )
}

export function getTripDays(
  pickupDate: string,
  dropDate: string,
  fallback = 3,
): number {
  if (!pickupDate || !dropDate) return fallback
  const diff =
    (new Date(dropDate).getTime() - new Date(pickupDate).getTime()) /
    (1000 * 60 * 60 * 24)
  return Math.max(1, Math.ceil(diff))
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

const HOURS_PER_DAY = 24

export function getPricePerHour(pricePerDay: number): number {
  return Math.max(1, Math.round(pricePerDay / HOURS_PER_DAY))
}

export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDisplayTime(timeStr: string): string {
  if (!timeStr) return '—'
  const [h, m] = timeStr.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`
}

export function hasActiveFilters(filters: FilterState): boolean {
  return (
    filters.priceRange[0] !== PRICE_MIN ||
    filters.priceRange[1] !== PRICE_MAX ||
    filters.vehicleTypes.length > 0 ||
    filters.transmission.length > 0 ||
    filters.fuelTypes.length > 0 ||
    filters.seats.length > 0 ||
    filters.brands.length > 0 ||
    filters.minRating !== null ||
    filters.driverOption !== 'all' ||
    filters.freeCancellation ||
    filters.instantBooking ||
    filters.unlimitedKm ||
    filters.airConditioning ||
    filters.bluetooth ||
    filters.sunroof
  )
}
