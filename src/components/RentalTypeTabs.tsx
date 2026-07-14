import { motion } from 'framer-motion'
import { Car, UserRound } from 'lucide-react'
import type { RentalType } from '../types'
import { RENTAL_TYPES } from '../constants/data'

interface RentalTypeTabsProps {
  value: RentalType
  onChange: (type: RentalType) => void
}

const icons = {
  'self-drive': Car,
  'with-driver': UserRound,
} as const

export function RentalTypeTabs({ value, onChange }: RentalTypeTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Rental type"
      className="relative inline-flex rounded-2xl border border-gray-100 bg-gray-50/80 p-1.5"
    >
      {RENTAL_TYPES.map((type) => {
        const Icon = icons[type.id]
        const isActive = value === type.id

        return (
          <button
            key={type.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(type.id)}
            className={`relative z-10 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors sm:px-7 sm:py-3.5 sm:text-base ${
              isActive ? 'text-white' : 'text-muted hover:text-dark'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="rental-tab-bg"
                className="absolute inset-0 rounded-xl bg-primary shadow-md shadow-primary/25"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className="relative h-4 w-4 sm:h-5 sm:w-5" />
            <span className="relative">{type.label}</span>
          </button>
        )
      })}
    </div>
  )
}
