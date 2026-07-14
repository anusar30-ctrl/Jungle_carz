import { forwardRef } from 'react'
import { HERO_VIDEO_SRC, VIDEO_HOLD_TIME } from '../../constants/luxury'
import { CinematicVideo, type CinematicVideoHandle } from './CinematicVideo'

export type HeroVideoHandle = CinematicVideoHandle

interface HeroVideoProps {
  paused?: boolean
  holdTime?: number
  showOverlay?: boolean
}

export const HeroVideo = forwardRef<HeroVideoHandle, HeroVideoProps>(
  function HeroVideo(
    { paused = true, holdTime = VIDEO_HOLD_TIME, showOverlay = true },
    ref,
  ) {
    return (
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <CinematicVideo
          ref={ref}
          src={HERO_VIDEO_SRC}
          paused={paused}
          autoPlay={!paused}
          loop={!paused}
          startTime={holdTime}
          className="h-full w-full"
        />

        {showOverlay && (
          <>
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(rgba(0,0,0,0.42), rgba(0,0,0,0.28))',
              }}
            />
            <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-black/55 to-transparent sm:h-48" />
          </>
        )}
      </div>
    )
  },
)
