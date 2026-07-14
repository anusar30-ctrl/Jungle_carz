import { useState, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Search } from 'lucide-react'

interface SearchButtonProps {
  isLoading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
}

export function SearchButton({
  isLoading = false,
  onClick,
  type = 'submit',
}: SearchButtonProps) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    setRipples((prev) => [...prev, { id, x, y }])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 600)
    onClick?.()
  }

  return (
    <motion.button
      type={type}
      disabled={isLoading}
      onClick={handleClick}
      whileHover={{ scale: isLoading ? 1 : 1.01 }}
      whileTap={{ scale: isLoading ? 1 : 0.99 }}
      className="group relative w-full overflow-hidden rounded-2xl bg-primary py-4 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-shadow hover:shadow-xl hover:shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-80"
      aria-label="Search available cars"
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <Search className="h-5 w-5 transition-transform group-hover:scale-110" />
            Search Available Cars
          </>
        )}
      </span>

      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none absolute h-8 w-8 rounded-full bg-white/30"
          style={{ left: ripple.x - 16, top: ripple.y - 16 }}
        />
      ))}
    </motion.button>
  )
}
