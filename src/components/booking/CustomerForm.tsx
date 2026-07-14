import { useEffect, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Mail, Phone, User } from 'lucide-react'
import type { BookingFormErrors, CustomerDetails } from '../../types/booking'
import {
  validateEmail,
  validateFullName,
  validateMobile,
} from '../../utils/bookingStorage'

interface CustomerFormProps {
  onSubmit: (details: CustomerDetails) => void
  isSubmitting?: boolean
  initialValues?: CustomerDetails
}

const empty: CustomerDetails = { fullName: '', email: '', mobile: '' }

export function CustomerForm({
  onSubmit,
  isSubmitting = false,
  initialValues,
}: CustomerFormProps) {
  const [form, setForm] = useState<CustomerDetails>(initialValues ?? empty)
  const [errors, setErrors] = useState<BookingFormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (initialValues) setForm(initialValues)
  }, [initialValues])

  const validate = (data: CustomerDetails): BookingFormErrors => ({
    fullName: validateFullName(data.fullName),
    email: validateEmail(data.email),
    mobile: validateMobile(data.mobile),
  })

  const update = (key: keyof CustomerDetails, value: string) => {
    const next = { ...form, [key]: value }
    setForm(next)
    if (touched[key]) {
      setErrors((e) => ({ ...e, [key]: validate(next)[key] }))
    }
  }

  const handleBlur = (key: keyof CustomerDetails) => {
    setTouched((t) => ({ ...t, [key]: true }))
    setErrors((e) => ({ ...e, [key]: validate(form)[key] }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const validation = validate(form)
    setErrors(validation)
    setTouched({ fullName: true, email: true, mobile: true })
    if (Object.values(validation).some(Boolean)) return
    onSubmit(form)
  }

  return (
    <div className="glass rounded-[24px] border border-white/60 p-6 shadow-card sm:p-8">
      <h2 className="mb-6 text-xl font-bold text-dark">Customer Details</h2>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <FormField
          id="full-name"
          label="Full Name"
          required
          icon={User}
          type="text"
          value={form.fullName}
          error={touched.fullName ? errors.fullName : undefined}
          onChange={(v) => update('fullName', v)}
          onBlur={() => handleBlur('fullName')}
          placeholder="Enter your full name"
          autoComplete="name"
        />
        <FormField
          id="email"
          label="Email Address"
          required
          icon={Mail}
          type="email"
          value={form.email}
          error={touched.email ? errors.email : undefined}
          onChange={(v) => update('email', v)}
          onBlur={() => handleBlur('email')}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <FormField
          id="mobile"
          label="Mobile Number"
          required
          icon={Phone}
          type="tel"
          value={form.mobile}
          error={touched.mobile ? errors.mobile : undefined}
          onChange={(v) => update('mobile', v)}
          onBlur={() => handleBlur('mobile')}
          placeholder="98765 43210"
          autoComplete="tel"
        />

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-shadow hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-80"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            'Confirm Booking Request'
          )}
        </motion.button>
      </form>
    </div>
  )
}

function FormField({
  id,
  label,
  required,
  icon: Icon,
  type,
  value,
  error,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
}: {
  id: string
  label: string
  required?: boolean
  icon: typeof User
  type: string
  value: string
  error?: string
  onChange: (v: string) => void
  onBlur: () => void
  placeholder: string
  autoComplete?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-dark">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      <div
        className={`input-glow flex items-center rounded-2xl border bg-white transition-colors ${
          error
            ? 'border-red-300 focus-within:border-red-400'
            : 'border-gray-200 focus-within:border-primary/40'
        }`}
      >
        <span className="pl-4 text-primary/70">
          <Icon className="h-5 w-5" />
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-full rounded-2xl bg-transparent py-4 pr-4 pl-3 text-base font-medium text-dark outline-none placeholder:text-muted/60"
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
