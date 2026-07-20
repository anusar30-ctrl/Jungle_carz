import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, Lock, Mail, Phone, User } from 'lucide-react'
import { AuthLayout } from '../components/auth/AuthLayout'
import { SocialLoginButtons } from '../components/auth/SocialLoginButtons'
import { useAuth } from '../context/AuthContext'
import { validateEmail, validateFullName, validateMobile } from '../utils/bookingStorage'

export function Register() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/'

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to={returnTo} replace />
  }

  const update = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    const nameErr = validateFullName(form.fullName)
    const emailErr = validateEmail(form.email)
    const mobileErr = validateMobile(form.mobile)

    if (nameErr || emailErr || mobileErr) {
      setError(nameErr || emailErr || mobileErr || 'Please fix the errors')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
      })
      navigate(returnTo, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Jungle Carz to book premium rides"
      footer={
        <>
          Already have an account?{' '}
          <Link
            to={`/login${returnTo !== '/' ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`}
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <Field
          id="fullName"
          label="Full Name"
          icon={User}
          value={form.fullName}
          onChange={(v) => update('fullName', v)}
          placeholder="Your full name"
          autoComplete="name"
        />
        <Field
          id="email"
          label="Email"
          type="email"
          icon={Mail}
          value={form.email}
          onChange={(v) => update('email', v)}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <Field
          id="mobile"
          label="Mobile"
          type="tel"
          icon={Phone}
          value={form.mobile}
          onChange={(v) => update('mobile', v)}
          placeholder="98765 43210"
          autoComplete="tel"
        />

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-semibold text-dark">
            Password <span className="text-primary">*</span>
          </label>
          <div className="input-glow flex items-center rounded-2xl border border-gray-200 bg-white">
            <span className="pl-4 text-primary/70">
              <Lock className="h-5 w-5" />
            </span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              placeholder="Min. 6 characters"
              autoComplete="new-password"
              required
              className="w-full rounded-2xl bg-transparent py-4 pr-3 pl-3 text-base font-medium text-dark outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="pr-4 text-muted"
              aria-label="Toggle password"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <Field
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          icon={Lock}
          value={form.confirmPassword}
          onChange={(v) => update('confirmPassword', v)}
          placeholder="Re-enter password"
          autoComplete="new-password"
        />

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.99 }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-white shadow-lg shadow-primary/30 disabled:opacity-80"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </motion.button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white/70 px-3 text-muted">Or sign up with</span>
        </div>
      </div>

      <SocialLoginButtons
        onError={setError}
        onSuccess={() => navigate(returnTo, { replace: true })}
      />

      <p className="mt-6 text-center text-xs text-muted">
        By creating an account, you agree to our Terms of Service and Privacy Policy.
      </p>
    </AuthLayout>
  )
}

function Field({
  id,
  label,
  type = 'text',
  icon: Icon,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  id: string
  label: string
  type?: string
  icon: typeof User
  value: string
  onChange: (v: string) => void
  placeholder: string
  autoComplete?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-dark">
        {label} <span className="text-primary">*</span>
      </label>
      <div className="input-glow flex items-center rounded-2xl border border-gray-200 bg-white">
        <span className="pl-4 text-primary/70">
          <Icon className="h-5 w-5" />
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className="w-full rounded-2xl bg-transparent py-4 pr-4 pl-3 text-base font-medium text-dark outline-none placeholder:text-muted/60"
        />
      </div>
    </div>
  )
}
