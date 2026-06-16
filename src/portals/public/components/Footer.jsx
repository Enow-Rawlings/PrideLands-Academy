import React from 'react'
import { Link } from 'react-router-dom'
import {
  GraduationCap, Facebook, Instagram, Twitter, Linkedin, Youtube,
  Mail, Phone, MapPin, ArrowRight
} from 'lucide-react'
import { BRAND } from '@/lib/constants'

const footerLinks = {
  programs: [
    { label: 'School of Technology',   path: '/programs/bict' },
    { label: 'Faculty of Business',    path: '/programs/bba' },
    { label: 'Built Environment',      path: '/programs/bed' },
    { label: 'Health Sciences',        path: '/programs/bpubh' },
    { label: 'Creative Arts',          path: '/programs' },
  ],
  admissions: [
    { label: 'Apply Now',       path: '/apply' },
    { label: 'Scholarships',    path: '/admissions#scholarships' },
    { label: 'Tuition & Fees',  path: '/admissions#tuition' },
    { label: 'Visa Support',    path: '/admissions#visa' },
    { label: 'FAQs',            path: '/faq' },
  ],
  quickLinks: [
    { label: 'Campus Map',     path: '/contact' },
    { label: 'Careers',        path: '/contact' },
    { label: 'Privacy Policy', path: '#' },
    { label: 'Terms of Service',path: '#' },
    { label: 'News Portal',    path: '/news' },
  ],
}

const socials = [
  { icon: Facebook,  href: BRAND.social.facebook,  label: 'Facebook' },
  { icon: Instagram, href: BRAND.social.instagram, label: 'Instagram' },
  { icon: Twitter,   href: BRAND.social.twitter,   label: 'Twitter/X' },
  { icon: Linkedin,  href: BRAND.social.linkedin,  label: 'LinkedIn' },
  { icon: Youtube,   href: BRAND.social.youtube,   label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">

      {/*  Main Footer */}
      <div className="container-academy py-16 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          <div className="lg:col-span-1">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <div className="w-9 h-9 rounded-lg bg-gold-500/20 flex items-center justify-center">
                <GraduationCap size={20} className="text-gold-400" />
              </div>
              <div className="leading-tight">
                <span className="block font-display font-800 text-sm text-white tracking-wide">Pridelands</span>
                <span className="block font-display font-600 text-xs text-gold-400 tracking-wider">Academy</span>
              </div>
            </Link>

            <p className="text-navy-300 text-sm leading-relaxed mb-6 max-w-xs">
              Empowering the next generation of Africans with excellence, innovation, and integrity since 2026.
            </p>

            <div className="space-y-2.5 mb-6">
              <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2.5 text-navy-300 text-sm hover:text-gold-400 transition-colors">
                <Mail size={14} className="text-gold-500 flex-shrink-0" />
                {BRAND.email}
              </a>
              <a href={`tel:${BRAND.phone}`} className="flex items-center gap-2.5 text-navy-300 text-sm hover:text-gold-400 transition-colors">
                <Phone size={14} className="text-gold-500 flex-shrink-0" />
                {BRAND.phone}
              </a>
              <div className="flex items-center gap-2.5 text-navy-300 text-sm">
                <MapPin size={14} className="text-gold-500 flex-shrink-0" />
                {BRAND.address}
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center text-navy-300 hover:bg-gold-500 hover:text-navy-900 transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/*Programs */}
          <div>
            <h4 className="font-display font-700 text-white text-sm tracking-wide mb-5 uppercase">
              Programs
            </h4>
            <ul className="space-y-3">
              {footerLinks.programs.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-navy-300 text-sm hover:text-gold-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-3 group-hover:ml-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/*  Admissions */}
          <div>
            <h4 className="font-display font-700 text-white text-sm tracking-wide mb-5 uppercase">
              Admissions
            </h4>
            <ul className="space-y-3">
              {footerLinks.admissions.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-navy-300 text-sm hover:text-gold-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-3 group-hover:ml-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-700 text-white text-sm tracking-wide mb-5 uppercase">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-navy-300 text-sm hover:text-gold-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-3 group-hover:ml-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter mini */}
            <div className="mt-8">
              <p className="text-white text-sm font-display font-600 mb-3">Stay Updated</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white text-xs placeholder:text-navy-400 focus:outline-none focus:border-gold-500 transition-colors"
                />
                <button className="px-3 py-2 rounded-lg bg-gold-500 text-navy-900 text-xs font-display font-700 hover:bg-gold-400 transition-colors flex-shrink-0">
                  Go
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-academy px-4 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-navy-400 text-xs">
            © {new Date().getFullYear()} PrideLands Academy. Excellence in Modern African Education.
          </p>
          <div className="flex items-center gap-4">
            <Link to="#" className="text-navy-400 text-xs hover:text-gold-400 transition-colors">Privacy</Link>
            <Link to="#" className="text-navy-400 text-xs hover:text-gold-400 transition-colors">Terms</Link>
            <Link to="#" className="text-navy-400 text-xs hover:text-gold-400 transition-colors">Sitemap</Link>
            <span className="text-navy-600 text-xs">
              Part of{' '}
              <a href="#" className="text-gold-500 hover:text-gold-400 transition-colors font-600">PrideLands Group</a>
            </span>
          </div>
        </div>
      </div>

    </footer>
  )
}
