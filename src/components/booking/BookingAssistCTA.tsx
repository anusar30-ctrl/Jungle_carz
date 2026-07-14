import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { PHONE_NUMBER, WHATSAPP_NUMBER } from '../../constants/data'

export function BookingAssistCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-12 rounded-[24px] border border-gray-100 bg-white p-6 text-center shadow-soft sm:p-8"
    >
      <p className="mb-4 text-muted">Need immediate assistance?</p>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
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
    </motion.section>
  )
}

export function SuccessAssistCTA() {
  return (
    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
      <a
        href={`tel:${PHONE_NUMBER.replace(/\s/g, '')}`}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-6 py-3.5 text-sm font-semibold text-dark transition-all hover:border-primary/30"
      >
        <Phone className="h-4 w-4 text-primary" />
        Call Us
      </a>
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/25"
      >
        <FaWhatsapp className="h-5 w-5" />
        WhatsApp Us
      </a>
    </div>
  )
}
