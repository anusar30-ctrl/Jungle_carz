import { motion } from 'framer-motion'
import {
  Headphones,
  Infinity,
  Receipt,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { TRUST_BADGES } from '../constants/data'
import type { TrustBadge } from '../types'

const iconMap: Record<TrustBadge['icon'], typeof ShieldCheck> = {
  shield: ShieldCheck,
  infinity: Infinity,
  headset: Headphones,
  receipt: Receipt,
  zap: Zap,
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function TrustBadges() {
  return (
    <section className="pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          {TRUST_BADGES.map((badge) => {
            const Icon = iconMap[badge.icon]
            return (
              <motion.article
                key={badge.id}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="group rounded-[20px] border border-gray-100 bg-white p-6 text-center shadow-soft transition-shadow hover:border-primary/15 hover:shadow-card"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </div>
                <h3 className="mb-2 text-sm font-bold text-dark sm:text-base">
                  {badge.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted sm:text-sm">
                  {badge.description}
                </p>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
