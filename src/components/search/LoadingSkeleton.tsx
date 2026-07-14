import { motion } from 'framer-motion'

export function LoadingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.08 }}
          className="overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-soft"
        >
          <div className="shimmer h-52 sm:h-56" />
          <div className="space-y-3 p-5">
            <div className="shimmer h-4 w-1/3 rounded-lg" />
            <div className="shimmer h-6 w-2/3 rounded-lg" />
            <div className="flex gap-2">
              <div className="shimmer h-4 w-16 rounded-lg" />
              <div className="shimmer h-4 w-16 rounded-lg" />
              <div className="shimmer h-4 w-16 rounded-lg" />
            </div>
            <div className="flex gap-2">
              <div className="shimmer h-6 w-20 rounded-lg" />
              <div className="shimmer h-6 w-24 rounded-lg" />
            </div>
            <div className="shimmer h-10 w-full rounded-2xl" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
