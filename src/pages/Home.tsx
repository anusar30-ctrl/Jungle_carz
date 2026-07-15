import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { LuxuryNavbar } from '../components/luxury/LuxuryNavbar'
import { LuxuryHero } from '../components/luxury/LuxuryHero'
import { TrustedCompanies } from '../components/luxury/TrustedCompanies'
import { LuxuryFooter } from '../components/luxury/LuxuryFooter'
import { CinematicIntro } from '../components/luxury/CinematicIntro'
import { INTRO_LOGO_AT } from '../constants/luxury'

const INTRO_SEEN_KEY = 'jungle-carz-intro-seen'

export function Home() {
  const [introComplete, setIntroComplete] = useState(
    () => sessionStorage.getItem(INTRO_SEEN_KEY) === '1',
  )
  const [holdTime, setHoldTime] = useState(INTRO_LOGO_AT)

  const handleIntroComplete = useCallback((time: number) => {
    setHoldTime(time)
    sessionStorage.setItem(INTRO_SEEN_KEY, '1')
    setIntroComplete(true)
  }, [])

  return (
    <div className="min-h-[100dvh] bg-black">
      {!introComplete && <CinematicIntro onComplete={handleIntroComplete} />}

      {introComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-[100dvh] w-full"
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
