import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bluetooth,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Fuel,
  Gauge,
  MapPin,
  Settings2,
  ShieldCheck,
  Snowflake,
  Star,
  Users,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import type { CarListing, ViewMode } from '../../types/search'
import { formatCurrency } from '../../hooks/useCarFilters'
import { FavoriteButton } from '../favorites/FavoriteButton'

interface CarCardProps {
  car: CarListing
  view: ViewMode
  tripDays: number
}

export function CarCard({ car, view, tripDays }: CarCardProps) {
  const navigate = useNavigate()
  const [imgIndex, setImgIndex] = useState(0)
  const totalCost = car.pricePerDay * tripDays
  const isList = view === 'list'
  const detailUrl = `/cars/${car.id}`

  const nextImg = () =>
    setImgIndex((i) => (i + 1) % car.images.length)
  const prevImg = () =>
    setImgIndex((i) => (i - 1 + car.images.length) % car.images.length)

  const stopNav = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
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
      className={`group cursor-pointer overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-soft transition-shadow hover:border-primary/20 hover:shadow-card ${
        isList ? 'flex flex-col md:flex-row' : 'flex flex-col'
      }`}
    >
      <div
        className={`relative overflow-hidden bg-gray-50 ${
          isList ? 'md:w-[38%] lg:w-[35%]' : 'w-full'
        }`}
        onClick={stopNav}
      >
        <div className={`relative ${isList ? 'h-56 md:h-full md:min-h-[220px]' : 'h-52 sm:h-56'}`}>
          <motion.img
            key={imgIndex}
            src={car.images[imgIndex]}
            alt={car.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {car.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImg}
                aria-label="Previous image"
                className="absolute top-1/2 left-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-dark opacity-0 shadow-md transition-opacity group-hover:opacity-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={nextImg}
                aria-label="Next image"
                className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-dark opacity-0 shadow-md transition-opacity group-hover:opacity-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {car.images.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === imgIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="pointer-events-none absolute top-3 left-3 flex flex-wrap gap-2">
          {car.badges.includes('available') && (
            <span className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-bold text-white">
              Available
            </span>
          )}
          {car.discountPercent && (
            <span className="rounded-lg bg-accent px-2.5 py-1 text-xs font-bold text-white">
              {car.discountPercent}% OFF
            </span>
          )}
          {car.badges.includes('popular') && (
            <span className="rounded-lg bg-primary px-2.5 py-1 text-xs font-bold text-white">
              Popular
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3" onClick={stopNav}>
          <FavoriteButton carId={car.id} />
        </div>

        {car.images.length > 1 && (
          <span className="pointer-events-none absolute right-3 bottom-3 rounded-lg bg-dark/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {imgIndex + 1}/{car.images.length}
          </span>
        )}
      </div>

      <div className={`flex flex-1 flex-col p-5 ${isList ? 'md:flex-row md:items-stretch md:gap-0' : ''}`}>
        <div className={`flex-1 ${isList ? 'md:pr-5' : ''}`}>
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                  {car.brand.slice(0, 2).toUpperCase()}
                </span>
                <span className="text-xs font-semibold text-muted uppercase">
                  {car.brand}
                </span>
              </div>
              <h3 className="text-lg font-bold text-dark sm:text-xl">{car.name}</h3>
              <p className="mt-0.5 text-sm text-muted">
                {car.year ?? 2022} Model
              </p>
              {car.tag && (
                <span className="mt-1 inline-block rounded-lg bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {car.tag}
                </span>
              )}
            </div>
          </div>

          <div className="mb-3 flex flex-wrap gap-3 text-sm text-muted">
            <Spec icon={Calendar} label={`${car.year ?? 2022}`} />
            <Spec icon={Settings2} label={car.transmission} />
            <Spec icon={Fuel} label={car.fuel} />
            <Spec icon={Users} label={`${car.seats} Seats`} />
            <Spec icon={Gauge} label={car.mileage} />
          </div>

          <div className="mb-3 flex flex-wrap gap-2">
            {car.amenities.ac && <Amenity icon={Snowflake} label="AC" />}
            {car.amenities.bluetooth && (
              <Amenity icon={Bluetooth} label="Bluetooth" />
            )}
            {car.amenities.gps && <Amenity icon={MapPin} label="GPS" />}
          </div>

          <div className="mb-3 flex flex-wrap gap-1.5">
            {car.featureChips.slice(0, isList ? 6 : 4).map((chip) => (
              <span
                key={chip}
                className="rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-medium text-dark/70"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(car.rating)
                      ? 'fill-accent text-accent'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-dark">{car.rating}</span>
            <span className="text-sm text-muted">({car.reviews} Reviews)</span>
          </div>
        </div>

        <div
          className={`mt-4 flex flex-col border-gray-100 pt-4 ${
            isList
              ? 'md:mt-0 md:w-[200px] md:shrink-0 md:justify-between md:border-t-0 md:border-l md:pt-0 md:pl-5 lg:w-[220px]'
              : 'border-t'
          }`}
          onClick={stopNav}
        >
          <div>
            <div className="mb-1 flex items-baseline gap-2">
              <span className="text-sm text-muted line-through">
                {formatCurrency(car.originalPrice)}
              </span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(car.pricePerDay)}
              <span className="text-sm font-medium text-muted">/day</span>
            </p>
            <p className="mt-1 text-sm text-muted">
              Total Trip Cost:{' '}
              <span className="font-bold text-dark">
                {formatCurrency(totalCost)}
              </span>
            </p>
            <p className="text-xs text-muted">Taxes Included</p>

            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-secondary" />
              Refundable Security: {formatCurrency(car.securityDeposit)}
            </div>
            <p className="mt-1 text-xs text-muted">{car.cancellationPolicy}</p>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <Link
              to={detailUrl}
              onClick={stopNav}
              className="flex w-full items-center justify-center rounded-2xl border border-gray-200 py-2.5 text-center text-sm font-semibold text-dark transition-all hover:border-primary/30 hover:shadow-md"
            >
              View Details
            </Link>
            <Link
              to={detailUrl}
              onClick={stopNav}
              className="flex w-full items-center justify-center rounded-2xl bg-primary py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-shadow hover:shadow-lg"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function Spec({ icon: Icon, label }: { icon: typeof Fuel; label: string }) {
  return (
    <span className="flex items-center gap-1 capitalize">
      <Icon className="h-3.5 w-3.5 text-primary" />
      {label}
    </span>
  )
}

function Amenity({ icon: Icon, label }: { icon: typeof Snowflake; label: string }) {
  return (
    <span className="flex items-center gap-1 rounded-lg bg-primary/5 px-2 py-1 text-xs font-medium text-primary">
      <Icon className="h-3 w-3" />
      {label}
    </span>
  )
}
