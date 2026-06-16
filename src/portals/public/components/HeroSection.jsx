import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { IMAGES } from '@/lib/theme'

// Animated counter hook 
function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

// Stat Card 
function StatCard({ value, suffix, label, delay, animate }) {
  const count = useCountUp(value, 1800, animate)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-academy p-5 hover:bg-white/15 transition-all duration-300"
    >
      <div className="font-display font-900 text-white text-3xl md:text-4xl leading-none mb-1.5">
        {animate ? count : 0}{suffix}
      </div>
      <div className="text-white/70 text-sm font-body leading-tight">{label}</div>
    </motion.div>
  )
}

const STATS = [
  { value: 50,   suffix: '+',  label: 'Academic Programs',   delay: 0.6 },
  { value: 200,  suffix: '+',  label: 'Industry Partners',   delay: 0.7 },
  { value: 98,   suffix: '%',  label: 'Success Rate',        delay: 0.8 },
  { value: 15000,suffix: '+',  label: 'Alumni Network',      delay: 0.9 },
]

export default function HeroSection() {
  const [animate, setAnimate] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    // Trigger counter after section visible
    const timer = setTimeout(() => setAnimate(true), 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image  */}
      <div className="absolute inset-0 z-0">
        <img
          src={IMAGES.hero}
          alt="PrideLands Academy Campus"
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />

        <div className="absolute inset-0 bg-navy-900/72" />


        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/80 via-navy-900/60 to-transparent" />
      </div>

      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-navy-600/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 container-academy w-full px-4 md:px-8 pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-2 mb-6"
            >
              <span className="block w-8 h-0.5 bg-gold-500 rounded-full" />
              <span className="text-gold-400 font-display font-600 text-sm tracking-widest uppercase">
                PrideLands Academy
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-display font-900 text-white leading-[1.08] mb-6"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)' }}
            >
              Building Africa's{' '}
              <span className="text-gradient-gold">Next Generation</span>
              {' '}of Leaders
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="text-white/75 text-lg leading-relaxed mb-10 max-w-lg"
            >
              Empowering innovators and entrepreneurs through world-class academic excellence and leadership development rooted in African values.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-gold-500 text-navy-900 font-display font-700 text-sm rounded-academy hover:bg-gold-400 hover:shadow-gold transition-all duration-200 active:scale-95"
              >
                Apply Now
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent text-white font-display font-600 text-sm rounded-academy border border-white/40 hover:bg-white/10 hover:border-white transition-all duration-200 active:scale-95"
              >
                Explore Programs
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-10 flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {[
                  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=40&h=40&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&crop=face',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Student"
                    className="w-8 h-8 rounded-full border-2 border-navy-900 object-cover"
                  />
                ))}
              </div>
              <p className="text-white/65 text-sm">
                Join <span className="text-gold-400 font-600">15,000+</span> alumni transforming Africa
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {STATS.map((stat) => (
              <StatCard key={stat.label} {...stat} animate={animate} />
            ))}
          </div>

        </div>
      </div>

      {/*  Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5"
      >
        <span className="text-white/40 text-xs font-body tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>

    </section>
  )
}
