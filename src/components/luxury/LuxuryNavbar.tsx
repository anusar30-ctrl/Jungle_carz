import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Mountain, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LUXURY_NAV } from '../../constants/luxury'
import { AuthMenu, AuthMenuMobile } from '../auth/AuthMenu'

interface LuxuryNavbarProps {
  visible?: boolean
}

export function LuxuryNavbar({ visible = true }: LuxuryNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -20 }}
        transition={{ duration: 0.6, delay: visible ? 0.2 : 0 }}
        className={`absolute inset-x-0 top-0 z-50 px-6 transition-all duration-500 md:px-10 lg:px-14 ${
          scrolled ? 'bg-black/20 py-3 backdrop-blur-md' : 'py-6'
        }`}
      >
        <nav
          aria-label="Main navigation"
          className="flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="group flex items-center gap-3"
              aria-label="Jungle Carz Home"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-colors group-hover:border-luxury-accent/50">
                <Mountain className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <div className="hidden sm:block">
                <span className="font-outfit text-[10px] font-semibold tracking-[0.25em] text-white/70">
                  JUNGLE
                </span>
                <p className="font-outfit text-lg font-bold tracking-wide text-white">
                  CARZ
                </p>
              </div>
            </Link>
            <AuthMenu variant="luxury" menuAlign="left" />
          </div>

          <ul className="hidden items-center gap-1 xl:flex">
            {LUXURY_NAV.map((link) => {
              const isRoute = link.href.startsWith('/')
              const className =
                'rounded-lg px-3 py-2 font-outfit text-sm font-medium text-white/80 transition-colors hover:text-luxury-accent'
              return (
                <li key={link.label}>
                  {isRoute ? (
                    <Link to={link.href} className={className}>
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className={className}>
                      {link.label}
                    </a>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-white xl:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm xl:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-[70] w-full max-w-sm glass-luxury xl:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile menu"
            >
              <div className="flex items-center justify-between border-b border-white/10 p-5">
                <span className="font-outfit font-bold text-white">Menu</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="text-white/70"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <ul className="p-5">
                {LUXURY_NAV.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="block py-3 font-outfit text-white/90 hover:text-luxury-accent"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="block py-3 font-outfit text-white/90 hover:text-luxury-accent"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
              <div className="border-t border-white/10 p-5">
                <AuthMenuMobile
                  variant="luxury"
                  onNavigate={() => setMobileOpen(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
