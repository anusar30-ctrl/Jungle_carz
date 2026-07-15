import { motion } from 'framer-motion'
import { HeroContent } from './HeroContent'
import { LuxuryBookingCard } from './LuxuryBookingCard'
import { FeatureBar } from './FeatureBar'
import { VIDEO_HOLD_TIME } from '../../constants/luxury'

interface LuxuryHeroProps {
  visible?: boolean
  videoHoldTime?: number
}

export function LuxuryHero({
  visible = true,
  videoHoldTime: _videoHoldTime = VIDEO_HOLD_TIME,
}: LuxuryHeroProps) {
  return (
    <motion.section
      id="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex min-h-[100dvh] flex-col supports-[min-height:100svh]:min-h-[100svh]"
    >
      <div className="relative z-10 flex flex-1 flex-col px-4 pt-24 pb-8 sm:px-6 sm:pt-28 sm:pb-10 md:px-10 lg:px-14">
        <div className="flex flex-1 flex-col gap-6 sm:gap-8 lg:grid lg:grid-cols-[1fr_minmax(0,400px)] lg:items-end lg:gap-10">
          <HeroContent />
          <div className="order-last flex w-full justify-center lg:order-none lg:justify-end lg:self-end">
            <LuxuryBookingCard />
          </div>
        </div>

        <div className="mt-8 pb-4 sm:mt-auto sm:pt-8">
          <FeatureBar />
        </div>
      </div>
    </motion.section>
  )
}
