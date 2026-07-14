import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Tag, UserRound } from 'lucide-react'
import type { BookingFormData, RentalType } from '../types'
import { DRIVER_AGES } from '../constants/data'
import { DatePicker } from './DatePicker'
import { LocationSelector } from './LocationSelector'
import { RentalTypeTabs } from './RentalTypeTabs'
import { SearchButton } from './SearchButton'
import { TimePicker } from './TimePicker'

const initialForm: BookingFormData = {
  rentalType: 'self-drive',
  pickupCity: '',
  pickupDate: '',
  pickupTime: '',
  dropDate: '',
  dropTime: '',
  promoCode: '',
  driverAge: '21+',
}

export function BookingCard() {
  const navigate = useNavigate()
  const [form, setForm] = useState<BookingFormData>(initialForm)
  const [isLoading, setIsLoading] = useState(false)

  const update = <K extends keyof BookingFormData>(
    key: K,
    value: BookingFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      const params = new URLSearchParams({
        city: form.pickupCity || 'Bangalore',
        pickup: form.pickupDate || '2026-08-20',
        pickupTime: form.pickupTime || '10:00',
        drop: form.dropDate || '2026-08-23',
        dropTime: form.dropTime || '19:00',
        type: form.rentalType,
      })
      navigate(`/search?${params.toString()}`)
    }, 1200)
  }

  return (
    <motion.section
      id="booking"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative -mt-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        <div className="glass rounded-[24px] border border-white/60 p-6 shadow-float sm:p-8">
          <div className="mb-8 flex justify-center">
            <RentalTypeTabs
              value={form.rentalType}
              onChange={(type: RentalType) => update('rentalType', type)}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid gap-5 md:grid-cols-3">
              <LocationSelector
                id="pickup-city"
                label="Pickup City"
                value={form.pickupCity}
                onChange={(v) => update('pickupCity', v)}
              />
              <DatePicker
                id="pickup-date"
                label="Pickup Date"
                value={form.pickupDate}
                onChange={(v) => update('pickupDate', v)}
              />
              <TimePicker
                id="pickup-time"
                label="Pickup Time"
                value={form.pickupTime}
                onChange={(v) => update('pickupTime', v)}
              />

              <DatePicker
                id="drop-date"
                label="Drop Date"
                value={form.dropDate}
                min={form.pickupDate || undefined}
                onChange={(v) => update('dropDate', v)}
              />
              <TimePicker
                id="drop-time"
                label="Drop Time"
                value={form.dropTime}
                onChange={(v) => update('dropTime', v)}
              />
              <div className="hidden md:block" />

              <div className="input-glow relative rounded-2xl border border-gray-200 bg-white transition-colors focus-within:border-primary/40 md:col-span-2">
                <label
                  htmlFor="promo-code"
                  className={`pointer-events-none absolute left-12 transition-all duration-200 ${
                    form.promoCode
                      ? '-top-2.5 left-4 bg-white px-1.5 text-xs font-semibold text-primary'
                      : 'top-1/2 -translate-y-1/2 text-sm text-muted'
                  }`}
                >
                  Promo Code
                  <span className="ml-1 text-xs font-normal text-muted">
                    (Optional)
                  </span>
                </label>
                <div className="flex items-center">
                  <span className="pointer-events-none absolute left-4 text-primary/70">
                    <Tag className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    id="promo-code"
                    value={form.promoCode}
                    onChange={(e) => update('promoCode', e.target.value)}
                    placeholder=""
                    className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-4 text-base font-medium text-dark outline-none"
                    aria-label="Promo code (optional)"
                  />
                </div>
              </div>

              <div className="input-glow relative rounded-2xl border border-gray-200 bg-white transition-colors focus-within:border-primary/40">
                <label
                  htmlFor="driver-age"
                  className="pointer-events-none absolute -top-2.5 left-4 bg-white px-1.5 text-xs font-semibold text-primary"
                >
                  Driver Age
                </label>
                <div className="flex items-center">
                  <span className="pointer-events-none absolute left-4 text-primary/70">
                    <UserRound className="h-5 w-5" />
                  </span>
                  <select
                    id="driver-age"
                    value={form.driverAge}
                    onChange={(e) => update('driverAge', e.target.value)}
                    className="w-full cursor-pointer appearance-none rounded-2xl bg-transparent py-4 pl-12 pr-10 text-base font-medium text-dark outline-none"
                    aria-label="Driver age"
                  >
                    {DRIVER_AGES.map((age) => (
                      <option key={age} value={age}>
                        {age}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 text-muted">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            <SearchButton isLoading={isLoading} />
          </form>
        </div>
      </div>
    </motion.section>
  )
}
