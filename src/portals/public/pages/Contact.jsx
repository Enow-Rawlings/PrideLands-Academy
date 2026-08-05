import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Mail, Phone, MapPin, Clock, Send, CheckCircle,
  Facebook, Instagram, Twitter, Linkedin, Youtube,
  MessageCircle, AlertCircle, ArrowRight
} from 'lucide-react'
import { BRAND } from '@/lib/constants'
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

// ─── Validation Schema ──────────────────────────────────────────────
const contactSchema = z.object({
  name:    z.string().min(2, 'Please enter your full name'),
  email:   z.string().email('Enter a valid email address'),
  phone:   z.string().optional(),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

const SUBJECTS = [
  'General Inquiry',
  'Admissions Question',
  'Programme Information',
  'Scholarships & Financial Aid',
  'Partnership Opportunity',
  'Press / Media',
  'Other',
]

const CONTACT_CARDS = [
  {
    icon: Mail,
    title: 'Email Us',
    lines: [BRAND.email, BRAND.admissionsEmail],
    action: `mailto:${BRAND.email}`,
  },
  {
    icon: Phone,
    title: 'Call Us',
    lines: [BRAND.phone, 'Mon – Fri, 8am – 5pm'],
    action: `tel:${BRAND.phone}`,
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    lines: [BRAND.address, 'Main Campus'],
    action: '#map',
  },
  {
    icon: Clock,
    title: 'Office Hours',
    lines: ['Mon – Fri: 8:00 – 17:00', 'Sat: 9:00 – 13:00'],
    action: null,
  },
]

const SOCIALS = [
  { icon: Facebook,  href: BRAND.social.facebook,  label: 'Facebook' },
  { icon: Instagram, href: BRAND.social.instagram, label: 'Instagram' },
  { icon: Twitter,   href: BRAND.social.twitter,   label: 'Twitter/X' },
  { icon: Linkedin,  href: BRAND.social.linkedin,  label: 'LinkedIn' },
  { icon: Youtube,   href: BRAND.social.youtube,   label: 'YouTube' },
]

const DEPARTMENTS = [
  { name: 'Admissions Office',      email: BRAND.admissionsEmail,            desc: 'Application status, requirements, and intake questions.' },
  { name: 'Student Affairs',        email: 'studentaffairs@pridelandsacademy.com', desc: 'Campus life, clubs, accommodation, and welfare.' },
  { name: 'Finance & Tuition',      email: 'finance@pridelandsacademy.com',  desc: 'Payment plans, invoices, and scholarship disbursement.' },
  { name: 'Partnerships & Media',   email: 'partnerships@pridelandsacademy.com', desc: 'Corporate partnerships, sponsorships, and press inquiries.' },
]

// ─── Field wrapper (matches Apply.jsx pattern) ─────────────────────
function Field({ label, error, children, required = true }) {
  return (
    <div>
      <label className="label">{label}{required && <span className="text-crimson-600 ml-0.5">*</span>}</label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-crimson-600 text-xs mt-1.5">
          <AlertCircle size={12} /> {error.message}
        </p>
      )}
    </div>
  )
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register, handleSubmit, formState: { errors }, reset,
  } = useForm({ resolver: zodResolver(contactSchema) })

  const onSubmit = (data) => {
    // TODO: Replace with real backend call once Firebase is wired in:
    // await addDoc(collection(db, 'contactMessages'), { ...data, createdAt: serverTimestamp() })
    console.log('Contact form submission:', data)
    setSubmitted(true)
    toast.success('Message sent! We\'ll respond within 24-48 hours.')
    reset()
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="overflow-x-hidden">

      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[360px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.campus4} alt="Contact PrideLands Academy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy-900/78" />
        </div>
        <div className="relative z-10 container-academy px-4 md:px-8 py-20">
          <p className="text-white/50 text-xs mb-5">
            <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Contact</span>
          </p>
          <FadeUp>
            <span className="section-eyebrow">Get In Touch</span>
            <h1 className="font-display font-900 text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}>
              We'd Love to Hear From You
            </h1>
            <p className="text-white/70 text-base leading-relaxed max-w-xl">
              Whether you have a question about admissions, programmes, or partnerships — our team is ready to help.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── 2. QUICK CONTACT CARDS ─────────────────────────────── */}
      <section className="bg-white py-14">
        <div className="container-academy px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 -mt-24 relative z-10">
            {CONTACT_CARDS.map((c, i) => {
              const Icon = c.icon
              const Wrapper = c.action ? 'a' : 'div'
              return (
                <FadeUp key={c.title} delay={i * 0.08}>
                  <Wrapper
                    {...(c.action ? { href: c.action } : {})}
                    className="card p-6 h-full block hover:-translate-y-1 transition-transform duration-300"
                  >
                    <div className="w-11 h-11 rounded-xl bg-navy-900 flex items-center justify-center mb-4">
                      <Icon size={19} className="text-gold-500" />
                    </div>
                    <p className="font-display font-700 text-navy-900 text-sm mb-2">{c.title}</p>
                    {c.lines.map((line) => (
                      <p key={line} className="text-gray-500 text-xs leading-relaxed">{line}</p>
                    ))}
                  </Wrapper>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 3. FORM + MAP ───────────────────────────────────────── */}
      <section id="map" className="section bg-white pt-4">
        <div className="container-academy px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Left — Form (3 cols) */}
            <FadeUp className="lg:col-span-3">
              <span className="section-eyebrow">Send a Message</span>
              <h2 className="section-title mb-2">Drop Us a Line</h2>
              <p className="text-gray-500 text-sm mb-8">We typically respond within 24–48 hours on business days.</p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card p-8 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gold-500/15 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={28} className="text-gold-500" />
                  </div>
                  <h3 className="font-display font-700 text-navy-900 text-lg mb-2">Message Sent!</h3>
                  <p className="text-gray-500 text-sm">Thank you for reaching out. Our team will get back to you shortly.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Full Name" error={errors.name}>
                      <input {...register('name')} className="input" placeholder="e.g. Amara Diallo" />
                    </Field>
                    <Field label="Email Address" error={errors.email}>
                      <input {...register('email')} type="email" className="input" placeholder="you@example.com" />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Phone Number (optional)" error={errors.phone} required={false}>
                      <input {...register('phone')} className="input" placeholder="+237 6XX XXX XXX" />
                    </Field>
                    <Field label="Subject" error={errors.subject}>
                      <select {...register('subject')} className="input">
                        <option value="">Select a subject...</option>
                        {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Field>
                  </div>

                  <Field label="Message" error={errors.message}>
                    <textarea
                      {...register('message')}
                      rows={6}
                      className="input resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </Field>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all active:scale-95"
                  >
                    Send Message <Send size={15} />
                  </button>
                </form>
              )}
            </FadeUp>

            {/* Right — Map + Socials (2 cols) */}
            <FadeUp delay={0.15} className="lg:col-span-2 space-y-6">
              {/* Map placeholder */}
              <div className="rounded-2xl overflow-hidden h-64 relative">
                <img src={IMAGES.campus1} alt="Campus location map" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-navy-900/40 flex items-center justify-center">
                  <div className="bg-white rounded-academy px-5 py-3 flex items-center gap-2 shadow-card">
                    <MapPin size={16} className="text-crimson-600" />
                    <span className="font-display font-600 text-navy-900 text-sm">{BRAND.address}</span>
                  </div>
                </div>
              </div>

              {/* Socials */}
              <div className="card-navy rounded-2xl p-6">
                <p className="font-display font-700 text-white text-sm mb-1">Follow PrideLands Academy</p>
                <p className="text-navy-300 text-xs mb-5">Stay updated with campus news and events.</p>
                <div className="flex items-center gap-2">
                  {SOCIALS.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-gold-500 hover:text-navy-900 transition-all duration-200"
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Live chat CTA */}
              <div className="rounded-2xl p-6 border border-gray-100 bg-slate-academy flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold-500/15 flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={18} className="text-gold-600" />
                </div>
                <div>
                  <p className="font-display font-700 text-navy-900 text-sm mb-1">Need a Faster Answer?</p>
                  <p className="text-gray-500 text-xs leading-relaxed mb-2">Check our FAQ page for instant answers to common questions.</p>
                  <Link to="/faq" className="inline-flex items-center gap-1.5 text-navy-900 font-display font-600 text-xs hover:text-gold-600 transition-colors">
                    Visit FAQ <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* ── 4. DEPARTMENT DIRECTORY ─────────────────────────────── */}
      <section className="section-alt">
        <div className="container-academy px-4 md:px-8">
          <FadeUp className="text-center mb-12">
            <span className="section-eyebrow">Reach the Right Team</span>
            <h2 className="section-title">Department Directory</h2>
            <p className="section-subtitle mx-auto">Contact the specific department for faster assistance.</p>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {DEPARTMENTS.map((d, i) => (
              <FadeUp key={d.name} delay={i * 0.08}>
                <a href={`mailto:${d.email}`} className="card p-6 flex items-start gap-4 block hover:-translate-y-0.5 transition-transform duration-300">
                  <div className="w-11 h-11 rounded-xl bg-navy-900 flex items-center justify-center flex-shrink-0">
                    <Mail size={17} className="text-gold-500" />
                  </div>
                  <div>
                    <p className="font-display font-700 text-navy-900 text-sm mb-1">{d.name}</p>
                    <p className="text-gray-500 text-xs leading-relaxed mb-2">{d.desc}</p>
                    <p className="text-gold-600 text-xs font-display font-600">{d.email}</p>
                  </div>
                </a>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. CTA ──────────────────────────────────────────────── */}
      <section className="py-16 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `radial-gradient(circle at 30% 50%, ${COLORS.secondary} 0%, transparent 50%)` }} />
        <div className="relative z-10 container-academy px-4 md:px-8 text-center">
          <FadeUp>
            <h2 className="font-display font-800 text-white text-2xl md:text-3xl mb-3">
              Ready to Take the Next Step?
            </h2>
            <p className="text-white/65 text-sm mb-8 max-w-lg mx-auto">
              Don't wait — start your application today and join Africa's next generation of leaders.
            </p>
            <Link to="/apply" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold-500 text-navy-900 font-display font-700 text-sm rounded-academy hover:bg-gold-400 hover:shadow-gold transition-all active:scale-95">
              Apply Now <ArrowRight size={15} />
            </Link>
          </FadeUp>
        </div>
      </section>

    </div>
  )
}
