import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn, Play } from 'lucide-react'
import { IMAGES, COLORS } from '@/lib/theme'

const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
)

// ─── DATA ──────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Campus', 'Events', 'Graduation', 'Labs', 'Sports', 'Culture']

const GALLERY_ITEMS = [
  { id: 1,  category: 'Campus',     title: 'Main Campus Entrance',        image: IMAGES.campus1,     type: 'photo' },
  { id: 2,  category: 'Labs',       title: 'Innovation & Tech Lab',       image: IMAGES.engineering, type: 'photo' },
  { id: 3,  category: 'Events',     title: 'Annual Career Fair 2024',     image: IMAGES.campus5,     type: 'photo' },
  { id: 4,  category: 'Graduation', title: 'Class of 2024 Ceremony',      image: IMAGES.news2,       type: 'photo' },
  { id: 5,  category: 'Campus',     title: 'Library & Study Centre',      image: IMAGES.campus3,     type: 'photo' },
  { id: 6,  category: 'Culture',    title: 'African Culture Gala 2024',   image: IMAGES.campus6,     type: 'photo' },
  { id: 7,  category: 'Labs',       title: 'Architecture Studio',         image: IMAGES.architecture,type: 'photo' },
  { id: 8,  category: 'Events',     title: 'Tech Hackathon 2024',         image: IMAGES.technology,  type: 'photo' },
  { id: 9,  category: 'Campus',     title: 'Student Lounge',              image: IMAGES.campus4,     type: 'photo' },
  { id: 10, category: 'Graduation', title: 'Valedictorian Address',       image: IMAGES.graduation,  type: 'photo' },
  { id: 11, category: 'Sports',     title: 'Inter-Campus Football Final', image: IMAGES.campus2,     type: 'photo' },
  { id: 12, category: 'Events',     title: 'Leadership Forum 2024',       image: IMAGES.news3,       type: 'photo' },
  { id: 13, category: 'Culture',    title: 'Cultural Arts Performance',   image: IMAGES.news1,       type: 'photo' },
  { id: 14, category: 'Labs',       title: 'Data Science Lab',            image: IMAGES.classroom,   type: 'photo' },
  { id: 15, category: 'Campus',     title: 'Campus Aerial View',          image: IMAGES.hero,        type: 'photo' },
  { id: 16, category: 'Sports',     title: 'Basketball Court',            image: IMAGES.campus1,     type: 'photo' },
]

// ─── Lightbox ──────────────────────────────────────────────────────
function Lightbox({ items, activeIndex, onClose, onPrev, onNext }) {
  const item = items[activeIndex]
  if (!item) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
      >
        <X size={20} />
      </button>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="max-w-4xl max-h-[85vh] mx-16 flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={item.image}
            alt={item.title}
            className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
          />
          <div className="mt-4 text-center">
            <p className="font-display font-700 text-white text-sm">{item.title}</p>
            <p className="text-white/50 text-xs mt-1">{activeIndex + 1} / {items.length}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext() }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
      >
        <ChevronRight size={22} />
      </button>

      {/* Thumbnail strip */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 overflow-x-auto max-w-[90vw] px-2">
        {items.map((it, i) => (
          <button
            key={it.id}
            onClick={(e) => { e.stopPropagation(); onNext(i) }}
            className={`w-12 h-9 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
              i === activeIndex ? 'border-gold-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-75'
            }`}
          >
            <img src={it.image} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Gallery grid item ─────────────────────────────────────────────
function GalleryItem({ item, index, onClick }) {
  // Give first item and every 7th item a larger span for visual rhythm
  const isLarge = index === 0 || index === 7

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.07 }}
      className={`relative group cursor-pointer rounded-xl overflow-hidden ${
        isLarge ? 'md:col-span-2 md:row-span-2' : ''
      }`}
      style={{ minHeight: isLarge ? '320px' : '200px' }}
      onClick={() => onClick(index)}
    >
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/55 transition-all duration-300 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            {item.type === 'video' ? <Play size={18} className="text-white" /> : <ZoomIn size={18} className="text-white" />}
          </div>
        </div>
      </div>

      {/* Category badge */}
      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-display font-600">
          {item.category}
        </span>
      </div>

      {/* Title bar bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-navy-900/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-white font-display font-600 text-xs">{item.title}</p>
      </div>
    </motion.div>
  )
}

// ─── PAGE ──────────────────────────────────────────────────────────
export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightboxIndex, setLightboxIndex]   = useState(null)

  const filtered = activeCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((i) => i.category === activeCategory)

  const openLightbox  = useCallback((index) => setLightboxIndex(index), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  const prevItem = useCallback(() =>
    setLightboxIndex((i) => (i - 1 + filtered.length) % filtered.length), [filtered.length])

  const nextItem = useCallback((index) =>
    setLightboxIndex(typeof index === 'number' ? index : (i) => (i + 1) % filtered.length), [filtered.length])

  // Keyboard navigation
  React.useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  prevItem()
      if (e.key === 'ArrowRight') nextItem()
      if (e.key === 'Escape')     closeLightbox()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIndex, prevItem, nextItem, closeLightbox])

  return (
    <div className="overflow-x-hidden">

      {/* ── 1. HERO ────────────────────────────────────────────── */}
      <section className="relative min-h-[320px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.campus4} alt="Gallery" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy-900/75" />
        </div>
        <div className="relative z-10 container-academy px-4 md:px-8 py-20">
          <p className="text-white/50 text-xs mb-5">
            <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Gallery</span>
          </p>
          <FadeUp>
            <span className="section-eyebrow">Photo & Video</span>
            <h1 className="font-display font-900 text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>
              Gallery
            </h1>
            <p className="text-white/70 text-base max-w-lg">
              A glimpse into life at PrideLands Academy — campus, events, graduation, and everything in between.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── 2. FILTER + GRID ───────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-academy px-4 md:px-8">

          {/* Category filter */}
          <FadeUp className="flex items-center gap-2 overflow-x-auto pb-2 mb-10 scrollbar-thin">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setLightboxIndex(null) }}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-display font-600 transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'bg-slate-academy text-navy-600 border border-gray-200 hover:border-navy-900 hover:text-navy-900'
                }`}
              >
                {cat}
                {cat !== 'All' && (
                  <span className="ml-1.5 opacity-60">
                    ({GALLERY_ITEMS.filter((i) => i.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </FadeUp>

          {/* Masonry-style grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[200px]"
            >
              {filtered.map((item, index) => (
                <GalleryItem
                  key={item.id}
                  item={item}
                  index={index}
                  onClick={openLightbox}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-sm">No items in this category yet.</p>
            </div>
          )}

          <FadeUp className="text-center mt-10">
            <p className="text-gray-400 text-xs">
              Click any image to view full size • Use arrow keys to navigate
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── 3. SUBMIT PHOTO CTA ────────────────────────────────── */}
      <section className="py-16 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `radial-gradient(circle at 70% 50%, ${COLORS.secondary} 0%, transparent 50%)` }} />
        <div className="relative z-10 container-academy px-4 md:px-8 text-center">
          <FadeUp>
            <h2 className="font-display font-800 text-white text-2xl md:text-3xl mb-3">
              Are You a PrideLands Student or Alumna?
            </h2>
            <p className="text-white/65 text-sm mb-8 max-w-md mx-auto">
              Share your campus moments with us. The best submissions get featured in our official gallery.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-gold-500 text-navy-900 font-display font-700 text-sm rounded-academy hover:bg-gold-400 hover:shadow-gold transition-all active:scale-95"
            >
              Submit Your Photos
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── LIGHTBOX ───────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            items={filtered}
            activeIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevItem}
            onNext={nextItem}
          />
        )}
      </AnimatePresence>

    </div>
  )
}
