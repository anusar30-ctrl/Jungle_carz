import { motion } from 'framer-motion'
import { MapPin, Phone } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { PHONE_NUMBER, WHATSAPP_NUMBER } from '../../constants/data'

export function BottomCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-card sm:p-8"
    >
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-dark">Still confused?</h3>
          <p className="mt-1 text-muted">
            Need help choosing a car? Our experts are here 24/7.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a
            href={`tel:${PHONE_NUMBER.replace(/\s/g, '')}`}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-6 py-3 text-sm font-semibold text-dark transition-all hover:border-primary/30 hover:shadow-md"
          >
            <Phone className="h-4 w-4 text-primary" />
            Call Jungle Carz
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark"
          >
            <FaWhatsapp className="h-5 w-5" />
            WhatsApp Support
          </a>
        </div>
      </div>
    </motion.section>
  )
}

interface MapViewPlaceholderProps {
  visible: boolean
  city: string
}

export function MapViewPlaceholder({ visible, city }: MapViewPlaceholderProps) {
  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-6 overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-card"
    >
      <div className="relative flex h-64 items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/10 sm:h-80">
        <div className="absolute inset-0 opacity-30">
          <div className="grid h-full w-full grid-cols-6 grid-rows-4 gap-px bg-gray-200">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="bg-gray-100" />
            ))}
          </div>
        </div>
        <div className="relative text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30">
            <MapPin className="h-6 w-6" />
          </div>
          <p className="font-bold text-dark">Cars Near {city}</p>
          <p className="text-sm text-muted">Map view — Google Maps integration</p>
        </div>
      </div>
    </motion.div>
  )
}
