import { Mountain, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { LUXURY_NAV } from '../../constants/luxury'
import { PHONE_NUMBER, WHATSAPP_NUMBER } from '../../constants/data'

export function LuxuryFooter() {
  return (
    <footer
      id="contact"
      className="bg-luxury-primary px-8 py-14 text-white md:px-14"
    >
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
              <Mountain className="h-5 w-5" />
            </div>
            <div>
              <p className="font-outfit text-[10px] tracking-[0.25em] text-white/60">
                JUNGLE
              </p>
              <p className="font-outfit text-xl font-bold">CARZ</p>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/60">
            India&apos;s premium car rental experience — where luxury meets
            adventure on every road.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-outfit text-sm font-semibold tracking-wide uppercase">
            Explore
          </h4>
          <ul className="space-y-2">
            {LUXURY_NAV.slice(0, 5).map((link) => (
              <li key={link.label}>
                {link.href.startsWith('/') ? (
                  <Link
                    to={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-luxury-accent"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-luxury-accent"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-outfit text-sm font-semibold tracking-wide uppercase">
            Contact
          </h4>
          <p className="mb-3 text-sm text-white/60">{PHONE_NUMBER}</p>
          <div className="flex gap-3">
            <a
              href={`tel:${PHONE_NUMBER.replace(/\s/g, '')}`}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 transition-colors hover:border-luxury-accent hover:text-luxury-accent"
              aria-label="Call us"
            >
              <Phone className="h-4 w-4" />
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 transition-colors hover:border-luxury-accent hover:text-luxury-accent"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Jungle Carz. Crafted for the road ahead.
      </div>
    </footer>
  )
}
