import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ArrowRight, Search, Tag } from 'lucide-react'
import { IMAGES } from '@/lib/theme'

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

// ─── DATA ───────────────────────────────────────────────────────────
// When Firebase is integrated, replace this with a real Firestore fetch
const CATEGORIES = ['All', 'News', 'Events', 'Research', 'Partnership', 'Student Stories']

const ALL_ARTICLES = [
  {
    id: 1,
    category: 'Partnership',
    title: 'Academy Partners with Global Tech Giant for AI Research Lab',
    excerpt: 'A landmark agreement brings state-of-the-art artificial intelligence infrastructure to our Engineering department, enabling students to work on real-world AI projects.',
    body: 'Full article content here...',
    image: IMAGES.news1,
    date: 'November 12, 2024',
    dateISO: '2024-11-12',
    author: 'PrideLands Communications',
    readTime: '3 min read',
    featured: true,
  },
  {
    id: 2,
    category: 'Events',
    title: 'Celebrating the Class of 2024: A Record-Breaking Graduation',
    excerpt: 'Our largest graduation ceremony yet, with over 400 graduates and 95% already placed in industry roles across 12 African countries.',
    image: IMAGES.news2,
    date: 'October 28, 2024',
    dateISO: '2024-10-28',
    author: 'Student Affairs Office',
    readTime: '4 min read',
    featured: true,
  },
  {
    id: 3,
    category: 'Research',
    title: 'New Research Hub to Focus on Sustainable Energy Solutions',
    excerpt: 'PrideLands launches its multidisciplinary center focused on renewable energy solutions for sub-Saharan Africa, backed by international funding.',
    image: IMAGES.news3,
    date: 'October 15, 2024',
    dateISO: '2024-10-15',
    author: 'Research Office',
    readTime: '5 min read',
    featured: false,
  },
  {
    id: 4,
    category: 'Student Stories',
    title: "From PrideLands to Silicon Valley: Amara's Journey",
    excerpt: 'Class of 2023 alumna Amara Diallo shares how her BSc in AI at PrideLands Academy landed her a role at a leading US-based tech firm.',
    image: IMAGES.campus2,
    date: 'October 5, 2024',
    dateISO: '2024-10-05',
    author: 'Alumni Relations',
    readTime: '6 min read',
    featured: false,
  },
  {
    id: 5,
    category: 'News',
    title: 'PrideLands Academy Achieves International Accreditation Milestone',
    excerpt: 'We are proud to announce our programmes have received provisional recognition from an international accreditation body, a major step towards global standing.',
    image: IMAGES.campus3,
    date: 'September 20, 2024',
    dateISO: '2024-09-20',
    author: 'Executive Office',
    readTime: '3 min read',
    featured: false,
  },
  {
    id: 6,
    category: 'Events',
    title: 'Annual Career Fair 2024: 60+ Employers on Campus',
    excerpt: 'Students and recent graduates connect with top African and international companies at our biggest career fair to date.',
    image: IMAGES.campus5,
    date: 'September 10, 2024',
    dateISO: '2024-09-10',
    author: 'Career Services',
    readTime: '2 min read',
    featured: false,
  },
  {
    id: 7,
    category: 'Partnership',
    title: 'PrideLands Signs MOU with East African University Network',
    excerpt: 'A new student exchange and joint research agreement will allow students from both institutions to study across borders.',
    image: IMAGES.campus6,
    date: 'August 22, 2024',
    dateISO: '2024-08-22',
    author: 'Partnerships Office',
    readTime: '3 min read',
    featured: false,
  },
  {
    id: 8,
    category: 'Research',
    title: 'Faculty Publishes Groundbreaking Study on African FinTech Adoption',
    excerpt: 'Dr. Kwame Asante and his team publish a landmark paper on mobile money adoption patterns across 8 African nations in a top peer-reviewed journal.',
    image: IMAGES.campus4,
    date: 'August 8, 2024',
    dateISO: '2024-08-08',
    author: 'Research Office',
    readTime: '4 min read',
    featured: false,
  },
  {
    id: 9,
    category: 'News',
    title: 'Applications Now Open for the September 2025 Intake',
    excerpt: 'Prospective students can now apply online for our full range of programmes starting September 2025. Limited seats available.',
    image: IMAGES.hero,
    date: 'July 30, 2024',
    dateISO: '2024-07-30',
    author: 'Admissions Office',
    readTime: '2 min read',
    featured: false,
  },
]

const CATEGORY_COLORS = {
  'News':           'bg-navy-900/10 text-navy-900',
  'Events':         'bg-gold-500/15 text-gold-700',
  'Research':       'bg-blue-100 text-blue-700',
  'Partnership':    'bg-emerald-100 text-emerald-700',
  'Student Stories':'bg-purple-100 text-purple-700',
}

// ─── Article Card ────────────────────────────────────────────────────
function ArticleCard({ article, i, large = false }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: i * 0.08 }}
      className={`card overflow-hidden group flex ${large ? 'flex-col md:flex-row' : 'flex-col'} h-full`}
    >
      {/* Image */}
      <div className={`overflow-hidden flex-shrink-0 ${large ? 'md:w-2/5 h-56 md:h-auto' : 'h-48'}`}>
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className={`flex flex-col flex-1 ${large ? 'p-7' : 'p-5'}`}>
        {/* Meta row */}
        <div className="flex items-center gap-3 mb-3">
          <span className={`badge text-xs px-2.5 py-1 ${CATEGORY_COLORS[article.category] || 'bg-gray-100 text-gray-600'}`}>
            {article.category}
          </span>
          <span className="text-gray-400 text-xs flex items-center gap-1">
            <Calendar size={11} /> {article.date}
          </span>
        </div>

        <h3 className={`font-display font-700 text-navy-900 leading-snug mb-2 group-hover:text-navy-700 transition-colors ${large ? 'text-xl mb-3' : 'text-base'}`}>
          {article.title}
        </h3>
        <p className={`text-gray-500 leading-relaxed flex-1 ${large ? 'text-sm mb-5' : 'text-xs mb-4 line-clamp-3'}`}>
          {article.excerpt}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <span className="text-gray-400 text-xs">{article.readTime}</span>
          <Link
            to={`/news/${article.id}`}
            className="inline-flex items-center gap-1.5 text-navy-900 font-display font-600 text-xs hover:text-gold-600 transition-colors group/link"
          >
            Read More <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

// ─── PAGE ────────────────────────────────────────────────────────────
export default function News() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const featured = ALL_ARTICLES.filter((a) => a.featured)
  const filtered = ALL_ARTICLES.filter((a) => {
    const matchCat = activeCategory === 'All' || a.category === activeCategory
    const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        a.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch && !a.featured
  })

  return (
    <div className="overflow-x-hidden">

      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[320px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.campus6} alt="News & Events" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy-900/78" />
        </div>
        <div className="relative z-10 container-academy px-4 md:px-8 py-20">
          <p className="text-white/50 text-xs mb-5">
            <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">News & Events</span>
          </p>
          <FadeUp>
            <span className="section-eyebrow">Stay Informed</span>
            <h1 className="font-display font-900 text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>
              News & Events
            </h1>
            <p className="text-white/70 text-base max-w-lg">
              The latest updates, achievements, and events from PrideLands Academy and our community.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── 2. FEATURED ARTICLES ────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-academy px-4 md:px-8">
          <FadeUp className="mb-10">
            <span className="section-eyebrow">Top Stories</span>
            <h2 className="section-title">Featured</h2>
          </FadeUp>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featured.map((article, i) => (
              <ArticleCard key={article.id} article={article} i={i} large />
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. ALL ARTICLES + FILTERS ───────────────────────────── */}
      <section className="section-alt">
        <div className="container-academy px-4 md:px-8">

          {/* Filter bar */}
          <FadeUp className="flex flex-col sm:flex-row gap-4 mb-10">
            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-1 scrollbar-thin">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-display font-600 transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-navy-900 text-white'
                      : 'bg-white text-navy-600 border border-gray-200 hover:border-navy-900 hover:text-navy-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-shrink-0">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-9 w-full sm:w-56 py-2 text-xs"
              />
            </div>
          </FadeUp>

          {/* Results */}
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key={activeCategory + searchQuery}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filtered.map((article, i) => (
                  <ArticleCard key={article.id} article={article} i={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Tag size={36} className="text-gray-300 mx-auto mb-4" />
                <p className="font-display font-600 text-navy-900 text-base mb-1">No articles found</p>
                <p className="text-gray-400 text-sm">Try a different category or search term.</p>
                <button
                  onClick={() => { setActiveCategory('All'); setSearchQuery('') }}
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 text-white font-display font-600 text-sm rounded-academy hover:bg-navy-800 transition-all"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Load more placeholder */}
          {filtered.length > 0 && (
            <FadeUp className="text-center mt-12">
              <button className="inline-flex items-center gap-2 px-7 py-3 border border-gray-200 text-navy-700 font-display font-600 text-sm rounded-academy hover:border-navy-900 hover:text-navy-900 transition-all">
                Load More Articles <ArrowRight size={14} />
              </button>
            </FadeUp>
          )}

        </div>
      </section>

      {/* ── 4. NEWSLETTER SIGNUP ────────────────────────────────── */}
      <section className="py-16 bg-navy-900">
        <div className="container-academy px-4 md:px-8">
          <FadeUp className="max-w-2xl mx-auto text-center">
            <span className="section-eyebrow">Never Miss an Update</span>
            <h2 className="section-title-light mb-3">Subscribe to Our Newsletter</h2>
            <p className="section-subtitle-light mx-auto mb-8">
              Get the latest news, events, and announcements delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="input flex-1 bg-white/10 border-white/20 text-white placeholder:text-navy-400 focus:border-gold-500"
              />
              <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 text-navy-900 font-display font-700 text-sm rounded-academy hover:bg-gold-400 transition-all active:scale-95 flex-shrink-0">
                Subscribe
              </button>
            </div>
            <p className="text-navy-400 text-xs mt-4">No spam. Unsubscribe at any time.</p>
          </FadeUp>
        </div>
      </section>

    </div>
  )
}
