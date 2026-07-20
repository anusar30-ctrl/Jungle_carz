import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? ''

if (import.meta.env.DEV && !googleClientId) {
  console.error(
    '[Jungle Carz] VITE_GOOGLE_CLIENT_ID is not set. Google Sign-In is disabled. Copy .env.example to .env and add your Google OAuth client ID.',
  )
}

const app = (
  <AuthProvider>
    <App />
  </AuthProvider>
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>{app}</GoogleOAuthProvider>
    ) : (
      app
    )}
  </StrictMode>,
)
