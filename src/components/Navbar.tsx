import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Phone, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { NAV_LINKS, PHONE_NUMBER, WHATSAPP_NUMBER } from '../constants/data'
import { Logo } from './Logo'
import { AuthMenu, AuthMenuMobile } from './auth/AuthMenu'

interface NavbarProps {
  variant?: 'default' | 'search'
}

export function Navbar({ variant = 'default' }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isSearch = variant === 'search'

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const navClass = isSearch
    ? isScrolled
      ? 'bg-dark/95 shadow-lg py-3 backdrop-blur-xl'
      : 'bg-dark py-4'
    : isScrolled
      ? 'glass shadow-soft py-3'
      : 'bg-white/80 py-4 backdrop-blur-md'

  const linkClass = (href: string) => {
    const active =
      (href === '#home' && location.pathname === '/') ||
      (href === '#cars' && location.pathname === '/search')
    return `relative rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
      isSearch
        ? active
          ? 'text-secondary'
          : 'text-white/70 hover:text-white'
        : active
          ? 'text-primary'
          : 'text-dark/70 hover:text-primary'
    }`
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        aria-label="Main navigation"
        className={`transition-all duration-300 ${navClass}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo light={isSearch} />

          <ul className="hidden items-center gap-1 xl:flex">
            {NAV_LINKS.map((link) => {
              const to = link.href.startsWith('#')
                ? link.href === '#home'
                  ? '/'
                  : link.href
                : link.href
              const isRoute = to.startsWith('/')
              const tourismActive =
                link.label === 'Tourism' &&
                new URLSearchParams(location.search).get('category') ===
                  'tourism'
              const selfDriveActive =
                link.label === 'Self Drive' &&
                location.pathname === '/search' &&
                new URLSearchParams(location.search).get('type') ===
                  'self-drive' &&
                new URLSearchParams(location.search).get('category') !==
                  'tourism'
              const withDriverActive =
                link.label === 'With Driver' &&
                location.pathname === '/search' &&
                new URLSearchParams(location.search).get('type') ===
                  'with-driver'
              const homeActive =
                link.label === 'Home' && location.pathname === '/'
              const active =
                tourismActive ||
                selfDriveActive ||
                withDriverActive ||
                homeActive

              return (
                <li key={link.label}>
                  {isRoute ? (
                    <Link
                      to={to}
                      className={
                        isSearch
                          ? active
                            ? 'relative rounded-xl px-3 py-2 text-sm font-medium text-secondary'
                            : 'relative rounded-xl px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white'
                          : active
                            ? 'relative rounded-xl px-3 py-2 text-sm font-medium text-primary'
                            : 'relative rounded-xl px-3 py-2 text-sm font-medium text-dark/70 transition-colors hover:text-primary'
                      }
                    >
                      {link.label}
                      {active && (
                        <motion.span
                          layoutId="nav-indicator"
                          className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full ${
                            isSearch ? 'bg-secondary' : 'bg-primary'
                          }`}
                        />
                      )}
                    </Link>
                  ) : (
                    <a href={to} className={linkClass(link.href)}>
                      {link.label}
                    </a>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            {isSearch ? (
              <>
                <a
                  href={`tel:${PHONE_NUMBER.replace(/\s/g, '')}`}
                  className="hidden items-center gap-2 text-sm font-semibold text-white/90 sm:flex"
                >
                  <Phone className="h-4 w-4" />
                  <span className="hidden lg:inline">{PHONE_NUMBER}</span>
                </a>
                <AuthMenu variant="search" />
              </>
            ) : (
              <>
                <AuthMenu variant="default" />
                <a
                  href={`tel:${PHONE_NUMBER.replace(/\s/g, '')}`}
                  aria-label="Call us"
                  className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-dark transition-all hover:border-primary/30 hover:text-primary md:flex"
                >
                  <Phone className="h-4 w-4" />
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp us"
                  className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark md:flex"
                >
                  <FaWhatsapp className="h-5 w-5" />
                </a>
              </>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-all xl:hidden ${
                isSearch
                  ? 'border-white/20 text-white hover:bg-white/10'
                  : 'border-gray-200 bg-white text-dark hover:border-primary/30'
              }`}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-dark/40 backdrop-blur-sm xl:hidden"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-2xl xl:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile menu"
            >
              <div className="flex items-center justify-between border-b border-gray-100 p-5">
                <Logo />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <ul className="flex-1 overflow-y-auto p-5">
                {NAV_LINKS.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-xl px-4 py-3.5 text-base font-medium text-dark/80 transition-colors hover:bg-primary/5 hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-xl px-4 py-3.5 text-base font-medium text-dark/80 transition-colors hover:bg-primary/5 hover:text-primary"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>

              <div className="space-y-3 border-t border-gray-100 p-5">
                <AuthMenuMobile onNavigate={() => setMobileOpen(false)} />
                <div className="flex gap-3">
                  <a
                    href={`tel:${PHONE_NUMBER.replace(/\s/g, '')}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3 text-sm font-semibold"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-white"
                  >
                    <FaWhatsapp className="h-4 w-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
