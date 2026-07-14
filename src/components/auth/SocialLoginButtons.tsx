import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import type { AuthProvider } from '../../types/auth'
import { useAuth } from '../../context/AuthContext'

interface SocialLoginButtonsProps {
  onError?: (message: string) => void
}

export function SocialLoginButtons({ onError }: SocialLoginButtonsProps) {
  const { loginWithSocial } = useAuth()
  const [loading, setLoading] = useState<AuthProvider | null>(null)

  const handleSocial = async (provider: AuthProvider) => {
    setLoading(provider)
    try {
      await loginWithSocial(provider)
    } catch {
      onError?.(`Could not sign in with ${provider}. Please try again.`)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-3">
      <SocialButton
        label="Continue with Google"
        icon={<FcGoogle className="h-5 w-5" />}
        onClick={() => handleSocial('google')}
        loading={loading === 'google'}
        disabled={!!loading}
      />
    </div>
  )
}

function SocialButton({
  label,
  icon,
  onClick,
  loading,
  disabled,
}: {
  label: string
  icon: React.ReactNode
  onClick: () => void
  loading: boolean
  disabled: boolean
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.99 }}
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-dark transition-colors hover:border-primary/30 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : icon}
      {label}
    </motion.button>
  )
}
