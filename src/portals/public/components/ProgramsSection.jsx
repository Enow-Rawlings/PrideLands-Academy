// FILE: src/portals/public/components/ProgramsSection.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { IMAGES } from '@/lib/theme'

const featuredPrograms = [
  {
    id: 'engineering',
    badge: 'Engineering',
    title: 'School of Engineering & Tech',
    description: 'Mastering the tools of the future through hands-on robotics and software development.',
    image: IMAGES.engineering,
    path: '/programs/bict',
  },
  {
    id: 'architecture',
    badge: 'Architecture',
    title: 'Faculty of Built Environment',
    description: 'Designing sustainable cities for Africa\'s growing urban landscape with eco-conscious innovation.',
    image: IMAGES.architecture,
    path: '/programs/bed',
  },
  {
    id: 'business',
    badge: 'Business',
    title: 'Leadership & Entrepreneurship',
    description: 'Empowering the next wave of African CEOs through intensive strategic management programs.',
    image: IMAGES.business,
    path: '/programs/bba',
  },
]

export default function ProgramsSection() {
  return (
    <section className="section-alt">
      <div className="container-academy">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10 gap-4"
        >
          <div>
            <span className="section-eyebrow">Our Faculties</span>
            <h2 className="section-title mb-2">Academic Programs</h2>
            <p className="section-subtitle">
              A diverse range of faculties designed to spark innovation.
            </p>
          </div>
          <Link
            to="/programs"
            className="hidden sm:inline-flex items-center gap-2 text-navy-900 font-display font-600 text-sm hover:text-gold-600 transition-colors flex-shrink-0 group"
          >
            View All Programs
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Program Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPrograms.map((program, i) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group relative rounded-academy overflow-hidden h-80 md:h-96 cursor-pointer"
            >
              {/* Background Image */}
              <img
                src={program.image}
                alt={program.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
              <div className="absolute inset-0 bg-navy-900/20 group-hover:bg-navy-900/30 transition-colors duration-300" />

              {/* Badge - top left */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-display font-600 border border-white/30">
                  {program.badge}
                </span>
              </div>

              {/* Content - bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <h3 className="font-display font-700 text-white text-lg leading-snug mb-2">
                  {program.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  {program.description}
                </p>
                <Link
                  to={program.path}
                  className="inline-flex items-center gap-1.5 text-gold-400 font-display font-600 text-sm hover:text-gold-300 transition-colors group/link"
                >
                  Learn More
                  <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile "View All" */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 btn-outline-navy"
          >
            View All Programs
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  )
}
