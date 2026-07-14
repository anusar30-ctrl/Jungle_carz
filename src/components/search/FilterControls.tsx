import type { ReactNode } from 'react'

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

export function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
}: PriceRangeSliderProps) {
  const [low, high] = value

  const handleMin = (v: number) => {
    onChange([Math.min(v, high - 500), high])
  }

  const handleMax = (v: number) => {
    onChange([low, Math.max(v, low + 500)])
  }

  const lowPercent = ((low - min) / (max - min)) * 100
  const highPercent = ((high - min) / (max - min)) * 100

  return (
    <div className="px-1">
      <div className="mb-3 flex items-center justify-between text-sm font-semibold">
        <span className="text-primary">₹{low.toLocaleString('en-IN')}</span>
        <span className="text-primary">₹{high.toLocaleString('en-IN')}</span>
      </div>
      <div className="relative h-2 rounded-full bg-gray-100">
        <div
          className="absolute h-full rounded-full bg-primary/30"
          style={{ left: `${lowPercent}%`, right: `${100 - highPercent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={500}
          value={low}
          onChange={(e) => handleMin(Number(e.target.value))}
          aria-label="Minimum price"
          className="range-thumb absolute inset-0 z-10 w-full cursor-pointer appearance-none bg-transparent"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={500}
          value={high}
          onChange={(e) => handleMax(Number(e.target.value))}
          aria-label="Maximum price"
          className="range-thumb absolute inset-0 z-20 w-full cursor-pointer appearance-none bg-transparent"
        />
      </div>
    </div>
  )
}

interface ToggleFilterProps {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ToggleFilter({
  id,
  label,
  checked,
  onChange,
}: ToggleFilterProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center justify-between gap-3 rounded-xl py-2 transition-colors hover:bg-gray-50"
    >
      <span className="text-sm font-medium text-dark">{label}</span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-gray-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  )
}

interface CheckboxGroupProps<T extends string | number> {
  options: readonly { value: T; label: string }[] | readonly T[]
  selected: T[]
  onChange: (selected: T[]) => void
  columns?: 1 | 2
}

export function CheckboxGroup<T extends string | number>({
  options,
  selected,
  onChange,
  columns = 2,
}: CheckboxGroupProps<T>) {
  const normalized = options.map((opt) =>
    typeof opt === 'object' && opt !== null && 'value' in opt
      ? (opt as { value: T; label: string })
      : { value: opt as T, label: String(opt) },
  )

  const toggle = (val: T) => {
    onChange(
      selected.includes(val)
        ? selected.filter((s) => s !== val)
        : [...selected, val],
    )
  }

  return (
    <div
      className={`grid gap-2 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}
    >
      {normalized.map(({ value, label }) => (
        <label
          key={String(value)}
          className="flex cursor-pointer items-center gap-2 rounded-lg py-1.5 text-sm transition-colors hover:text-primary"
        >
          <input
            type="checkbox"
            checked={selected.includes(value)}
            onChange={() => toggle(value)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/30"
          />
          <span className="font-medium text-dark/80">{label}</span>
        </label>
      ))}
    </div>
  )
}

interface FilterSectionProps {
  title: string
  defaultOpen?: boolean
  children: ReactNode
}

export function FilterSection({
  title,
  defaultOpen = true,
  children,
}: FilterSectionProps) {
  return (
    <details open={defaultOpen} className="group border-b border-gray-100 py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-dark [&::-webkit-details-marker]:hidden">
        {title}
        <span className="text-muted transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  )
}
