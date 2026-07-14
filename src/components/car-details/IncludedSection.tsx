import { Check, X } from 'lucide-react'

interface IncludedSectionProps {
  items: string[]
}

export function IncludedSection({ items }: IncludedSectionProps) {
  return (
    <section aria-labelledby="included-heading">
      <h2 id="included-heading" className="mb-4 text-xl font-bold text-dark">
        What&apos;s Included
      </h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-soft"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary/15">
              <Check className="h-4 w-4 text-secondary" />
            </span>
            <span className="text-sm font-medium text-dark">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

interface RulesSectionProps {
  rules: { text: string; allowed?: boolean }[]
}

export function RulesSection({ rules }: RulesSectionProps) {
  return (
    <section aria-labelledby="rules-heading">
      <h2 id="rules-heading" className="mb-4 text-xl font-bold text-dark">
        Rental Rules
      </h2>
      <ul className="space-y-2">
        {rules.map((rule) => (
          <li
            key={rule.text}
            className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3"
          >
            <span
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                rule.allowed !== false
                  ? 'bg-primary/10 text-primary'
                  : 'bg-red-50 text-red-500'
              }`}
            >
              {rule.allowed !== false ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <X className="h-3.5 w-3.5" />
              )}
            </span>
            <span className="text-sm text-dark">{rule.text}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
