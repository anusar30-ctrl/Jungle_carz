import { api, getToken, setToken } from '../lib/api'
import type {
  LoginCredentials,
  ProfileUpdate,
  RegisterData,
  User,
} from '../types/auth'

export async function fetchCurrentUser(): Promise<User | null> {
  if (!getToken()) return null
  try {
    const res = await api<{ user: User }>('/auth/me')
    return res.user
  } catch {
    setToken(null)
    return null
  }
}

export async function registerUser(data: RegisterData): Promise<User> {
  const res = await api<{ token: string; user: User }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
    auth: false,
  })
  setToken(res.token)
  return res.user
}

export async function loginUser(credentials: LoginCredentials): Promise<User> {
  const res = await api<{ token: string; user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
    auth: false,
  })
  setToken(res.token)
  return res.user
}

export function logoutUser(): void {
  setToken(null)
}

export async function updateUserProfile(
  _userId: string,
  data: ProfileUpdate,
): Promise<User> {
  const res = await api<{ user: User }>('/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  return res.user
}

export async function requestPasswordReset(_email: string): Promise<boolean> {
  // Backend has no password-reset endpoint yet; show success UX only.
  return true
}
