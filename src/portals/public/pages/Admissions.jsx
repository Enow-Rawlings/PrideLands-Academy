// FILE: src/portals/public/pages/Admissions.jsx

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, CheckCircle, FileText, Upload, ClipboardCheck,
  Mail, GraduationCap, Calendar, DollarSign, ChevronDown,
  Clock, Award, BookOpen, HelpCircle
} from 'lucide-react'
import { ADMISSION_STEPS, FAQS } from '@/lib/constants'
import { IMAGES, COLORS } from '@/lib/theme'
import { PROGRAMS_DATA } from '@/lib/programsData'

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

const STEP_ICONS = [FileText, Upload, ClipboardCheck, Mail, GraduationCap]

// Tuition table — derived from real programsData (single source of truth)
const TUITION_ROWS = PROGRAMS_DATA
  .filter((p) => !p.comingSoon)
  .slice(0, 8)
  .map((p) => ({ program: p.title, duration: p.duration, tuition: p.tuition, type: p.type }))

const CALENDAR = [
  { period: 'September Intake', applyBy: 'July 15',     starts: 'September 2', label: 'Main Intake' },
  { period: 'February Intake',  applyBy: 'December 10', starts: 'February 3',  label: 'Mid-Year Intake' },
  { period: 'June Intake',      applyBy: 'April 20',    starts: 'June 9',      label: 'Short Courses Only' },
]

const SCHOLARSHIPS = [
  { title: 'Merit Excellence Award',  desc: 'Up to 50% tuition reduction for top-scoring applicants.', icon: Award },
  { title: 'Need-Based Grant',        desc: 'Financial assistance assessed on documented household income.', icon: DollarSign },
  { title: 'PrideLands Legacy Grant', desc: 'For dependents of PrideLands Group employees and partners.', icon: GraduationCap },
]

function FaqItem({ faq, isOpen, onClick }) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={onClick} className="w-full flex items-center justify-between gap-4 py-5 text-left group">
        <span className="font-display font-600 text-navy-900 text-sm md:text-base group-hover:text-gold-600 transition-colors">
          {faq.question}
        </span>
        <ChevronDown size={18} className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-gold-500' : ''}`} />
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
            <p className="text-gray-500 text-sm leading-relaxed pb-5 pr-8">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Admissions() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div className="overflow-x-hidden">

      {/* 1. HERO */}
      <section className="relative min-h-[420px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.campus5} alt="Admissions" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy-900/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/70 to-transparent" />
        </div>
        <div className="relative z-10 container-academy px-4 md:px-8 py-24">
          <p className="text-white/50 text-xs mb-5">
            <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Admissions</span>
          </p>
          <FadeUp>
            <span className="section-eyebrow">Join PrideLands</span>
            <h1 className="font-display font-900 text-white leading-tight mb-5" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}>
              Your Path to Excellence<br />Starts Here
            </h1>
            <p className="text-white/70 text-base leading-relaxed mb-8 max-w-lg">
              Admissions for the next academic intake are open. Follow our simple 5-step process to begin your journey with PrideLands Academy.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/apply" className="inline-flex items-center gap-2 px-7 py-3.5 bg-gold-500 text-navy-900 font-display font-700 text-sm rounded-academy hover:bg-gold-400 transition-all active:scale-95">
                Start Application <ArrowRight size={15} />
              </Link>
              <Link to="#calendar" className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent text-white font-display font-600 text-sm rounded-academy border border-white/40 hover:bg-white/10 transition-all active:scale-95">
                View Academic Calendar
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 2. ADMISSION PROCESS — 5 steps */}
      <section className="section bg-white">
        <div className="container-academy px-4 md:px-8">
          <FadeUp className="text-center mb-14">
            <span className="section-eyebrow">How It Works</span>
            <h2 className="section-title">The Admission Process</h2>
            <p className="section-subtitle mx-auto">Five simple steps from application to enrollment.</p>
          </FadeUp>
          <div className="relative">
            <div className="hidden lg:block absolute top-9 left-0 right-0 h-px bg-gray-100" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {ADMISSION_STEPS.map((step, i) => {
                const Icon = STEP_ICONS[i] || FileText
                return (
                  <FadeUp key={step.step} delay={i * 0.1} className="flex flex-col items-center text-center">
                    <div className={`w-[72px] h-[72px] rounded-full flex items-center justify-center mb-5 z-10 shadow-md ${i % 2 === 0 ? 'bg-navy-900' : 'bg-gold-500'}`}>
                      <Icon size={26} className={i % 2 === 0 ? 'text-gold-400' : 'text-navy-900'} />
                    </div>
                    <span className="font-display font-800 text-gold-600 text-xs tracking-widest mb-1">STEP {step.step}</span>
                    <h3 className="font-display font-700 text-navy-900 text-sm mb-2">{step.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed max-w-[180px]">{step.description}</p>
                  </FadeUp>
                )
              })}
            </div>
          </div>
          <FadeUp delay={0.4} className="text-center mt-12">
            <Link to="/apply" className="inline-flex items-center gap-2 px-8 py-4 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all shadow-navy active:scale-95">
              Begin Your Application <ArrowRight size={16} />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* 3. ACADEMIC CALENDAR */}
      <section id="calendar" className="section-alt">
        <div className="container-academy px-4 md:px-8">
          <FadeUp className="text-center mb-12">
            <span className="section-eyebrow">Plan Ahead</span>
            <h2 className="section-title">Academic Calendar</h2>
            <p className="section-subtitle mx-auto">Key application and enrollment dates for the upcoming academic year.</p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CALENDAR.map((c, i) => (
              <FadeUp key={c.period} delay={i * 0.1}>
                <div className="card p-7 h-full relative overflow-hidden">
                  {i === 0 && (
                    <span className="absolute top-0 right-0 bg-gold-500 text-navy-900 text-xs font-display font-700 px-3 py-1 rounded-bl-lg">
                      Recommended
                    </span>
                  )}
                  <div className="w-12 h-12 rounded-xl bg-navy-900 flex items-center justify-center mb-5">
                    <Calendar size={20} className="text-gold-500" />
                  </div>
                  <p className="text-gold-600 text-xs font-display font-700 tracking-wider uppercase mb-1">{c.label}</p>
                  <h3 className="font-display font-700 text-navy-900 text-lg mb-4">{c.period}</h3>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between border-b border-gray-50 pb-2.5">
                      <span className="text-gray-400">Apply by</span>
                      <span className="font-display font-600 text-navy-900">{c.applyBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Classes start</span>
                      <span className="font-display font-600 text-navy-900">{c.starts}</span>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TUITION & FEES */}
      <section className="section bg-white">
        <div className="container-academy px-4 md:px-8">
          <FadeUp className="text-center mb-10">
            <span className="section-eyebrow">Investment in Your Future</span>
            <h2 className="section-title">Tuition & Fees</h2>
            <p className="section-subtitle mx-auto">Transparent pricing across our most popular programmes.</p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-card">
              <table className="w-full text-sm border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-navy-900">
                    <th className="text-left px-6 py-4 text-white font-display font-700 text-sm">Programme</th>
                    <th className="text-center px-6 py-4 text-white font-display font-700 text-sm">Award</th>
                    <th className="text-center px-6 py-4 text-white font-display font-700 text-sm">Duration</th>
                    <th className="text-right px-6 py-4 text-gold-400 font-display font-700 text-sm">Tuition</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {TUITION_ROWS.map((row, i) => (
                    <tr key={row.program} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-academy'}>
                      <td className="px-6 py-4 font-display font-600 text-navy-900 text-sm">{row.program}</td>
                      <td className="px-6 py-4 text-center text-gray-500 text-sm">{row.type}</td>
                      <td className="px-6 py-4 text-center text-gray-500 text-sm">{row.duration}</td>
                      <td className="px-6 py-4 text-right font-display font-700 text-navy-900 text-sm">{row.tuition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-xs mt-4 text-center">
              Tuition fees are quoted per academic year and exclude accommodation. Visit individual{' '}
              <Link to="/programs" className="text-navy-900 underline hover:text-gold-600">programme pages</Link>{' '}
              for full breakdowns.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* 5. SCHOLARSHIPS */}
      <section id="scholarships" className="py-20 bg-navy-900">
        <div className="container-academy px-4 md:px-8">
          <FadeUp className="text-center mb-12">
            <span className="section-eyebrow">Financial Support</span>
            <h2 className="section-title-light">Scholarships & Financial Aid</h2>
            <p className="section-subtitle-light mx-auto">We believe excellence should never be limited by financial circumstance.</p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SCHOLARSHIPS.map((s, i) => {
              const Icon = s.icon
              return (
                <FadeUp key={s.title} delay={i * 0.1}>
                  <div className="rounded-academy p-7 h-full border border-white/10 hover:border-gold-500/40 transition-colors duration-300" style={{ backgroundColor: COLORS.darkCard }}>
                    <div className="w-12 h-12 rounded-xl bg-gold-500/15 flex items-center justify-center mb-5">
                      <Icon size={20} className="text-gold-400" />
                    </div>
                    <h3 className="font-display font-700 text-white text-base mb-2">{s.title}</h3>
                    <p className="text-navy-300 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </FadeUp>
              )
            })}
          </div>
          <FadeUp delay={0.3} className="text-center mt-10">
            <Link to="/contact" className="inline-flex items-center gap-2 text-gold-400 font-display font-600 text-sm hover:text-gold-300 transition-colors group">
              Speak to Financial Aid Office <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* 6. REQUIRED DOCUMENTS */}
      <section className="section bg-white">
        <div className="container-academy px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <FadeUp>
              <span className="section-eyebrow">Get Prepared</span>
              <h2 className="section-title">Required Documents</h2>
              <p className="text-gray-500 text-base leading-relaxed mb-8">
                Have these ready before you start your online application to ensure a smooth and fast review process.
              </p>
              <div className="space-y-3">
                {[
                  'Completed online application form',
                  'Academic transcripts / certificates (WAEC, GCE, or equivalent)',
                  'Valid national ID or passport',
                  'Recent passport-sized photograph',
                  'Statement of purpose (for select programmes)',
                  'Proof of English proficiency (if applicable)',
                ].map((doc) => (
                  <div key={doc} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-gold-500 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{doc}</span>
                  </div>
                ))}
              </div>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div className="relative rounded-2xl overflow-hidden shadow-card-hover h-[400px]">
                <img src={IMAGES.campus3} alt="Document preparation" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold-500 flex items-center justify-center flex-shrink-0">
                      <Clock size={18} className="text-navy-900" />
                    </div>
                    <div>
                      <p className="font-display font-700 text-navy-900 text-sm">Average Review Time</p>
                      <p className="text-gray-500 text-xs">5 – 7 working days after submission</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="section-alt">
        <div className="container-academy px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <FadeUp className="lg:col-span-1">
              <span className="section-eyebrow">Questions?</span>
              <h2 className="section-title mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Can't find what you're looking for? Reach out to our admissions team directly.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-3 bg-navy-900 text-white font-display font-600 text-sm rounded-academy hover:bg-navy-800 transition-all">
                <HelpCircle size={15} /> Contact Admissions
              </Link>
            </FadeUp>
            <FadeUp delay={0.1} className="lg:col-span-2">
              <div className="card p-2 md:p-6">
                {FAQS.slice(0, 6).map((faq, i) => (
                  <FaqItem key={faq.question} faq={faq} isOpen={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? -1 : i)} />
                ))}
              </div>
              <Link to="/faq" className="inline-flex items-center gap-2 mt-5 text-navy-900 font-display font-600 text-sm hover:text-gold-600 transition-colors group">
                View All FAQs <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <section className="py-20 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 20% 50%, ${COLORS.secondary} 0%, transparent 50%), radial-gradient(circle at 80% 50%, ${COLORS.primaryLight} 0%, transparent 50%)` }} />
        <div className="relative z-10 container-academy px-4 md:px-8 text-center">
          <FadeUp>
            <h2 className="font-display font-900 text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              Your Future Starts With One Click
            </h2>
            <p className="text-white/65 text-base mb-10 max-w-xl mx-auto">
              Join the next generation of African leaders, innovators, and changemakers at PrideLands Academy.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/apply" className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 text-navy-900 font-display font-700 text-sm rounded-academy hover:bg-gold-400 hover:shadow-gold transition-all active:scale-95">
                Apply Now <ArrowRight size={15} />
              </Link>
              <Link to="/programs" className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white font-display font-600 text-sm rounded-academy border border-white/30 hover:bg-white/10 hover:border-white/60 transition-all active:scale-95">
                Browse Programs
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  )
}