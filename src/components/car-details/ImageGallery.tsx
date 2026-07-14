import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  RotateCw,
  X,
} from 'lucide-react'
import { FavoriteButton } from '../favorites/FavoriteButton'

interface GalleryImage {
  url: string
  label: string
}

interface ImageGalleryProps {
  images: GalleryImage[]
  badges?: string[]
  carId: string
}

export function ImageGallery({ images, badges = [], carId }: ImageGalleryProps) {
  const [active, setActive] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length)
  const next = () => setActive((i) => (i + 1) % images.length)

  return (
    <>
      <div className="overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-card">
        <div className="group relative aspect-[16/10] overflow-hidden bg-gray-100 sm:aspect-[16/9]">
          <motion.img
            key={active}
            src={images[active].url}
            alt={images[active].label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full cursor-zoom-in object-cover transition-transform duration-500 group-hover:scale-105"
            onClick={() => setFullscreen(true)}
          />

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className={`rounded-lg px-3 py-1 text-xs font-bold text-white ${
                  badge.includes('Instant')
                    ? 'bg-accent'
                    : 'bg-primary'
                }`}
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="absolute top-4 right-4">
            <FavoriteButton carId={carId} size="md" className="h-11 w-11" />
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous image"
                className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-dark shadow-md transition-all hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next image"
                className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-dark shadow-md transition-all hover:bg-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <div className="absolute bottom-4 left-4 rounded-lg bg-dark/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
            {active + 1} / {images.length}
          </div>

          <button
            type="button"
            className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-xs font-semibold text-dark shadow-md backdrop-blur-sm transition-all hover:bg-white"
          >
            <RotateCw className="h-3.5 w-3.5 text-primary" />
            360° View
          </button>

          <button
            type="button"
            onClick={() => setFullscreen(true)}
            aria-label="Fullscreen preview"
            className="absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-dark shadow-md backdrop-blur-sm transition-all hover:bg-white"
          >
            <Expand className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto p-4">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View ${img.label}`}
              className={`relative shrink-0 overflow-hidden rounded-xl transition-all ${
                active === i
                  ? 'ring-2 ring-primary ring-offset-2'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img.url}
                alt={img.label}
                className="h-16 w-24 object-cover sm:h-20 sm:w-28"
              />
              <span className="absolute inset-x-0 bottom-0 bg-dark/50 py-0.5 text-center text-[10px] font-medium text-white">
                {img.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/90 p-4"
            onClick={() => setFullscreen(false)}
          >
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              aria-label="Close fullscreen"
              className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={images[active].url}
              alt={images[active].label}
              className="max-h-[90vh] max-w-full rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
