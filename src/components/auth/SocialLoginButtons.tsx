import { useRef, useState } from 'react'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import type { AuthProvider } from '../../types/auth'
import { useAuth } from '../../context/AuthContext'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? ''
const isGoogleSignInConfigured = googleClientId.length > 0

interface SocialLoginButtonsProps {
  onError?: (message: string) => void
  onSuccess?: () => void
}

export function SocialLoginButtons({ onError, onSuccess }: SocialLoginButtonsProps) {
  const { loginWithSocial } = useAuth()
  const [loading, setLoading] = useState<AuthProvider | null>(null)
  const googleButtonRef = useRef<HTMLDivElement>(null)

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      onError?.('Google sign-in failed. Please try again.')
      return
    }

    setLoading('google')
    try {
      await loginWithSocial('google', response.credential)
      onSuccess?.()
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Could not sign in with Google.')
    } finally {
      setLoading(null)
    }
  }

  const handleGoogleClick = () => {
    if (!isGoogleSignInConfigured) {
      if (import.meta.env.DEV) {
        console.error(
          '[Jungle Carz] VITE_GOOGLE_CLIENT_ID is not set. Add it to your root .env file (see .env.example).',
        )
      }
      onError?.(
        'Google sign-in is not configured. Add VITE_GOOGLE_CLIENT_ID to your .env file.',
      )
      return
    }

    const googleBtn = googleButtonRef.current?.querySelector(
      'div[role="button"]',
    ) as HTMLElement | null
    googleBtn?.click()
  }

  return (
    <div className="space-y-3">
      {isGoogleSignInConfigured && (
        <div ref={googleButtonRef} className="sr-only" aria-hidden="true">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => onError?.('Google sign-in was cancelled or failed.')}
            useOneTap={false}
            type="standard"
            theme="outline"
            size="large"
            text="continue_with"
          />
        </div>
      )}

      <SocialButton
        label="Continue with Google"
        icon={<FcGoogle className="h-5 w-5" />}
        onClick={handleGoogleClick}
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
