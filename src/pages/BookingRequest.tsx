import { useEffect, useMemo, useState } from 'react'
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
  BookingOptionsPanel,
  DEFAULT_BOOKING_OPTIONS,
  type BookingOptionsState,
} from '../components/booking/BookingOptionsPanel'
import {
  buildCarDetail,
  DEFAULT_TRIP,
} from '../constants/carDetails'
import { getTripDays } from '../hooks/useCarFilters'
import type { CarDetailData } from '../types/carDetails'
import type { CustomerDetails } from '../types/booking'
import { createBooking } from '../utils/bookingStorage'
import { fetchCarById } from '../utils/carsStorage'
import {
  calcPriceBreakdown,
  UNLIMITED_KM_PREMIUM,
  type BookingPricingOptions,
} from '../utils/pricing'

function parseCoords(
  lat: string | null,
  lng: string | null,
): { latitude: number; longitude: number } | null {
  if (!lat || !lng) return null
  const latitude = Number(lat)
  const longitude = Number(lng)
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null
  return { latitude, longitude }
}

export function BookingRequest() {
  const { carId } = useParams<{ carId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [car, setCar] = useState<CarDetailData | null>(null)
  const [loadingCar, setLoadingCar] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [bookingOptions, setBookingOptions] = useState<BookingOptionsState>(
    DEFAULT_BOOKING_OPTIONS,
  )

  useEffect(() => {
    if (!carId) return
    setLoadingCar(true)
    fetchCarById(carId)
      .then((listing) => setCar(listing ? buildCarDetail(listing) : null))
      .finally(() => setLoadingCar(false))
  }, [carId])

  useEffect(() => {
    const dropMode = searchParams.get('dropMode')
    const dropLat = searchParams.get('dropLat')
    const dropLng = searchParams.get('dropLng')
    const dropLocationAddress = searchParams.get('dropLocation')
    const dropCity = searchParams.get('dropCity')

    if (dropMode === 'different' && dropLat && dropLng && dropLocationAddress) {
      const latitude = Number(dropLat)
      const longitude = Number(dropLng)
      if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
        setBookingOptions({
          ...DEFAULT_BOOKING_OPTIONS,
          dropLocationMode: 'different',
          dropLocation: {
            name: dropCity || dropLocationAddress.split(',')[0]?.trim() || 'Drop location',
            address: dropLocationAddress,
            latitude,
            longitude,
          },
        })
        return
      }
    }

    if (dropMode === 'same') {
      setBookingOptions((prev) => ({
        ...prev,
        dropLocationMode: 'same',
        dropLocation: null,
      }))
    }
  }, [searchParams])

  const trip = useMemo(
    () => ({
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
    }),
    [searchParams],
  )

  const pickupCoords = useMemo(() => {
    const fromUrl = parseCoords(searchParams.get('lat'), searchParams.get('lng'))
    if (fromUrl) return fromUrl
    if (car?.latitude != null && car?.longitude != null) {
      return { latitude: car.latitude, longitude: car.longitude }
    }
    return null
  }, [searchParams, car])

  const pricingOptions: BookingPricingOptions = useMemo(
    () => ({
      kmPackage: bookingOptions.kmPackage,
      dropLocationMode: bookingOptions.dropLocationMode,
      pickupCoords,
      dropCoords: bookingOptions.dropLocation
        ? {
            latitude: bookingOptions.dropLocation.latitude,
            longitude: bookingOptions.dropLocation.longitude,
          }
        : null,
      travelConfidence: bookingOptions.travelConfidence,
    }),
    [bookingOptions, pickupCoords],
  )

  const carPricing = useMemo(
    () =>
      car
        ? {
            pricePerKm: car.pricePerKm,
            pricePerDay: car.pricePerDay,
            originalPrice: car.originalPrice,
            excessKmRate: car.excessKmRate,
            securityDeposit: car.securityDeposit,
          }
        : null,
    [car],
  )

  const pricing = useMemo(() => {
    if (!carPricing) {
      return calcPriceBreakdown(
        { pricePerDay: 0, originalPrice: 0 },
        trip,
        pricingOptions,
      )
    }
    return calcPriceBreakdown(carPricing, trip, pricingOptions)
  }, [carPricing, trip, pricingOptions])

  const packagePreview = useMemo(() => {
    if (!carPricing) return { limited: 0, unlimited: 0 }
    const limited = calcPriceBreakdown(carPricing, trip, {
      ...pricingOptions,
      kmPackage: 'limited',
    }).kmPackagePrice
    return {
      limited,
      unlimited: Math.round(limited * (1 + UNLIMITED_KM_PREMIUM)),
    }
  }, [carPricing, trip, pricingOptions])

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

  const pickupLocationLabel =
    searchParams.get('location') || car.locationName || trip.pickupCity

  const handleSubmit = async (customer: CustomerDetails) => {
    if (!bookingOptions.termsAccepted) {
      setSubmitError('Please accept the terms and conditions to continue.')
      return
    }
    if (
      bookingOptions.dropLocationMode === 'different' &&
      !bookingOptions.dropLocation
    ) {
      setSubmitError('Please select a drop location.')
      return
    }

    setSubmitError('')
    setIsSubmitting(true)
    try {
      const booking = await createBooking({
        carId: car.id,
        rentalType: trip.rentalType,
        pickupCity: trip.pickupCity,
        dropCity:
          bookingOptions.dropLocationMode === 'different' && bookingOptions.dropLocation
            ? bookingOptions.dropLocation.name
            : trip.pickupCity,
        pickupDate: trip.pickupDate,
        dropDate: trip.dropDate,
        pickupTime: trip.pickupTime,
        dropTime: trip.dropTime,
        days: trip.days,
        kmPackage: bookingOptions.kmPackage,
        dropLocationMode: bookingOptions.dropLocationMode,
        dropLocationAddress: bookingOptions.dropLocation?.address,
        dropLatitude: bookingOptions.dropLocation?.latitude,
        dropLongitude: bookingOptions.dropLocation?.longitude,
        pickupLatitude: pickupCoords?.latitude,
        pickupLongitude: pickupCoords?.longitude,
        travelConfidence: bookingOptions.travelConfidence,
        depositPayNow: bookingOptions.depositPayNow,
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
            Choose your km package, drop location, and confirm trip pricing.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-10">
          <div className="space-y-6">
            <BookingOptionsPanel
              city={trip.pickupCity}
              pickupLocationLabel={pickupLocationLabel}
              pickupCoords={pickupCoords}
              pricing={pricing}
              limitedPackagePrice={packagePreview.limited}
              unlimitedPackagePrice={packagePreview.unlimited}
              options={bookingOptions}
              onChange={setBookingOptions}
            />

            {submitError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
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
            dropLocationLabel={
              bookingOptions.dropLocationMode === 'different'
                ? bookingOptions.dropLocation?.name || 'Select location'
                : pickupLocationLabel
            }
          />
        </div>

        <BookingAssistCTA />
      </main>

      <Footer />
    </div>
  )
}
