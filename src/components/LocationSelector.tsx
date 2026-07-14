import { MapPin } from 'lucide-react'
import { CITIES } from '../constants/data'

interface LocationSelectorProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}

export function LocationSelector({
  id,
  label,
  value,
  onChange,
  required = true,
}: LocationSelectorProps) {
  return (
    <div className="input-glow group relative rounded-2xl border border-gray-200 bg-white transition-colors focus-within:border-primary/40">
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-12 transition-all duration-200 ${
          value
            ? '-top-2.5 left-4 bg-white px-1.5 text-xs font-semibold text-primary'
            : 'top-1/2 -translate-y-1/2 text-sm text-muted'
        }`}
      >
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      <div className="flex items-center">
        <span className="pointer-events-none absolute left-4 text-primary/70">
          <MapPin className="h-5 w-5" />
        </span>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full cursor-pointer appearance-none rounded-2xl bg-transparent py-4 pl-12 pr-10 text-base font-medium text-dark outline-none"
          aria-label={label}
        >
          <option value="" disabled>
            Select City
          </option>
          {CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
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
  )
}
