import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Loader2, Mail } from 'lucide-react'
import { AuthLayout } from '../components/auth/AuthLayout'
import { requestPasswordReset } from '../utils/authStorage'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))

    const exists = requestPasswordReset(email)
    if (!exists) {
      setError('No account found with this email address')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="We'll send you a link to reset your password"
      footer={
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="text-center">
          <CheckCircle className="mx-auto h-14 w-14 text-secondary" />
          <p className="mt-4 font-semibold text-dark">Check your inbox</p>
          <p className="mt-2 text-sm text-muted">
            If an account exists for <strong>{email}</strong>, you&apos;ll receive reset
            instructions shortly.
          </p>
          <p className="mt-4 text-xs text-muted">
            (Password reset is not connected to the server yet — no email is sent.)
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-dark">
              Email address <span className="text-primary">*</span>
            </label>
            <div className="input-glow flex items-center rounded-2xl border border-gray-200 bg-white">
              <span className="pl-4 text-primary/70">
                <Mail className="h-5 w-5" />
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-2xl bg-transparent py-4 pr-4 pl-3 text-base font-medium text-dark outline-none"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-white shadow-lg shadow-primary/30 disabled:opacity-80"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : (
              'Send reset link'
            )}
          </motion.button>
        </form>
      )}
    </AuthLayout>
  )
}
