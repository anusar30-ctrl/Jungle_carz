import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, MapPin, X } from 'lucide-react'
import type { TripInfo } from '../../types/carDetails'
import { formatCurrency } from '../../hooks/useCarFilters'

export const DROP_LOCATION_EXTRA_PER_KM = 25

type DropLocationPolicyModalProps = {
  open: boolean
  trip: TripInfo
  onClose: () => void
  onContinue: () => void
}

export function DropLocationPolicyModal({
  open,
  trip,
  onClose,
  onContinue,
}: DropLocationPolicyModalProps) {
  if (typeof document === 'undefined') return null

  const sameLocation =
    trip.pickupCity.toLowerCase() === trip.dropCity.toLowerCase()

  return createPortal(
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
            className="relative w-full max-w-md rounded-[24px] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drop-policy-title"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6 pt-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>

              <h2
                id="drop-policy-title"
                className="text-xl font-bold text-dark"
              >
                Drop location policy
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Please review how vehicle drop-off works before you continue
                booking.
              </p>

              <div className="mt-5 space-y-3 rounded-2xl bg-gray-50 p-4 text-sm">
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold text-dark">Pickup location</p>
                    <p className="text-muted">{trip.pickupCity}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <div>
                    <p className="font-semibold text-dark">Drop location</p>
                    <p className="text-muted">
                      {sameLocation
                        ? `Same as pickup (${trip.dropCity})`
                        : trip.dropCity}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-sm font-semibold text-dark">
                  Standard drop-off
                </p>
                <p className="mt-1 text-sm text-muted">
                  The vehicle should be returned at the{' '}
                  <span className="font-medium text-dark">same location</span>{' '}
                  where it was picked up. No extra drop charges apply in this
                  case.
                </p>
              </div>

              <div className="mt-3 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    Different drop location
                  </p>
                  <p className="mt-1 text-sm text-amber-800/90">
                    If you choose to drop the car at a different location, an
                    extra charge of{' '}
                    <span className="font-bold">
                      {formatCurrency(DROP_LOCATION_EXTRA_PER_KM)}/km
                    </span>{' '}
                    applies from the drop location.
                  </p>
                </div>
              </div>

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
                  onClick={onContinue}
                  className="flex-1 rounded-2xl bg-primary py-3 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-colors hover:bg-primary-dark"
                >
                  Continue booking
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
