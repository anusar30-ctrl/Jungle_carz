import { useEffect, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Car, MapPin, Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import type { RentalType } from '../../types'
import { DEFAULT_SEARCH } from '../../constants/filters'
import { LUXURY_LOCATIONS } from '../../constants/luxury'
import {
  minDropDatetime,
  splitDatetimeLocal,
  toDatetimeLocal,
} from '../../utils/datetime'

function paramsToForm(params: URLSearchParams) {
  const pickupDate = params.get('pickup') || DEFAULT_SEARCH.pickupDate
  const pickupTime = params.get('pickupTime') || DEFAULT_SEARCH.pickupTime
  const dropDate = params.get('drop') || DEFAULT_SEARCH.dropDate
  const dropTime = params.get('dropTime') || DEFAULT_SEARCH.dropTime

  return {
    pickupCity: params.get('city') || DEFAULT_SEARCH.pickupCity,
    dropCity:
      params.get('dropCity') ||
      params.get('city') ||
      DEFAULT_SEARCH.dropCity,
    pickupDatetime: toDatetimeLocal(pickupDate, pickupTime),
    dropDatetime: toDatetimeLocal(dropDate, dropTime),
    rentalType:
      (params.get('type') as RentalType) || DEFAULT_SEARCH.rentalType,
  }
}

export function SearchSummary() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [form, setForm] = useState(() => paramsToForm(searchParams))
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    setForm(paramsToForm(searchParams))
  }, [searchParams])

  const todayMin = `${new Date().toISOString().split('T')[0]}T00:00`

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setUpdating(true)

    const pickup = splitDatetimeLocal(form.pickupDatetime)
    const drop = splitDatetimeLocal(form.dropDatetime)

    const next = new URLSearchParams(searchParams)
    next.set('city', form.pickupCity)
    next.set('dropCity', form.dropCity)
    next.set('pickup', pickup.date)
    next.set('pickupTime', pickup.time)
    next.set('drop', drop.date)
    next.set('dropTime', drop.time)
    next.set('type', form.rentalType)

    setTimeout(() => {
      setSearchParams(next)
      setUpdating(false)
    }, 400)
  }

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'pickupDatetime' && prev.dropDatetime < value) {
        next.dropDatetime = value
      }
      return next
    })
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass mx-auto max-w-7xl rounded-[24px] border border-white/60 px-4 py-4 shadow-card sm:px-6 sm:py-5"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <EditField icon={MapPin} label="Pickup Location">
            <select
              value={form.pickupCity}
              onChange={(e) => update('pickupCity', e.target.value)}
              className="search-edit-input"
              aria-label="Pickup location"
            >
              {LUXURY_LOCATIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </EditField>

          <EditField icon={MapPin} label="Drop Location">
            <select
              value={form.dropCity}
              onChange={(e) => update('dropCity', e.target.value)}
              className="search-edit-input"
              aria-label="Drop location"
            >
              {LUXURY_LOCATIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </EditField>

          <EditField icon={Calendar} label="Pickup Date & Time">
            <input
              type="datetime-local"
              value={form.pickupDatetime}
              min={todayMin}
              onChange={(e) => update('pickupDatetime', e.target.value)}
              required
              className="search-edit-input [color-scheme:light]"
              aria-label="Pickup date and time"
            />
          </EditField>

          <EditField icon={Calendar} label="Drop Date & Time">
            <input
              type="datetime-local"
              value={form.dropDatetime}
              min={minDropDatetime(form.pickupDatetime) || todayMin}
              onChange={(e) => update('dropDatetime', e.target.value)}
              required
              className="search-edit-input [color-scheme:light]"
              aria-label="Drop date and time"
            />
          </EditField>

          <EditField icon={Car} label="Rental Type">
            <select
              value={form.rentalType}
              onChange={(e) => update('rentalType', e.target.value as RentalType)}
              className="search-edit-input"
              aria-label="Rental type"
            >
              <option value="self-drive">Self Drive</option>
              <option value="with-driver">With Driver</option>
            </select>
          </EditField>
        </div>

        <button
          type="submit"
          disabled={updating}
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-lg disabled:opacity-70 lg:w-auto"
        >
          <Search className="h-4 w-4" />
          {updating ? 'Updating...' : 'Update Search'}
        </button>
      </div>
    </motion.form>
  )
}

function EditField({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </label>
      <div className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 transition-colors focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
        {children}
      </div>
    </div>
  )
}
