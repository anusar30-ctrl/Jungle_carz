import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

export interface CinematicVideoHandle {
  seekTo: (time: number) => void
  pause: () => void
  play: () => void
  getCurrentTime: () => number
}

interface CinematicVideoProps {
  src: string
  className?: string
  paused?: boolean
  loop?: boolean
  autoPlay?: boolean
  onTimeUpdate?: (currentTime: number) => void
  onEnded?: () => void
  onPlaying?: () => void
  onAutoplayBlocked?: () => void
  startTime?: number
}

export const CinematicVideo = forwardRef<CinematicVideoHandle, CinematicVideoProps>(
  function CinematicVideo(
    {
      src,
      className = '',
      paused = false,
      loop = false,
      autoPlay = true,
      onTimeUpdate,
      onEnded,
      onPlaying,
      onAutoplayBlocked,
      startTime,
    },
    ref,
  ) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const onTimeUpdateRef = useRef(onTimeUpdate)
    const onEndedRef = useRef(onEnded)
    const onPlayingRef = useRef(onPlaying)
    const onAutoplayBlockedRef = useRef(onAutoplayBlocked)

    useEffect(() => {
      onTimeUpdateRef.current = onTimeUpdate
      onEndedRef.current = onEnded
      onPlayingRef.current = onPlaying
      onAutoplayBlockedRef.current = onAutoplayBlocked
    }, [onTimeUpdate, onEnded, onPlaying, onAutoplayBlocked])

    useImperativeHandle(ref, () => ({
      seekTo: (time: number) => {
        const video = videoRef.current
        if (!video) return
        video.currentTime = time
        video.pause()
      },
      pause: () => videoRef.current?.pause(),
      play: () => {
        videoRef.current?.play().catch(() => {
          // Imperative play (e.g. hero controls) — failure is non-fatal.
        })
      },
      getCurrentTime: () => videoRef.current?.currentTime ?? 0,
    }))

    useEffect(() => {
      const video = videoRef.current
      if (!video) return

      video.playbackRate = 1
      video.loop = loop

      let canplayRetryUsed = false
      let canplayRetryHandler: (() => void) | null = null

      const attemptAutoplay = () => {
        if (paused || !autoPlay) return

        const retryPlay = () => {
          video.play().catch(() => {
            onAutoplayBlockedRef.current?.()
          })
        }

        video.play().catch(() => {
          if (canplayRetryUsed) {
            onAutoplayBlockedRef.current?.()
            return
          }

          canplayRetryUsed = true
          if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
            retryPlay()
          } else {
            canplayRetryHandler = retryPlay
            video.addEventListener('canplay', canplayRetryHandler, { once: true })
          }
        })
      }

      const handleLoaded = () => {
        if (startTime !== undefined) video.currentTime = startTime
        if (paused) {
          video.pause()
        } else {
          attemptAutoplay()
        }
      }

      const handleTimeUpdate = () => {
        onTimeUpdateRef.current?.(video.currentTime)
      }

      const handleEnded = () => onEndedRef.current?.()

      const handlePlaying = () => {
        onPlayingRef.current?.()
      }

      video.addEventListener('loadeddata', handleLoaded)
      video.addEventListener('timeupdate', handleTimeUpdate)
      video.addEventListener('ended', handleEnded)
      video.addEventListener('playing', handlePlaying)

      if (video.readyState >= 2) handleLoaded()

      return () => {
        if (canplayRetryHandler) {
          video.removeEventListener('canplay', canplayRetryHandler)
        }
        video.removeEventListener('loadeddata', handleLoaded)
        video.removeEventListener('timeupdate', handleTimeUpdate)
        video.removeEventListener('ended', handleEnded)
        video.removeEventListener('playing', handlePlaying)
      }
    }, [src, paused, autoPlay, loop, startTime])

    useEffect(() => {
      const video = videoRef.current
      if (!video || startTime === undefined) return
      video.currentTime = startTime
      if (paused) video.pause()
    }, [startTime, paused])

    return (
      <div className={`cinematic-video-wrap ${className}`}>
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="auto"
          className="cinematic-video"
        />
      </div>
    )
  },
)
