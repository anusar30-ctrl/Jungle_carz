import { motion } from 'framer-motion'
import { Mountain } from 'lucide-react'

export function LogoReveal() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative mb-6"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 40px rgba(27, 94, 32, 0.3)',
                '0 0 80px rgba(27, 94, 32, 0.55)',
                '0 0 40px rgba(27, 94, 32, 0.3)',
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-luxury-primary/80 backdrop-blur-sm"
          >
            <Mountain className="h-9 w-9 text-white" strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          animate={{ opacity: 1, letterSpacing: '0.35em' }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="font-outfit text-sm font-semibold tracking-[0.35em] text-white/90"
        >
          JUNGLE CARZ
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-3 font-display text-2xl font-medium tracking-wide text-white/80 sm:text-3xl"
        >
          Drive Into Adventure
        </motion.p>
      </motion.div>
    </div>
  )
}
