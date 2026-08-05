

import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, User, BookOpen, FileText, ClipboardList,
  BarChart2, Scroll, CreditCard, Award, Clock, Bell,
  HelpCircle, Settings, LogOut, Menu, X, GraduationCap,
  ChevronRight
} from 'lucide-react'
import { logOut } from '@/firebase/auth'
import useAuthStore from '@/shared/store/authStore'
import toast from 'react-hot-toast'

//  Nav items 
const NAV_ITEMS = [
  { label: 'Dashboard',     path: '/student/dashboard',     icon: LayoutDashboard },
  { label: 'My Profile',    path: '/student/profile',       icon: User },
  { label: 'My Courses',    path: '/student/courses',       icon: BookOpen },
  { label: 'Materials',     path: '/student/materials',     icon: FileText },
  { label: 'Assignments',   path: '/student/assignments',   icon: ClipboardList },
  { label: 'Results',       path: '/student/results',       icon: BarChart2 },
  { label: 'Transcript',    path: '/student/transcript',    icon: Scroll },
  { label: 'Payments',      path: '/student/payments',      icon: CreditCard },
  { label: 'Certificates',  path: '/student/certificates',  icon: Award },
  { label: 'Timetable',     path: '/student/timetable',     icon: Clock },
  { label: 'Announcements', path: '/student/announcements', icon: Bell },
  { label: 'Support',       path: '/student/support',       icon: HelpCircle },
  { label: 'Settings',      path: '/student/settings',      icon: Settings },
]

// ─── Sidebar ───────────────────────────────────────────────────────
function Sidebar({ open, onClose }) {
  const navigate  = useNavigate()
  const { profile } = useAuthStore()

  const handleLogout = async () => {
    try {
      await logOut()
      toast.success('Signed out successfully.')
      navigate('/login', { replace: true })
    } catch {
      toast.error('Sign out failed. Try again.')
    }
  }

  const initials = profile
    ? `${profile.firstName?.[0] ?? ''}${profile.lastName?.[0] ?? ''}`.toUpperCase()
    : 'S'

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-navy-900 z-40 flex flex-col
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>

        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-500/20 flex items-center justify-center">
              <GraduationCap size={17} className="text-gold-400" />
            </div>
            <div className="leading-tight">
              <span className="block font-display font-800 text-white text-xs tracking-wide">Pridelands</span>
              <span className="block font-display font-600 text-gold-400 text-[10px] tracking-wider">Student Portal</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* User info */}
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold-500 flex items-center justify-center font-display font-700 text-navy-900 text-sm flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-display font-700 text-white text-sm truncate">
                {profile?.firstName} {profile?.lastName}
              </p>
              <p className="text-navy-400 text-xs truncate">{profile?.studentId ?? 'Student'}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 scrollbar-thin">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display font-500
                transition-all duration-150 group
                ${isActive
                  ? 'bg-gold-500/15 text-gold-400 font-600'
                  : 'text-navy-300 hover:bg-white/8 hover:text-white'
                }
              `}
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="truncate">{label}</span>
              <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-display font-500 text-navy-400 hover:bg-crimson-600/15 hover:text-crimson-400 transition-all duration-150"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}

// ─── Top header bar ────────────────────────────────────────────────
function PortalHeader({ onMenuClick, title }) {
  const { profile } = useAuthStore()

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-5 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-navy-700 hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-display font-700 text-navy-900 text-base">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <NavLink to="/student/announcements" className="relative p-2 rounded-lg text-navy-600 hover:bg-gray-100 transition-colors">
          <Bell size={18} />
          {/* Notification dot — will be dynamic once Firebase is connected */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-crimson-600" />
        </NavLink>
        <NavLink to="/student/profile" className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center font-display font-700 text-gold-400 text-xs">
          {profile?.firstName?.[0]}{profile?.lastName?.[0]}
        </NavLink>
      </div>
    </header>
  )
}

// ─── Layout shell ──────────────────────────────────────────────────
export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-slate-academy overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <PortalHeader
          onMenuClick={() => setSidebarOpen(true)}
          title="Student Portal"
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}