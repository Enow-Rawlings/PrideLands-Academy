import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Users, Target, Globe } from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Industry-Relevant Education',
    description:
      'Curriculum designed in collaboration with leading African and global corporations to keep you ahead.',
  },
  {
    icon: Users,
    title: 'Experienced Faculty',
    description:
      'Learn from distinguished professors and industry practitioners with global impact and real-world expertise.',
  },
  {
    icon: Target,
    title: 'Career-Focused Learning',
    description:
      'Dedicated career services ensuring graduates are job-ready from day one, with placement support.',
  },
  {
    icon: Globe,
    title: 'Global Opportunities',
    description:
      'Student exchange programmes and research fellowships with partner universities worldwide.',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: 'easeOut' },
  }),
}

export default function WhyUsSection() {
  return (
    <section className="section bg-white">
      <div className="container-academy">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="section-title">Why Choose Pridelands Academy?</h2>
          <p className="section-subtitle mx-auto">
            We provide more than just education; we cultivate the mindset of global excellence rooted in African values.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                className="card p-6 group hover:-translate-y-1 transition-transform duration-300"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-navy-900 flex items-center justify-center mb-5 group-hover:bg-gold-500 transition-colors duration-300">
                  <Icon size={22} className="text-gold-500 group-hover:text-navy-900 transition-colors duration-300" />
                </div>

                {/* Content */}
                <h3 className="font-display font-700 text-navy-900 text-base mb-3 leading-snug">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
