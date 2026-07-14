export type AuthProvider = 'email' | 'google' | 'facebook' | 'apple'

export type UserRole = 'user' | 'admin'

export interface User {
  id: string
  email: string
  fullName: string
  mobile: string
  provider: AuthProvider
  role: UserRole
  avatar?: string
  createdAt: string
}

export interface StoredUser extends User {
  password?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  fullName: string
  email: string
  mobile: string
  password: string
}

export interface ProfileUpdate {
  fullName: string
  mobile: string
}

export interface AdminUserView {
  id: string
  email: string
  fullName: string
  mobile: string
  provider: AuthProvider
  role: UserRole
  createdAt: string
}
