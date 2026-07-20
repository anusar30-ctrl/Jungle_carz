import { motion } from 'framer-motion'

export function LoadingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.08 }}
          className="flex flex-col overflow-hidden rounded-[18px] border border-gray-100 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
        >
          <div className="shimmer h-40 w-full sm:h-44" />
          <div className="flex flex-1 flex-col p-4">
            <div className="shimmer h-4 w-1/4 rounded-lg" />
            <div className="mt-2 shimmer h-6 w-2/3 rounded-lg" />
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((__, j) => (
                <div key={j} className="shimmer h-14 rounded-xl" />
              ))}
            </div>
            <div className="mt-3 shimmer h-9 w-full rounded-xl" />
            <div className="mt-4 flex gap-2">
              <div className="shimmer h-10 flex-1 rounded-xl" />
              <div className="shimmer h-10 flex-1 rounded-xl" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
