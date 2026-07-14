import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, Home, Search } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { SuccessAssistCTA } from '../components/booking/BookingAssistCTA'
import { getLastBooking } from '../utils/bookingStorage'

export function BookingSuccess() {
  const location = useLocation()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const booking = getLastBooking()
  const reference =
    (location.state as { reference?: string } | null)?.reference ??
    booking?.reference ??
    'JC-2026-000145'

  const hasBooking = !!booking || !!(location.state as { reference?: string })?.reference

  useEffect(() => {
    if (!hasBooking) {
      navigate('/search', { replace: true })
    }
  }, [hasBooking, navigate])

  const copyRef = async () => {
    await navigator.clipboard.writeText(reference)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!hasBooking) return null

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="search" />

      <main className="mx-auto max-w-2xl px-4 pt-28 pb-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="glass rounded-[24px] border border-white/60 p-8 text-center shadow-float sm:p-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center"
          >
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.15, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-secondary/20"
            />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
              <motion.div
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <Check className="h-10 w-10 text-white" strokeWidth={3} />
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-2xl font-bold text-dark sm:text-3xl"
          >
            Booking Request Received!
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-6 space-y-4 text-muted leading-relaxed"
          >
            <p>Thank you for choosing Jungle Carz.</p>
            <p>
              Your booking request has been successfully submitted. One of our
              booking executives will contact you shortly to confirm your
              reservation, verify availability, and assist you with the
              remaining booking process.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mt-8 rounded-2xl bg-primary/5 p-5"
          >
            <p className="text-sm font-medium text-muted">Booking Reference</p>
            <div className="mt-1 flex items-center justify-center gap-2">
              <span className="text-xl font-bold tracking-wide text-primary sm:text-2xl">
                {reference}
              </span>
              <button
                type="button"
                onClick={copyRef}
                aria-label="Copy booking reference"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 text-primary transition-colors hover:bg-primary/10"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
            <Link
              to="/search"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-6 py-3.5 text-sm font-semibold text-dark transition-all hover:border-primary/30"
            >
              <Search className="h-4 w-4" />
              Browse More Cars
            </Link>
          </motion.div>

          <SuccessAssistCTA />
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
