import { useState, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  ChevronRight,
  Clock,
  Edit3,
  Flame,
  MapPin,
  ShieldCheck,
  Star,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import type { CarDetailData, PriceBreakdown, TripInfo } from '../../types/carDetails'
import {
  formatCurrency,
  formatDisplayDate,
  formatDisplayTime,
} from '../../hooks/useCarFilters'
import { AuthBookNowButton } from '../auth/AuthBookNowButton'

interface CarBookingSidebarProps {
  car: CarDetailData
  trip: TripInfo
  pricing: PriceBreakdown
  bookingHref: string
  compact?: boolean
  sticky?: boolean
}

export function CarBookingSidebar({
  car,
  trip,
  pricing,
  bookingHref,
  compact = false,
  sticky = false,
}: CarBookingSidebarProps) {
  const savings = car.originalPrice - car.pricePerDay
  const discountPct = Math.round(
    ((car.originalPrice - car.pricePerDay) / car.originalPrice) * 100,
  )

  return (
    <div
      className={`rounded-[24px] border border-gray-100 bg-white shadow-card ${
        compact ? 'p-5' : 'p-6'
      } ${
        sticky
          ? 'lg:sticky lg:top-[max(5rem,calc(100dvh-100%-1.5rem))] lg:self-start'
          : ''
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
              {car.brand.slice(0, 2).toUpperCase()}
            </span>
            <span className="text-xs font-semibold text-muted uppercase">
              {car.brand}
            </span>
          </div>
          <h1 className="text-xl font-bold text-dark sm:text-2xl">{car.model}</h1>
          <p className="mt-0.5 text-sm text-muted">{car.year} Model</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
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
              <span className="ml-1 text-sm font-bold">{car.rating}</span>
            </div>
            <span className="text-sm text-muted">({car.reviews} Reviews)</span>
          </div>
        </div>
        <span className="shrink-0 rounded-lg bg-secondary/15 px-2.5 py-1 text-xs font-bold text-secondary">
          Available
        </span>
      </div>

      <div className="mb-4 flex flex-wrap items-baseline gap-2">
        <span className="text-3xl font-bold text-primary">
          {formatCurrency(car.pricePerDay)}
        </span>
        <span className="text-sm font-medium text-muted">/day</span>
        <span className="text-sm text-muted line-through">
          {formatCurrency(car.originalPrice)}
        </span>
        <span className="rounded-lg bg-accent/15 px-2 py-0.5 text-xs font-bold text-accent">
          {discountPct}% OFF
        </span>
      </div>
      <p className="mb-4 text-sm font-semibold text-secondary">
        You save {formatCurrency(savings)}/day
      </p>

      <div className="mb-4 rounded-2xl bg-gray-50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-bold text-dark">Trip Summary</span>
          <Link
            to="/search"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <Edit3 className="h-3 w-3" />
            Edit
          </Link>
        </div>
        <div className="space-y-2 text-sm">
          <Row icon={MapPin} label="Pickup" value={trip.pickupCity} />
          <Row icon={MapPin} label="Drop" value={trip.dropCity} />
          <Row
            icon={Calendar}
            label="Dates"
            value={`${formatDisplayDate(trip.pickupDate)} – ${formatDisplayDate(trip.dropDate)}`}
          />
          <Row
            icon={Clock}
            label="Time"
            value={`${formatDisplayTime(trip.pickupTime)} – ${formatDisplayTime(trip.dropTime)}`}
          />
          <Row
            icon={Calendar}
            label="Duration"
            value={`${trip.days} Days • ${trip.rentalType === 'self-drive' ? 'Self Drive' : 'With Driver'}`}
          />
        </div>
      </div>

      <div className="mb-4 space-y-2 border-b border-gray-100 pb-4 text-sm">
        <PriceRow
          label={`Price (${trip.days} days)`}
          value={formatCurrency(pricing.basePrice)}
        />
        <PriceRow
          label="Discount"
          value={`-${formatCurrency(pricing.discount)}`}
          highlight="discount"
        />
        <PriceRow label="GST (18%)" value={formatCurrency(pricing.gst)} />
        <PriceRow label="Delivery Charges" value="FREE" highlight="free" />
        <div className="flex items-center justify-between pt-2">
          <span className="font-bold text-dark">Total Trip Cost</span>
          <span className="text-xl font-bold text-primary">
            {formatCurrency(pricing.total)}
          </span>
        </div>
      </div>

      <div className="mb-5 flex items-center gap-2 rounded-xl bg-primary/5 p-3">
        <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
        <div className="text-sm">
          <span className="font-semibold text-dark">Refundable Deposit</span>
          <span className="ml-1 text-muted">
            {formatCurrency(pricing.deposit)}
          </span>
        </div>
      </div>

      <BookNowButton href={bookingHref} />
      <button
        type="button"
        className="mt-3 flex w-full items-center justify-center rounded-2xl border-2 border-primary/30 py-3.5 text-sm font-semibold text-primary transition-all hover:bg-primary/5"
      >
        Reserve Now, Pay Later
      </button>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted">
        <Flame className="h-3.5 w-3.5 text-accent" />
        Booked {car.bookedThisWeek} times this week
      </p>
    </div>
  )
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
      <span className="text-muted">{label}:</span>
      <span className="font-medium text-dark">{value}</span>
    </div>
  )
}

function PriceRow({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: 'discount' | 'free'
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted">{label}</span>
      <span
        className={`font-semibold ${
          highlight === 'discount'
            ? 'text-red-500'
            : highlight === 'free'
              ? 'text-secondary'
              : 'text-dark'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

function BookNowButton({ href }: { href: string }) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id = Date.now()
    setRipples((p) => [
      ...p,
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ])
    setTimeout(() => setRipples((p) => p.filter((r) => r.id !== id)), 600)
  }

  return (
    <AuthBookNowButton
      href={href}
      onRipple={handleClick}
      className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-xl"
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        Book Now
        <ChevronRight className="h-5 w-5" />
      </span>
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ scale: 0, opacity: 0.4 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none absolute h-8 w-8 rounded-full bg-white/30"
          style={{ left: r.x - 16, top: r.y - 16 }}
        />
      ))}
    </AuthBookNowButton>
  )
}
