import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, Heart, LayoutDashboard, LogOut, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

type AuthMenuVariant = 'default' | 'search' | 'luxury'

interface AuthMenuProps {
  variant?: AuthMenuVariant
  menuAlign?: 'left' | 'right'
  onNavigate?: () => void
}

export function AuthMenu({
  variant = 'default',
  menuAlign = 'right',
  onNavigate,
}: AuthMenuProps) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    logout()
    setOpen(false)
    onNavigate?.()
    navigate('/')
  }

  const close = () => {
    setOpen(false)
    onNavigate?.()
  }

  if (!isAuthenticated) {
    if (variant === 'luxury') {
      return (
        <Link
          to="/login"
          onClick={onNavigate}
          aria-label="Login"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-white/80 transition-all hover:border-luxury-accent/40 hover:text-luxury-accent"
        >
          <User className="h-4 w-4" />
        </Link>
      )
    }

    if (variant === 'search') {
      return (
        <Link
          to="/login"
          onClick={onNavigate}
          className="hidden rounded-2xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10 sm:block"
        >
          Login
        </Link>
      )
    }

    return (
      <div className="hidden items-center gap-2 sm:flex">
        <Link
          to="/login"
          onClick={onNavigate}
          className="rounded-2xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-dark transition-all hover:border-primary/30 hover:shadow-md"
        >
          Login
        </Link>
        <Link
          to="/register"
          onClick={onNavigate}
          className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-lg"
        >
          Register
        </Link>
      </div>
    )
  }

  const initials = user?.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const triggerClass =
    variant === 'luxury'
      ? 'flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-white/80 transition-all hover:border-luxury-accent/40 hover:text-luxury-accent'
      : variant === 'search'
        ? 'flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 text-white transition-all hover:bg-white/10'
        : 'flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-dark transition-all hover:border-primary/30'

  const dropdownClass =
    variant === 'luxury'
      ? 'glass-luxury border border-white/10'
      : 'border border-gray-100 bg-white shadow-xl'

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        className={triggerClass}
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt=""
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span
            className={`text-xs font-bold ${
              variant === 'default' ? 'text-primary' : 'text-white'
            }`}
          >
            {initials}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 mt-2 w-56 overflow-hidden rounded-2xl ${dropdownClass} ${
              menuAlign === 'left' ? 'left-0' : 'right-0'
            }`}
          >
            <div
              className={`border-b px-4 py-3 ${
                variant === 'luxury' ? 'border-white/10' : 'border-gray-100'
              }`}
            >
              <p
                className={`truncate text-sm font-semibold ${
                  variant === 'luxury' ? 'text-white' : 'text-dark'
                }`}
              >
                {user?.fullName}
              </p>
              <p
                className={`truncate text-xs ${
                  variant === 'luxury' ? 'text-white/60' : 'text-muted'
                }`}
              >
                {user?.email}
              </p>
            </div>

            <div className="p-1.5">
              {isAdmin && (
                <MenuLink
                  to="/admin"
                  icon={LayoutDashboard}
                  label="Admin Panel"
                  variant={variant}
                  onClick={close}
                />
              )}
              <MenuLink
                to="/favorites"
                icon={Heart}
                label="My Favorites"
                variant={variant}
                onClick={close}
              />
              <MenuLink
                to="/bookings"
                icon={Calendar}
                label="My Bookings"
                variant={variant}
                onClick={close}
              />
              <MenuLink
                to="/profile"
                icon={User}
                label="Profile"
                variant={variant}
                onClick={close}
              />
              <button
                type="button"
                onClick={handleLogout}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  variant === 'luxury'
                    ? 'text-white/80 hover:bg-white/10 hover:text-luxury-accent'
                    : 'text-dark/80 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MenuLink({
  to,
  icon: Icon,
  label,
  variant,
  onClick,
}: {
  to: string
  icon: typeof User
  label: string
  variant: AuthMenuVariant
  onClick: () => void
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        variant === 'luxury'
          ? 'text-white/80 hover:bg-white/10 hover:text-luxury-accent'
          : 'text-dark/80 hover:bg-primary/5 hover:text-primary'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  )
}

export function AuthMenuMobile({
  onNavigate,
  variant = 'default',
}: {
  onNavigate?: () => void
  variant?: 'default' | 'luxury'
}) {
  const { isAuthenticated, user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const linkClass =
    variant === 'luxury'
      ? 'block rounded-xl px-4 py-3 font-outfit text-white/90 hover:bg-white/10'
      : 'block rounded-xl px-4 py-3 text-base font-medium text-dark/80 hover:bg-primary/5 hover:text-primary'

  const btnClass =
    variant === 'luxury'
      ? 'w-full rounded-2xl border border-white/20 py-3.5 font-outfit text-sm font-semibold text-white'
      : 'w-full rounded-2xl border border-gray-200 py-3.5 text-sm font-semibold text-dark'

  const primaryBtnClass =
    variant === 'luxury'
      ? 'w-full rounded-2xl bg-luxury-accent py-3.5 font-outfit text-sm font-semibold text-white'
      : 'w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/25'

  if (isAuthenticated) {
    return (
      <div className="space-y-2">
        <p
          className={`px-4 text-sm font-semibold ${
            variant === 'luxury' ? 'text-white/70' : 'text-muted'
          }`}
        >
          Signed in as {user?.fullName}
        </p>
        {isAdmin && (
          <Link to="/admin" onClick={onNavigate} className={linkClass}>
            Admin Panel
          </Link>
        )}
        <Link to="/favorites" onClick={onNavigate} className={linkClass}>
          My Favorites
        </Link>
        <Link to="/bookings" onClick={onNavigate} className={linkClass}>
          My Bookings
        </Link>
        <Link to="/profile" onClick={onNavigate} className={linkClass}>
          Profile
        </Link>
        <button
          type="button"
          onClick={() => {
            logout()
            onNavigate?.()
            navigate('/')
          }}
          className={btnClass}
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Link to="/login" onClick={onNavigate} className={`block text-center ${btnClass}`}>
        Login
      </Link>
      <Link
        to="/register"
        onClick={onNavigate}
        className={`block text-center ${primaryBtnClass}`}
      >
        Register
      </Link>
    </div>
  )
}
