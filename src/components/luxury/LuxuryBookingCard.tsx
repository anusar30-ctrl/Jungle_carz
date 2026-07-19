import {
  useState,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  Calendar,
  ChevronDown,
  MapPin,
  Search,
  Tag,
} from 'lucide-react'
import type { LuxuryBookingMode } from '../../constants/luxury'
import { LUXURY_LOCATIONS, VEHICLE_TYPES } from '../../constants/luxury'
import {
  addHoursToDatetimeLocal,
  getTripDurationHours,
  minDropDatetime,
  MIN_SELF_DRIVE_HOURS,
  splitDatetimeLocal,
  toDatetimeLocal,
} from '../../utils/datetime'
import { LuxuryRentalTabs } from './LuxuryRentalTabs'
import { MinTripDurationModal } from './MinTripDurationModal'
import {
  LocationPickerModal,
  type SelectedLocation,
} from './LocationPickerModal'

const today = new Date().toISOString().split('T')[0]
const defaultTripStart = toDatetimeLocal(today, '10:00')
const defaultTripEnd = toDatetimeLocal(
  new Date(Date.now() + 86400000).toISOString().split('T')[0],
  '10:00'
)

function formatLocationLabel(location: SelectedLocation | null) {
  if (!location) return ''
  const label = location.name
  return label.length > 42 ? `${label.slice(0, 39)}...` : label
}

export function LuxuryBookingCard() {
  const navigate = useNavigate()
  const [bookingMode, setBookingMode] = useState<LuxuryBookingMode>('self-drive')
  const [city, setCity] = useState('')
  const [location, setLocation] = useState<SelectedLocation | null>(null)
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [tripStart, setTripStart] = useState(defaultTripStart)
  const [tripEnd, setTripEnd] = useState(defaultTripEnd)
  const [vehicleType, setVehicleType] = useState('')
  const [promo, setPromo] = useState('')
  const [loading, setLoading] = useState(false)
  const [durationModalOpen, setDurationModalOpen] = useState(false)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>(
    []
  )

  const todayMin = `${today}T00:00`
  const isSelfDrive = bookingMode === 'self-drive'
  const tripEndMin = isSelfDrive
    ? addHoursToDatetimeLocal(tripStart, MIN_SELF_DRIVE_HOURS) ||
      minDropDatetime(tripStart) ||
      todayMin
    : minDropDatetime(tripStart) || todayMin

  const showMinDurationModal = () => setDurationModalOpen(true)

  const isSelfDriveDurationTooShort = () =>
    isSelfDrive && getTripDurationHours(tripStart, tripEnd) < MIN_SELF_DRIVE_HOURS

  const handleModeChange = (mode: LuxuryBookingMode) => {
    setBookingMode(mode)
    if (mode === 'self-drive') {
      const minEnd = addHoursToDatetimeLocal(tripStart, MIN_SELF_DRIVE_HOURS)
      if (minEnd && tripEnd < minEnd) setTripEnd(minEnd)
    }
  }

  const handleCityChange = (nextCity: string) => {
    setCity(nextCity)
    setLocation(null)
  }

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (!location) return

    if (isSelfDriveDurationTooShort()) {
      showMinDurationModal()
      return
    }

    setLoading(true)

    const start = splitDatetimeLocal(tripStart)
    const end = splitDatetimeLocal(tripEnd)

    setTimeout(() => {
      setLoading(false)
      const params = new URLSearchParams({
        city,
        dropCity: city,
        location: location.address,
        pickup: start.date,
        drop: end.date,
        pickupTime: start.time,
        dropTime: end.time,
      })

      if (bookingMode === 'tourism') {
        params.set('category', 'tourism')
      } else {
        params.set('type', bookingMode)
        if (vehicleType) params.set('vehicleType', vehicleType.toLowerCase())
      }
      if (promo) params.set('promo', promo)
      params.set('lat', String(location.latitude))
      params.set('lng', String(location.longitude))

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
    <>
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
              <LuxuryRentalTabs value={bookingMode} onChange={handleModeChange} />
            </div>

            <form onSubmit={handleSearch} className="mt-5 space-y-3">
              <LuxuryField icon={Building2} label="City">
                <select
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  required
                  className="luxury-input"
                  aria-label="City"
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

              <LuxuryField icon={MapPin} label="Location">
                <button
                  type="button"
                  onClick={() => city && setLocationModalOpen(true)}
                  disabled={!city}
                  className="luxury-input flex w-full items-center justify-between gap-2 text-left disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Select pickup location"
                >
                  <span
                    className={
                      location ? 'truncate text-white' : 'text-white/30'
                    }
                  >
                    {location
                      ? formatLocationLabel(location)
                      : city
                        ? 'Select location'
                        : 'Select city first'}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-white/40" />
                </button>
                <input
                  type="hidden"
                  name="location"
                  value={location?.address ?? ''}
                  required
                  readOnly
                />
              </LuxuryField>

              <LuxuryField icon={Calendar} label="Trip Start">
                <input
                  type="datetime-local"
                  value={tripStart}
                  min={todayMin}
                  onChange={(e) => {
                    const value = e.target.value
                    setTripStart(value)
                    const nextEndMin = isSelfDrive
                      ? addHoursToDatetimeLocal(value, MIN_SELF_DRIVE_HOURS)
                      : value
                    if (tripEnd < nextEndMin) setTripEnd(nextEndMin)
                  }}
                  required
                  className="luxury-input w-full [color-scheme:dark]"
                  aria-label="Trip start date and time"
                />
              </LuxuryField>

              <LuxuryField icon={Calendar} label="Trip End">
                <input
                  type="datetime-local"
                  value={tripEnd}
                  min={tripEndMin}
                  onChange={(e) => {
                    const value = e.target.value
                    setTripEnd(value)
                    if (
                      isSelfDrive &&
                      getTripDurationHours(tripStart, value) > 0 &&
                      getTripDurationHours(tripStart, value) < MIN_SELF_DRIVE_HOURS
                    ) {
                      showMinDurationModal()
                    }
                  }}
                  required
                  className="luxury-input w-full [color-scheme:dark]"
                  aria-label="Trip end date and time"
                />
              </LuxuryField>

              {!isSelfDrive && (
                <>
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
                </>
              )}

              <motion.button
                type="submit"
                disabled={loading || !location}
                onClick={handleRipple}
                whileHover={{
                  y: -2,
                  boxShadow: '0 12px 40px rgba(249,115,22,0.4)',
                }}
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

      <LocationPickerModal
        open={locationModalOpen}
        city={city}
        selection={location}
        onClose={() => setLocationModalOpen(false)}
        onContinue={(next) => {
          setLocation(next)
          setLocationModalOpen(false)
        }}
      />

      <MinTripDurationModal
        open={durationModalOpen}
        onClose={() => setDurationModalOpen(false)}
      />
    </>
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
