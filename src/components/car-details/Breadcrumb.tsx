import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface BreadcrumbProps {
  items: string[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          const href =
            i === 0 ? '/' : i === 1 ? '/search' : i === 2 ? '/search' : undefined

          return (
            <li key={item} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-muted" aria-hidden />
              )}
              {isLast || !href ? (
                <span
                  className={
                    isLast
                      ? 'font-semibold text-dark'
                      : 'text-muted'
                  }
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item}
                </span>
              ) : (
                <Link
                  to={href}
                  className="text-muted transition-colors hover:text-primary"
                >
                  {item}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
