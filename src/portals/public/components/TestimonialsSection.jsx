import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/constants'

export default function TestimonialsSection() {
  const [active, setActive] = useState(0)

  const prev = () => setActive((v) => (v - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const next = () => setActive((v) => (v + 1) % TESTIMONIALS.length)

  const current = TESTIMONIALS[active]

  return (
    <section className="py-20 bg-navy-900 overflow-hidden">
      <div className="container-academy px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — Heading + Controls */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-eyebrow">Alumni Voices</span>
            <h2 className="section-title-light mb-6">
              Success Stories From Our Global Alumni
            </h2>
            <p className="section-subtitle-light mb-10">
              PrideLands Academy graduates are currently leading departments in Fortune 500 companies and launching impactful startups across the African continent.
            </p>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/40 transition-all duration-200 active:scale-95"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/40 transition-all duration-200 active:scale-95"
                aria-label="Next testimonial"
              >
                <ChevronRight size={18} />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2 ml-2">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === active
                        ? 'w-6 h-2 bg-gold-500'
                        : 'w-2 h-2 bg-white/25 hover:bg-white/40'
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — Quote Card */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="bg-navy-800 border border-white/10 rounded-2xl p-8 md:p-10 relative"
              >
                {/* Large quote mark */}
                <div className="absolute -top-4 -left-2 w-14 h-14 bg-gold-500 rounded-xl flex items-center justify-center shadow-gold">
                  <span className="font-display font-900 text-navy-900 text-3xl leading-none">"</span>
                </div>

                {/* Quote text */}
                <blockquote className="text-white/90 text-lg leading-relaxed mb-8 mt-4 font-body">
                  "{current.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={current.avatar}
                    alt={current.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gold-500/40"
                  />
                  <div>
                    <p className="font-display font-700 text-white text-sm">{current.name}</p>
                    <p className="text-navy-400 text-xs mt-0.5">{current.program}</p>
                    <p className="text-gold-500 text-xs">🌍 {current.country}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}
