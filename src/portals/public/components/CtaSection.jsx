import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const partners = [
  'GLOBAL BANK', 'TECH CORP', 'AFRI-MINING', 'FUTURE BUILD', 'ECO SOLUTIONS', 'NEXUSMEDIA',
]

export function PartnersBar() {
  return (
    <section className="py-10 bg-gray-50 border-y border-gray-100">
      <div className="container-academy px-4 md:px-8">
        <p className="text-center text-gray-400 text-xs font-display font-600 tracking-widest uppercase mb-7">
          Trusted by Industry Leaders
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {partners.map((partner) => (
            <span
              key={partner}
              className="font-display font-700 text-gray-300 text-sm tracking-wider hover:text-gray-500 transition-colors cursor-default select-none"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #C9A84C 0%, transparent 50%),
                            radial-gradient(circle at 80% 50%, #1e3570 0%, transparent 50%)`
        }}
      />

      <div className="relative z-10 container-academy px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold-500/20 text-gold-400 text-xs font-display font-700 tracking-widest uppercase mb-6 border border-gold-500/30">
            Applications Open
          </span>

          <h2 className="font-display font-900 text-white mb-5 leading-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}
          >
            Ready to Shape Your Future?
          </h2>

          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Join thousands of ambitious Africans building world-class careers at PrideLands Academy.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 text-navy-900 font-display font-700 text-sm rounded-academy hover:bg-gold-400 hover:shadow-gold transition-all duration-200 active:scale-95"
            >
              Apply Now — It's Free
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white font-display font-600 text-sm rounded-academy border border-white/30 hover:bg-white/10 hover:border-white/60 transition-all duration-200 active:scale-95"
            >
              Talk to Admissions
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
