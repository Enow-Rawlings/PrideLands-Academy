import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, GraduationCap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { PUBLIC_NAV } from '@/lib/constants'

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location])

  // Scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const isHeroPage = location.pathname === '/'

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled || mobileOpen
            ? 'bg-white shadow-md'
            : isHeroPage
            ? 'bg-transparent'
            : 'bg-white shadow-sm',
        )}
      >
        <div className="container-academy">
          <div className="flex items-center justify-between h-16 md:h-18">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">

              <div className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-300',
                scrolled || !isHeroPage ? 'bg-navy-900' : 'bg-white/20 backdrop-blur-sm'
              )}>
                <GraduationCap
                  size={20}
                  className={cn(
                    'transition-colors duration-300',
                    scrolled || !isHeroPage ? 'text-gold-500' : 'text-white'
                  )}
                />
              </div>
              {/* Text */}
              <div className="leading-tight">
                <span className={cn(
                  'block font-display font-800 text-sm tracking-wide transition-colors duration-300',
                  scrolled || !isHeroPage ? 'text-navy-900' : 'text-white'
                )}>
                  Pridelands
                </span>
                <span className={cn(
                  'block font-display font-600 text-xs tracking-wider transition-colors duration-300',
                  scrolled || !isHeroPage ? 'text-gold-500' : 'text-gold-400'
                )}>
                  Academy
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {PUBLIC_NAV.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    cn(
                      'px-3.5 py-2 rounded-lg text-sm font-display font-500 transition-all duration-200',
                      isActive
                        ? scrolled || !isHeroPage
                          ? 'text-navy-900 bg-navy-900/8 font-700'
                          : 'text-gold-400 font-700'
                        : scrolled || !isHeroPage
                        ? 'text-navy-700 hover:text-navy-900 hover:bg-gray-100'
                        : 'text-white/85 hover:text-white hover:bg-white/10',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-2">
              <Link
                to="/login"
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-display font-600 border transition-all duration-200',
                  scrolled || !isHeroPage
                    ? 'border-navy-900/30 text-navy-900 hover:bg-navy-900 hover:text-white hover:border-navy-900'
                    : 'border-white/40 text-white hover:bg-white/10 hover:border-white',
                )}
              >
                Student Portal Login
              </Link>
              <Link
                to="/apply"
                className="px-5 py-2.5 rounded-lg text-sm font-display font-700 bg-navy-900 text-white hover:bg-navy-800 transition-all duration-200 shadow-sm hover:shadow-navy active:scale-95"
              >
                Apply Now
              </Link>
            </div>

            {/*  Mobile Hamburger Menu Icon */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className={cn(
                'lg:hidden p-2 rounded-lg transition-colors duration-200',
                scrolled || !isHeroPage
                  ? 'text-navy-900 hover:bg-gray-100'
                  : 'text-white hover:bg-white/10',
              )}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="lg:hidden overflow-hidden bg-white border-t border-gray-100"
            >
              <div className="container-academy py-4 space-y-1">
                {PUBLIC_NAV.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center px-4 py-3 rounded-academy text-sm font-display font-500 transition-colors duration-150',
                        isActive
                          ? 'bg-navy-900 text-white font-700'
                          : 'text-navy-700 hover:bg-gray-50',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}

                <div className="pt-3 space-y-2 border-t border-gray-100 mt-3">
                  <Link
                    to="/login"
                    className="flex items-center justify-center w-full px-4 py-3 rounded-academy text-sm font-display font-600 border border-navy-900/30 text-navy-900 hover:bg-navy-900 hover:text-white transition-all duration-200"
                  >
                    Student Portal Login
                  </Link>
                  <Link
                    to="/apply"
                    className="flex items-center justify-center w-full px-4 py-3 rounded-academy text-sm font-display font-700 bg-navy-900 text-white hover:bg-navy-800 transition-all duration-200"
                  >
                    Apply Now
                  </Link>
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
