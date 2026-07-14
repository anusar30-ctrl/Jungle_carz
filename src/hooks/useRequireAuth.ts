import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function useRequireAuth() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const requireAuth = (returnTo: string) => {
    if (isAuthenticated) return true
    navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`)
    return false
  }

  return { isAuthenticated, requireAuth }
}
