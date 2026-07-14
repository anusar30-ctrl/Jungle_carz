import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  AuthProvider,
  LoginCredentials,
  ProfileUpdate,
  RegisterData,
  User,
} from '../types/auth'
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
} from '../utils/authStorage'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  loginWithSocial: (provider: AuthProvider) => Promise<void>
  logout: () => void
  updateProfile: (data: ProfileUpdate) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCurrentUser()
      .then(setUser)
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const loggedIn = await loginUser(credentials)
    setUser(loggedIn)
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    const registered = await registerUser(data)
    setUser(registered)
  }, [])

  const loginWithSocial = useCallback(async (_provider: AuthProvider) => {
    throw new Error(
      'Social sign-in is not available yet. Please use email and password.',
    )
  }, [])

  const logout = useCallback(() => {
    logoutUser()
    setUser(null)
  }, [])

  const updateProfile = useCallback(
    async (data: ProfileUpdate) => {
      if (!user) throw new Error('Not authenticated')
      const updated = await updateUserProfile(user.id, data)
      setUser(updated)
    },
    [user],
  )

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login,
      register,
      loginWithSocial,
      logout,
      updateProfile,
    }),
    [user, isLoading, login, register, loginWithSocial, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
