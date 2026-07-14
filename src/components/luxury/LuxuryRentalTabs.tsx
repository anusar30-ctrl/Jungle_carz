import { motion } from 'framer-motion'
import type { RentalType } from '../../types'
import { RENTAL_TYPES } from '../../constants/data'
import { Car, UserRound } from 'lucide-react'

interface LuxuryRentalTabsProps {
  value: RentalType
  onChange: (type: RentalType) => void
}

const icons = { 'self-drive': Car, 'with-driver': UserRound } as const

export function LuxuryRentalTabs({ value, onChange }: LuxuryRentalTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Rental type"
      className="flex rounded-2xl bg-white/5 p-1"
    >
      {RENTAL_TYPES.map((type) => {
        const Icon = icons[type.id]
        const active = value === type.id
        return (
          <button
            key={type.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(type.id)}
            className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 font-outfit text-sm font-semibold transition-colors ${
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
            <Icon className="relative h-4 w-4" />
            <span className="relative">{type.label}</span>
          </button>
        )
      })}
    </div>
  )
}
