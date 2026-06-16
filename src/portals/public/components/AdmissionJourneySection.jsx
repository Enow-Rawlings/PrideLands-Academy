import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ADMISSION_STEPS } from '@/lib/constants'

const homeSteps = [
  { step: 1, title: 'Apply Online',      description: 'Complete our comprehensive online application form and upload your transcripts.' },
  { step: 2, title: 'Review Process',    description: 'Our admissions committee meticulously reviews every profile for academic potential.' },
  { step: 3, title: 'Enrollment',        description: 'Successful students receive their formal offer and complete registration formalities.' },
  { step: 4, title: 'Start Learning',    description: 'Join the orientation week and begin your transformative academic journey.' },
]

export default function AdmissionJourneySection() {
  return (
    <section className="section bg-white">
      <div className="container-academy">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="section-eyebrow">Get Started</span>
          <h2 className="section-title">Admission Journey</h2>
          <p className="section-subtitle mx-auto">
            Your path to excellence starts with four simple steps.
          </p>
        </motion.div>

        <div className="relative">

          {/* Connecting line — desktop */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-gray-200 z-0" style={{ top: '2rem' }}>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gold-500 origin-left"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative z-10">
            {homeSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex flex-col items-center text-center md:items-center"
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center font-display font-800 text-lg mb-6 shadow-md z-10 transition-all duration-300 ${
                    i % 2 === 0
                      ? 'bg-navy-900 text-white'
                      : 'bg-gold-500 text-navy-900'
                  }`}
                >
                  0{step.step}
                </div>

                <h3 className="font-display font-700 text-navy-900 text-base mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-14 text-center"
        >
          <Link
            to="/apply"
            className="inline-flex items-center gap-2 px-8 py-4 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all duration-200 shadow-navy hover:shadow-lg active:scale-95"
          >
            Start Your Application
            <ArrowRight size={16} />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
