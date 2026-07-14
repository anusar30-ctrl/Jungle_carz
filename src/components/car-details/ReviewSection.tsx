import { useState } from 'react'
import { motion } from 'framer-motion'
import { BadgeCheck, Star, ThumbsUp } from 'lucide-react'
import type { CarReview } from '../../types/carDetails'

interface ReviewSectionProps {
  reviews: CarReview[]
  rating: number
  totalReviews: number
}

export function ReviewSection({
  reviews,
  rating,
  totalReviews,
}: ReviewSectionProps) {
  const [visible, setVisible] = useState(2)
  const [helpful, setHelpful] = useState<Set<string>>(new Set())

  const toggleHelpful = (id: string) => {
    setHelpful((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <section aria-labelledby="reviews-heading">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="reviews-heading" className="text-xl font-bold text-dark">
            Customer Reviews
          </h2>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(rating)
                      ? 'fill-accent text-accent'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="font-bold text-dark">{rating}</span>
            <span className="text-sm text-muted">({totalReviews} reviews)</span>
          </div>
        </div>
        <button
          type="button"
          className="rounded-2xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-dark transition-all hover:border-primary/30"
        >
          Write a Review
        </button>
      </div>

      <div className="space-y-4">
        {reviews.slice(0, visible).map((review, i) => (
          <motion.article
            key={review.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-soft"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {review.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-dark">{review.name}</span>
                    {review.verified && (
                      <span className="flex items-center gap-0.5 text-xs font-semibold text-secondary">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted">{review.date}</span>
                </div>
              </div>
              <div className="flex">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                ))}
              </div>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-muted">
              {review.comment}
            </p>
            {review.images.length > 0 && (
              <div className="mb-3 flex gap-2">
                {review.images.map((img, j) => (
                  <img
                    key={j}
                    src={img}
                    alt={`Review photo ${j + 1}`}
                    className="h-20 w-28 rounded-xl object-cover"
                  />
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => toggleHelpful(review.id)}
              className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                helpful.has(review.id) ? 'text-primary' : 'text-muted hover:text-primary'
              }`}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              Helpful ({review.helpful + (helpful.has(review.id) ? 1 : 0)})
            </button>
          </motion.article>
        ))}
      </div>

      {visible < reviews.length && (
        <button
          type="button"
          onClick={() => setVisible((v) => v + 2)}
          className="mt-4 w-full rounded-2xl border border-gray-200 py-3 text-sm font-semibold text-dark transition-all hover:border-primary/30"
        >
          Load More Reviews
        </button>
      )}
    </section>
  )
}
