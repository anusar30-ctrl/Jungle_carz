import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Mail, Phone, Shield, User } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { validateFullName, validateMobile } from '../utils/bookingStorage'

export function Profile() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({
    fullName: user?.fullName ?? '',
    mobile: user?.mobile ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    const nameErr = validateFullName(form.fullName)
    const mobileErr = form.mobile ? validateMobile(form.mobile) : undefined

    if (nameErr || mobileErr) {
      setError(nameErr || mobileErr || 'Please fix the errors')
      return
    }

    setSaving(true)
    try {
      await updateProfile(form)
      setMessage('Profile updated successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="search" />

      <main className="mx-auto max-w-2xl px-4 pt-28 pb-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-dark">My Profile</h1>
          <p className="mt-2 text-muted">Manage your account details</p>
        </motion.div>

        <div className="glass rounded-[24px] border border-white/60 p-6 shadow-card sm:p-8">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
              {user.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-semibold text-dark">{user.fullName}</p>
              <p className="text-sm text-muted">{user.email}</p>
              <span className="mt-1 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold capitalize text-primary">
                {user.provider} account
              </span>
            </div>
          </div>

          {message && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <ProfileField
              id="fullName"
              label="Full Name"
              icon={User}
              value={form.fullName}
              onChange={(v) => setForm((f) => ({ ...f, fullName: v }))}
            />
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-dark">
                <Mail className="h-4 w-4 text-primary" />
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-muted"
              />
              <p className="mt-1 text-xs text-muted">Email cannot be changed</p>
            </div>
            <ProfileField
              id="mobile"
              label="Mobile Number"
              icon={Phone}
              value={form.mobile}
              onChange={(v) => setForm((f) => ({ ...f, mobile: v }))}
              placeholder="98765 43210"
            />

            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: saving ? 1 : 1.01 }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-white shadow-lg shadow-primary/30 disabled:opacity-80"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save changes'
              )}
            </motion.button>
          </form>
        </div>

        <div className="mt-6 glass rounded-[24px] border border-white/60 p-6 shadow-card">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold text-dark">Account security</p>
              <p className="text-sm text-muted">
                Password reset available from the login page.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function ProfileField({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
}: {
  id: string
  label: string
  icon: typeof User
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-center gap-2 text-sm font-semibold text-dark">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-glow w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-dark outline-none focus:border-primary/40"
      />
    </div>
  )
}
