import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { LuxuryNavbar } from '../components/luxury/LuxuryNavbar'
import { LuxuryHero } from '../components/luxury/LuxuryHero'
import { TrustedCompanies } from '../components/luxury/TrustedCompanies'
import { LuxuryFooter } from '../components/luxury/LuxuryFooter'
import { CinematicIntroOverlay } from '../components/luxury/CinematicIntroOverlay'
import { HeroVideoOverlay } from '../components/luxury/HeroVideoOverlay'
import {
  CinematicVideo,
  type CinematicVideoHandle,
} from '../components/luxury/CinematicVideo'
import { HERO_VIDEO_SRC, INTRO_LOGO_AT } from '../constants/luxury'
import { useCinematicIntro } from '../hooks/useCinematicIntro'

const INTRO_SEEN_KEY = 'jungle-carz-intro-seen'

export function Home() {
  const videoRef = useRef<CinematicVideoHandle>(null)
  const [introComplete, setIntroComplete] = useState(
    () => sessionStorage.getItem(INTRO_SEEN_KEY) === '1',
  )
  const [holdTime, setHoldTime] = useState(INTRO_LOGO_AT)

  const handleIntroComplete = useCallback((time: number) => {
    setHoldTime(time)
    sessionStorage.setItem(INTRO_SEEN_KEY, '1')
    setIntroComplete(true)
  }, [])

  const intro = useCinematicIntro({
    videoRef,
    onComplete: handleIntroComplete,
    enabled: !introComplete,
  })

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'fetch'
    link.href = HERO_VIDEO_SRC
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
    return () => {
      link.remove()
    }
  }, [])

  return (
    <div className="relative min-h-[100dvh] bg-black">
      <div
        className={
          introComplete
            ? 'absolute inset-0 overflow-hidden'
            : 'fixed inset-0 z-[199] overflow-hidden bg-black'
        }
        aria-hidden={!introComplete}
      >
        <CinematicVideo
          ref={videoRef}
          src={HERO_VIDEO_SRC}
          autoPlay={!introComplete}
          paused={introComplete}
          startTime={introComplete ? holdTime : undefined}
          className="!absolute inset-0 h-full w-full"
          {...intro.videoCallbacks}
        />
        {introComplete && <HeroVideoOverlay />}
      </div>

      {!introComplete && <CinematicIntroOverlay {...intro.overlay} />}

      {introComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[100dvh] w-full"
        >
          <div className="relative">
            <LuxuryNavbar visible />
            <LuxuryHero visible videoHoldTime={holdTime} />
          </div>
          <TrustedCompanies />
          <LuxuryFooter />
        </motion.div>
      )}
    </div>
  )
}
