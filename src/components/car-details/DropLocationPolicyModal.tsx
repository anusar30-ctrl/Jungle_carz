import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, ChevronRight, MapPin, X } from 'lucide-react'
import type { TripInfo } from '../../types/carDetails'
import { formatCurrency } from '../../hooks/useCarFilters'
import {
  calcDropLocationCharge,
  DROP_LOCATION_EXTRA_PER_KM,
  type DropLocationMode,
} from '../../utils/pricing'
import {
  MapLocationPickerModal,
} from '../luxury/MapLocationPickerModal'
import type { SelectedLocation } from '../luxury/LocationPickerModal'

export type DropLocationSelection = {
  mode: DropLocationMode
  dropLocation: SelectedLocation | null
}

type DropLocationPolicyModalProps = {
  open: boolean
  trip: TripInfo
  city: string
  pickupLocationLabel?: string
  pickupCoords?: { latitude: number; longitude: number } | null
  onClose: () => void
  onContinue: (selection: DropLocationSelection) => void
}

export function DropLocationPolicyModal({
  open,
  trip,
  city,
  pickupLocationLabel,
  pickupCoords,
  onClose,
  onContinue,
}: DropLocationPolicyModalProps) {
  const [mode, setMode] = useState<DropLocationMode>('same')
  const [dropLocation, setDropLocation] = useState<SelectedLocation | null>(null)
  const [locationPickerOpen, setLocationPickerOpen] = useState(false)

  useEffect(() => {
    if (open) {
      setMode('same')
      setDropLocation(null)
      setLocationPickerOpen(false)
    }
  }, [open])

  const pickupLabel = pickupLocationLabel || trip.pickupCity

  const { charge, distanceKm } = useMemo(
    () =>
      calcDropLocationCharge(
        mode,
        pickupCoords,
        dropLocation
          ? {
              latitude: dropLocation.latitude,
              longitude: dropLocation.longitude,
            }
          : null,
      ),
    [mode, pickupCoords, dropLocation],
  )

  const canContinue =
    mode === 'same' || (mode === 'different' && dropLocation != null)

  const handleModeChange = (next: DropLocationMode) => {
    setMode(next)
    if (next === 'same') {
      setDropLocation(null)
      setLocationPickerOpen(false)
      return
    }
    setLocationPickerOpen(true)
  }

  const handleContinue = () => {
    if (!canContinue) return
    onContinue({ mode, dropLocation })
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[24px] bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="drop-policy-title"
            >
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-6 pt-7">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>

                <h2 id="drop-policy-title" className="text-xl font-bold text-dark">
                  Drop location policy
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Choose where you will return the vehicle before continuing.
                </p>

                <div className="mt-5 space-y-3 rounded-2xl bg-gray-50 p-4 text-sm">
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="font-semibold text-dark">Pickup location</p>
                      <p className="text-muted">{pickupLabel}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                    <div>
                      <p className="font-semibold text-dark">Drop location</p>
                      <p className="text-muted">
                        {mode === 'same'
                          ? `Same as pickup (${pickupLabel})`
                          : dropLocation?.name || 'Select on map'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <RadioOption
                    checked={mode === 'same'}
                    title="Drop at same location"
                    onSelect={() => handleModeChange('same')}
                  />
                  <RadioOption
                    checked={mode === 'different'}
                    title="Drop at different location"
                    onSelect={() => handleModeChange('different')}
                  />
                </div>

                {mode === 'same' && (
                  <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                    <p className="text-sm font-semibold text-dark">
                      Standard drop-off
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      The vehicle should be returned at the{' '}
                      <span className="font-medium text-dark">same location</span>{' '}
                      where it was picked up ({pickupLabel}). No extra drop
                      charges apply.
                    </p>
                  </div>
                )}

                {mode === 'different' && (
                  <div className="mt-4 space-y-3">
                    <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                      <div>
                        <p className="text-sm font-semibold text-amber-900">
                          Different drop location
                        </p>
                        <p className="mt-1 text-sm text-amber-800/90">
                          An extra charge of{' '}
                          <span className="font-bold">
                            {formatCurrency(DROP_LOCATION_EXTRA_PER_KM)}/km
                          </span>{' '}
                          applies based on distance from pickup to drop point.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setLocationPickerOpen(true)}
                      className="flex w-full items-center justify-between rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {dropLocation
                          ? 'Change drop location on map'
                          : 'Search & select drop location'}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    {dropLocation && (
                      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm">
                        <p className="font-semibold text-dark">
                          {dropLocation.name}
                        </p>
                        <p className="mt-1 text-muted">{dropLocation.address}</p>
                        {distanceKm > 0 && (
                          <p className="mt-2 text-muted">
                            Distance from pickup:{' '}
                            <span className="font-semibold text-dark">
                              {Math.round(distanceKm)} km
                            </span>
                          </p>
                        )}
                        <p className="mt-2 font-bold text-amber-800">
                          Extra charge: {formatCurrency(charge)}
                        </p>
                      </div>
                    )}

                    {!dropLocation && (
                      <p className="text-xs text-amber-700">
                        Please select a drop location on the map to continue.
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-2xl border border-gray-200 py-3 text-sm font-semibold text-dark transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={!canContinue}
                    className="flex-1 rounded-2xl bg-primary py-3 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Continue booking
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MapLocationPickerModal
        open={locationPickerOpen}
        city={city}
        selection={dropLocation}
        title="Select drop location"
        onClose={() => setLocationPickerOpen(false)}
        onContinue={(location) => {
          setDropLocation(location)
          setMode('different')
          setLocationPickerOpen(false)
        }}
      />
    </>,
    document.body,
  )
}

function RadioOption({
  checked,
  title,
  onSelect,
}: {
  checked: boolean
  title: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${
        checked
          ? 'border-primary bg-primary/5'
          : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          checked ? 'border-primary' : 'border-gray-300'
        }`}
      >
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
      </span>
      <span className="font-semibold text-dark">{title}</span>
    </button>
  )
}
