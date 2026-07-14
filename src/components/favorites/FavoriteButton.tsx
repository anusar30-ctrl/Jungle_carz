import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useFavorites } from '../../hooks/useFavorites'

interface FavoriteButtonProps {
  carId: string
  returnTo?: string
  className?: string
  size?: 'sm' | 'md'
}

export function FavoriteButton({
  carId,
  returnTo,
  className = '',
  size = 'md',
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorited = isFavorite(carId)

  const sizeClass =
    size === 'sm' ? 'h-9 w-9' : 'h-10 w-10'
  const iconClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'

  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(carId, returnTo)
      }}
      whileTap={{ scale: 0.85 }}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      className={`flex items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-colors hover:bg-white ${sizeClass} ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={favorited ? 'on' : 'off'}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        >
          <Heart
            className={`${iconClass} ${
              favorited ? 'fill-red-500 text-red-500' : 'text-dark/60'
            }`}
          />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
