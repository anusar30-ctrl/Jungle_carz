import { motion } from 'framer-motion'
import {
  Bluetooth,
  Camera,
  Fuel,
  Gauge,
  MapPin,
  Monitor,
  Settings2,
  Shield,
  Smartphone,
  Sun,
  Tag,
  Usb,
  Users,
} from 'lucide-react'
import type { CarFeature } from '../../types/carDetails'

const iconMap: Record<string, typeof Fuel> = {
  settings: Settings2,
  fuel: Fuel,
  users: Users,
  gauge: Gauge,
  sun: Sun,
  bluetooth: Bluetooth,
  smartphone: Smartphone,
  monitor: Monitor,
  usb: Usb,
  tag: Tag,
  camera: Camera,
  shield: Shield,
  airbag: Shield,
  map: MapPin,
}

interface FeatureGridProps {
  features: CarFeature[]
}

export function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <section aria-labelledby="features-heading">
      <h2 id="features-heading" className="mb-6 text-xl font-bold text-dark">
        Features
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {features.map((feature, i) => {
          const Icon = iconMap[feature.icon] ?? Settings2
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -4 }}
              className="flex flex-col items-center gap-2 rounded-[20px] border border-gray-100 bg-white p-4 text-center shadow-soft transition-shadow hover:shadow-card"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-dark sm:text-sm">
                {feature.label}
              </span>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
