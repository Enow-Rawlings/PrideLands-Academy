
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, CheckCircle, Target, Eye, Star,
  BookOpen, Wrench, Lightbulb, TrendingUp,
  Users, Globe, Leaf, Briefcase
} from 'lucide-react'
import { IMAGES, COLORS, META } from '@/lib/theme'

// Fade-up animation  
const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.55, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
)

//Animated counter 
function useCountUp(target, duration = 1800, trigger = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let start = null
    const tick = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, trigger])
  return val
}


const TIMELINE = [
  { year: '2026: The Foundation',       desc: 'Established with a founding class of 42 students and 3 programmes, rooted in Pan-African values.' },
  { year: '2026: Regional Launch',      desc: 'Expanded to East Africa, welcoming the first Pan-African Technology Campus cohort.' },
  { year: '2026: Digital Transformation', desc: 'Launched hybrid learning and secured 120+ global industry partnerships.' },
]

const VMV = [
  {
    icon: Eye,
    title: 'Our Vision',
    text: 'To be the global reference point for academic excellence that empowers African talent to lead global innovation.',
  },
  {
    icon: Target,
    title: 'Our Mission',
    text: 'Empowering future leaders through rigorous academic training, character development, and industry-integrated learning paths.',
  },
  {
    icon: Star,
    title: 'Core Values',
    items: ['Leadership + Integrity', 'Innovation + Excellence', 'Defining Courage'],
  },
]

const PILLARS = [
  { icon: Users,    title: 'Empowering African Youth',   desc: 'Unlocking the raw potential of the world\'s youngest demographic with broad-based literacy.' },
  { icon: Briefcase,title: 'Industry Relevance',         desc: 'Bridging the skills gap by co-creating curriculum with global and African industry leaders.' },
  { icon: Lightbulb,title: 'Entrepreneurship',           desc: 'Fostering a mindset of job creation rather than job-seeking across all academic disciplines.' },
  { icon: Leaf,     title: 'Sustainable Impact',         desc: 'Ensuring that our institutional goals drive community and continental/environmental health.' },
]

const EDU_STEPS = [
  { icon: BookOpen,   step: 'LEARN',    desc: 'Rigorous theoretical foundations.' },
  { icon: Wrench,     step: 'APPLY',    desc: 'Real-world projects and implementation.' },
  { icon: Lightbulb, step: 'INNOVATE', desc: 'Creativity and problem-solving.' },
  { icon: TrendingUp, step: 'LEAD',    desc: 'Strategic impact and mentorship.' },
]

const STATS = [
  { value: 45,    suffix: '+',  label: 'Accredited Programs' },
  { value: 120,   suffix: '+',  label: 'Global Partnerships' },
  { value: 92,    suffix: '%',  label: 'Graduate Employment' },
  { value: 15000, suffix: '+',  label: 'Active Alumni' },
]

const FUTURE_ITEMS = [
  { icon: Globe,      title: 'Academic Growth',          desc: 'Scaling to 10 African nations, integrating advanced AI into pedagogy.' },
  { icon: Lightbulb, title: 'Digital Transformation',   desc: 'Building fully immersive hybrid learning platforms.' },
  { icon: Users,      title: 'International Hubs',       desc: 'Student exchange fellowships with partner European institutions.' },
  { icon: BookOpen,   title: 'Research Centers',         desc: 'Dedicated interdisciplinary African research hubs on innovation.' },
]

const CAMPUS_IMAGES = [
  { src: IMAGES.campus1, label: 'Innovative Labs',        span: 'col-span-2 row-span-2' },
  { src: IMAGES.campus2, label: 'Global Seminars',        span: 'col-span-1 row-span-1' },
  { src: IMAGES.campus3, label: 'Student Research Symposium', span: 'col-span-1 row-span-1' },
  { src: IMAGES.campus4, label: 'Creative Studios',       span: 'col-span-2 row-span-1' },
]

// STAT CARD 
function StatCard({ value, suffix, label, trigger }) {
  const count = useCountUp(value, 1600, trigger)
  return (
    <div className="text-center px-4">
      <div className="font-display font-900 text-white leading-none mb-1" style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>
        {trigger ? count.toLocaleString() : '0'}{suffix}
      </div>
      <div className="text-navy-300 text-sm font-body">{label}</div>
    </div>
  )
}

// PAGE 
export default function About() {
  const statsRef = useRef(null)
  const [statsVisible, setStatsVisible] = useState(false)

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsVisible(true); obs.disconnect() } }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="overflow-x-hidden">

      {/* 1. HERO  */}
      <section className="relative h-[60vh] min-h-[480px] flex items-center">
        {/* Split: left image, right dark */}
        <div className="absolute inset-0 grid grid-cols-2">
          <div className="relative overflow-hidden">
            <img src={IMAGES.heroAbout} alt="About PrideLands Academy" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-navy-900/40" />
          </div>
          <div className="bg-navy-900" />
        </div>

        <div className="absolute top-6 left-0 right-0 z-10">
          <div className="container-academy px-4 md:px-8">
            <p className="text-white/60 text-xs font-body">
              <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-white">About Us</span>
            </p>
          </div>
        </div>

        <div className="relative z-10 container-academy px-4 md:px-8 w-full">
          <div className="flex justify-end">
            <div className="w-full lg:w-1/2 pl-0 lg:pl-12">
              <FadeUp delay={0.1}>
                <span className="section-eyebrow">About Us</span>
                <h1 className="font-display font-900 text-white leading-tight mb-6"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                  Shaping Africa's Future<br />Through Education
                </h1>
                <p className="text-white/70 text-base leading-relaxed mb-8 max-w-md">
                  PrideLands Academy stands as a beacon of academic excellence and leadership development, cultivating the next generation of innovators across the continent through a world-class curriculum and values.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/programs" className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-navy-900 font-display font-700 text-sm rounded-academy hover:bg-gold-400 transition-all active:scale-95">
                    Explore Programs <ArrowRight size={15} />
                  </Link>
                  <Link to="/apply" className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-white font-display font-600 text-sm rounded-academy border border-white/40 hover:bg-white/10 transition-all active:scale-95">
                    Apply Now
                  </Link>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY  */}
      <section className="section bg-white">
        <div className="container-academy px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Left  Text + Timeline */}
            <FadeUp>
              <span className="section-eyebrow">Established {META.foundedYear}</span>
              <h2 className="section-title">Our Story: A Vision of Excellence</h2>
              <p className="text-gray-500 text-base leading-relaxed mb-8">
                PrideLands Academy was founded on the belief that education is the ultimate catalyst for continental transformation. From our humble beginnings as a single campus to becoming a premier pan-African institution, our journey has been defined by an unwavering commitment to bridging the gap between traditional academics and the dynamic needs of modern industry.
              </p>
              {/* Timeline */}
              <div className="space-y-5">
                {TIMELINE.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-gold-500 flex-shrink-0 mt-1.5" />
                      {i < TIMELINE.length - 1 && <div className="w-px flex-1 bg-gray-200 my-1.5" />}
                    </div>
                    <div className="pb-4">
                      <p className="font-display font-700 text-navy-900 text-sm mb-1">{item.year}</p>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>

            {/* Right  Image */}
            <FadeUp delay={0.15}>
              <div className="relative rounded-2xl overflow-hidden shadow-card-hover h-[420px]">
                <img src={IMAGES.aboutStory} alt="Our Story" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 to-transparent" />
                <div className="absolute bottom-6 left-6 bg-gold-500 text-navy-900 rounded-xl px-5 py-3">
                  <p className="font-display font-800 text-2xl leading-none">{META.foundedYear}</p>
                  <p className="font-display font-600 text-xs mt-0.5">Year Founded</p>
                </div>
              </div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* 3. VISION / MISSION / VALUES */}
      <section className="section-alt">
        <div className="container-academy px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VMV.map((item, i) => {
              const Icon = item.icon
              return (
                <FadeUp key={item.title} delay={i * 0.12}>
                  <div className="card p-7 h-full">
                    <div className="w-12 h-12 rounded-xl bg-navy-900 flex items-center justify-center mb-5">
                      <Icon size={22} className="text-gold-500" />
                    </div>
                    <h3 className="font-display font-700 text-navy-900 text-lg mb-3">{item.title}</h3>
                    {item.text && <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>}
                    {item.items && (
                      <ul className="space-y-2 mt-1">
                        {item.items.map((v) => (
                          <li key={v} className="flex items-center gap-2 text-gray-500 text-sm">
                            <CheckCircle size={14} className="text-gold-500 flex-shrink-0" />
                            {v}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. DIRECTOR'S WELCOME  */}
      <section className="section bg-white">
        <div className="container-academy px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Left Directors (Mbi Vahid's) Photo */}
            <FadeUp>
              <div className="relative">
                <div className="rounded-2xl overflow-hidden h-[460px] shadow-card-hover">
                  <img src={IMAGES.director} alt="Executive Director" className="w-full h-full object-cover object-top" />
                </div>
                {/* Label badge */}
                <div className="absolute -bottom-4 left-6 bg-navy-900 text-white rounded-xl px-5 py-3 shadow-navy">
                  <p className="font-display font-700 text-sm">Dr. Mbi Vahid</p>
                  <p className="text-gold-400 text-xs font-body mt-0.5">Executive Director, PrideLands Academy</p>
                </div>
              </div>
            </FadeUp>

            {/* Right — Quote */}
            <FadeUp delay={0.15}>
              <span className="section-eyebrow">Director's Welcome</span>
              <h2 className="section-title">Cultivating Leaders,<br />Building Futures</h2>
              <div className="space-y-4 text-gray-500 text-base leading-relaxed">
                <p>
                  "At PrideLands Academy, we don't just teach subjects, we inspire potential. Our curriculum is designed to challenge the status quo and equip our students with the resilience and intellectual rigor needed to navigate the complexities of the 21st century."
                </p>
                <p>
                  "We invite you to join a community of scholars who are passionate about making a tangible difference in their communities and across the African continent."
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <div className="w-10 h-px bg-gold-500" />
                <p className="font-display font-600 text-navy-900 text-sm">Dr. Mbi Vahid</p>
              </div>
              <Link to="/leadership" className="inline-flex items-center gap-2 mt-6 text-navy-900 font-display font-600 text-sm hover:text-gold-600 transition-colors group">
                Meet the Leadership <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </FadeUp>

          </div>
        </div>
      </section>

      {/*5. DRIVEN BY PURPOSE  */}
      <section className="py-20 bg-navy-900">
        <div className="container-academy px-4 md:px-8">
          <FadeUp className="text-center mb-14">
            <span className="section-eyebrow">Why We Exist</span>
            <h2 className="section-title-light">Driven by Purpose</h2>
            <p className="section-subtitle-light mx-auto">
              Addressing the continent's most pressing challenges through targeted educational outcomes.
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((p, i) => {
              const Icon = p.icon
              return (
                <FadeUp key={p.title} delay={i * 0.1}>
                  <div className="rounded-academy p-6 h-full border border-white/10 hover:border-gold-500/40 transition-colors duration-300 group"
                    style={{ backgroundColor: COLORS.darkCard }}>
                    <div className="w-11 h-11 rounded-xl bg-gold-500/15 flex items-center justify-center mb-4 group-hover:bg-gold-500 transition-colors duration-300">
                      <Icon size={20} className="text-gold-400 group-hover:text-navy-900 transition-colors duration-300" />
                    </div>
                    <h3 className="font-display font-700 text-white text-sm mb-2">{p.title}</h3>
                    <p className="text-navy-300 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* 6. EDUCATIONAL PHILOSOPHY  */}
      <section className="section bg-white">
        <div className="container-academy px-4 md:px-8">
          <FadeUp className="text-center mb-14">
            <span className="section-eyebrow">How We Teach</span>
            <h2 className="section-title">Our Educational Philosophy</h2>
            <p className="section-subtitle mx-auto">A continuous cycle of growth designed for lifelong success.</p>
          </FadeUp>

          {/* Steps with connecting line */}
          <div className="relative">
            <div className="hidden md:block absolute top-9 left-0 right-0 h-px bg-gray-100" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {EDU_STEPS.map((s, i) => {
                const Icon = s.icon
                return (
                  <FadeUp key={s.step} delay={i * 0.12} className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center mb-4 z-10 shadow-md ${i % 2 === 0 ? 'bg-navy-900' : 'bg-gold-500'}`}>
                      <Icon size={20} className={i % 2 === 0 ? 'text-gold-400' : 'text-navy-900'} />
                    </div>
                    <p className={`font-display font-800 text-sm tracking-widest mb-2 ${i % 2 === 0 ? 'text-navy-900' : 'text-gold-500'}`}>{s.step}</p>
                    <p className="text-gray-500 text-xs leading-relaxed max-w-[160px]">{s.desc}</p>
                  </FadeUp>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 7. STATS BAR  */}
      <div ref={statsRef} className="py-16 bg-navy-900 border-y border-white/10">
        <div className="container-academy px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
            {STATS.map((s) => (
              <StatCard key={s.label} {...s} trigger={statsVisible} />
            ))}
          </div>
        </div>
      </div>

      {/*8. FUTURE WE ARE BUILDING  */}
      <section className="section bg-navy-900 relative overflow-hidden">
        {/* bg image */}
        <div className="absolute inset-0">
          <img src={IMAGES.futureBuilding} alt="Future" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-navy-900/80" />
        </div>

        <div className="relative z-10 container-academy px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

            {/* Left */}
            <FadeUp>
              <span className="section-eyebrow">Our 2030 Roadmap</span>
              <h2 className="section-title-light">The Future We Are Building</h2>
              <p className="text-navy-300 text-base leading-relaxed mb-10">
                PrideLands Academy is evolving. Our 2030 roadmap focuses on scaling our impact across 10 African nations, integrating advanced AI into our pedagogy, and establishing regional research hubs dedicated to sustainable development goals.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {FUTURE_ITEMS.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <FadeUp key={item.title} delay={i * 0.1}>
                      <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gold-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon size={16} className="text-gold-400" />
                        </div>
                        <div>
                          <p className="font-display font-700 text-white text-sm mb-1">{item.title}</p>
                          <p className="text-navy-300 text-xs leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </FadeUp>
                  )
                })}
              </div>
            </FadeUp>

            {/* Right — image grid */}
            <FadeUp delay={0.2}>
              <div className="grid grid-cols-2 grid-rows-2 gap-3 h-[420px] min-h-0">
                <img src={IMAGES.campus1} alt="Campus Life" className="rounded-xl object-cover w-full h-full row-span-2" />
                <img src={IMAGES.globalSeminar2} alt="Innovative Labs" className="rounded-xl object-cover w-full h-full" />
                <img src={IMAGES.globalSeminar1} alt="Global Seminars" className="rounded-xl object-cover w-full h-full" />
              </div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/*9. CAMPUS CULTURE  */}
      <section className="section bg-white">
        <div className="container-academy px-4 md:px-8">
          <FadeUp className="text-center mb-12">
            <span className="section-eyebrow">Life at PrideLands</span>
            <h2 className="section-title">Vibrant Campus Culture</h2>
            <p className="section-subtitle mx-auto">Life beyond the classroom is where lifelong friendships become forever family.</p>
          </FadeUp>

          {/* Gallery grid — matches design layout */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-[480px] md:h-[520px]">
            <div className="col-span-1 md:col-span-1 row-span-2 rounded-2xl overflow-hidden">
              <img src={IMAGES.campus1} alt="Campus Life" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="rounded-2xl overflow-hidden relative group">
              <img src={IMAGES.campus2} alt="Innovative Labs" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-navy-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white font-display font-600 text-sm">Innovative Labs</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden relative group">
              <img src={IMAGES.globalSeminar2} alt="Global Seminars" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-navy-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white font-display font-600 text-sm">Global Seminars</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden relative group col-span-1">
              <img src={IMAGES.campus4} alt="Student Research" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-navy-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white font-display font-600 text-sm">Student Research Symposium</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden relative group col-span-1">
              <img src={IMAGES.campus5} alt="Creative Studios" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-navy-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white font-display font-600 text-sm">Creative Studios</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CTA  */}
      <section className="py-20 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `radial-gradient(circle at 20% 50%, ${COLORS.secondary} 0%, transparent 50%), radial-gradient(circle at 80% 50%, ${COLORS.primaryLight} 0%, transparent 50%)` }} />
        <div className="relative z-10 container-academy px-4 md:px-8 text-center">
          <FadeUp>
            <h2 className="font-display font-900 text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              Become Part of Africa's Next Generation of Leaders
            </h2>
            <p className="text-white/65 text-base mb-10 max-w-xl mx-auto">
              Applications for the next academic semester are now open. Start your journey towards Excellence today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/apply" className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 text-navy-900 font-display font-700 text-sm rounded-academy hover:bg-gold-400 hover:shadow-gold transition-all active:scale-95">
                Apply Now <ArrowRight size={15} />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white font-display font-600 text-sm rounded-academy border border-white/30 hover:bg-white/10 hover:border-white/60 transition-all active:scale-95">
                Contact Admissions
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  )
}
