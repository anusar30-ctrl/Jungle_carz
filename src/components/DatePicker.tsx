import { Calendar } from 'lucide-react'

interface DatePickerProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  min?: string
  required?: boolean
}

export function DatePicker({
  id,
  label,
  value,
  onChange,
  min,
  required = true,
}: DatePickerProps) {
  const today = new Date().toISOString().split('T')[0]

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
          <Calendar className="h-5 w-5" />
        </span>
        <input
          type="date"
          id={id}
          value={value}
          min={min ?? today}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-4 text-base font-medium text-dark outline-none [color-scheme:light]"
          aria-label={label}
        />
      </div>
    </div>
  )
}
