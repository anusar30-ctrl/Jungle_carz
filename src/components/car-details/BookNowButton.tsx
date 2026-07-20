import { useState, type MouseEvent, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { TripInfo } from '../../types/carDetails'
import { useRequireAuth } from '../../hooks/useRequireAuth'
import {
  DropLocationPolicyModal,
  type DropLocationSelection,
} from './DropLocationPolicyModal'

type BookNowButtonProps = {
  href: string
  trip: TripInfo
  city: string
  pickupLocationLabel?: string
  pickupCoords?: { latitude: number; longitude: number } | null
  className: string
  children: ReactNode
}

export function BookNowButton({
  href,
  trip,
  city,
  pickupLocationLabel,
  pickupCoords,
  className,
  children,
}: BookNowButtonProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>(
    [],
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

  const buildBookingUrl = (selection: DropLocationSelection) => {
    const url = new URL(href, window.location.origin)
    url.searchParams.set('dropMode', selection.mode)

    if (selection.mode === 'different' && selection.dropLocation) {
      url.searchParams.set('dropCity', selection.dropLocation.name)
      url.searchParams.set('dropLocation', selection.dropLocation.address)
      url.searchParams.set('dropLat', String(selection.dropLocation.latitude))
      url.searchParams.set('dropLng', String(selection.dropLocation.longitude))
    } else {
      url.searchParams.delete('dropLocation')
      url.searchParams.delete('dropLat')
      url.searchParams.delete('dropLng')
    }

    return `${url.pathname}${url.search}`
  }

  const handleContinue = (selection: DropLocationSelection) => {
    setModalOpen(false)
    const target = buildBookingUrl(selection)
    if (requireAuth(target)) {
      navigate(target)
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
        city={city}
        pickupLocationLabel={pickupLocationLabel}
        pickupCoords={pickupCoords}
        onClose={() => setModalOpen(false)}
        onContinue={handleContinue}
      />
    </>
  )
}
