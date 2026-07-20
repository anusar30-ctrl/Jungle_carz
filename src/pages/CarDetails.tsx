import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Breadcrumb } from '../components/car-details/Breadcrumb'
import { ImageGallery } from '../components/car-details/ImageGallery'
import { CarBookingSidebar } from '../components/car-details/CarBookingSidebar'
import { FeatureGrid } from '../components/car-details/FeatureGrid'
import { Description, KeySpecs } from '../components/car-details/Description'
import { Specifications } from '../components/car-details/Specifications'
import { IncludedSection, RulesSection } from '../components/car-details/IncludedSection'
import { HostCard, BookingTimeline } from '../components/car-details/HostCard'
import { ReviewSection } from '../components/car-details/ReviewSection'
import { SimilarCars } from '../components/car-details/SimilarCars'
import { FAQ } from '../components/car-details/FAQ'
import { CarDetailsCTA } from '../components/car-details/CarDetailsCTA'
import { MobileBookingSheet } from '../components/car-details/MobileBookingSheet'
import {
  buildCarDetail,
  DEFAULT_TRIP,
  getSimilarCars,
} from '../constants/carDetails'
import { fetchAllCars, fetchCarById } from '../utils/carsStorage'
import { getTripDays } from '../hooks/useCarFilters'
import { calcPriceBreakdown } from '../utils/pricing'
import type { CarDetailData } from '../types/carDetails'

type Tab = 'specs' | 'included' | 'rules' | 'host' | 'faq'

function parsePickupCoords(
  lat: string | null,
  lng: string | null,
  car: CarDetailData,
): { latitude: number; longitude: number } | null {
  if (lat && lng) {
    const latitude = Number(lat)
    const longitude = Number(lng)
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      return { latitude, longitude }
    }
  }
  if (car.latitude != null && car.longitude != null) {
    return { latitude: car.latitude, longitude: car.longitude }
  }
  return null
}

export function CarDetails() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<Tab>('specs')
  const [car, setCar] = useState<CarDetailData | null>(null)
  const [similar, setSimilar] = useState<CarDetailData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([fetchCarById(id), fetchAllCars()])
      .then(([listing, allCars]) => {
        if (!listing) {
          setCar(null)
          setSimilar([])
          return
        }
        setCar(buildCarDetail(listing))
        setSimilar(getSimilarCars(allCars, id))
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (!car) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <p className="mb-4 text-lg font-semibold text-dark">Car not found</p>
        <Link to="/search" className="text-primary hover:underline">
          Back to search
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

  const pricing = calcPriceBreakdown(car, trip, {
    kmPackage: 'limited',
    dropLocationMode: 'same',
    travelConfidence: false,
  })

  const bookingQuery = new URLSearchParams({
    city: trip.pickupCity,
    dropCity: trip.dropCity,
    pickup: trip.pickupDate,
    drop: trip.dropDate,
    pickupTime: trip.pickupTime,
    dropTime: trip.dropTime,
    type: trip.rentalType,
  })
  const location = searchParams.get('location')
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  if (location) bookingQuery.set('location', location)
  if (lat) bookingQuery.set('lat', lat)
  if (lng) bookingQuery.set('lng', lng)
  const bookingHref = `/booking/${car.id}?${bookingQuery.toString()}`
  const pickupLocationLabel = location || car.locationName
  const pickupCoords = parsePickupCoords(lat, lng, car)

  const tabs: { id: Tab; label: string }[] = [
    { id: 'specs', label: 'Specifications' },
    { id: 'included', label: "What's Included" },
    { id: 'rules', label: 'Rental Rules' },
    { id: 'host', label: 'Host Information' },
    { id: 'faq', label: 'FAQ' },
  ]

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <Navbar variant="search" />

      <div className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <Breadcrumb items={car.breadcrumb} />

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px] lg:gap-10">
          <div className="min-w-0 space-y-8">
            <ImageGallery images={car.gallery} badges={car.badges} carId={car.id} />

            <FeatureGrid features={car.features} />

            <div className="lg:hidden">
                <CarBookingSidebar
                  car={car}
                  trip={trip}
                  pricing={pricing}
                  bookingHref={bookingHref}
                  pickupLocationLabel={pickupLocationLabel}
                  pickupCoords={pickupCoords}
                  compact
                />
            </div>

            <Description description={car.description} carName={car.name} />
            <KeySpecs specs={car.keySpecs} />

            <div className="overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-card">
              <div className="flex overflow-x-auto border-b border-gray-100">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 px-5 py-4 text-sm font-semibold transition-colors ${
                      activeTab === tab.id
                        ? 'border-b-2 border-primary text-primary'
                        : 'text-muted hover:text-dark'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="p-6">
                {activeTab === 'specs' && (
                  <Specifications groups={car.specGroups} />
                )}
                {activeTab === 'included' && (
                  <IncludedSection items={car.included} />
                )}
                {activeTab === 'rules' && (
                  <RulesSection rules={car.rules} />
                )}
                {activeTab === 'host' && <HostCard host={car.host} />}
                {activeTab === 'faq' && <FAQ items={car.faqs} />}
              </div>
            </div>

            <BookingTimeline />
            <ReviewSection
              reviews={car.reviewsList}
              rating={car.rating}
              totalReviews={car.reviews}
            />
            <SimilarCars cars={similar} />
            <CarDetailsCTA />
          </div>

          <div className="hidden lg:block">
            <CarBookingSidebar
              car={car}
              trip={trip}
              pricing={pricing}
              bookingHref={bookingHref}
              pickupLocationLabel={pickupLocationLabel}
              pickupCoords={pickupCoords}
              sticky
            />
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Footer />
      </div>

      <MobileBookingSheet
        car={car}
        trip={trip}
        pricing={pricing}
        bookingHref={bookingHref}
        pickupLocationLabel={pickupLocationLabel}
        pickupCoords={pickupCoords}
      />
    </div>
  )
}
