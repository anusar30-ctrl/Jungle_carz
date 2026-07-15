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
  onLoadedMetadata?: () => void
  onAutoplayBlocked?: () => void
  startTime?: number
}

function isAutoplayBlockedError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === 'NotAllowedError' || error.name === 'AbortError')
  )
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
      onLoadedMetadata,
      onAutoplayBlocked,
      startTime,
    },
    ref,
  ) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const onTimeUpdateRef = useRef(onTimeUpdate)
    const onEndedRef = useRef(onEnded)
    const onPlayingRef = useRef(onPlaying)
    const onLoadedMetadataRef = useRef(onLoadedMetadata)
    const onAutoplayBlockedRef = useRef(onAutoplayBlocked)

    useEffect(() => {
      onTimeUpdateRef.current = onTimeUpdate
      onEndedRef.current = onEnded
      onPlayingRef.current = onPlaying
      onLoadedMetadataRef.current = onLoadedMetadata
      onAutoplayBlockedRef.current = onAutoplayBlocked
    }, [onTimeUpdate, onEnded, onPlaying, onLoadedMetadata, onAutoplayBlocked])

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
          // Manual play retry — non-fatal.
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

      const notifyAutoplayBlocked = () => {
        onAutoplayBlockedRef.current?.()
      }

      const retryPlay = () => {
        video.play().catch((error: unknown) => {
          if (isAutoplayBlockedError(error)) notifyAutoplayBlocked()
        })
      }

      const attemptAutoplay = () => {
        if (paused || !autoPlay) return

        video.play().catch((error: unknown) => {
          if (isAutoplayBlockedError(error)) {
            if (canplayRetryUsed) {
              notifyAutoplayBlocked()
              return
            }
            canplayRetryUsed = true
            if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
              retryPlay()
            } else {
              canplayRetryHandler = retryPlay
              video.addEventListener('canplay', canplayRetryHandler, { once: true })
            }
            return
          }

          if (canplayRetryUsed) return
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

      const handleLoadedMetadata = () => {
        onLoadedMetadataRef.current?.()
      }

      video.addEventListener('loadeddata', handleLoaded)
      video.addEventListener('loadedmetadata', handleLoadedMetadata)
      video.addEventListener('timeupdate', handleTimeUpdate)
      video.addEventListener('ended', handleEnded)
      video.addEventListener('playing', handlePlaying)

      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
        handleLoadedMetadata()
      }
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        handleLoaded()
      }

      return () => {
        if (canplayRetryHandler) {
          video.removeEventListener('canplay', canplayRetryHandler)
        }
        video.removeEventListener('loadeddata', handleLoaded)
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
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
