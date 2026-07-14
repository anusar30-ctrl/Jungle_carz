import { Calendar, Clock, MapPin, Tag } from 'lucide-react'
import type { PriceBreakdown, TripInfo } from '../../types/carDetails'
import { formatCurrency, formatDisplayDate, formatDisplayTime } from '../../hooks/useCarFilters'

interface TripSummaryCardProps {
  carName: string
  carImage: string
  brand: string
  trip: TripInfo
  pricing: PriceBreakdown
}

export function TripSummaryCard({
  carName,
  carImage,
  brand,
  trip,
  pricing,
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
      </div>

      <div className="mb-5 space-y-3 border-b border-gray-100 pb-5 text-sm">
        <SummaryRow icon={Tag} label="Rental Type" value={rentalLabel} />
        <SummaryRow icon={MapPin} label="Pickup" value={trip.pickupCity} />
        <SummaryRow icon={MapPin} label="Drop" value={trip.dropCity} />
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
        <SummaryRow icon={Calendar} label="Duration" value={`${trip.days} Days`} />
      </div>

      <div className="space-y-2 text-sm">
        <PriceLine label={`Price (${trip.days} days)`} value={formatCurrency(pricing.basePrice)} />
        <PriceLine label="Taxes (GST 18%)" value={formatCurrency(pricing.gst)} />
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="font-bold text-dark">Grand Total</span>
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(pricing.total)}
          </span>
        </div>
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

function PriceLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{label}</span>
      <span className="font-semibold text-dark">{value}</span>
    </div>
  )
}
