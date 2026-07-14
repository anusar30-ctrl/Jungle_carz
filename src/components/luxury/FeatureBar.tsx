import { motion } from 'framer-motion'
import { Headphones, MapPin, ShieldCheck, Star } from 'lucide-react'
import { FEATURE_BAR_ITEMS } from '../../constants/luxury'

const icons = {
  shield: ShieldCheck,
  headset: Headphones,
  map: MapPin,
  star: Star,
} as const

export function FeatureBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.6 }}
      className="relative z-20 mx-auto w-full max-w-4xl px-4"
    >
      <div className="glass-luxury-bar grid grid-cols-2 gap-4 rounded-2xl px-4 py-4 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-6 md:justify-between md:px-10 lg:flex-nowrap">
        {FEATURE_BAR_ITEMS.map((item, i) => {
          const Icon = icons[item.icon]
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.08 }}
              className="flex items-center gap-2"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 sm:h-9 sm:w-9">
                <Icon className="h-3.5 w-3.5 text-luxury-accent sm:h-4 sm:w-4" />
              </div>
              <span className="font-outfit text-xs font-medium text-white/90 sm:text-sm">
                {item.label}
              </span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
