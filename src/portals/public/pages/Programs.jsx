

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Clock, Award, CheckCircle, X,
  BookOpen, Users, Lightbulb, Briefcase, Globe, Target,
  Cpu, TrendingUp, Rocket, Star, GraduationCap, MapPin
} from 'lucide-react'
import { IMAGES, COLORS } from '@/lib/theme'
import { TABS, PROGRAMS_DATA as ALL_PROGRAMS } from '@/lib/programsData'

//  Fade-up wrapper 
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

//  DATA (imported from single source of truth — src/lib/programsData.js) 

const JOURNEY_STEPS = [
  { num: '01', title: 'Enroll',    desc: 'Identify your passion and join the academy.' },
  { num: '02', title: 'Learn',     desc: 'Immerse theory with global faculty.' },
  { num: '03', title: 'Practice',  desc: 'Hands-on work and real-world projects.' },
  { num: '04', title: 'Graduate',  desc: 'Obtain globally recognised accreditation.' },
  { num: '05', title: 'Employ',    desc: 'Direct placement with industry partners.' },
  { num: '06', title: 'Lead',      desc: 'Impact your community and industry.' },
]

const STANDOUT = [
  { icon: Star,       title: 'Elite Curriculum',   desc: 'Co-designed with top-league educators and industry leaders.' },
  { icon: Users,      title: 'Mentorship',          desc: 'Direct access to successful CEOs and innovators.' },
  { icon: Lightbulb, title: 'Innovation Labs',     desc: 'State-of-the-art facilities for research and prototyping.' },
  { icon: Briefcase,  title: 'Active Projects',    desc: 'Solve real business challenges during your studies.' },
  { icon: Globe,      title: 'Global Network',     desc: 'Join alumni connected with top institutions across 40+ countries.' },
  { icon: Target,     title: 'Career Support',     desc: 'Lifelong career coaching and placement assistance.' },
]

const COMPARISON_ROWS = [
  { feature: 'Typical Duration',     degree: '3 – 4 Years',        cert: '6 – 12 Months',  exec: '2 – 6 Weeks' },
  { feature: 'Certification',        degree: 'Honours Degree',     cert: 'Industry Badge',  exec: 'Certificate' },
  { feature: 'Study Mode',          degree: 'On-Campus / Hybrid', cert: 'Hybrid / Online', exec: 'Intensive / Online' },
  { feature: 'Internship Included', degree: true,                  cert: true,              exec: false },
]

const QUICK_LINKS = [
  { icon: BookOpen,      title: 'Admissions Guide',     desc: 'Everything you need to know about the enrolment process.', path: '/admissions' },
  { icon: GraduationCap,title: 'Online Application',   desc: 'Start your digital application profile today.', path: '/apply' },
  { icon: MapPin,        title: 'Campus Life',          desc: 'Explore the vibrant community waiting for you.', path: '/student-life' },
]

const PAGE_STATS = [
  { value: '24+',  label: 'Active Programs' },
  { value: '89%',  label: 'Partner Employment' },
  { value: '150+', label: 'Global Mentors' },
  { value: '12+',  label: 'Specialised Certs' },
]

// ── PROGRAM CARD ─────────────────────────────────────────────────
function ProgramCard({ program, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, delay: i * 0.1 }}
      className="card overflow-hidden flex flex-col group"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={program.image}
          alt={program.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {program.comingSoon && (
          <div className="absolute inset-0 bg-navy-900/60 flex items-center justify-center">
            <span className="font-display font-700 text-white text-sm tracking-wider">Coming 2026</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-white text-xs font-display font-600 ${program.badgeColor}`}>
            {program.badge}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-700 text-navy-900 text-base leading-snug mb-2">{program.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">{program.desc}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
          <span className="flex items-center gap-1"><Clock size={12} /> {program.duration}</span>
          <span className="flex items-center gap-1"><Award size={12} /> {program.type}</span>
        </div>

        {/* Actions */}
        {!program.comingSoon ? (
          <div className="flex gap-2">
            <Link to="/apply" className="flex-1 text-center py-2.5 bg-navy-900 text-white font-display font-600 text-xs rounded-lg hover:bg-navy-800 transition-colors active:scale-95">
              Apply
            </Link>
            <Link to={program.path} className="flex-1 text-center py-2.5 border border-gray-200 text-navy-700 font-display font-600 text-xs rounded-lg hover:border-navy-900 hover:text-navy-900 transition-colors">
              Details
            </Link>
          </div>
        ) : (
          <button disabled className="w-full py-2.5 bg-gray-100 text-gray-400 font-display font-600 text-xs rounded-lg cursor-not-allowed">
            Notify Me When Open
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ── PAGE ─────────────────────────────────────────────────────────
export default function Programs() {
  const [activeTab, setActiveTab] = useState(TABS[0])
  const filtered = ALL_PROGRAMS.filter((p) => p.tab === activeTab)

  return (
    <div className="overflow-x-hidden">

      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[480px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.classroom || IMAGES.campus1} alt="Programs" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy-900/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/60 to-transparent" />
        </div>

        {/* Watermark text */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
          <span className="font-display font-900 text-white/[0.04] whitespace-nowrap"
            style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', letterSpacing: '0.15em' }}>
            INNOVATE · LEAD · TRANSFORM
          </span>
        </div>

        <div className="relative z-10 container-academy px-4 md:px-8 py-28">
          {/* Breadcrumb */}
          <p className="text-white/50 text-xs mb-6">
            <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Programs</span>
          </p>

          <FadeUp>
            <span className="inline-block px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-400 text-xs font-display font-700 tracking-widest uppercase mb-5">
              World-Class Education
            </span>
            <h1 className="font-display font-900 text-white leading-tight mb-5"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>
              Programs Designed For<br />Africa's Future Leaders
            </h1>
            <p className="text-white/70 text-base leading-relaxed mb-8 max-w-lg">
              Empowering students through industry-relevant curricula, practical innovation labs, and mentorship from global thought leaders in technology and business.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link to="/programs#explore" className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-navy-900 font-display font-700 text-sm rounded-academy hover:bg-gold-400 transition-all active:scale-95">
                Explore Programs <ArrowRight size={15} />
              </Link>
              <Link to="/apply" className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-white font-display font-600 text-sm rounded-academy border border-white/40 hover:bg-white/10 transition-all active:scale-95">
                Apply Now
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-5">
              {[
                { icon: Target,  label: 'Career-Focused' },
                { icon: Briefcase, label: 'Industry Partners' },
                { icon: Award,   label: 'Global Accreditation' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-white/65 text-xs font-display font-500">
                  <Icon size={14} className="text-gold-400" />
                  {label}
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 2. EXCELLENCE THROUGH INNOVATION ───────────────────── */}
      <section className="section bg-white">
        <div className="container-academy px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <FadeUp>
              <h2 className="section-title">Excellence Through<br />Practical Innovation</h2>
              <p className="text-gray-500 text-base leading-relaxed mb-8">
                At PrideLands Academy, we bridge the gap between theory and practice. Our curriculum is co-designed with top industry experts to ensure our graduates are ready to lead from day one. We focus on critical thinking, ethical leadership, and technological fluency.
              </p>
              {/* Mini stats grid */}
              <div className="grid grid-cols-2 gap-4">
                {PAGE_STATS.map((s) => (
                  <div key={s.label} className="p-4 rounded-xl bg-slate-academy border border-gray-100">
                    <p className="font-display font-900 text-navy-900 text-2xl leading-none mb-1">{s.value}</p>
                    <p className="text-gray-400 text-xs font-body">{s.label}</p>
                  </div>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="relative rounded-2xl overflow-hidden shadow-card-hover h-[400px]">
                <img src={IMAGES.campus2} alt="Innovation" className="w-full h-full object-cover" />
                <div className="absolute bottom-5 right-5 bg-gold-500 text-navy-900 rounded-xl px-4 py-3 shadow-gold">
                  <p className="font-display font-700 text-sm leading-snug">Ranked #1 for Innovation</p>
                  <p className="font-body text-xs mt-0.5 opacity-80">in Education 2023</p>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── 3. EXPLORE ACADEMIC PATHWAYS ────────────────────────── */}
      <section id="explore" className="section-alt">
        <div className="container-academy px-4 md:px-8">
          <FadeUp className="text-center mb-10">
            <span className="section-eyebrow">Find Your Path</span>
            <h2 className="section-title">Explore Academic Pathways</h2>
            <p className="section-subtitle mx-auto">Find the program that aligns with your professional ambition.</p>
          </FadeUp>

          {/* Tab row */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-8 scrollbar-thin">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-lg text-sm font-display font-600 transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'text-navy-600 hover:text-navy-900 hover:bg-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Program cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((program, i) => (
                <ProgramCard key={program.id} program={program} i={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── 4. JOURNEY TO LEADERSHIP ────────────────────────────── */}
      <section className="py-20 bg-navy-900">
        <div className="container-academy px-4 md:px-8">
          <FadeUp className="text-center mb-14">
            <h2 className="section-title-light">Your Journey to Leadership</h2>
            <p className="section-subtitle-light mx-auto">
              A structured pathway designed to evolve you from an aspiring learner to a global industry leader.
            </p>
          </FadeUp>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-white/10" />
            <motion.div
              className="hidden lg:block absolute top-8 left-0 h-px bg-gold-500 origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.2, ease: 'easeInOut' }}
              style={{ right: 0 }}
            />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {JOURNEY_STEPS.map((s, i) => (
                <FadeUp key={s.num} delay={i * 0.1} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gold-500 flex items-center justify-center font-display font-800 text-navy-900 text-lg mb-4 z-10 shadow-gold">
                    {s.num}
                  </div>
                  <p className="font-display font-700 text-white text-sm mb-1.5">{s.title}</p>
                  <p className="text-navy-300 text-xs leading-relaxed max-w-[120px]">{s.desc}</p>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. WHY OUR PROGRAMS STAND OUT ───────────────────────── */}
      <section className="section bg-white">
        <div className="container-academy px-4 md:px-8">
          <FadeUp className="text-center mb-12">
            <h2 className="section-title">Why Our Programs Stand Out</h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {STANDOUT.map((item, i) => {
              const Icon = item.icon
              return (
                <FadeUp key={item.title} delay={i * 0.08}>
                  <div className="flex gap-4 p-5 rounded-academy border border-gray-100 hover:border-gold-500/40 hover:shadow-card transition-all duration-200 group">
                    <div className="w-10 h-10 rounded-lg bg-navy-900 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500 transition-colors duration-300">
                      <Icon size={18} className="text-gold-500 group-hover:text-navy-900 transition-colors duration-300" />
                    </div>
                    <div>
                      <p className="font-display font-700 text-navy-900 text-sm mb-1">{item.title}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 6. PROGRAM COMPARISON TABLE ─────────────────────────── */}
      <section className="section-alt">
        <div className="container-academy px-4 md:px-8">
          <FadeUp className="text-center mb-10">
            <span className="section-eyebrow">Compare Options</span>
            <h2 className="section-title">Program Comparison</h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-card">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-navy-900">
                    <th className="text-left px-6 py-4 text-white font-display font-700 text-sm">Program Feature</th>
                    <th className="text-center px-6 py-4 text-white font-display font-700 text-sm">Full Degree</th>
                    <th className="text-center px-6 py-4 text-gold-400 font-display font-700 text-sm">Professional Cert</th>
                    <th className="text-center px-6 py-4 text-white font-display font-700 text-sm">Executive Short Course</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {COMPARISON_ROWS.map((row, i) => (
                    <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-academy'}>
                      <td className="px-6 py-4 font-display font-600 text-navy-900 text-sm">{row.feature}</td>
                      {[row.degree, row.cert, row.exec].map((val, j) => (
                        <td key={j} className="px-6 py-4 text-center">
                          {typeof val === 'boolean' ? (
                            val
                              ? <CheckCircle size={18} className="text-gold-500 mx-auto" />
                              : <X size={18} className="text-gray-300 mx-auto" />
                          ) : (
                            <span className="text-gray-600 text-sm">{val}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 7. CTA BANNER ───────────────────────────────────────── */}
      <section className="py-16 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `radial-gradient(circle at 10% 50%, ${COLORS.secondary} 0%, transparent 50%)` }} />
        <div className="relative z-10 container-academy px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <FadeUp className="max-w-xl">
              <h2 className="font-display font-800 text-white text-2xl md:text-3xl leading-tight mb-2">
                Ready to shape your future?
              </h2>
              <p className="text-white/65 text-sm leading-relaxed">
                Admissions are currently open for the 2026 academic year. Speak with our experts to find the right path for you.
              </p>
            </FadeUp>
            <FadeUp delay={0.1} className="flex flex-wrap gap-3 flex-shrink-0">
              <Link to="/apply" className="inline-flex items-center gap-2 px-7 py-3.5 bg-gold-500 text-navy-900 font-display font-700 text-sm rounded-academy hover:bg-gold-400 transition-all active:scale-95">
                Apply Now <ArrowRight size={15} />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent text-white font-display font-600 text-sm rounded-academy border border-white/40 hover:bg-white/10 transition-all active:scale-95">
                Speak To Admissions
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── 8. QUICK LINKS  */}
      <section className="section bg-white">
        <div className="container-academy px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {QUICK_LINKS.map((item, i) => {
              const Icon = item.icon
              return (
                <FadeUp key={item.title} delay={i * 0.1}>
                  <Link to={item.path} className="card p-6 flex gap-4 group hover:-translate-y-1 transition-transform duration-300">
                    <div className="w-12 h-12 rounded-xl bg-navy-900 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500 transition-colors duration-300">
                      <Icon size={20} className="text-gold-500 group-hover:text-navy-900 transition-colors duration-300" />
                    </div>
                    <div>
                      <p className="font-display font-700 text-navy-900 text-sm mb-1 group-hover:text-gold-600 transition-colors">{item.title}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </Link>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

    </div>
  )
}

//cyber