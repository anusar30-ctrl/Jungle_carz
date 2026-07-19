import { useState, type MouseEvent, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { TripInfo } from '../../types/carDetails'
import { useRequireAuth } from '../../hooks/useRequireAuth'
import { DropLocationPolicyModal } from './DropLocationPolicyModal'

type BookNowButtonProps = {
  href: string
  trip: TripInfo
  className: string
  children: ReactNode
}

export function BookNowButton({
  href,
  trip,
  className,
  children,
}: BookNowButtonProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>(
    []
  )
  const { requireAuth } = useRequireAuth()
  const navigate = useNavigate()

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id = Date.now()
    setRipples((p) => [
      ...p,
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ])
    setTimeout(() => setRipples((p) => p.filter((r) => r.id !== id)), 600)
    setModalOpen(true)
  }

  const handleContinue = () => {
    setModalOpen(false)
    if (requireAuth(href)) {
      navigate(href)
    }
  }

  return (
    <>
      <button type="button" onClick={handleClick} className={className}>
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            initial={{ scale: 0, opacity: 0.4 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none absolute h-8 w-8 rounded-full bg-white/30"
            style={{ left: r.x - 16, top: r.y - 16 }}
          />
        ))}
      </button>

      <DropLocationPolicyModal
        open={modalOpen}
        trip={trip}
        onClose={() => setModalOpen(false)}
        onContinue={handleContinue}
      />
    </>
  )
}
