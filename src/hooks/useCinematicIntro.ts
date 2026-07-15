import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import {
  INTRO_FADE_MS,
  INTRO_HOLD_END,
  INTRO_LOGO_AT,
} from '../constants/luxury'
import type { CinematicVideoHandle } from '../components/luxury/CinematicVideo'

/** Only skip when the video file never begins loading (ms). */
const INTRO_LOAD_FAILSAFE_MS = 12_000

/** After confirmed autoplay denial, wait for a tap before skipping (ms). */
const INTRO_TAP_GRACE_MS = 4_000

interface UseCinematicIntroOptions {
  videoRef: RefObject<CinematicVideoHandle | null>
  onComplete: (holdTime: number) => void
  enabled: boolean
}

type IntroPhase = 'playing' | 'fading' | 'done'

export function useCinematicIntro({
  videoRef,
  onComplete,
  enabled,
}: UseCinematicIntroOptions) {
  const [phase, setPhase] = useState<IntroPhase>('playing')
  const [showLogo, setShowLogo] = useState(false)
  const [blackOpacity, setBlackOpacity] = useState(0)
  const [needsTap, setNeedsTap] = useState(false)

  const fadeStarted = useRef(false)
  const completed = useRef(false)
  const logoShown = useRef(false)
  const playbackStarted = useRef(false)
  const hasMetadata = useRef(false)
  const autoplayDenied = useRef(false)
  const holdTimeRef = useRef(INTRO_LOGO_AT)

  const finishIntro = useCallback(
    (holdTime: number) => {
      if (completed.current) return
      completed.current = true
      setPhase('done')
      onComplete(holdTime)
    },
    [onComplete],
  )

  const skipIntro = useCallback(() => {
    finishIntro(holdTimeRef.current)
  }, [finishIntro])

  const startFadeToBlack = useCallback(() => {
    if (fadeStarted.current || completed.current) return
    fadeStarted.current = true
    setPhase('fading')

    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / INTRO_FADE_MS)
      setBlackOpacity(t)
      if (t < 1) {
        requestAnimationFrame(tick)
      } else {
        finishIntro(holdTimeRef.current)
      }
    }
    requestAnimationFrame(tick)
  }, [finishIntro])

  const handlePlaying = useCallback(() => {
    playbackStarted.current = true
    setNeedsTap(false)
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    hasMetadata.current = true
  }, [])

  const handleAutoplayBlocked = useCallback(() => {
    if (playbackStarted.current || completed.current) return
    autoplayDenied.current = true
    setNeedsTap(true)
  }, [])

  const retryPlay = useCallback(() => {
    videoRef.current?.play()
  }, [videoRef])

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
    if (!enabled) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    const loadFailsafeId = window.setTimeout(() => {
      if (completed.current || playbackStarted.current) return
      if (!hasMetadata.current) skipIntro()
    }, INTRO_LOAD_FAILSAFE_MS)

    return () => window.clearTimeout(loadFailsafeId)
  }, [enabled, skipIntro])

  useEffect(() => {
    if (!enabled || !needsTap) return

    const tapGraceId = window.setTimeout(() => {
      if (!playbackStarted.current && !completed.current) skipIntro()
    }, INTRO_TAP_GRACE_MS)

    return () => window.clearTimeout(tapGraceId)
  }, [enabled, needsTap, skipIntro])

  return {
    overlay: {
      phase,
      showLogo,
      blackOpacity,
      needsTap,
      onTap: retryPlay,
    },
    videoCallbacks: enabled
      ? {
          onPlaying: handlePlaying,
          onLoadedMetadata: handleLoadedMetadata,
          onAutoplayBlocked: handleAutoplayBlocked,
          onTimeUpdate: handleTimeUpdate,
          onEnded: handleEnded,
        }
      : {},
  }
}
