import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calendar,
  Car,
  ChevronRight,
  Clock,
  Loader2,
  MapPin,
  Search,
} from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { formatCurrency } from '../hooks/useCarFilters'
import { fetchMyBookings } from '../utils/bookingStorage'
import type { BookingRequest, BookingStatus } from '../types/booking'

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
  completed: 'bg-blue-100 text-blue-700',
}

export function MyBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<BookingRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    fetchMyBookings()
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [user])

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
            <h1 className="text-3xl font-bold text-dark">My Bookings</h1>
            <p className="mt-2 text-muted">
              {loading
                ? 'Loading bookings...'
                : bookings.length === 0
                  ? 'You have no bookings yet'
                  : `${bookings.length} booking${bookings.length === 1 ? '' : 's'}`}
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
        ) : bookings.length === 0 ? (
          <div className="glass rounded-[24px] border border-white/60 p-12 text-center shadow-card">
            <Car className="mx-auto h-14 w-14 text-primary/40" />
            <h2 className="mt-4 text-xl font-semibold text-dark">No bookings yet</h2>
            <p className="mt-2 text-muted">
              Find your perfect ride and book your first adventure with Jungle Carz.
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
          <div className="space-y-4">
            {bookings.map((booking, i) => (
              <BookingCard key={booking.id} booking={booking} index={i} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

function BookingCard({ booking, index }: { booking: BookingRequest; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass overflow-hidden rounded-[24px] border border-white/60 shadow-card"
    >
      <div className="flex flex-col sm:flex-row">
        {booking.carImage && (
          <div className="h-40 shrink-0 sm:h-auto sm:w-48">
            <img
              src={booking.carImage}
              alt={booking.carName}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-dark">{booking.carName}</h3>
              <p className="text-sm text-muted">Ref: {booking.reference}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[booking.status]}`}
            >
              {booking.status}
            </span>
          </div>

          <div className="mt-4 grid gap-2 text-sm text-muted sm:grid-cols-2">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {booking.pickupCity}
              {booking.dropCity !== booking.pickupCity && ` → ${booking.dropCity}`}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              {formatDate(booking.pickupDate)} – {formatDate(booking.dropDate)}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              {booking.pickupTime} pickup · {booking.days} day
              {booking.days === 1 ? '' : 's'}
            </span>
            <span className="flex items-center gap-2 capitalize">
              <Car className="h-4 w-4 text-primary" />
              {booking.rentalType.replace('-', ' ')}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
            <p className="text-lg font-bold text-primary">
              {formatCurrency(booking.total)}
            </p>
            <p className="text-xs text-muted">
              Booked {formatDate(booking.createdAt.split('T')[0])}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
