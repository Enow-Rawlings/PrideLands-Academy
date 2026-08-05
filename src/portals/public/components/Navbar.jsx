// FILE: src/portals/public/components/Navbar.jsx

import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, GraduationCap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { PUBLIC_NAV } from '@/lib/constants'

function DropdownMenu({ children, isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-card-hover border border-gray-100 py-1.5 z-50"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [mobileExpanded, setMobileExpanded] = useState(null)
  const location = useLocation()
  const navRef = useRef(null)

  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
    setMobileExpanded(null)
  }, [location])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenDropdown(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isHeroPage = location.pathname === '/'

  const navTextBase = scrolled || !isHeroPage || mobileOpen
    ? 'text-navy-700 hover:text-navy-900 hover:bg-gray-100'
    : 'text-white/85 hover:text-white hover:bg-white/10'

  const navTextActive = scrolled || !isHeroPage || mobileOpen
    ? 'text-navy-900 bg-navy-900/8 font-700'
    : 'text-gold-400 font-700'

  return (
    <>
      <header
        ref={navRef}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled || mobileOpen ? 'bg-white shadow-md' : isHeroPage ? 'bg-transparent' : 'bg-white shadow-sm'
        )}
      >
        <div className="container-academy">
          <div className="flex items-center justify-between h-16 md:h-18 px-4 md:px-8">

            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-300', scrolled || !isHeroPage ? 'bg-navy-900' : 'bg-white/20 backdrop-blur-sm')}>
                <GraduationCap size={20} className={cn('transition-colors duration-300', scrolled || !isHeroPage ? 'text-gold-500' : 'text-white')} />
              </div>
              <div className="leading-tight">
                <span className={cn('block font-display font-800 text-sm tracking-wide transition-colors duration-300', scrolled || !isHeroPage ? 'text-navy-900' : 'text-white')}>Pridelands</span>
                <span className={cn('block font-display font-600 text-xs tracking-wider transition-colors duration-300', scrolled || !isHeroPage ? 'text-gold-500' : 'text-gold-400')}>Academy</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {PUBLIC_NAV.map((item) => {
                const hasDropdown = item.children && item.children.length > 0
                const isDropOpen = openDropdown === item.label
                return (
                  <div key={item.label} className="relative" onMouseEnter={() => hasDropdown && setOpenDropdown(item.label)} onMouseLeave={() => hasDropdown && setOpenDropdown(null)}>
                    {hasDropdown ? (
                      <button onClick={() => setOpenDropdown(isDropOpen ? null : item.label)} className={cn('flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-display font-500 transition-all duration-200', navTextBase)}>
                        {item.label}
                        <ChevronDown size={13} className={cn('transition-transform duration-200', isDropOpen && 'rotate-180')} />
                      </button>
                    ) : (
                      <NavLink to={item.path} end={item.path === '/'} className={({ isActive }) => cn('px-3.5 py-2 rounded-lg text-sm font-display font-500 transition-all duration-200', isActive ? navTextActive : navTextBase)}>
                        {item.label}
                      </NavLink>
                    )}

                    {hasDropdown && (
                      <DropdownMenu isVisible={isDropOpen}>
                        {item.children.map((child) => (
                          <NavLink key={child.path} to={child.path} end className={({ isActive }) => cn('flex items-center px-4 py-2.5 text-sm font-display font-500 transition-colors duration-150', isActive ? 'text-gold-600 bg-gold-500/8 font-600' : 'text-navy-700 hover:text-navy-900 hover:bg-gray-50')}>
                            {child.label}
                          </NavLink>
                        ))}
                      </DropdownMenu>
                    )}
                  </div>
                )
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-2">
              <Link to="/login" className={cn('px-4 py-2 rounded-lg text-sm font-display font-600 border transition-all duration-200', scrolled || !isHeroPage ? 'border-navy-900/30 text-navy-900 hover:bg-navy-900 hover:text-white hover:border-navy-900' : 'border-white/40 text-white hover:bg-white/10 hover:border-white')}>Student Portal Login</Link>
              <Link to="/apply" className="px-5 py-2.5 rounded-lg text-sm font-display font-700 bg-navy-900 text-white hover:bg-navy-800 transition-all duration-200 shadow-sm active:scale-95">Apply Now</Link>
            </div>

            <button onClick={() => setMobileOpen((v) => !v)} className={cn('lg:hidden p-2 rounded-lg transition-colors duration-200', scrolled || !isHeroPage ? 'text-navy-900 hover:bg-gray-100' : 'text-white hover:bg-white/10')} aria-label="Toggle menu">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: 'easeInOut' }} className="lg:hidden overflow-hidden bg-white border-t border-gray-100">
              <div className="container-academy px-4 md:px-8 py-4 space-y-1">
                {PUBLIC_NAV.map((item) => {
                  const hasChildren = item.children && item.children.length > 0
                  const isExpanded = mobileExpanded === item.label
                  return (
                    <div key={item.label}>
                      {hasChildren ? (
                        <>
                          <button onClick={() => setMobileExpanded(isExpanded ? null : item.label)} className="w-full flex items-center justify-between px-4 py-3 rounded-academy text-sm font-display font-500 text-navy-700 hover:bg-gray-50 transition-colors">
                            {item.label}
                            <ChevronDown size={14} className={cn('transition-transform', isExpanded && 'rotate-180')} />
                          </button>
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden pl-4">
                                {item.children.map((child) => (
                                  <NavLink key={child.path} to={child.path} className={({ isActive }) => cn('flex items-center px-4 py-2.5 rounded-academy text-sm font-display font-500 transition-colors', isActive ? 'text-gold-600 font-600' : 'text-navy-600 hover:text-navy-900 hover:bg-gray-50')}>
                                    {child.label}
                                  </NavLink>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <NavLink to={item.path} end={item.path === '/'} className={({ isActive }) => cn('flex items-center px-4 py-3 rounded-academy text-sm font-display font-500 transition-colors', isActive ? 'bg-navy-900 text-white font-700' : 'text-navy-700 hover:bg-gray-50')}>
                          {item.label}
                        </NavLink>
                      )}
                    </div>
                  )
                })}

                <div className="pt-3 space-y-2 border-t border-gray-100 mt-2">
                  <Link to="/login" className="flex items-center justify-center w-full px-4 py-3 rounded-academy text-sm font-display font-600 border border-navy-900/30 text-navy-900 hover:bg-navy-900 hover:text-white transition-all">Student Portal Login</Link>
                  <Link to="/apply" className="flex items-center justify-center w-full px-4 py-3 rounded-academy text-sm font-display font-700 bg-navy-900 text-white hover:bg-navy-800 transition-all">Apply Now</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {!isHeroPage && <div className="h-16 md:h-18" />}
    </>
  )
}
