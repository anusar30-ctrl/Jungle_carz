import { Link } from 'react-router-dom'
import { Logo } from '../Logo'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12 sm:px-6">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex justify-center">
            <Logo />
          </Link>
          <h1 className="mt-8 text-3xl font-bold tracking-tight text-dark">{title}</h1>
          <p className="mt-2 text-muted">{subtitle}</p>
        </div>

        <div className="glass rounded-[24px] border border-white/60 p-6 shadow-card sm:p-8">
          {children}
        </div>

        {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
      </div>
    </div>
  )
}
