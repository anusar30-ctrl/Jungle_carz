import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Fuel,
  MapPin,
  Navigation,
  Route,
  Settings2,
  Star,
  Users,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import type { CarListing } from '../../types/search'
import { formatCurrency } from '../../hooks/useCarFilters'
import { calcPriceBreakdown, resolvePricePerKm } from '../../utils/pricing'
import type { UserCoords } from '../../hooks/useUserLocation'
import { FavoriteButton } from '../favorites/FavoriteButton'
import { formatDistanceKm, formatDistanceKmValue, getDistanceKm } from '../../utils/distance'

interface CarCardProps {
  car: CarListing
  tripDays: number
  searchQuery?: string
  tripTimes?: {
    pickupDate: string
    dropDate: string
    pickupTime: string
    dropTime: string
  }
  priority?: boolean
  userCoords?: UserCoords | null
}


function getDistanceKmValue(
  car: CarListing,
  userCoords?: UserCoords | null,
): number | null {
  if (
    !userCoords ||
    car.latitude == null ||
    car.longitude == null
  ) {
    return null
  }
  return getDistanceKm(
    userCoords.latitude,
    userCoords.longitude,
    car.latitude,
    car.longitude,
  )
}

function getFeaturePills(car: CarListing): string[] {
  const pills: string[] = []
  if (car.amenities.ac) pills.push('AC')
  if (car.amenities.bluetooth) pills.push('Bluetooth')
  if (car.amenities.gps) pills.push('GPS')
  if (car.featureChips.some((c) => /fasttag/i.test(c))) pills.push('FastTag')
  if (car.featureChips.some((c) => /airbag/i.test(c))) pills.push('Airbags')
  return pills.slice(0, 5)
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function CarCard({
  car,
  tripDays,
  searchQuery = '',
  tripTimes,
  priority = false,
  userCoords,
}: CarCardProps) {
  const navigate = useNavigate()
  const [imgIndex, setImgIndex] = useState(0)
  const detailUrl = searchQuery
    ? `/cars/${car.id}?${searchQuery}`
    : `/cars/${car.id}`

  const distanceKm = getDistanceKmValue(car, userCoords)
  const distanceLabel =
    distanceKm != null ? formatDistanceKm(distanceKm) : null
  const distanceValue =
    distanceKm != null ? formatDistanceKmValue(distanceKm) : '—'
  const pricePerKm = resolvePricePerKm(car)
  const tripPricing = calcPriceBreakdown(
    car,
    {
      pickupDate: tripTimes?.pickupDate ?? '',
      dropDate: tripTimes?.dropDate ?? '',
      pickupTime: tripTimes?.pickupTime ?? '10:00',
      dropTime: tripTimes?.dropTime ?? '19:00',
      days: tripDays,
    },
    {
      kmPackage: 'limited',
      dropLocationMode: 'same',
      travelConfidence: false,
    },
  )
  const featurePills = getFeaturePills(car)

  const nextImg = () =>
    setImgIndex((i) => (i + 1) % car.images.length)
  const prevImg = () =>
    setImgIndex((i) => (i - 1 + car.images.length) % car.images.length)

  const stopNav = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
      onClick={() => navigate(detailUrl)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          navigate(detailUrl)
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`View details for ${car.name}`}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[18px] border border-gray-100 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
    >
      <div
        className="relative h-40 shrink-0 overflow-hidden bg-gray-50 sm:h-44"
        onClick={stopNav}
      >
        <motion.img
          key={imgIndex}
          src={car.images[imgIndex]}
          alt={car.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
        />

        {car.badges.includes('available') && (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-[#16A34A] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase sm:top-3 sm:left-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
            Available
          </span>
        )}

        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3" onClick={stopNav}>
          <FavoriteButton carId={car.id} />
        </div>

        {distanceLabel && (
          <span className="absolute bottom-2.5 left-2.5 inline-flex max-w-[calc(100%-3rem)] items-center gap-1 truncate rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-gray-800 shadow-sm backdrop-blur-sm sm:bottom-3 sm:left-3 sm:px-2.5 sm:py-1 sm:text-xs">
            <Navigation className="h-3 w-3 shrink-0 text-[#16A34A]" />
            {distanceLabel}
          </span>
        )}

        {car.images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImg}
              aria-label="Previous image"
              className="absolute top-1/2 left-1.5 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 opacity-0 shadow-md transition-opacity group-hover:opacity-100 sm:left-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={nextImg}
              aria-label="Next image"
              className="absolute top-1/2 right-1.5 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 opacity-0 shadow-md transition-opacity group-hover:opacity-100 sm:right-2"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute right-0 bottom-2.5 left-0 flex justify-center gap-1 sm:bottom-3">
              {car.images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === imgIndex ? 'w-4 bg-white sm:w-5' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-3 sm:p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-1.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-gray-100 bg-gray-50 text-[9px] font-bold text-[#16A34A] sm:h-7 sm:w-7 sm:text-[10px]">
                {car.brand.slice(0, 2).toUpperCase()}
              </span>
              <span className="truncate text-[10px] font-medium tracking-wide text-gray-500 uppercase sm:text-xs">
                {car.brand}
              </span>
            </div>
            <h3 className="truncate text-base font-bold tracking-tight text-gray-900 sm:text-lg">
              {car.name}
            </h3>
            <p className="text-xs text-gray-500 sm:text-sm">{car.year ?? 2022} Model</p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-lg font-bold tracking-tight text-[#16A34A] sm:text-xl">
              {formatCurrency(pricePerKm)}
              <span className="text-[10px] font-medium text-gray-500 sm:text-xs">/km</span>
            </p>
            <p className="text-[10px] text-gray-500 sm:text-xs">
              {formatCurrency(tripPricing.total)} total
            </p>
            <p className="text-[10px] text-gray-400 sm:text-xs">
              {tripPricing.includedKm} km incl.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2">
          <FeatureCard icon={MapPin} label="Distance" value={distanceValue} />
          <FeatureCard icon={Fuel} label="Fuel" value={capitalize(car.fuel)} />
          <FeatureCard
            icon={Settings2}
            label="Transmission"
            value={capitalize(car.transmission)}
          />
          <FeatureCard icon={Users} label="Seats" value={`${car.seats}`} />
        </div>

        <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-[#16A34A]/15 bg-[#16A34A]/5 px-2.5 py-1.5 sm:mt-2.5 sm:rounded-xl sm:px-3 sm:py-2">
          <Route className="h-3.5 w-3.5 shrink-0 text-[#16A34A]" />
          <span className="truncate text-[11px] font-medium text-gray-800 sm:text-sm">
            {car.unlimitedKm
              ? `${tripPricing.includedKm} km included`
              : `Extra: ${formatCurrency(car.excessKmRate ?? 7)}/km`}
          </span>
        </div>

        {featurePills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {featurePills.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-gray-100 bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-700 sm:text-xs"
              >
                {pill}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <div className="flex min-w-0 items-center gap-1">
            <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-gray-900 sm:text-sm">
              {car.rating}
            </span>
            <span className="truncate text-[10px] text-gray-500 sm:text-xs">
              ({car.reviews} Reviews)
            </span>
          </div>
          <p className="hidden text-xs text-gray-500 sm:block">
            Deposit {formatCurrency(car.securityDeposit)}
          </p>
        </div>

        <div className="mt-2.5 grid grid-cols-2 gap-2" onClick={stopNav}>
          <Link
            to={detailUrl}
            onClick={stopNav}
            className="flex items-center justify-center rounded-lg border border-[#16A34A] py-2 text-center text-xs font-semibold text-[#16A34A] transition-colors hover:bg-[#16A34A]/5 sm:rounded-xl sm:py-2.5 sm:text-sm"
          >
            View Details
          </Link>
          <Link
            to={detailUrl}
            onClick={stopNav}
            className="flex items-center justify-center rounded-lg bg-[#16A34A] py-2 text-xs font-semibold text-white shadow-sm transition-shadow hover:shadow-md sm:rounded-xl sm:py-2.5 sm:text-sm"
          >
            Book Now
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

function FeatureCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Fuel
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-gray-100 bg-gray-50/80 px-1.5 py-1.5 text-center sm:rounded-xl sm:px-2 sm:py-2">
      <Icon className="mb-0.5 h-3.5 w-3.5 text-[#16A34A] sm:mb-1 sm:h-4 sm:w-4" />
      <span className="text-[9px] font-medium tracking-wide text-gray-500 uppercase sm:text-[10px]">
        {label}
      </span>
      <span className="mt-0.5 w-full truncate text-[10px] font-semibold text-gray-900 capitalize sm:text-xs">
        {value}
      </span>
    </div>
  )
}
