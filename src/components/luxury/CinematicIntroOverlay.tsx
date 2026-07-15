import { motion, AnimatePresence } from 'framer-motion'
import { LogoReveal } from './LogoReveal'

interface CinematicIntroOverlayProps {
  phase: 'playing' | 'fading' | 'done'
  showLogo: boolean
  blackOpacity: number
  needsTap: boolean
  onTap: () => void
}

export function CinematicIntroOverlay({
  phase,
  showLogo,
  blackOpacity,
  needsTap,
  onTap,
}: CinematicIntroOverlayProps) {
  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          exit={{ opacity: 0 }}
          onClick={needsTap ? onTap : undefined}
          onKeyDown={
            needsTap
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') onTap()
                }
              : undefined
          }
          role={needsTap ? 'button' : undefined}
          tabIndex={needsTap ? 0 : undefined}
          className="fixed inset-0 z-[200] flex min-h-[100dvh] w-full items-center justify-center bg-transparent supports-[min-height:100svh]:min-h-[100svh]"
          style={{
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
          aria-label={
            needsTap ? 'Tap to play Jungle Carz intro' : 'Jungle Carz cinematic intro'
          }
        >
          {showLogo && <LogoReveal />}

          {needsTap && (
            <p className="pointer-events-none absolute bottom-16 z-20 font-outfit text-sm font-medium tracking-wide text-white/70">
              Tap to continue
            </p>
          )}

          <div
            className="pointer-events-none absolute inset-0 z-10 bg-black transition-none"
            style={{ opacity: blackOpacity }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
