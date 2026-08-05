
// import React from 'react'
// import { Link, useParams, Navigate } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import {
//   ArrowRight, Clock, Award, CheckCircle, BookOpen,
//   Briefcase, Calendar, MapPin, ChevronRight
// } from 'lucide-react'
// import { PROGRAMS_DATA, getProgramById } from '@/lib/programsData'
// import { COLORS } from '@/lib/theme'

// const FadeUp = ({ children, delay = 0, className = '' }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 24 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     viewport={{ once: true, margin: '-50px' }}
//     transition={{ duration: 0.5, delay, ease: 'easeOut' }}
//     className={className}
//   >
//     {children}
//   </motion.div>
// )

// export default function ProgramDetail() {
//   const { id } = useParams()
//   const program = getProgramById(id)
//   if (!program) return <Navigate to="/programs" replace />
//   const related = PROGRAMS_DATA.filter((p) => p.id !== program.id).slice(0, 3)

//   return (
//     <div className="overflow-x-hidden">
//       {/* Hero, Quick Facts Bar, Overview, Curriculum, Requirements,
//           Career Outcomes, Sticky Apply Sidebar, Related Programs, CTA */}
//       {/* — full implementation saved on disk — */}
//     </div>
//   )
// }



import React from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Clock, Award, CheckCircle, BookOpen,
  Briefcase, Calendar, MapPin, ChevronRight
} from 'lucide-react'
import { PROGRAMS_DATA, getProgramById } from '@/lib/programsData'
import { COLORS } from '@/lib/theme'

const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
    viewport={{ once:true, margin:'-50px' }} transition={{ duration:0.5, delay, ease:'easeOut' }}
    className={className}>{children}</motion.div>
)

export default function ProgramDetail() {
  const { id }    = useParams()
  const program   = getProgramById(id)
  if (!program)   return <Navigate to="/programs" replace />
  const related   = PROGRAMS_DATA.filter(p => p.id !== program.id).slice(0, 3)

  return (
    <div className="overflow-x-hidden">

      {/* Hero */}
      <section className="relative min-h-[420px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy-900/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/50 to-transparent" />
        </div>
        <div className="relative z-10 container-academy px-4 md:px-8 pb-12 pt-28 w-full">
          <p className="text-white/50 text-xs mb-5 flex items-center gap-1.5">
            <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <ChevronRight size={12}/>
            <Link to="/programs" className="hover:text-gold-400 transition-colors">Programs</Link>
            <ChevronRight size={12}/>
            <span className="text-white">{program.title}</span>
          </p>
          <FadeUp>
            <span className={`inline-block px-3 py-1 rounded-full text-white text-xs font-display font-600 mb-4 ${program.badgeColor}`}>{program.badge}</span>
            {program.comingSoon && <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/30 text-white text-xs font-display font-600 mb-4 ml-2">Coming {program.intake}</span>}
            <h1 className="font-display font-900 text-white leading-tight mb-4" style={{ fontSize:'clamp(1.8rem,4vw,3rem)' }}>{program.title}</h1>
            <p className="text-white/70 text-base leading-relaxed max-w-2xl">{program.desc}</p>
          </FadeUp>
        </div>
      </section>

      {/* Quick facts */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-academy px-4 md:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon:Clock,    label:'Duration', value:program.duration },
              { icon:Award,    label:'Award',    value:program.type },
              { icon:Calendar, label:'Intake',   value:program.intake },
              { icon:MapPin,   label:'Mode',     value:program.mode },
            ].map(f => {
              const Icon = f.icon
              return (
                <div key={f.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-navy-900 flex items-center justify-center flex-shrink-0">
                    <Icon size={17} className="text-gold-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">{f.label}</p>
                    <p className="font-display font-700 text-navy-900 text-sm">{f.value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <section className="section bg-white">
        <div className="container-academy px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Left — 2 cols */}
            <div className="lg:col-span-2 space-y-12">
              <FadeUp>
                <h2 className="font-display font-800 text-navy-900 text-2xl mb-4">Programme Overview</h2>
                <p className="text-gray-500 text-base leading-relaxed">{program.overview}</p>
              </FadeUp>
              <FadeUp delay={0.1}>
                <h2 className="font-display font-800 text-navy-900 text-2xl mb-5">Curriculum & Modules</h2>
                <div className="space-y-3">
                  {program.modules.map((mod, i) => (
                    <div key={mod} className="flex items-center gap-4 p-4 rounded-academy bg-slate-academy border border-gray-100">
                      <div className="w-8 h-8 rounded-lg bg-navy-900 flex items-center justify-center font-display font-700 text-gold-500 text-xs flex-shrink-0">
                        {String(i+1).padStart(2,'0')}
                      </div>
                      <p className="font-display font-600 text-navy-900 text-sm">{mod}</p>
                    </div>
                  ))}
                </div>
              </FadeUp>
              <FadeUp delay={0.15}>
                <h2 className="font-display font-800 text-navy-900 text-2xl mb-5">Admission Requirements</h2>
                <ul className="space-y-3">
                  {program.requirements.map(req => (
                    <li key={req} className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-gold-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </FadeUp>
              <FadeUp delay={0.2}>
                <h2 className="font-display font-800 text-navy-900 text-2xl mb-5">Career Outcomes</h2>
                <div className="flex flex-wrap gap-3">
                  {program.careers.map(career => (
                    <span key={career} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-academy bg-navy-900/5 text-navy-900 text-sm font-display font-600">
                      <Briefcase size={14} className="text-gold-600" />{career}
                    </span>
                  ))}
                </div>
              </FadeUp>
            </div>

            {/* Right — sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-5">
                <FadeUp className="card-navy rounded-2xl p-7">
                  <p className="text-navy-300 text-xs uppercase tracking-wider font-display font-600 mb-1">Tuition</p>
                  <p className="font-display font-800 text-white text-2xl mb-5">{program.tuition}</p>
                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex justify-between border-b border-white/10 pb-3">
                      <span className="text-navy-300">Duration</span>
                      <span className="text-white font-600">{program.duration}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-3">
                      <span className="text-navy-300">Award</span>
                      <span className="text-white font-600">{program.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-navy-300">Mode</span>
                      <span className="text-white font-600">{program.mode}</span>
                    </div>
                  </div>
                  {!program.comingSoon ? (
                    <Link to="/apply" className="flex items-center justify-center gap-2 w-full py-3.5 bg-gold-500 text-navy-900 font-display font-700 text-sm rounded-academy hover:bg-gold-400 transition-all active:scale-95">
                      Apply Now <ArrowRight size={15} />
                    </Link>
                  ) : (
                    <button disabled className="w-full py-3.5 bg-white/10 text-white/50 font-display font-700 text-sm rounded-academy cursor-not-allowed">
                      Opens {program.intake}
                    </button>
                  )}
                  <Link to="/contact" className="flex items-center justify-center gap-2 w-full py-3 mt-2.5 border border-white/20 text-white font-display font-600 text-sm rounded-academy hover:bg-white/5 transition-all">
                    Talk to Admissions
                  </Link>
                </FadeUp>
                <FadeUp delay={0.1} className="card p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen size={18} className="text-gold-600" />
                    <p className="font-display font-700 text-navy-900 text-sm">Need More Info?</p>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">Speak with our admissions team for a personalised consultation.</p>
                  <Link to="/faq" className="text-navy-900 font-display font-600 text-xs hover:text-gold-600 transition-colors inline-flex items-center gap-1">
                    View FAQs <ArrowRight size={12} />
                  </Link>
                </FadeUp>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="section-alt">
        <div className="container-academy px-4 md:px-8">
          <FadeUp className="mb-10">
            <span className="section-eyebrow">Explore More</span>
            <h2 className="section-title">Related Programs</h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((p, i) => (
              <FadeUp key={p.id} delay={i * 0.1}>
                <Link to={p.path} className="card overflow-hidden flex flex-col group h-full">
                  <div className="relative h-40 overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full text-white text-xs font-display font-600 ${p.badgeColor}`}>{p.badge}</span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-display font-700 text-navy-900 text-sm mb-2 leading-snug">{p.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-3 flex-1">{p.desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-navy-900 font-display font-600 text-xs group-hover:text-gold-600 transition-colors">
                      View Programme <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage:`radial-gradient(circle at 80% 50%, ${COLORS.secondary} 0%, transparent 50%)` }} />
        <div className="relative z-10 container-academy px-4 md:px-8 text-center">
          <FadeUp>
            <h2 className="font-display font-800 text-white text-2xl md:text-3xl mb-3">Ready to start your journey?</h2>
            <p className="text-white/65 text-sm mb-8 max-w-lg mx-auto">Applications for the {program.intake} intake are open.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/apply" className="inline-flex items-center gap-2 px-7 py-3.5 bg-gold-500 text-navy-900 font-display font-700 text-sm rounded-academy hover:bg-gold-400 transition-all active:scale-95">
                Apply Now <ArrowRight size={15} />
              </Link>
              <Link to="/programs" className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent text-white font-display font-600 text-sm rounded-academy border border-white/40 hover:bg-white/10 transition-all active:scale-95">
                Back to All Programs
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  )
}