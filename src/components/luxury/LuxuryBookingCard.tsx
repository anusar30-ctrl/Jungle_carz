import { useState, type FormEvent, type MouseEvent, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Calendar,
  ChevronDown,
  MapPin,
  Search,
  Tag,
} from 'lucide-react'
import type { RentalType } from '../../types'
import {
  LUXURY_LOCATIONS,
  VEHICLE_TYPES,
} from '../../constants/luxury'
import { splitDatetimeLocal, toDatetimeLocal } from '../../utils/datetime'
import { LuxuryRentalTabs } from './LuxuryRentalTabs'

const DEFAULT_PICKUP = toDatetimeLocal('2026-08-20', '10:00')
const DEFAULT_DROP = toDatetimeLocal('2026-08-23', '18:00')

export function LuxuryBookingCard() {
  const navigate = useNavigate()
  const [rentalType, setRentalType] = useState<RentalType>('self-drive')
  const [pickupCity, setPickupCity] = useState('')
  const [pickupDatetime, setPickupDatetime] = useState('')
  const [dropDatetime, setDropDatetime] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [promo, setPromo] = useState('')
  const [loading, setLoading] = useState(false)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])

  const todayMin = `${new Date().toISOString().split('T')[0]}T00:00`

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const pickup = splitDatetimeLocal(pickupDatetime || DEFAULT_PICKUP)
    const drop = splitDatetimeLocal(dropDatetime || DEFAULT_DROP)

    setTimeout(() => {
      setLoading(false)
      const city = pickupCity || 'Bangalore'
      const params = new URLSearchParams({
        city,
        dropCity: city,
        pickup: pickup.date,
        drop: drop.date,
        pickupTime: pickup.time,
        dropTime: drop.time,
        type: rentalType,
      })
      navigate(`/search?${params.toString()}`)
    }, 900)
  }

  const handleRipple = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id = Date.now()
    setRipples((p) => [
      ...p,
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ])
    setTimeout(() => setRipples((p) => p.filter((r) => r.id !== id)), 600)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-20 w-full max-w-full sm:max-w-[430px] lg:shrink-0"
    >
      <div className="glass-luxury overflow-hidden rounded-[32px] shadow-luxury">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />

        <div className="relative max-h-[min(90vh,720px)] overflow-y-auto p-5 sm:p-6 lg:p-7">
          <h2 className="font-display text-2xl font-semibold text-white">
            Book Your Ride
          </h2>
          <p className="mt-1 font-outfit text-sm text-white/50">
            Fast. Easy. Secure.
          </p>

          <div className="mt-5">
            <LuxuryRentalTabs value={rentalType} onChange={setRentalType} />
          </div>

          <form onSubmit={handleSearch} className="mt-5 space-y-3">
            <LuxuryField icon={MapPin} label="Pickup Location">
              <select
                value={pickupCity}
                onChange={(e) => setPickupCity(e.target.value)}
                required
                className="luxury-input"
                aria-label="Pickup location"
              >
                <option value="" className="text-dark">
                  Select City
                </option>
                {LUXURY_LOCATIONS.map((c) => (
                  <option key={c} value={c} className="text-dark">
                    {c}
                  </option>
                ))}
              </select>
            </LuxuryField>

            <LuxuryField icon={Calendar} label="Pickup Date & Time">
              <input
                type="datetime-local"
                value={pickupDatetime}
                min={todayMin}
                onChange={(e) => {
                  const value = e.target.value
                  setPickupDatetime(value)
                  if (dropDatetime && dropDatetime < value) {
                    setDropDatetime(value)
                  }
                }}
                required
                className="luxury-input w-full [color-scheme:dark]"
                aria-label="Pickup date and time"
              />
            </LuxuryField>

            <LuxuryField icon={Calendar} label="Drop Off Date & Time">
              <input
                type="datetime-local"
                value={dropDatetime}
                min={pickupDatetime || todayMin}
                onChange={(e) => setDropDatetime(e.target.value)}
                required
                className="luxury-input w-full [color-scheme:dark]"
                aria-label="Drop off date and time"
              />
            </LuxuryField>

            <LuxuryField icon={ChevronDown} label="Vehicle Type">
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="luxury-input"
                aria-label="Vehicle type"
              >
                <option value="" className="text-dark">
                  Any Type
                </option>
                {VEHICLE_TYPES.map((t) => (
                  <option key={t} value={t} className="text-dark">
                    {t}
                  </option>
                ))}
              </select>
            </LuxuryField>

            <LuxuryField icon={Tag} label="Promo Code (Optional)">
              <input
                type="text"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder="Enter code"
                className="luxury-input placeholder:text-white/30"
                aria-label="Promo code"
              />
            </LuxuryField>

            <motion.button
              type="submit"
              disabled={loading || !pickupDatetime || !dropDatetime}
              onClick={handleRipple}
              whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(249,115,22,0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="relative mt-2 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-luxury-accent to-orange-400 py-4 font-outfit text-base font-semibold text-white shadow-lg shadow-luxury-accent/30 disabled:opacity-70"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  'Searching...'
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    Search Cars →
                  </>
                )}
              </span>
              {ripples.map((r) => (
                <motion.span
                  key={r.id}
                  initial={{ scale: 0, opacity: 0.4 }}
                  animate={{ scale: 4, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="pointer-events-none absolute h-8 w-8 rounded-full bg-white/30"
                  style={{ left: r.x - 16, top: r.y - 16 }}
                />
              ))}
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  )
}

function LuxuryField({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin
  label: string
  children: ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block font-outfit text-xs font-medium text-white/50">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 transition-colors focus-within:border-luxury-accent/40 focus-within:bg-white/8">
        <Icon className="h-4 w-4 shrink-0 text-white/40" />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
