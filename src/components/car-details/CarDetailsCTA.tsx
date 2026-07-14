import { motion } from 'framer-motion'
import { MessageCircle, Phone } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { PHONE_NUMBER, WHATSAPP_NUMBER } from '../../constants/data'

export function CarDetailsCTA() {
  const items = [
    {
      icon: Phone,
      title: 'Call Us',
      subtitle: PHONE_NUMBER,
      href: `tel:${PHONE_NUMBER.replace(/\s/g, '')}`,
      primary: false,
    },
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      subtitle: 'Chat with us',
      href: `https://wa.me/${WHATSAPP_NUMBER}`,
      primary: true,
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      subtitle: 'Online now',
      href: '#',
      primary: false,
    },
  ]

  return (
    <section className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-card sm:p-8">
      <div className="mb-6 text-center sm:text-left">
        <h3 className="text-xl font-bold text-dark">Need Help Booking?</h3>
        <p className="mt-1 text-muted">
          Our team is available 24/7 to assist you.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((item, i) => {
          const Icon = item.icon
          return (
            <motion.a
              key={item.title}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className={`flex flex-col items-center gap-2 rounded-[20px] p-5 text-center transition-all ${
                item.primary
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'border border-gray-100 bg-gray-50 hover:border-primary/20'
              }`}
            >
              <Icon className={`h-6 w-6 ${item.primary ? 'text-white' : 'text-primary'}`} />
              <span className="font-bold">{item.title}</span>
              <span className={`text-xs ${item.primary ? 'text-white/80' : 'text-muted'}`}>
                {item.subtitle}
              </span>
            </motion.a>
          )
        })}
      </div>
    </section>
  )
}
