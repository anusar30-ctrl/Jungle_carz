import { motion } from 'framer-motion'
import { Car, SearchX } from 'lucide-react'

interface NoResultsProps {
  onReset: () => void
}

export function NoResults({ onReset }: NoResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center rounded-[24px] border border-gray-100 bg-white px-6 py-16 text-center shadow-soft"
    >
      <div className="relative mb-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
          <Car className="h-12 w-12 text-primary/40" />
        </div>
        <div className="absolute -right-1 -bottom-1 flex h-10 w-10 items-center justify-center rounded-full bg-accent/15">
          <SearchX className="h-5 w-5 text-accent" />
        </div>
      </div>
      <h3 className="mb-2 text-xl font-bold text-dark">No Cars Found</h3>
      <p className="mb-6 max-w-sm text-muted">
        Try changing your filters or modifying your search dates to see more
        available vehicles.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="rounded-2xl bg-primary px-8 py-3 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark"
      >
        Reset Filters
      </button>
    </motion.div>
  )
}
