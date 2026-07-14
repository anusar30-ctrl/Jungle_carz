import { motion } from 'framer-motion'
import { TRUSTED_BRANDS } from '../../constants/luxury'

export function TrustedCompanies() {
  return (
    <section
      id="destinations"
      className="border-t border-luxury-dark/5 bg-luxury-bg px-8 py-14 md:px-14"
      aria-labelledby="trusted-heading"
    >
      <p
        id="trusted-heading"
        className="mb-8 text-center font-outfit text-xs font-semibold tracking-[0.25em] text-luxury-dark/40 uppercase"
      >
        Trusted By
      </p>
      <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
        {TRUSTED_BRANDS.map((brand, i) => (
          <motion.span
            key={brand}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="font-outfit text-xl font-bold tracking-tight text-luxury-dark/25 grayscale transition-all hover:text-luxury-dark/40 md:text-2xl"
          >
            {brand}
          </motion.span>
        ))}
      </div>
    </section>
  )
}
