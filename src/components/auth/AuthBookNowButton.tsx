import { useNavigate } from 'react-router-dom'
import { useRequireAuth } from '../../hooks/useRequireAuth'

interface AuthBookNowLinkProps {
  href: string
  className: string
  children: React.ReactNode
  onRipple?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export function AuthBookNowButton({
  href,
  className,
  children,
  onRipple,
}: AuthBookNowLinkProps) {
  const { requireAuth } = useRequireAuth()
  const navigate = useNavigate()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onRipple?.(e)
    if (requireAuth(href)) {
      navigate(href)
    }
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
