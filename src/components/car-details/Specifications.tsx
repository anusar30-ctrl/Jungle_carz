import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { SpecGroup } from '../../types/carDetails'

interface SpecificationsProps {
  groups: SpecGroup[]
}

export function Specifications({ groups }: SpecificationsProps) {
  const [open, setOpen] = useState<string>(groups[0]?.id ?? '')

  return (
    <section aria-labelledby="specs-heading">
      <h2 id="specs-heading" className="mb-4 text-xl font-bold text-dark">
        Specifications
      </h2>
      <div className="space-y-2">
        {groups.map((group) => {
          const isOpen = open === group.id
          return (
            <div
              key={group.id}
              className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-soft"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? '' : group.id)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-dark">{group.title}</span>
                <ChevronDown
                  className={`h-5 w-5 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 border-t border-gray-100 px-5 py-4">
                      {group.specs.map((spec) => (
                        <div
                          key={spec.label}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-muted">{spec.label}</span>
                          <span className="font-semibold text-dark">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
