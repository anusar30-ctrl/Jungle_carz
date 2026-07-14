import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import {
  fetchFavoriteIds,
  toggleFavoriteApi,
} from '../utils/favoritesStorage'

interface FavoritesContextValue {
  favorites: string[]
  favoriteCount: number
  isLoading: boolean
  isFavorite: (carId: string) => boolean
  toggleFavorite: (carId: string, returnTo?: string) => Promise<boolean>
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      setFavorites([])
      return
    }

    setIsLoading(true)
    fetchFavoriteIds()
      .then(setFavorites)
      .catch(() => setFavorites([]))
      .finally(() => setIsLoading(false))
  }, [user])

  const isFavorite = useCallback(
    (carId: string) => favorites.includes(carId),
    [favorites],
  )

  const toggleFavorite = useCallback(
    async (carId: string, returnTo?: string): Promise<boolean> => {
      if (!isAuthenticated || !user) {
        const path = returnTo ?? window.location.pathname + window.location.search
        navigate(`/login?returnTo=${encodeURIComponent(path)}`)
        return false
      }

      const wasFavorite = favorites.includes(carId)
      const next = await toggleFavoriteApi(carId, wasFavorite)
      setFavorites(next)
      return !wasFavorite
    },
    [isAuthenticated, user, favorites, navigate],
  )

  const value = useMemo(
    () => ({
      favorites,
      favoriteCount: favorites.length,
      isLoading,
      isFavorite,
      toggleFavorite,
    }),
    [favorites, isLoading, isFavorite, toggleFavorite],
  )

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  )
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
