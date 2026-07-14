import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { CarDetailData } from '../../types/carDetails'

interface DescriptionProps {
  description: CarDetailData['description']
  carName: string
}

export function Description({ description, carName }: DescriptionProps) {
  const [expanded, setExpanded] = useState(false)

  const sections = [
    { title: 'Comfort', text: description.comfort },
    { title: 'Performance', text: description.performance },
    { title: 'Safety', text: description.safety },
    { title: 'Luxury', text: description.luxury },
  ]

  return (
    <section aria-labelledby="about-heading">
      <h2 id="about-heading" className="mb-4 text-xl font-bold text-dark">
        About {carName}
      </h2>
      <p className="text-base leading-relaxed text-muted">{description.intro}</p>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 space-y-5 overflow-hidden"
          >
            {sections.map((s) => (
              <div key={s.title}>
                <h3 className="mb-2 font-bold text-dark">{s.title}</h3>
                <p className="leading-relaxed text-muted">{s.text}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
      >
        {expanded ? 'Read Less' : 'Read More'}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
    </section>
  )
}

interface KeySpecsProps {
  specs: { label: string; value: string }[]
}

export function KeySpecs({ specs }: KeySpecsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
      {specs.map((spec) => (
        <div
          key={spec.label}
          className="rounded-[20px] border border-gray-100 bg-white p-4 text-center shadow-soft"
        >
          <p className="text-xs font-medium text-muted">{spec.label}</p>
          <p className="mt-1 text-sm font-bold text-dark">{spec.value}</p>
        </div>
      ))}
    </div>
  )
}
