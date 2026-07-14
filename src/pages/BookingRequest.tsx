import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { CustomerForm } from '../components/booking/CustomerForm'
import { TripSummaryCard } from '../components/booking/TripSummaryCard'
import { BookingAssistCTA } from '../components/booking/BookingAssistCTA'
import {
  buildCarDetail,
  calcPriceBreakdown,
  DEFAULT_TRIP,
} from '../constants/carDetails'
import { getTripDays } from '../hooks/useCarFilters'
import type { CarDetailData } from '../types/carDetails'
import type { CustomerDetails } from '../types/booking'
import { createBooking } from '../utils/bookingStorage'
import { fetchCarById } from '../utils/carsStorage'

export function BookingRequest() {
  const { carId } = useParams<{ carId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [car, setCar] = useState<CarDetailData | null>(null)
  const [loadingCar, setLoadingCar] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (!carId) return
    setLoadingCar(true)
    fetchCarById(carId)
      .then((listing) => setCar(listing ? buildCarDetail(listing) : null))
      .finally(() => setLoadingCar(false))
  }, [carId])

  if (loadingCar) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (!car) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <p className="mb-4 text-lg font-semibold">Car not found</p>
        <Link to="/search" className="text-primary hover:underline">
          Browse cars
        </Link>
      </div>
    )
  }

  const trip = {
    ...DEFAULT_TRIP,
    pickupCity: searchParams.get('city') || DEFAULT_TRIP.pickupCity,
    dropCity:
      searchParams.get('dropCity') ||
      searchParams.get('city') ||
      DEFAULT_TRIP.dropCity,
    pickupDate: searchParams.get('pickup') || DEFAULT_TRIP.pickupDate,
    dropDate: searchParams.get('drop') || DEFAULT_TRIP.dropDate,
    pickupTime: searchParams.get('pickupTime') || DEFAULT_TRIP.pickupTime,
    dropTime: searchParams.get('dropTime') || DEFAULT_TRIP.dropTime,
    rentalType:
      (searchParams.get('type') as typeof DEFAULT_TRIP.rentalType) ||
      DEFAULT_TRIP.rentalType,
    days: getTripDays(
      searchParams.get('pickup') || DEFAULT_TRIP.pickupDate,
      searchParams.get('drop') || DEFAULT_TRIP.dropDate,
    ),
  }

  const pricing = calcPriceBreakdown(car.pricePerDay, car.originalPrice, trip.days)

  const handleSubmit = async (customer: CustomerDetails) => {
    setSubmitError('')
    setIsSubmitting(true)
    try {
      const booking = await createBooking({
        carId: car.id,
        rentalType: trip.rentalType,
        pickupCity: trip.pickupCity,
        dropCity: trip.dropCity,
        pickupDate: trip.pickupDate,
        dropDate: trip.dropDate,
        pickupTime: trip.pickupTime,
        dropTime: trip.dropTime,
        days: trip.days,
        customer,
      })
      navigate('/booking/success', { state: { reference: booking.reference } })
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Could not submit booking',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="search" />

      <main className="mx-auto max-w-6xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center sm:text-left"
        >
          <h1 className="text-3xl font-bold tracking-tight text-dark sm:text-4xl">
            Complete Your Booking
          </h1>
          <p className="mt-3 text-lg text-muted">
            You&apos;re just one step away from reserving your vehicle.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-10">
          <div>
            {submitError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {submitError}
              </div>
            )}
            <CustomerForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              initialValues={
                user
                  ? {
                      fullName: user.fullName,
                      email: user.email,
                      mobile: user.mobile,
                    }
                  : undefined
              }
            />
          </div>
          <TripSummaryCard
            carName={car.name}
            carImage={car.gallery[0]?.url ?? ''}
            brand={car.brand}
            trip={trip}
            pricing={pricing}
          />
        </div>

        <BookingAssistCTA />
      </main>

      <Footer />
    </div>
  )
}
