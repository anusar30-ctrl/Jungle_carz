import { api } from '../lib/api'
import type { BookingRequest, CustomerDetails } from '../types/booking'

export function saveLastBooking(booking: BookingRequest): void {
  sessionStorage.setItem('jungle-carz-last-booking', JSON.stringify(booking))
}

export function getLastBooking(): BookingRequest | null {
  try {
    const raw = sessionStorage.getItem('jungle-carz-last-booking')
    return raw ? (JSON.parse(raw) as BookingRequest) : null
  } catch {
    return null
  }
}

export async function fetchMyBookings(): Promise<BookingRequest[]> {
  const res = await api<{ bookings: BookingRequest[] }>('/bookings/mine')
  return res.bookings
}

export async function fetchAllBookings(): Promise<BookingRequest[]> {
  const res = await api<{ bookings: BookingRequest[] }>('/bookings')
  return res.bookings
}

export interface CreateBookingInput {
  carId: string
  rentalType: 'self-drive' | 'with-driver'
  pickupCity: string
  dropCity: string
  pickupDate: string
  dropDate: string
  pickupTime: string
  dropTime: string
  days: number
  kmPackage?: 'limited' | 'unlimited'
  dropLocationMode?: 'same' | 'different'
  dropLocationAddress?: string
  dropLatitude?: number
  dropLongitude?: number
  pickupLatitude?: number
  pickupLongitude?: number
  travelConfidence?: boolean
  depositPayNow?: boolean
  customer: CustomerDetails
}

export async function createBooking(
  input: CreateBookingInput,
): Promise<BookingRequest> {
  const res = await api<{ booking: BookingRequest }>('/bookings', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  saveLastBooking(res.booking)
  return res.booking
}

export async function updateBookingStatus(
  id: string,
  status: BookingRequest['status'],
): Promise<BookingRequest> {
  const res = await api<{ booking: BookingRequest }>(`/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
  return res.booking
}

export async function deleteBooking(id: string): Promise<void> {
  await api(`/bookings/${id}`, { method: 'DELETE' })
}

export function validateFullName(value: string): string | undefined {
  if (!value.trim()) return 'Full name is required'
  if (value.trim().length < 2) return 'Name must be at least 2 characters'
  if (!/^[a-zA-Z\s.'-]+$/.test(value.trim()))
    return 'Please enter a valid name'
  return undefined
}

export function validateEmail(value: string): string | undefined {
  if (!value.trim()) return 'Email address is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
    return 'Please enter a valid email address'
  return undefined
}

export function validateMobile(value: string): string | undefined {
  const digits = value.replace(/\D/g, '')
  if (!digits) return 'Mobile number is required'
  if (digits.length !== 10) return 'Enter a valid 10-digit mobile number'
  if (!/^[6-9]/.test(digits)) return 'Mobile number must start with 6–9'
  return undefined
}
