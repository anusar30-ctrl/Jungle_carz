import { Calendar, Clock, MapPin, Route, Tag } from 'lucide-react'
import type { PriceBreakdown, TripInfo } from '../../types/carDetails'
import {
  formatCurrency,
  formatDisplayDate,
  formatDisplayTime,
} from '../../hooks/useCarFilters'

interface TripSummaryCardProps {
  carName: string
  carImage: string
  brand: string
  trip: TripInfo
  pricing: PriceBreakdown
  dropLocationLabel?: string
}

export function TripSummaryCard({
  carName,
  carImage,
  brand,
  trip,
  pricing,
  dropLocationLabel,
}: TripSummaryCardProps) {
  const rentalLabel =
    trip.rentalType === 'self-drive' ? 'Self Drive' : 'With Driver'

  return (
    <div className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-card lg:sticky lg:top-28">
      <h2 className="mb-5 text-xl font-bold text-dark">Trip Summary</h2>

      <div className="mb-5 overflow-hidden rounded-2xl">
        <img
          src={carImage}
          alt={carName}
          className="aspect-[16/10] w-full object-cover"
        />
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {brand}
        </p>
        <p className="text-lg font-bold text-dark">{carName}</p>
        <p className="mt-1 text-sm font-semibold text-primary">
          {formatCurrency(pricing.pricePerKm)}/km
        </p>
      </div>

      <div className="mb-5 space-y-3 border-b border-gray-100 pb-5 text-sm">
        <SummaryRow icon={Tag} label="Rental Type" value={rentalLabel} />
        <SummaryRow icon={MapPin} label="Pickup" value={trip.pickupCity} />
        <SummaryRow
          icon={MapPin}
          label="Drop"
          value={dropLocationLabel || trip.dropCity}
        />
        <SummaryRow
          icon={Calendar}
          label="Dates"
          value={`${formatDisplayDate(trip.pickupDate)} – ${formatDisplayDate(trip.dropDate)}`}
        />
        <SummaryRow
          icon={Clock}
          label="Time"
          value={`${formatDisplayTime(trip.pickupTime)} – ${formatDisplayTime(trip.dropTime)}`}
        />
        <SummaryRow
          icon={Calendar}
          label="Duration"
          value={`${pricing.billingDays} day${pricing.billingDays === 1 ? '' : 's'} (${Math.round(pricing.tripHours)} hrs)`}
        />
        <SummaryRow
          icon={Route}
          label="Km package"
          value={
            pricing.kmPackage === 'unlimited'
              ? 'Unlimited kms'
              : `${pricing.includedKm} kms included`
          }
        />
      </div>

      <div className="space-y-2 text-sm">
        <PriceLine
          label={`Km package (${pricing.includedKm} km × ${formatCurrency(pricing.pricePerKm)}/km)`}
          value={formatCurrency(pricing.kmPackagePrice)}
        />
        {pricing.locationCharge > 0 && (
          <PriceLine
            label="Different drop location"
            value={formatCurrency(pricing.locationCharge)}
          />
        )}
        {pricing.travelConfidence > 0 && (
          <PriceLine
            label="Travel with confidence"
            value={formatCurrency(pricing.travelConfidence)}
          />
        )}
        {pricing.discount > 0 && (
          <PriceLine
            label="Discount"
            value={`-${formatCurrency(pricing.discount)}`}
            highlight="discount"
          />
        )}
        <PriceLine label="Taxes (GST 18%)" value={formatCurrency(pricing.gst)} />
        <PriceLine label="Delivery" value="FREE" highlight="free" />
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="font-bold text-dark">Grand Total</span>
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(pricing.total)}
          </span>
        </div>
        <p className="pt-1 text-xs text-muted">
          Refundable deposit {formatCurrency(pricing.deposit)} (pay separately)
        </p>
      </div>
    </div>
  )
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div>
        <span className="text-muted">{label}: </span>
        <span className="font-semibold text-dark">{value}</span>
      </div>
    </div>
  )
}

function PriceLine({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: 'discount' | 'free'
}) {
  return (
    <div className="flex items-center justify-between gap-3">
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
