import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import type { CarDetailData, PriceBreakdown, TripInfo } from '../../types/carDetails'
import { formatCurrency } from '../../hooks/useCarFilters'
import { CarBookingSidebar } from './CarBookingSidebar'
import { BookNowButton } from './BookNowButton'

interface MobileBookingSheetProps {
  car: CarDetailData
  trip: TripInfo
  pricing: PriceBreakdown
  bookingHref: string
}

export function MobileBookingSheet({
  car,
  trip,
  pricing,
  bookingHref,
}: MobileBookingSheetProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-primary">
              {formatCurrency(pricing.total)}
            </p>
            <p className="text-xs text-muted">Total for {trip.days} days</p>
          </div>
          <BookNowButton
            href={bookingHref}
            trip={trip}
            className="flex min-h-[48px] flex-1 items-center justify-center rounded-2xl bg-primary px-6 py-3.5 text-center text-sm font-semibold text-white shadow-md shadow-primary/25"
          >
            Book Now
          </BookNowButton>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-dark/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-[24px] bg-background lg:hidden"
            >
              <div className="sticky top-0 flex justify-center bg-background py-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close booking sheet"
                  className="flex items-center gap-1 text-sm font-semibold text-muted"
                >
                  <ChevronUp className="h-4 w-4" />
                  Close
                </button>
              </div>
              <div className="px-4 pb-8">
                <CarBookingSidebar
                  car={car}
                  trip={trip}
                  pricing={pricing}
                  bookingHref={bookingHref}
                  compact
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
