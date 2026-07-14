import { motion } from 'framer-motion'
import { Car, Gift, Sparkles } from 'lucide-react'
import { SPECIAL_OFFERS } from '../../constants/filters'

const icons = {
  gift: Gift,
  road: Car,
  sparkles: Sparkles,
} as const

export function OfferBanner() {
  return (
    <section aria-label="Special offers" className="py-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {SPECIAL_OFFERS.map((offer, i) => {
          const Icon = icons[offer.icon]
          return (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className={`flex items-center gap-4 rounded-[24px] border border-gray-100 bg-gradient-to-br ${offer.color} p-5 shadow-soft transition-shadow hover:shadow-card`}
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-soft">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wide">
                  {offer.title}
                </p>
                <p className="text-lg font-bold text-dark">{offer.subtitle}</p>
                <p className="text-xs text-muted">{offer.description}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
