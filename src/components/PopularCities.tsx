import { motion } from 'framer-motion'
import {
  Building2,
  Castle,
  Church,
  Landmark,
  MapPin,
  Mountain,
  Waves,
} from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import { POPULAR_CITIES } from '../constants/data'

import 'swiper/css'
import 'swiper/css/navigation'

const cityIcons: Record<string, typeof Building2> = {
  Bangalore: Building2,
  Hyderabad: Castle,
  Chennai: Waves,
  Mumbai: Landmark,
  Delhi: Church,
  Pune: Mountain,
}

export function PopularCities() {
  return (
    <section className="py-16 md:py-20" aria-labelledby="popular-cities-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2
            id="popular-cities-heading"
            className="text-2xl font-bold text-dark sm:text-3xl"
          >
            Popular Cities
          </h2>
          <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-primary" />
        </motion.div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={16}
            slidesPerView={2}
            navigation
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            breakpoints={{
              480: { slidesPerView: 2.5 },
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
              1280: { slidesPerView: 6 },
            }}
            className="popular-cities-swiper !pb-2"
          >
            {POPULAR_CITIES.map((city, i) => {
              const Icon = cityIcons[city.name] ?? MapPin
              return (
                <SwiperSlide key={city.name}>
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex w-full flex-col items-center gap-3 rounded-[20px] border border-gray-100 bg-white p-5 shadow-soft transition-shadow hover:border-primary/20 hover:shadow-card"
                    aria-label={`Select ${city.name}`}
                  >
                    <div className="flex h-20 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/5 transition-colors group-hover:from-primary/15 group-hover:to-secondary/10">
                      <Icon className="h-10 w-10 text-primary/70 transition-colors group-hover:text-primary" strokeWidth={1.5} />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-dark">{city.name}</p>
                      <p className="text-xs text-muted">{city.landmark}</p>
                    </div>
                  </motion.button>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      </div>
    </section>
  )
}
