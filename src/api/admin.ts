import { api } from '../lib/api'

export interface AdminStats {
  cars: number
  tourism: number
  bookings: number
  pending: number
  users: number
  admins: number
  revenue: number
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await api<{ stats: AdminStats }>('/admin/stats')
  return res.stats
}
