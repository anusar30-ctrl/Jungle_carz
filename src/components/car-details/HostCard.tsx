import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { BadgeCheck, Clock, MessageCircle, Star } from 'lucide-react'
import type { HostInfo } from '../../types/carDetails'

interface HostCardProps {
  host: HostInfo
}

export function HostCard({ host }: HostCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-card"
    >
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-white">
          {host.avatar}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-dark">{host.name}</h3>
            {host.verified && (
              <span className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                <BadgeCheck className="h-3.5 w-3.5" />
                Verified
              </span>
            )}
          </div>
          <p className="text-sm text-muted">Premium Fleet Partner</p>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-3">
        <Stat label="Trips" value={host.trips} />
        <Stat
          label="Rating"
          value={String(host.rating)}
          icon={<Star className="h-3 w-3 fill-accent text-accent" />}
        />
        <Stat
          label="Response"
          value={host.responseTime}
          icon={<Clock className="h-3 w-3 text-primary" />}
        />
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-primary/30 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary/5"
      >
        <MessageCircle className="h-4 w-4" />
        Contact Host
      </button>
    </motion.div>
  )
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: ReactNode
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-3 text-center">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-0.5 flex items-center justify-center gap-1 text-sm font-bold text-dark">
        {icon}
        {value}
      </p>
    </div>
  )
}

export function BookingTimeline() {
  const steps = [
    'Select Car',
    'Choose Dates',
    'Confirm Booking',
    'Payment',
    'Pickup',
  ]

  return (
    <section aria-labelledby="timeline-heading" className="py-4">
      <h2 id="timeline-heading" className="mb-6 text-center text-lg font-bold text-dark">
        Booking Timeline
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-0">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-md shadow-primary/25">
                {i + 1}
              </div>
              <span className="mt-2 text-xs font-semibold text-dark">{step}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="mx-2 hidden h-0.5 w-8 bg-primary/30 sm:mx-4 sm:block lg:w-16" />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
