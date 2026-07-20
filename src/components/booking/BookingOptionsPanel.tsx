import { useState } from 'react'
import {
  ChevronRight,
  MapPin,
  Shield,
  ShieldCheck,
  Tag,
} from 'lucide-react'
import type { PriceBreakdown } from '../../types/carDetails'
import type { DropLocationMode, KmPackageType } from '../../utils/pricing'
import {
  DROP_LOCATION_EXTRA_PER_KM,
  INCLUDED_KM_PER_DAY,
  TRAVEL_CONFIDENCE_FEE,
  UNLIMITED_KM_PREMIUM,
} from '../../utils/pricing'
import { formatCurrency } from '../../hooks/useCarFilters'
import {
  MapLocationPickerModal,
} from '../luxury/MapLocationPickerModal'
import type { SelectedLocation } from '../luxury/LocationPickerModal'

export type BookingOptionsState = {
  kmPackage: KmPackageType
  dropLocationMode: DropLocationMode
  dropLocation: SelectedLocation | null
  travelConfidence: boolean
  depositPayNow: boolean
  termsAccepted: boolean
}

export const DEFAULT_BOOKING_OPTIONS: BookingOptionsState = {
  kmPackage: 'limited',
  dropLocationMode: 'same',
  dropLocation: null,
  travelConfidence: false,
  depositPayNow: false,
  termsAccepted: false,
}

type BookingOptionsPanelProps = {
  city: string
  pickupLocationLabel?: string
  pickupCoords?: { latitude: number; longitude: number } | null
  pricing: PriceBreakdown
  limitedPackagePrice: number
  unlimitedPackagePrice: number
  options: BookingOptionsState
  onChange: (next: BookingOptionsState) => void
  onProceed?: () => void
  proceedDisabled?: boolean
  showProceedButton?: boolean
}

export function BookingOptionsPanel({
  city,
  pickupLocationLabel,
  pricing,
  limitedPackagePrice,
  unlimitedPackagePrice,
  options,
  onChange,
  onProceed,
  proceedDisabled = false,
  showProceedButton = false,
}: BookingOptionsPanelProps) {
  const [dropModalOpen, setDropModalOpen] = useState(false)

  const update = <K extends keyof BookingOptionsState>(
    key: K,
    value: BookingOptionsState[K],
  ) => {
    onChange({ ...options, [key]: value })
  }

  const handleDropModeChange = (mode: DropLocationMode) => {
    if (mode === 'same') {
      onChange({ ...options, dropLocationMode: 'same', dropLocation: null })
      return
    }
    onChange({ ...options, dropLocationMode: 'different' })
    setDropModalOpen(true)
  }

  return (
    <>
      <div className="space-y-4">
        <section className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-dark">Choose your Km Package</h3>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(pricing.kmPackagePrice)}
            </span>
          </div>

          <div className="space-y-3">
            <KmOption
              checked={options.kmPackage === 'limited'}
              title={`${pricing.includedKm} Kms Included`}
              subtitle={`${formatCurrency(pricing.excessKmRate)}/km will be charged in case of excess km`}
              price={limitedPackagePrice}
              onSelect={() => update('kmPackage', 'limited')}
            />
            <KmOption
              checked={options.kmPackage === 'unlimited'}
              title="Unlimited Kms Included"
              subtitle={`${Math.round(UNLIMITED_KM_PREMIUM * 100)}% premium over limited package`}
              price={unlimitedPackagePrice}
              onSelect={() => update('kmPackage', 'unlimited')}
            />
          </div>

          <p className="mt-3 text-xs text-muted">
            Rate: {formatCurrency(pricing.pricePerKm)}/km × {pricing.includedKm}{' '}
            km ({INCLUDED_KM_PER_DAY} km/day × {pricing.billingDays} day
            {pricing.billingDays === 1 ? '' : 's'})
          </p>
        </section>

        <section className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-dark">Drop location</h3>
            {pricing.locationCharge > 0 && (
              <span className="text-sm font-bold text-amber-700">
                +{formatCurrency(pricing.locationCharge)}
              </span>
            )}
          </div>

          <div className="space-y-3">
            <DropOption
              checked={options.dropLocationMode === 'same'}
              title="Drop at same location"
              subtitle={
                pickupLocationLabel
                  ? `Return at ${pickupLocationLabel}`
                  : `Return in ${city}`
              }
              onSelect={() => handleDropModeChange('same')}
            />
            <DropOption
              checked={options.dropLocationMode === 'different'}
              title="Drop at different location"
              subtitle={
                options.dropLocation
                  ? options.dropLocation.name
                  : `Extra ${formatCurrency(DROP_LOCATION_EXTRA_PER_KM)}/km applies`
              }
              onSelect={() => handleDropModeChange('different')}
            />
          </div>

          {options.dropLocationMode === 'different' && (
            <button
              type="button"
              onClick={() => setDropModalOpen(true)}
              className="mt-3 flex w-full items-center justify-between rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {options.dropLocation ? 'Change drop location' : 'Select drop location'}
              </span>
              <ChevronRight className="h-4 w-4" />
            </button>
          )}

          {pricing.locationDistanceKm > 0 && (
            <p className="mt-2 text-xs text-muted">
              Distance from pickup: {Math.round(pricing.locationDistanceKm)} km ×{' '}
              {formatCurrency(DROP_LOCATION_EXTRA_PER_KM)}/km
            </p>
          )}
        </section>

        <section className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-card">
          <label className="flex cursor-pointer items-start justify-between gap-4">
            <div className="flex gap-3">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-bold text-dark">Travel with confidence</p>
                <p className="mt-1 text-sm text-muted">
                  Your trip is secured against accidental damage
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-sm font-bold text-dark">
                {formatCurrency(TRAVEL_CONFIDENCE_FEE)}
              </span>
              <input
                type="checkbox"
                checked={options.travelConfidence}
                onChange={(e) => update('travelConfidence', e.target.checked)}
                className="h-5 w-5 rounded accent-primary"
              />
            </div>
          </label>
        </section>

        <section className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-dark">Refundable Deposit</h3>
            </div>
            <span className="text-lg font-bold text-dark">
              {formatCurrency(pricing.deposit)}
            </span>
          </div>

          <div className="space-y-3">
            <DepositOption
              checked={options.depositPayNow}
              title="Pay Now"
              subtitle="Complete the payment along with your booking fee"
              onSelect={() => update('depositPayNow', true)}
            />
            <DepositOption
              checked={!options.depositPayNow}
              title="Pay Later"
              subtitle="Pay anytime before your trip start"
              onSelect={() => update('depositPayNow', false)}
            />
          </div>

          <p className="mt-3 rounded-xl bg-primary/5 px-3 py-2 text-xs text-muted">
            Full refund within 2–3 days after booking completion, unless there is
            damage or late return.
          </p>
        </section>

        <section className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-card">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 text-left"
          >
            <div className="flex items-center gap-3">
              <Tag className="h-5 w-5 text-primary" />
              <div>
                <p className="font-bold text-dark">Explore Offers</p>
                <p className="text-sm text-muted">Check availability here</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted" />
          </button>
        </section>

        <label className="flex cursor-pointer items-start gap-3 rounded-[24px] border border-gray-100 bg-gray-50 p-4">
          <input
            type="checkbox"
            checked={options.termsAccepted}
            onChange={(e) => update('termsAccepted', e.target.checked)}
            className="mt-1 h-5 w-5 rounded accent-primary"
          />
          <span className="text-sm text-muted">
            I agree to the terms and conditions of the lease agreement with the
            host.{' '}
            <button type="button" className="font-semibold text-primary">
              View Details
            </button>
          </span>
        </label>

        {showProceedButton && (
          <div className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-card">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-3xl font-bold text-dark">
                  {formatCurrency(pricing.total)}
                </p>
                <p className="text-sm text-muted">
                  Incl.{' '}
                  {options.kmPackage === 'unlimited'
                    ? 'unlimited kms'
                    : `${pricing.includedKm} kms`}
                </p>
              </div>
              <button type="button" className="text-sm font-semibold text-primary">
                View Details
              </button>
            </div>
            <button
              type="button"
              disabled={proceedDisabled || !options.termsAccepted}
              onClick={onProceed}
              className="w-full rounded-2xl bg-primary py-4 text-sm font-bold tracking-wide text-white uppercase shadow-lg shadow-primary/25 transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              Proceed to Pay
            </button>
          </div>
        )}
      </div>

      <MapLocationPickerModal
        open={dropModalOpen}
        city={city}
        selection={options.dropLocation}
        title="Select drop location"
        onClose={() => setDropModalOpen(false)}
        onContinue={(location) => {
          onChange({
            ...options,
            dropLocationMode: 'different',
            dropLocation: location,
          })
          setDropModalOpen(false)
        }}
      />
    </>
  )
}

function KmOption({
  checked,
  title,
  subtitle,
  price,
  onSelect,
}: {
  checked: boolean
  title: string
  subtitle: string
  price: number
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-start justify-between gap-3 rounded-2xl border p-4 text-left transition-colors ${
        checked
          ? 'border-primary bg-primary/5'
          : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      <div className="flex gap-3">
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
            checked ? 'border-primary' : 'border-gray-300'
          }`}
        >
          {checked && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
        </span>
        <div>
          <p className="font-semibold text-dark">{title}</p>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        </div>
      </div>
      <span className="shrink-0 font-bold text-dark">{formatCurrency(price)}</span>
    </button>
  )
}

function DropOption({
  checked,
  title,
  subtitle,
  onSelect,
}: {
  checked: boolean
  title: string
  subtitle: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
        checked
          ? 'border-primary bg-primary/5'
          : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          checked ? 'border-primary' : 'border-gray-300'
        }`}
      >
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
      </span>
      <div>
        <p className="font-semibold text-dark">{title}</p>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </div>
    </button>
  )
}

function DepositOption({
  checked,
  title,
  subtitle,
  onSelect,
}: {
  checked: boolean
  title: string
  subtitle: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
        checked
          ? 'border-primary bg-primary/5'
          : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          checked ? 'border-primary' : 'border-gray-300'
        }`}
      >
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
      </span>
      <div>
        <p className="font-semibold text-dark">{title}</p>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </div>
    </button>
  )
}
