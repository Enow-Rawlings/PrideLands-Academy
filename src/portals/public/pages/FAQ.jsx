

import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, Search, HelpCircle, MessageCircle,
  ArrowRight, Phone
} from 'lucide-react'
import { FAQS_BY_CATEGORY, FAQ_CATEGORIES, FAQS } from '@/lib/constants'
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

// ─── Single accordion item ──────────────────────────────────────────
function FaqItem({ faq, isOpen, onClick, highlight = '' }) {
  // Highlight matching search text
  const highlightText = (text) => {
    if (!highlight.trim()) return text
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase()
        ? <mark key={i} className="bg-gold-500/30 text-navy-900 rounded px-0.5">{part}</mark>
        : part
    )
  }

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onClick}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span className="font-display font-600 text-navy-900 text-sm md:text-base group-hover:text-gold-600 transition-colors leading-snug">
          {highlightText(faq.question)}
        </span>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 ${
          isOpen ? 'bg-gold-500' : 'bg-gray-100 group-hover:bg-gray-200'
        }`}>
          <ChevronDown
            size={14}
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-navy-900' : 'text-gray-500'}`}
          />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-gray-500 text-sm leading-relaxed pb-5 pr-8">
              {highlightText(faq.answer)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Category accordion group ───────────────────────────────────────
function FaqGroup({ category, faqs, openId, setOpenId, searchQuery }) {
  if (faqs.length === 0) return null
  return (
    <FadeUp className="mb-8">
      <div className="mb-4 flex items-center gap-3">
        <span className="block w-4 h-1 bg-gold-500 rounded-full" />
        <h3 className="font-display font-700 text-navy-900 text-base">{category}</h3>
        <span className="text-gray-400 text-xs">({faqs.length})</span>
      </div>
      <div className="card divide-y divide-gray-50 px-6">
        {faqs.map((faq, i) => {
          const id = `${category}-${i}`
          return (
            <FaqItem
              key={id}
              faq={faq}
              isOpen={openId === id}
              onClick={() => setOpenId(openId === id ? null : id)}
              highlight={searchQuery}
            />
          )
        })}
      </div>
    </FadeUp>
  )
}

// ─── PAGE ────────────────────────────────────────────────────────────
export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery]       = useState('')
  const [openId, setOpenId]                 = useState('Admissions-0') // open first by default

  // Compute filtered questions
  const filteredByCategory = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    const result = {}

    const categories = activeCategory === 'All'
      ? Object.keys(FAQS_BY_CATEGORY)
      : [activeCategory]

    categories.forEach((cat) => {
      const items = FAQS_BY_CATEGORY[cat] || []
      result[cat] = query
        ? items.filter(
            (f) =>
              f.question.toLowerCase().includes(query) ||
              f.answer.toLowerCase().includes(query)
          )
        : items
    })
    return result
  }, [activeCategory, searchQuery])

  const totalResults = Object.values(filteredByCategory).flat().length
  const hasResults   = totalResults > 0

  return (
    <div className="overflow-x-hidden">

      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[320px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.campus3} alt="FAQ" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy-900/78" />
        </div>
        <div className="relative z-10 container-academy px-4 md:px-8 py-20">
          <p className="text-white/50 text-xs mb-5">
            <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">FAQ</span>
          </p>
          <FadeUp>
            <span className="section-eyebrow">Quick Answers</span>
            <h1 className="font-display font-900 text-black leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>
              Frequently Asked Questions
            </h1>
            <p className="text-white/70 text-black max-w-lg mb-8">
              Find answers to common questions about admissions, programmes, tuition, and campus life.
            </p>
            {/* Hero search */}
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setActiveCategory('All') }}
                className="w-full pl-11 pr-4 py-3.5 rounded-academy bg-white text-navy-900 text-sm font-body placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy-900 text-xs font-display font-600"
                >
                  Clear
                </button>
              )}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 2. STATS BAR ────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-academy px-4 md:px-8 py-5">
          <div className="flex flex-wrap items-center gap-6">
            {[
              { value: FAQS.length + '+', label: 'Questions answered' },
              { value: Object.keys(FAQS_BY_CATEGORY).length, label: 'Topic categories' },
              { value: '24h', label: 'Average response time' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="font-display font-800 text-navy-900 text-lg">{s.value}</span>
                <span className="text-gray-400 text-xs">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. MAIN CONTENT ─────────────────────────────────────── */}
      <section className="section bg-slate-academy">
        <div className="container-academy px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

            {/* Sidebar — category nav */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-2">
                <p className="font-display font-700 text-navy-900 text-xs uppercase tracking-widest mb-4">
                  Browse by Topic
                </p>
                {FAQ_CATEGORIES.map((cat) => {
                  const count = cat === 'All'
                    ? FAQS.length
                    : (FAQS_BY_CATEGORY[cat] || []).length
                  return (
                    <button
                      key={cat}
                      onClick={() => { setActiveCategory(cat); setSearchQuery('') }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-academy text-sm font-display font-600 transition-all duration-200 ${
                        activeCategory === cat && !searchQuery
                          ? 'bg-navy-900 text-white'
                          : 'text-navy-600 hover:bg-white hover:text-navy-900'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        activeCategory === cat && !searchQuery
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {count}
                      </span>
                    </button>
                  )
                })}

                {/* Contact cards */}
                <div className="pt-6 space-y-3">
                  <a
                    href={`https://wa.me/${'+237000000000'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-academy border border-[#25D366]/40 bg-[#25D366]/5 hover:bg-[#25D366]/10 transition-colors"
                  >
                    <Phone size={15} className="text-[#25D366]" />
                    <div>
                      <p className="font-display font-600 text-navy-900 text-xs">WhatsApp Us</p>
                      <p className="text-gray-400 text-xs">Fastest response</p>
                    </div>
                  </a>
                  <Link
                    to="/contact"
                    className="flex items-center gap-3 p-3 rounded-academy border border-gray-200 bg-white hover:border-navy-900 transition-colors"
                  >
                    <MessageCircle size={15} className="text-navy-900" />
                    <div>
                      <p className="font-display font-600 text-navy-900 text-xs">Email Support</p>
                      <p className="text-gray-400 text-xs">24–48h reply</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Main — FAQ accordions */}
            <div className="lg:col-span-3">

              {/* Search result header */}
              {searchQuery && (
                <FadeUp className="mb-6 p-4 rounded-academy bg-white border border-gray-100">
                  <p className="text-navy-900 text-sm font-display font-600">
                    {hasResults
                      ? <>{totalResults} result{totalResults !== 1 ? 's' : ''} for <span className="text-gold-600">"{searchQuery}"</span></>
                      : <>No results for <span className="text-crimson-600">"{searchQuery}"</span></>
                    }
                  </p>
                </FadeUp>
              )}

              {/* FAQ groups */}
              {hasResults ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory + searchQuery}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {Object.entries(filteredByCategory).map(([cat, faqs]) => (
                      <FaqGroup
                        key={cat}
                        category={cat}
                        faqs={faqs}
                        openId={openId}
                        setOpenId={setOpenId}
                        searchQuery={searchQuery}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <FadeUp className="text-center py-20 card">
                  <HelpCircle size={40} className="text-gray-300 mx-auto mb-4" />
                  <p className="font-display font-700 text-navy-900 text-base mb-2">No results found</p>
                  <p className="text-gray-400 text-sm mb-5">
                    Try different keywords or browse by category.
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setActiveCategory('All') }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 text-white font-display font-600 text-sm rounded-academy hover:bg-navy-800 transition-all"
                  >
                    Clear Search
                  </button>
                </FadeUp>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. STILL HAVE QUESTIONS ─────────────────────────────── */}
      <section className="py-16 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `radial-gradient(circle at 30% 50%, ${COLORS.secondary} 0%, transparent 50%)` }} />
        <div className="relative z-10 container-academy px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <FadeUp>
              <HelpCircle size={36} className="text-gold-500 mx-auto mb-4" />
              <h2 className="font-display font-800 text-white text-2xl md:text-3xl mb-3">
                Still Have Questions?
              </h2>
              <p className="text-white/65 text-sm mb-8 max-w-lg mx-auto">
                Can't find what you're looking for? Our admissions team is happy to help you directly.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-gold-500 text-navy-900 font-display font-700 text-sm rounded-academy hover:bg-gold-400 hover:shadow-gold transition-all active:scale-95"
                >
                  Contact Us <ArrowRight size={15} />
                </Link>
                <Link
                  to="/admissions"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent text-white font-display font-600 text-sm rounded-academy border border-white/40 hover:bg-white/10 transition-all active:scale-95"
                >
                  Admissions Guide
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

    </div>
  )
}

