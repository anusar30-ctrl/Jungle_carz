import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { Link } from 'react-router-dom'

export function HeroContent() {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springX = useSpring(mx, { stiffness: 80, damping: 20 })
  const springY = useSpring(my, { stiffness: 80, damping: 20 })
  const parallaxX = useTransform(springX, [-0.5, 0.5], [-8, 8])
  const parallaxY = useTransform(springY, [-0.5, 0.5], [-6, 6])

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{ x: parallaxX, y: parallaxY }}
      className="relative z-10 max-w-xl"
    >
      <p className="mb-4 font-outfit text-xs font-semibold tracking-[0.3em] text-luxury-secondary uppercase">
        Drive Into Adventure
      </p>

      <h1 className="font-display text-[2rem] leading-[1.08] font-semibold tracking-tight text-white sm:text-5xl lg:text-[4.5rem]">
        Every Journey
        <br />
        Starts Here.
      </h1>

      <p className="mt-6 max-w-md text-base leading-relaxed text-white/75 sm:text-lg">
        Premium self-drive and chauffeur-driven cars for city drives, weekend
        escapes, business travel, and unforgettable road trips.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/search"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-luxury-secondary px-8 py-4 font-outfit text-base font-semibold text-white shadow-lg shadow-black/20 transition-colors hover:bg-luxury-primary sm:w-auto"
          >
            Book Your Ride
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
        <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/search"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-white/40 bg-white/5 px-8 py-4 font-outfit text-base font-semibold text-white backdrop-blur-sm transition-colors hover:border-luxury-accent hover:text-luxury-accent sm:w-auto"
          >
            <Play className="h-4 w-4 fill-current" />
            Explore Collection
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
