

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Linkedin, Twitter, Mail, ArrowRight,
  Quote, ChevronLeft, ChevronRight, Star
} from 'lucide-react'
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

// ─── DATA 
// Replace placeholder names/titles with real staff when available

const EXECUTIVE = [
  {
    id: 'director',
    name: 'Dr. Mbi Vahid',
    title: 'Executive Director',
    dept: 'Executive Office',
    image: IMAGES.director,
    bio: 'Dr. Mbi Vahid is a Pan-African educator and entrepreneur with over 20 years of experience in higher education leadership. He founded PrideLands Academy with a vision to create a world-class institution rooted in African values and global standards. He holds a PhD in Educational Leadership from the University of Ghana and has served as an advisor to several African governments on education policy.',
    quote: 'We don\'t just educate students — we equip a generation of Africans to lead, build, and transform the continent.',
    linkedin: '#',
    twitter: '#',
    email: 'director@pridelandsacademy.com',
    achievements: ['PhD in Educational Leadership', '20+ Years in Higher Education', 'UNESCO Education Advisor'],
  },
  {
    id: 'academic-director',
    name: 'Prof. Queenta Lois',
    title: 'Director of Academic Affairs',
    dept: 'Academic Office',
    image: IMAGES.team2,
    bio: 'Prof. Owusu oversees all academic programmes, curriculum development, and faculty management at PrideLands Academy. She brings deep expertise in curriculum design from her 15 years in West African higher education institutions and her international research in pedagogy.',
    quote: 'Our curriculum is built for tomorrow\'s Africa — rigorous, relevant, and unapologetically innovative.',
    linkedin: '#',
    twitter: '#',
    email: 'academic@pridelandsacademy.com',
    achievements: ['MSc Curriculum Design, London', '15+ Years Academia', 'Published Researcher'],
  },
  {
    id: 'admin-director',
    name: 'Mr. Jean-Baptiste Ndongo',
    title: 'Director of Administration',
    dept: 'Administration',
    image: IMAGES.team3,
    bio: 'Mr. Ndongo manages the day-to-day operational excellence of the academy — from student services and facilities to partnerships and institutional compliance. His background spans corporate operations and public sector administration across Central Africa.',
    quote: 'A great institution is built on systems that are invisible to students — they simply experience excellence.',
    linkedin: '#',
    twitter: null,
    email: 'admin@pridelandsacademy.com',
    achievements: ['MBA, ESSEC Business School', 'Certified Project Manager', '12 Years Operations Leadership'],
  },
]

const FACULTY = [
  {
    name: 'Engr. Enow Rawlings',
    title: 'Head of Technology & AI',
    dept: 'Faculty of Technology',
    image: IMAGES.team1,
    linkedin: '#',
    email: 'e.rawlings@pridelandsacademy.com',
  },
  {
    name: 'Dr. Fatima Al-Hassan',
    title: 'Head of Business Studies',
    dept: 'Faculty of Business',
    image: IMAGES.team4,
    linkedin: '#',
    email: 'f.alhassan@pridelandsacademy.com',
  },
  {
    name: 'Miss. Sakwe Welisane',
    title: 'Head of Entrepreneurship',
    dept: 'Faculty of Entrepreneurship',
    image: IMAGES.team5,
    linkedin: '#',
    email: 's.welisane@pridelandsacademy.com',
  },
  {
    name: 'Dr. Desmond Kobby',
    title: 'Head of Professional Development',
    dept: 'Professional Studies',
    image: IMAGES.team7,
    linkedin: '#',
    email: 'd.kobby@pridelandsacademy.com',
  },
  {
    name: 'Mr. Samuel Touré',
    title: 'Director of Career Services',
    dept: 'Student Success',
    image: IMAGES.team6,
    linkedin: '#',
    email: 's.toure@pridelandsacademy.com',
  },
  {
    name: 'Ms. Adaeze Nwosu',
    title: 'Head of Student Affairs',
    dept: 'Student Affairs',
    image: IMAGES.team8,
    linkedin: '#',
    email: 'a.nwosu@pridelandsacademy.com',
  },
]

const BOARD = [
  {
    name: 'Dr. Mbi Vahid',
    title: 'Board Chairman',
    org: 'PrideLands Group',
    image: IMAGES.team9,
  },
  {
    name: 'Enr. Enow Rawlings',
    title: 'Board Member',
    org: 'AfriHealth Foundation',
    image: IMAGES.team4,
  },
  {
    name: 'Mrs Queenta Lois',
    title: 'Board Member',
    org: 'TechAfrica Ventures',
    image: IMAGES.team5,
  },
  {
    name: 'Prof. Leila Benali',
    title: 'Academic Advisor',
    org: 'University of Cape Town',
    image: IMAGES.team2,
  },
]

// ─── Executive Card (full expandable) ─────────────────────────────
function ExecutiveCard({ person, i }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <FadeUp delay={i * 0.1}>
      <div className="card overflow-hidden group">
        <div className="grid grid-cols-1 md:grid-cols-5">

          {/* Photo */}
          <div className="md:col-span-2 relative h-64 md:h-auto overflow-hidden">
            <img
              src={person.image}
              alt={person.name}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent md:hidden" />
            {/* Social links overlay */}
            <div className="absolute bottom-4 left-4 flex gap-2 md:hidden">
              <SocialBtn href={person.linkedin} icon={Linkedin} />
              {person.twitter && <SocialBtn href={person.twitter} icon={Twitter} />}
              <SocialBtn href={`mailto:${person.email}`} icon={Mail} />
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3 p-7 flex flex-col">
            <div className="mb-4">
              <p className="text-gold-600 text-xs font-display font-700 tracking-widest uppercase mb-1">{person.dept}</p>
              <h3 className="font-display font-800 text-navy-900 text-xl mb-0.5">{person.name}</h3>
              <p className="text-gray-500 text-sm">{person.title}</p>
            </div>

            {/* Quote */}
            <div className="flex gap-2 mb-4 p-4 bg-slate-academy rounded-academy">
              <Quote size={16} className="text-gold-500 flex-shrink-0 mt-0.5" />
              <p className="text-navy-700 text-sm leading-relaxed italic">{person.quote}</p>
            </div>

            {/* Bio — collapsible */}
            <AnimatePresence>
              {expanded && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden text-gray-500 text-sm leading-relaxed mb-4"
                >
                  {person.bio}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Achievements */}
            <div className="flex flex-wrap gap-2 mb-5">
              {person.achievements.map((a) => (
                <span key={a} className="flex items-center gap-1 text-xs text-navy-700 bg-navy-900/5 px-3 py-1 rounded-full font-display font-600">
                  <Star size={10} className="text-gold-500" /> {a}
                </span>
              ))}
            </div>

            {/* Footer row */}
            <div className="flex items-center justify-between mt-auto">
              {/* Social — desktop */}
              <div className="hidden md:flex gap-2">
                <SocialBtn href={person.linkedin} icon={Linkedin} />
                {person.twitter && <SocialBtn href={person.twitter} icon={Twitter} />}
                <SocialBtn href={`mailto:${person.email}`} icon={Mail} />
              </div>

              <button
                onClick={() => setExpanded((v) => !v)}
                className="inline-flex items-center gap-1.5 text-navy-900 font-display font-600 text-xs hover:text-gold-600 transition-colors"
              >
                {expanded ? 'Show less' : 'Read full bio'}
                <ArrowRight size={12} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </FadeUp>
  )
}

// ─── Small social button ───────────────────────────────────────────
function SocialBtn({ href, icon: Icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 rounded-lg bg-navy-900/8 flex items-center justify-center text-navy-600 hover:bg-navy-900 hover:text-white transition-all duration-200"
    >
      <Icon size={14} />
    </a>
  )
}

// ─── Faculty card ──────────────────────────────────────────────────
function FacultyCard({ person, i }) {
  return (
    <FadeUp delay={i * 0.08}>
      <div className="card p-5 flex items-center gap-4 group hover:-translate-y-0.5 transition-transform duration-300">
        <img
          src={person.image}
          alt={person.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-display font-700 text-navy-900 text-sm truncate">{person.name}</p>
          <p className="text-gray-500 text-xs truncate">{person.title}</p>
          <p className="text-gold-600 text-xs font-display font-600 truncate">{person.dept}</p>
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          <SocialBtn href={person.linkedin} icon={Linkedin} />
          <SocialBtn href={`mailto:${person.email}`} icon={Mail} />
        </div>
      </div>
    </FadeUp>
  )
}

// ─── Board card ────────────────────────────────────────────────────
function BoardCard({ person, i }) {
  return (
    <FadeUp delay={i * 0.1}>
      <div className="flex flex-col items-center text-center group">
        <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-card group-hover:border-gold-500 transition-colors duration-300">
          <img
            src={person.image}
            alt={person.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <p className="font-display font-700 text-white text-sm">{person.name}</p>
        <p className="text-gold-400 text-xs font-display font-600 mt-0.5">{person.title}</p>
        <p className="text-navy-300 text-xs mt-0.5">{person.org}</p>
      </div>
    </FadeUp>
  )
}

// ─── PAGE 
export default function Leadership() {
  return (
    <div className="overflow-x-hidden">

      {/* ── 1. HERO ───────────────────────────────────────────── */}
      <section className="relative min-h-[380px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.aboutStory} alt="Leadership" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy-900/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/60 to-transparent" />
        </div>
        <div className="relative z-10 container-academy px-4 md:px-8 py-24">
          <p className="Text-white/50 text-xs mb-5">
            <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/about" className="hover:text-gold-400 transition-colors">About</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Leadership</span>
          </p>
          <FadeUp>
            <span className="section-eyebrow">The People Behind the Vision</span>
            <h1
              className="font-display font-900 text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}
            >
              Our Leadership Team
            </h1>
            <p className="text-white/70 text-base leading-relaxed max-w-xl">
              Visionary leaders, seasoned educators, and industry experts — united by a shared commitment to raising African excellence.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── 2. EXECUTIVE LEADERSHIP ───────────────────────────── */}
      <section className="section bg-white">
        <div className="container-academy px-4 md:px-8">
          <FadeUp className="mb-12">
            <span className="section-eyebrow">Executive Team</span>
            <h2 className="section-title">Leading with Purpose</h2>
            <p className="section-subtitle max-w-2xl">
              Our executives bring decades of combined experience in education, business, and public service across Africa and beyond.
            </p>
          </FadeUp>
          <div className="space-y-6">
            {EXECUTIVE.map((person, i) => (
              <ExecutiveCard key={person.id} person={person} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FACULTY HEADS ──────────────────────────────────── */}
      <section className="section-alt">
        <div className="container-academy px-4 md:px-8">
          <FadeUp className="mb-12">
            <span className="section-eyebrow">Academic Leadership</span>
            <h2 className="section-title">Faculty & Department Heads</h2>
            <p className="section-subtitle">
              Our faculty leaders are practitioners and scholars driving academic excellence across every department.
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FACULTY.map((person, i) => (
              <FacultyCard key={person.name} person={person} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. BOARD OF GOVERNORS ─────────────────────────────── */}
      <section className="py-20 bg-navy-900">
        <div className="container-academy px-4 md:px-8">
          <FadeUp className="text-center mb-14">
            <span className="section-eyebrow">Governance</span>
            <h2 className="section-title-light">Board of Governors</h2>
            <p className="section-subtitle-light mx-auto">
              Our board brings institutional wisdom and strategic oversight to ensure PrideLands Academy fulfills its long-term mission.
            </p>
          </FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {BOARD.map((person, i) => (
              <BoardCard key={person.name} person={person} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. JOIN THE TEAM ──────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-academy px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <FadeUp>
              <span className="section-eyebrow">Careers</span>
              <h2 className="section-title">Join Our Growing Team</h2>
              <p className="text-gray-500 text-base leading-relaxed mb-6">
                We are always looking for passionate educators, administrators, and professionals who believe in the transformative power of African education. If you share our values, we want to hear from you.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Competitive compensation aligned with industry standards',
                  'A collaborative, innovation-driven work culture',
                  'Continuous professional development and training',
                  'Meaningful work that shapes Africa\'s future',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-600 text-sm">
                    <Star size={15} className="text-gold-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all active:scale-95"
              >
                Send Your CV <ArrowRight size={15} />
              </Link>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="relative rounded-2xl overflow-hidden h-[400px] shadow-card-hover">
                <img
                  src={IMAGES.campus2}
                  alt="Join our team"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-5">
                    <p className="font-display font-700 text-navy-900 text-sm mb-1">
                      Open Positions
                    </p>
                    <p className="text-gray-500 text-xs mb-3">
                      We are actively recruiting across academic and administrative roles.
                    </p>
                    <Link
                      to="/contact"
                      className="text-gold-600 font-display font-600 text-xs inline-flex items-center gap-1 hover:text-gold-700 transition-colors"
                    >
                      View Open Roles <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── 6. CTA ────────────────────────────────────────────── */}
      <section className="py-16 bg-navy-900 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `radial-gradient(circle at 70% 50%, ${COLORS.secondary} 0%, transparent 50%)` }}
        />
        <div className="relative z-10 container-academy px-4 md:px-8 text-center">
          <FadeUp>
            <h2 className="font-display font-800 text-white text-2xl md:text-3xl mb-3">
              Shaped by Great Leaders. Built for the Next Generation.
            </h2>
            <p className="text-white/65 text-sm mb-8 max-w-lg mx-auto">
              Experience world-class education under proven leadership. Apply to PrideLands Academy today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-gold-500 text-navy-900 font-display font-700 text-sm rounded-academy hover:bg-gold-400 hover:shadow-gold transition-all active:scale-95"
              >
                Apply Now <ArrowRight size={15} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent text-white font-display font-600 text-sm rounded-academy border border-white/40 hover:bg-white/10 transition-all active:scale-95"
              >
                About the Academy
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  )
}
// import React from 'react'

// export default function Leadership() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-academy">
//       <div className="text-center">
//         <span className="section-eyebrow">Coming Next</span>
//         <h1 className="section-title mt-2">Leadership Page</h1>
//         <p className="section-subtitle mx-auto mt-2">This section is being built. Check back soon.</p>
//       </div>
//     </div>
//   )
// }
