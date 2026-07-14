import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Trees } from 'lucide-react'

interface LogoProps {
  className?: string
  light?: boolean
}

export function Logo({ className = '', light = false }: LogoProps) {
  return (
    <Link
      to="/"
      className={`group flex items-center gap-2.5 ${className}`}
      aria-label="Jungle Carz — Home"
    >
      <motion.div
        whileHover={{ scale: 1.05, rotate: -3 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-md shadow-primary/25"
      >
        <Trees className="h-5 w-5 text-white" strokeWidth={2.5} />
      </motion.div>
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-bold tracking-[0.2em] text-primary">
          JUNGLE
        </span>
        <span
          className={`text-lg font-extrabold tracking-tight ${
            light ? 'text-white' : 'text-dark'
          }`}
        >
          CARZ
        </span>
      </div>
    </Link>
  )
}
