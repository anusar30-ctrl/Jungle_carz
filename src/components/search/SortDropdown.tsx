import { ChevronDown } from 'lucide-react'
import type { SortOption } from '../../types/search'
import { SORT_OPTIONS } from '../../constants/filters'

interface SortDropdownProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const current = SORT_OPTIONS.find((o) => o.value === value)

  return (
    <div className="relative">
      <label htmlFor="sort-cars" className="sr-only">
        Sort cars
      </label>
      <select
        id="sort-cars"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="cursor-pointer appearance-none rounded-2xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm font-semibold text-dark shadow-soft transition-all hover:border-primary/30 focus:border-primary/40"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
        <ChevronDown className="h-4 w-4" />
      </div>
      <span className="sr-only">Currently sorted by {current?.label}</span>
    </div>
  )
}
