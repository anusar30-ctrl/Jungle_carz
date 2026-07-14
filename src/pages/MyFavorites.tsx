import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Heart, Loader2, Search } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { FavoriteButton } from '../components/favorites/FavoriteButton'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import { fetchAllCars } from '../utils/carsStorage'
import { formatCurrency } from '../hooks/useCarFilters'
import type { CarListing } from '../types/search'

export function MyFavorites() {
  const { user } = useAuth()
  const { favorites, isLoading: favoritesLoading } = useFavorites()
  const [allCars, setAllCars] = useState<CarListing[]>([])
  const [loadingCars, setLoadingCars] = useState(true)

  useEffect(() => {
    fetchAllCars()
      .then(setAllCars)
      .catch(() => setAllCars([]))
      .finally(() => setLoadingCars(false))
  }, [])

  const favoriteCars = useMemo(() => {
    const ids = new Set(favorites)
    return allCars.filter((car) => ids.has(car.id))
  }, [allCars, favorites])

  const loading = loadingCars || favoritesLoading

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="search" />

      <main className="mx-auto max-w-4xl px-4 pt-28 pb-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-dark">My Favorites</h1>
            <p className="mt-2 text-muted">
              {loading
                ? 'Loading favorites...'
                : favoriteCars.length === 0
                  ? 'No saved cars yet'
                  : `${favoriteCars.length} saved car${favoriteCars.length === 1 ? '' : 's'}`}
            </p>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md shadow-primary/25"
          >
            <Search className="h-4 w-4" />
            Browse cars
          </Link>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : favoriteCars.length === 0 ? (
          <div className="glass rounded-[24px] border border-white/60 p-12 text-center shadow-card">
            <Heart className="mx-auto h-14 w-14 text-primary/40" />
            <h2 className="mt-4 text-xl font-semibold text-dark">No favorites yet</h2>
            <p className="mt-2 text-muted">
              Tap the heart on any car card while logged in to save it here.
            </p>
            <Link
              to="/search"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white"
            >
              Explore cars
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {favoriteCars.map((car, i) => (
              <motion.article
                key={car.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-soft"
              >
                <div className="relative aspect-[16/10]">
                  <img
                    src={car.images[0]}
                    alt={car.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <FavoriteButton carId={car.id} returnTo="/favorites" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-dark">{car.name}</h3>
                  <p className="text-sm text-muted">{car.brand}</p>
                  <p className="mt-2 text-xl font-bold text-primary">
                    {formatCurrency(car.pricePerDay)}
                    <span className="text-sm font-medium text-muted">/day</span>
                  </p>
                  <Link
                    to={`/cars/${car.id}`}
                    className="mt-4 flex w-full items-center justify-center gap-1 rounded-2xl bg-primary py-3 text-sm font-semibold text-white"
                  >
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
