// FILE: src/portals/public/components/NewsSection.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Tag } from 'lucide-react'
import { UNSPLASH_PHOTOS } from '@/lib/utils'

const newsItems = [
  {
    id: 1,
    category: 'Partnership',
    title: 'Academy Partners with Global Tech Giant for AI Lab',
    excerpt: 'A landmark agreement brings state-of-the-art artificial intelligence infrastructure to our Engineering department.',
    image: UNSPLASH_PHOTOS.news1,
    date: 'Nov 12, 2025',
    path: '/news',
  },
  {
    id: 2,
    category: 'Events',
    title: 'Celebrating the Class of 2025: A Record Success',
    excerpt: 'The latest graduation ceremony saw our largest cohort yet, with 95% of graduates already placed in industry roles.',
    image: UNSPLASH_PHOTOS.news2,
    date: 'Jan 28, 2026',
    path: '/news',
  },
  {
    id: 3,
    category: 'Research',
    title: 'New Research Hub to Focus on Sustainable Energy',
    excerpt: 'PrideLands launches its multidisciplinary center focused on renewable solutions for sub-Saharan Africa.',
    image: UNSPLASH_PHOTOS.news3,
    date: 'May 15, 2026',
    path: '/news',
  },
]

export default function NewsSection() {
  return (
    <section className="section bg-white">
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
            <span className="section-eyebrow">Stay Informed</span>
            <h2 className="section-title mb-1">Latest News & Events</h2>
          </div>
          <Link
            to="/news"
            className="hidden sm:inline-flex items-center gap-2 text-navy-900 font-display font-600 text-sm hover:text-gold-600 transition-colors flex-shrink-0 group"
          >
            All News
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* News Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsItems.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="card group overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="badge-gold text-xs px-2.5 py-1">{item.category}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
                  <Calendar size={12} />
                  {item.date}
                </div>

                <h3 className="font-display font-700 text-navy-900 text-base leading-snug mb-2 group-hover:text-navy-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {item.excerpt}
                </p>

                <Link
                  to={item.path}
                  className="inline-flex items-center gap-1.5 text-navy-900 font-display font-600 text-sm hover:text-gold-600 transition-colors group/link"
                >
                  Read More
                  <ArrowRight size={13} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  )
}
