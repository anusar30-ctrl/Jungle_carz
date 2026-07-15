import { motion } from 'framer-motion'
import { Car, MapPinned, UserRound } from 'lucide-react'
import {
  LUXURY_BOOKING_MODES,
  type LuxuryBookingMode,
} from '../../constants/luxury'

interface LuxuryRentalTabsProps {
  value: LuxuryBookingMode
  onChange: (mode: LuxuryBookingMode) => void
}

const icons = {
  'self-drive': Car,
  'with-driver': UserRound,
  tourism: MapPinned,
} as const

export function LuxuryRentalTabs({ value, onChange }: LuxuryRentalTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Booking type"
      className="flex rounded-2xl bg-white/5 p-1"
    >
      {LUXURY_BOOKING_MODES.map((mode) => {
        const Icon = icons[mode.id]
        const active = value === mode.id
        return (
          <button
            key={mode.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(mode.id)}
            className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 font-outfit text-xs font-semibold transition-colors sm:gap-2 sm:text-sm ${
              active ? 'text-white' : 'text-white/50 hover:text-white/80'
            }`}
          >
            {active && (
              <motion.span
                layoutId="luxury-tab"
                className="absolute inset-0 rounded-xl bg-luxury-secondary shadow-md"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className="relative h-4 w-4 shrink-0" />
            <span className="relative">{mode.label}</span>
          </button>
        )
      })}
    </div>
  )
}
