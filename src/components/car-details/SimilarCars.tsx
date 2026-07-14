import { motion } from 'framer-motion'
import { ChevronRight, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import type { CarDetailData } from '../../types/carDetails'
import { formatCurrency } from '../../hooks/useCarFilters'

import 'swiper/css'
import 'swiper/css/navigation'

interface SimilarCarsProps {
  cars: CarDetailData[]
}

export function SimilarCars({ cars }: SimilarCarsProps) {
  return (
    <section aria-labelledby="similar-heading">
      <div className="mb-6 flex items-center justify-between">
        <h2 id="similar-heading" className="text-xl font-bold text-dark">
          Similar Cars You Might Like
        </h2>
        <Link
          to="/search"
          className="text-sm font-semibold text-primary hover:underline"
        >
          View All
        </Link>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={1.2}
        navigation
        breakpoints={{
          480: { slidesPerView: 1.5 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="similar-cars-swiper"
      >
        {cars.map((car) => (
          <SwiperSlide key={car.id}>
            <motion.div
              whileHover={{ y: -6 }}
              className="overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-soft transition-shadow hover:shadow-card"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={car.gallery[0]?.url}
                  alt={car.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-dark">{car.name}</h3>
                <div className="mt-1 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                  <span className="text-sm font-semibold">{car.rating}</span>
                </div>
                <p className="mt-2 text-lg font-bold text-primary">
                  {formatCurrency(car.pricePerDay)}
                  <span className="text-sm font-medium text-muted">/day</span>
                </p>
                <Link
                  to={`/cars/${car.id}`}
                  className="mt-3 flex w-full items-center justify-center gap-1 rounded-2xl border border-gray-200 py-2.5 text-sm font-semibold text-dark transition-all hover:border-primary/30 hover:text-primary"
                >
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
