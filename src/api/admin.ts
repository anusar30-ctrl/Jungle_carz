import { api } from '../lib/api'
import type { AdminUserView } from '../types/auth'
import type { BookingRequest } from '../types/booking'

export interface AdminStats {
  cars: number
  tourism: number
  bookings: number
  pending: number
  guestBookings: number
  users: number
  admins: number
  newUsers7d: number
  revenue: number
}

export interface AdminDashboardData {
  stats: AdminStats
  recentSignups: AdminUserView[]
  recentBookings: Array<{
    id: string
    reference: string
    carName: string
    isGuest: boolean
    customerName: string
    customerEmail: string
    customerMobile: string
    accountEmail?: string
    total: number
    status: BookingRequest['status']
    createdAt: string
  }>
}

export async function fetchAdminDashboard(): Promise<AdminDashboardData> {
  const res = await api<AdminDashboardData>('/admin/stats')
  return res
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const data = await fetchAdminDashboard()
  return data.stats
}
