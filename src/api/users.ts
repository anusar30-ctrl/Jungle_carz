import { api } from '../lib/api'
import type { AdminUserView, UserRole } from '../types/auth'

export async function fetchAllUsers(): Promise<AdminUserView[]> {
  const res = await api<{ users: AdminUserView[] }>('/users')
  return res.users
}

export async function updateUserRole(
  userId: string,
  role: UserRole,
): Promise<AdminUserView> {
  const res = await api<{ user: AdminUserView }>(`/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  })
  return res.user
}

export async function deleteUser(userId: string): Promise<void> {
  await api(`/users/${userId}`, { method: 'DELETE' })
}
