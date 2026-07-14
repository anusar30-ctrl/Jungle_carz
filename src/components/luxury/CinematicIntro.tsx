import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HERO_VIDEO_SRC,
  INTRO_FADE_MS,
  INTRO_HOLD_END,
  INTRO_LOGO_AT,
} from '../../constants/luxury'
import { LogoReveal } from './LogoReveal'
import { CinematicVideo } from './CinematicVideo'

interface CinematicIntroProps {
  onComplete: (holdTime: number) => void
}

type IntroPhase = 'playing' | 'fading' | 'done'

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState<IntroPhase>('playing')
  const [showLogo, setShowLogo] = useState(false)
  const [blackOpacity, setBlackOpacity] = useState(0)
  const fadeStarted = useRef(false)
  const completed = useRef(false)
  const logoShown = useRef(false)
  const holdTimeRef = useRef(INTRO_LOGO_AT)

  const startFadeToBlack = useCallback(() => {
    if (fadeStarted.current) return
    fadeStarted.current = true
    setPhase('fading')

    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / INTRO_FADE_MS)
      setBlackOpacity(t)
      if (t < 1) {
        requestAnimationFrame(tick)
      } else if (!completed.current) {
        completed.current = true
        setPhase('done')
        onComplete(holdTimeRef.current)
      }
    }
    requestAnimationFrame(tick)
  }, [onComplete])

  const handleTimeUpdate = useCallback(
    (t: number) => {
      holdTimeRef.current = t
      if (t >= INTRO_LOGO_AT && !logoShown.current) {
        logoShown.current = true
        setShowLogo(true)
      }
      if (t >= INTRO_HOLD_END && phase === 'playing') startFadeToBlack()
    },
    [phase, startFadeToBlack],
  )

  const handleEnded = useCallback(() => {
    if (!logoShown.current) {
      logoShown.current = true
      setShowLogo(true)
    }
    setTimeout(startFadeToBlack, 1000)
  }, [startFadeToBlack])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex min-h-[100dvh] w-full items-center justify-center bg-black supports-[min-height:100svh]:min-h-[100svh]"
          style={{
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
          aria-label="Jungle Carz cinematic intro"
        >
          <CinematicVideo
            src={HERO_VIDEO_SRC}
            autoPlay
            paused={false}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            className="!absolute inset-0 h-full w-full"
          />

          {showLogo && <LogoReveal />}

          <div
            className="pointer-events-none absolute inset-0 z-10 bg-black transition-none"
            style={{ opacity: blackOpacity }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
