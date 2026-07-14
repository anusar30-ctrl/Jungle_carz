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
      startTime,
    },
    ref,
  ) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const onTimeUpdateRef = useRef(onTimeUpdate)
    const onEndedRef = useRef(onEnded)

    useEffect(() => {
      onTimeUpdateRef.current = onTimeUpdate
      onEndedRef.current = onEnded
    }, [onTimeUpdate, onEnded])

    useImperativeHandle(ref, () => ({
      seekTo: (time: number) => {
        const video = videoRef.current
        if (!video) return
        video.currentTime = time
        video.pause()
      },
      pause: () => videoRef.current?.pause(),
      play: () => videoRef.current?.play().catch(() => {}),
      getCurrentTime: () => videoRef.current?.currentTime ?? 0,
    }))

    useEffect(() => {
      const video = videoRef.current
      if (!video) return

      video.playbackRate = 1
      video.loop = loop

      const handleLoaded = () => {
        if (startTime !== undefined) video.currentTime = startTime
        if (paused) video.pause()
        else if (autoPlay) video.play().catch(() => {})
      }

      const handleTimeUpdate = () => {
        onTimeUpdateRef.current?.(video.currentTime)
      }

      const handleEnded = () => onEndedRef.current?.()

      video.addEventListener('loadeddata', handleLoaded)
      video.addEventListener('timeupdate', handleTimeUpdate)
      video.addEventListener('ended', handleEnded)

      if (video.readyState >= 2) handleLoaded()

      return () => {
        video.removeEventListener('loadeddata', handleLoaded)
        video.removeEventListener('timeupdate', handleTimeUpdate)
        video.removeEventListener('ended', handleEnded)
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
