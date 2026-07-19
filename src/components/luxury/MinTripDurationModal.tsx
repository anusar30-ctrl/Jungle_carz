import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Clock, X } from 'lucide-react'
import { MIN_SELF_DRIVE_HOURS } from '../../utils/datetime'

type MinTripDurationModalProps = {
  open: boolean
  onClose: () => void
}

export function MinTripDurationModal({ open, onClose }: MinTripDurationModalProps) {
  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-sm overflow-hidden rounded-[28px] border border-white/10 bg-[#1a1a2e] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="min-duration-title"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6 pt-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-luxury-accent/20">
                <Clock className="h-7 w-7 text-luxury-accent" />
              </div>

              <h2
                id="min-duration-title"
                className="font-display text-xl font-semibold text-white"
              >
                Minimum trip duration
              </h2>
              <p className="mt-3 font-outfit text-sm leading-relaxed text-white/70">
                Self drive bookings must be for more than{' '}
                <span className="font-semibold text-white">
                  {MIN_SELF_DRIVE_HOURS} hours
                </span>
                . Please adjust your trip start or end time.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-luxury-accent to-orange-400 py-3.5 font-outfit text-sm font-semibold text-white shadow-lg shadow-luxury-accent/30 transition-opacity hover:opacity-90"
              >
                OK, I&apos;ll adjust
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
