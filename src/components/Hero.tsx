import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Car, ChevronRight, Headphones, Star } from 'lucide-react'
import { HERO_STATS } from '../constants/data'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1519641471654-76ce0107a1bf?auto=format&fit=crop&w=1200&q=80'

const statIcons = {
  star: Star,
  car: Car,
  headset: Headphones,
} as const

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.6 + i * 0.15,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-24 pb-32 md:pt-28 md:pb-40"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -right-20 top-20 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-5 flex items-center gap-2"
            >
              <span className="h-px w-8 bg-primary" />
              <span className="text-sm font-semibold tracking-wide text-primary">
                Drive Your Adventure
              </span>
            </motion.div>

            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-dark sm:text-5xl lg:text-[3.5rem]">
              Rent Your Perfect Ride
              <br />
              Anytime.{' '}
              <span className="text-primary">Anywhere.</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted">
              Choose from premium self-drive cars or chauffeur-driven vehicles
              with instant booking, transparent pricing, and 24/7 support.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/search"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-shadow hover:shadow-xl hover:shadow-primary/35"
                >
                  Book Now
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
              <motion.a
                href="#cars"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-8 py-4 text-base font-semibold text-dark transition-all hover:border-primary/30 hover:shadow-md"
              >
                Explore Cars
                <ChevronRight className="h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] shadow-float">
              <img
                src={HERO_IMAGE}
                alt="Premium luxury SUV on a scenic mountain road"
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/20 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-4 -left-4 right-4 flex flex-col gap-3 sm:-bottom-6 sm:flex-row sm:items-end sm:justify-between lg:-left-8">
              {HERO_STATS.map((stat, i) => {
                const Icon = statIcons[stat.icon]
                return (
                  <motion.div
                    key={stat.id}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className={`glass flex items-center gap-3 rounded-[20px] p-4 shadow-card ${
                      i === 1 ? 'sm:mt-8' : i === 2 ? 'sm:mt-4' : ''
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                        stat.icon === 'star'
                          ? 'bg-accent/15 text-accent'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      <Icon
                        className="h-5 w-5"
                        fill={stat.icon === 'star' ? 'currentColor' : 'none'}
                      />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-dark">
                        {stat.value}
                        {stat.icon === 'star' && (
                          <span className="ml-1 text-sm text-accent">★</span>
                        )}
                      </p>
                      <p className="text-xs font-medium text-muted">
                        {stat.label}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
