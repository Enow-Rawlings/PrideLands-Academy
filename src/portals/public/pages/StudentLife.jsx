

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Users, Music, Trophy, Globe,
  BookOpen, Heart, Coffee, Calendar, MapPin, Star
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

//  DATA 
const LIFE_STATS = [
  { value: '20+',  label: 'Student Clubs' },
  { value: '15+',  label: 'Annual Events' },
  { value: '8',    label: 'Sports Teams' },
  { value: '100%', label: 'Wi-Fi Campus' },
]

const CLUBS = [
  { icon: BookOpen, name: 'Entrepreneurship Club',   desc: 'Pitch competitions, startup bootcamps, and mentorship from real founders.', members: 120 },
  { icon: Globe,    name: 'Tech Society',             desc: 'Hackathons, coding challenges, and industry speaker sessions every month.', members: 95 },
  { icon: Users,    name: 'Debate Union',             desc: 'Sharpen your critical thinking and public speaking on continental issues.', members: 60 },
  { icon: Music,    name: 'Cultural Arts Association',desc: 'Celebrating African heritage through music, drama, dance, and visual arts.', members: 85 },
  { icon: Trophy,   name: 'Sports & Athletics',       desc: 'Football, basketball, athletics, and more — compete inter-campus and beyond.', members: 200 },
  { icon: Heart,    name: 'Community Outreach Club',  desc: 'Volunteer programmes, mentorship drives, and campus sustainability initiatives.', members: 75 },
  { icon: Coffee,   name: 'Innovation Lab Society',   desc: 'Hands-on building, prototyping, and design thinking workshops weekly.', members: 50 },
  { icon: Star,     name: 'Leadership Forum',         desc: 'Seminars, executive masterclasses, and leadership development retreats.', members: 45 },
]

const EVENTS = [
  {
    title: 'Annual Graduation Ceremony',
    date: 'July 2025',
    category: 'Academic',
    desc: 'Our flagship event celebrating the achievements of graduating students with industry leaders and families.',
    image: IMAGES.news2,
  },
  {
    title: 'PrideLands Career Fair',
    date: 'May 2025',
    category: 'Career',
    desc: '60+ employers on campus for networking, interviews, and internship placements across Africa and beyond.',
    image: IMAGES.campus5,
  },
  {
    title: 'Tech Innovation Hackathon',
    date: 'April 2025',
    category: 'Technology',
    desc: '48-hour hackathon where student teams build solutions to real African challenges for cash prizes.',
    image: IMAGES.engineering,
  },
  {
    title: 'African Culture Gala',
    date: 'March 2025',
    category: 'Culture',
    desc: 'An evening of food, music, dance, and fashion celebrating the diversity of African cultures on campus.',
    image: IMAGES.campus6,
  },
]

const FACILITIES = [
  { icon: BookOpen, title: 'Library & Research Centre',  desc: 'Over 15,000 physical and digital resources, 24/7 reading rooms, and online journal access.' },
  { icon: Globe,    title: 'Innovation & Tech Lab',       desc: 'State-of-the-art computing, AI tools, 3D printers, and robotics kits available to all students.' },
  { icon: Trophy,   title: 'Sports Complex',              desc: 'Full-size football pitch, basketball court, gym, and athletics track.' },
  { icon: Coffee,   title: 'Student Lounge & Café',       desc: 'A vibrant space to relax, collaborate, and grab a meal between classes.' },
  { icon: Users,    title: 'Collaborative Study Spaces',  desc: 'Bookable group rooms, whiteboards, and presentation spaces across campus.' },
  { icon: Heart,    title: 'Student Wellness Centre',     desc: 'Counselling, health clinics, and mental wellness support available free to all students.' },
]

const TESTIMONIALS = [
  {
    name: 'Amara Diallo',
    program: 'BSc. AI, Class of 2024',
    country: '🇸🇳 Senegal',
    quote: 'The clubs and events at PrideLands gave me a network I never expected. I met my co-founder at a hackathon here in Year 2.',
    image: IMAGES.testimonial1,
  },
  {
    name: 'Kofi Boateng',
    program: 'Business Admin, Class of 2023',
    country: '🇬🇭 Ghana',
    quote: 'Campus life here is genuinely vibrant. The Cultural Gala alone is worth the experience — it made me feel truly at home far from home.',
    image: IMAGES.testimonial2,
  },
  {
    name: 'Ngozi Okafor',
    program: 'Finance, Class of 2024',
    country: '🇳🇬 Nigeria',
    quote: 'Between the Leadership Forum sessions and the Career Fair, I had three internship offers before I even graduated. The connections here are real.',
    image: IMAGES.testimonial3,
  },
]

//  Club Card 
function ClubCard({ club, i }) {
  const Icon = club.icon
  return (
    <FadeUp delay={i * 0.07}>
      <div className="card p-5 h-full group hover:-translate-y-0.5 transition-transform duration-300">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-navy-900 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500 transition-colors duration-300">
            <Icon size={19} className="text-gold-500 group-hover:text-navy-900 transition-colors duration-300" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-display font-700 text-navy-900 text-sm leading-snug">{club.name}</h3>
              <span className="text-xs text-gray-400 flex-shrink-0">{club.members} members</span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">{club.desc}</p>
          </div>
        </div>
      </div>
    </FadeUp>
  )
}

//  Event Card 
function EventCard({ event, i }) {
  return (
    <FadeUp delay={i * 0.1}>
      <div className="card overflow-hidden group h-full flex flex-col">
        <div className="relative h-44 overflow-hidden">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute top-3 left-3">
            <span className="badge-gold text-xs">{event.category}</span>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-2">
            <Calendar size={11} /> {event.date}
          </div>
          <h3 className="font-display font-700 text-navy-900 text-sm leading-snug mb-2">{event.title}</h3>
          <p className="text-gray-500 text-xs leading-relaxed flex-1">{event.desc}</p>
        </div>
      </div>
    </FadeUp>
  )
}

//  PAGE 
export default function StudentLife() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  return (
    <div className="overflow-x-hidden">

      {/*  1. HERO  */}
      <section className="relative min-h-[420px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.campus1} alt="Student Life" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-navy-900/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/60 to-transparent" />
        </div>
        <div className="relative z-10 container-academy px-4 md:px-8 py-24">
          <p className="text-white/50 text-xs mb-5">
            <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Student Life</span>
          </p>
          <FadeUp>
            <span className="section-eyebrow">Life at PrideLands</span>
            <h1 className="font-display font-900 text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}>
              More Than a Degree —<br />A Life-Changing Experience
            </h1>
            <p className="text-white/70 text-base leading-relaxed max-w-xl mb-8">
              From vibrant clubs to world-class facilities and unforgettable events, PrideLands Academy is a community where friendships, networks, and futures are built.
            </p>
            <Link to="/apply" className="inline-flex items-center gap-2 px-7 py-3.5 bg-gold-500 text-navy-900 font-display font-700 text-sm rounded-academy hover:bg-gold-400 transition-all active:scale-95">
              Join Our Community <ArrowRight size={15} />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/*  2. STATS BAR  */}
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="container-academy px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {LIFE_STATS.map((s, i) => (
              <FadeUp key={s.label} delay={i * 0.08}>
                <p className="font-display font-900 text-navy-900 text-3xl mb-1">{s.value}</p>
                <p className="text-gray-400 text-sm">{s.label}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      {/*  3. CAMPUS CULTURE GALLERY  */}
      <section className="section bg-white">
        <div className="container-academy px-4 md:px-8">
          <FadeUp className="text-center mb-12">
            <span className="section-eyebrow">Campus Culture</span>
            <h2 className="section-title">A Community That Feels Like Home</h2>
            <p className="section-subtitle mx-auto">
              Life beyond the classroom is where lifelong friendships become family.
            </p>
          </FadeUp>
          {/* Mosaic grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-[480px]">
            <div className="row-span-2 rounded-2xl overflow-hidden">
              <img src={IMAGES.campus1} alt="Campus" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="rounded-2xl overflow-hidden relative group">
              <img src={IMAGES.campus2} alt="Labs" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-navy-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white font-display font-600 text-sm">Innovation Labs</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden relative group">
              <img src={IMAGES.campus3} alt="Seminars" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-navy-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white font-display font-600 text-sm">Global Seminars</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden relative group">
              <img src={IMAGES.campus4} alt="Research" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-navy-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white font-display font-600 text-sm">Student Research</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden relative group">
              <img src={IMAGES.campus5} alt="Studios" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-navy-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white font-display font-600 text-sm">Creative Studios</span>
              </div>
            </div>
          </div>
          <FadeUp className="text-center mt-6">
            <Link to="/gallery" className="inline-flex items-center gap-2 text-navy-900 font-display font-600 text-sm hover:text-gold-600 transition-colors group">
              View Full Gallery <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/*  4. CLUBS & SOCIETIES  */}
      <section className="section-alt">
        <div className="container-academy px-4 md:px-8">
          <FadeUp className="text-center mb-12">
            <span className="section-eyebrow">Get Involved</span>
            <h2 className="section-title">Clubs & Societies</h2>
            <p className="section-subtitle mx-auto">
              Find your people. Grow your skills. Build your legacy outside the classroom.
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CLUBS.map((club, i) => (
              <ClubCard key={club.name} club={club} i={i} />
            ))}
          </div>
          <FadeUp className="text-center mt-10">
            <p className="text-gray-400 text-sm mb-3">Don't see your interest? Start your own club.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 border border-navy-900/30 text-navy-900 font-display font-600 text-sm rounded-academy hover:bg-navy-900 hover:text-white transition-all">
              Propose a New Club <ArrowRight size={14} />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/*  5. EVENTS  */}
      <section className="section bg-white">
        <div className="container-academy px-4 md:px-8">
          <FadeUp className="flex items-end justify-between mb-10">
            <div>
              <span className="section-eyebrow">What's On</span>
              <h2 className="section-title mb-0">Upcoming Events</h2>
            </div>
            <Link to="/news" className="hidden sm:inline-flex items-center gap-1.5 text-navy-900 font-display font-600 text-sm hover:text-gold-600 transition-colors group flex-shrink-0">
              All Events <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {EVENTS.map((event, i) => (
              <EventCard key={event.title} event={event} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/*  6. FACILITIES  */}
      <section className="section-alt">
        <div className="container-academy px-4 md:px-8">
          <FadeUp className="text-center mb-12">
            <span className="section-eyebrow">World-Class Infrastructure</span>
            <h2 className="section-title">Campus Facilities</h2>
            <p className="section-subtitle mx-auto">
              Everything you need to learn, grow, and thrive — all on one campus.
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FACILITIES.map((f, i) => {
              const Icon = f.icon
              return (
                <FadeUp key={f.title} delay={i * 0.08}>
                  <div className="card p-6 h-full group hover:-translate-y-0.5 transition-transform duration-300">
                    <div className="w-11 h-11 rounded-xl bg-navy-900 flex items-center justify-center mb-4 group-hover:bg-gold-500 transition-colors duration-300">
                      <Icon size={19} className="text-gold-500 group-hover:text-navy-900 transition-colors duration-300" />
                    </div>
                    <h3 className="font-display font-700 text-navy-900 text-sm mb-2">{f.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/*  7. STUDENT TESTIMONIALS  */}
      <section className="py-20 bg-navy-900">
        <div className="container-academy px-4 md:px-8">
          <FadeUp className="text-center mb-12">
            <span className="section-eyebrow">Student Voices</span>
            <h2 className="section-title-light">What Students Are Saying</h2>
          </FadeUp>

          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="bg-navy-800 border border-white/10 rounded-2xl p-8 md:p-10 text-center"
              >
                <img
                  src={TESTIMONIALS[activeTestimonial].image}
                  alt={TESTIMONIALS[activeTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gold-500/50 mx-auto mb-5"
                />
                <p className="text-white/90 text-base leading-relaxed mb-6 italic">
                  "{TESTIMONIALS[activeTestimonial].quote}"
                </p>
                <p className="font-display font-700 text-white text-sm">
                  {TESTIMONIALS[activeTestimonial].name}
                </p>
                <p className="text-navy-400 text-xs mt-0.5">{TESTIMONIALS[activeTestimonial].program}</p>
                <p className="text-gold-500 text-xs mt-0.5">{TESTIMONIALS[activeTestimonial].country}</p>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeTestimonial ? 'w-6 h-2 bg-gold-500' : 'w-2 h-2 bg-white/25 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/*  8. ACCOMMODATION NOTE  */}
      <section className="section bg-white">
        <div className="container-academy px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeUp>
              <div className="relative rounded-2xl overflow-hidden h-[360px] shadow-card-hover">
                <img src={IMAGES.campus6} alt="Accommodation" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gold-500 flex items-center justify-center flex-shrink-0">
                      <MapPin size={16} className="text-navy-900" />
                    </div>
                    <div>
                      <p className="font-display font-700 text-navy-900 text-sm">Buea, Cameroon</p>
                      <p className="text-gray-400 text-xs">Verified off-campus housing available nearby</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.15}>
              <span className="section-eyebrow">Accommodation</span>
              <h2 className="section-title">A Place to Call Home</h2>
              <p className="text-gray-500 text-base leading-relaxed mb-5">
                On-campus accommodation is currently under development. In the meantime, our Student Affairs team maintains a curated list of verified, safe, and affordable housing options within walking or commuting distance of campus.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Verified landlords vetted by Student Affairs',
                  'Options from shared rooms to studio apartments',
                  'Transport guidance from key housing areas',
                  'Student community WhatsApp groups for each area',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-600 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 text-white font-display font-600 text-sm rounded-academy hover:bg-navy-800 transition-all active:scale-95">
                Contact Student Affairs <ArrowRight size={14} />
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/*  9. CTA  */}
      <section className="py-16 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `radial-gradient(circle at 30% 50%, ${COLORS.secondary} 0%, transparent 50%)` }} />
        <div className="relative z-10 container-academy px-4 md:px-8 text-center">
          <FadeUp>
            <h2 className="font-display font-800 text-white text-2xl md:text-3xl mb-3">
              Ready to Experience It for Yourself?
            </h2>
            <p className="text-white/65 text-sm mb-8 max-w-md mx-auto">
              Apply today and become part of the PrideLands Academy community.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/apply" className="inline-flex items-center gap-2 px-7 py-3.5 bg-gold-500 text-navy-900 font-display font-700 text-sm rounded-academy hover:bg-gold-400 hover:shadow-gold transition-all active:scale-95">
                Apply Now <ArrowRight size={15} />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent text-white font-display font-600 text-sm rounded-academy border border-white/40 hover:bg-white/10 transition-all active:scale-95">
                Book a Campus Visit
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  )
}
