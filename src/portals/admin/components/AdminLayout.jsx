// // FILE: src/portals/admin/components/AdminLayout.jsx

// import React, { useState } from 'react'
// import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
// import { motion, AnimatePresence } from 'framer-motion'
// import {
//   LayoutDashboard, Users, UserCheck, BookOpen, GraduationCap,
//   ClipboardList, BarChart2, CreditCard, Award, FileText,
//   PieChart, Shield, Settings, LogOut, Menu, X,
//   ChevronDown, ChevronRight, Bell
// } from 'lucide-react'
// import { logOut } from '@/firebase/auth'
// import useAuthStore from '@/shared/store/authStore'
// import toast from 'react-hot-toast'

// // ─── Nav structure with grouped sections ───────────────────────────
// const NAV_GROUPS = [
//   {
//     label: 'Overview',
//     items: [
//       { label: 'Dashboard',    path: '/admin/dashboard',    icon: LayoutDashboard },
//     ],
//   },
//   {
//     label: 'People',
//     items: [
//       { label: 'Students',     path: '/admin/students',     icon: Users },
//       { label: 'Lecturers',    path: '/admin/lecturers',    icon: UserCheck },
//     ],
//   },
//   {
//     label: 'Academics',
//     items: [
//       { label: 'Programs',     path: '/admin/programs',     icon: BookOpen },
//       { label: 'Courses',      path: '/admin/courses',      icon: GraduationCap },
//       { label: 'Admissions',   path: '/admin/admissions',   icon: ClipboardList },
//       { label: 'Results',      path: '/admin/results',      icon: BarChart2 },
//     ],
//   },
//   {
//     label: 'Operations',
//     items: [
//       { label: 'Finance',      path: '/admin/finance',      icon: CreditCard },
//       { label: 'Certificates', path: '/admin/certificates', icon: Award },
//       { label: 'Content',      path: '/admin/content',      icon: FileText },
//     ],
//   },
//   {
//     label: 'System',
//     items: [
//       { label: 'Reports',      path: '/admin/reports',      icon: PieChart },
//       { label: 'Roles',        path: '/admin/roles',        icon: Shield },
//       { label: 'Settings',     path: '/admin/settings',     icon: Settings },
//     ],
//   },
// ]

// function Sidebar({ open, onClose }) {
//   const navigate    = useNavigate()
//   const location    = useLocation()
//   const { profile } = useAuthStore()
//   const [collapsed, setCollapsed] = useState({})

//   const handleLogout = async () => {
//     try {
//       await logOut()
//       toast.success('Signed out successfully.')
//       navigate('/login', { replace: true })
//     } catch { toast.error('Sign out failed.') }
//   }

//   const initials = `${profile?.firstName?.[0] ?? 'A'}${profile?.lastName?.[0] ?? ''}`.toUpperCase()

//   const toggleGroup = (label) =>
//     setCollapsed(prev => ({ ...prev, [label]: !prev[label] }))

//   return (
//     <>
//       <AnimatePresence>
//         {open && (
//           <motion.div
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 z-30 lg:hidden"
//             onClick={onClose}
//           />
//         )}
//       </AnimatePresence>

//       <aside className={`
//         fixed top-0 left-0 h-full w-64 bg-navy-900 z-40 flex flex-col
//         transition-transform duration-300 ease-in-out
//         ${open ? 'translate-x-0' : '-translate-x-full'}
//         lg:translate-x-0 lg:static lg:z-auto
//       `}>

//         {/* Logo */}
//         <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
//           <div className="flex items-center gap-2.5">
//             <div className="w-8 h-8 rounded-lg bg-gold-500/20 flex items-center justify-center">
//               <GraduationCap size={16} className="text-gold-400" />
//             </div>
//             <div className="leading-tight">
//               <span className="block font-display font-800 text-white text-xs tracking-wide">Pridelands</span>
//               <span className="block font-display font-600 text-gold-400 text-[10px] tracking-wider">Admin Portal</span>
//             </div>
//           </div>
//           <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white">
//             <X size={18} />
//           </button>
//         </div>

//         {/* User chip */}
//         <div className="px-4 py-3 border-b border-white/10">
//           <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-white/5">
//             <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center font-display font-700 text-navy-900 text-xs flex-shrink-0">
//               {initials}
//             </div>
//             <div className="min-w-0 flex-1">
//               <p className="font-display font-700 text-white text-xs truncate">
//                 {profile?.firstName} {profile?.lastName}
//               </p>
//               <p className="text-gold-400 text-[10px] capitalize">{profile?.role?.replace('_', ' ')}</p>
//             </div>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 overflow-y-auto py-3 px-3 scrollbar-thin">
//           {NAV_GROUPS.map((group) => {
//             const isGroupCollapsed = collapsed[group.label]
//             return (
//               <div key={group.label} className="mb-1">
//                 <button
//                   onClick={() => toggleGroup(group.label)}
//                   className="w-full flex items-center justify-between px-2 py-1.5 text-navy-500 hover:text-navy-300 transition-colors mb-0.5"
//                 >
//                   <span className="text-[10px] font-display font-700 tracking-widest uppercase">
//                     {group.label}
//                   </span>
//                   <ChevronDown
//                     size={11}
//                     className={`transition-transform duration-200 ${isGroupCollapsed ? '-rotate-90' : ''}`}
//                   />
//                 </button>

//                 <AnimatePresence initial={false}>
//                   {!isGroupCollapsed && (
//                     <motion.div
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: 'auto', opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       transition={{ duration: 0.2 }}
//                       className="overflow-hidden"
//                     >
//                       {group.items.map(({ label, path, icon: Icon }) => {
//                         const isActive = location.pathname === path
//                         return (
//                           <NavLink
//                             key={path}
//                             to={path}
//                             onClick={onClose}
//                             className={() => `
//                               flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
//                               font-display font-500 transition-all duration-150 group mb-0.5
//                               ${isActive
//                                 ? 'bg-gold-500/15 text-gold-400 font-600'
//                                 : 'text-navy-300 hover:bg-white/8 hover:text-white'
//                               }
//                             `}
//                           >
//                             <Icon size={15} className="flex-shrink-0" />
//                             <span className="truncate text-sm">{label}</span>
//                             {isActive && (
//                               <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400" />
//                             )}
//                           </NavLink>
//                         )
//                       })}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             )
//           })}
//         </nav>

//         {/* Logout */}
//         <div className="p-3 border-t border-white/10">
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-display font-500 text-navy-400 hover:bg-crimson-600/15 hover:text-crimson-400 transition-all"
//           >
//             <LogOut size={15} /> Sign Out
//           </button>
//         </div>
//       </aside>
//     </>
//   )
// }

// function AdminHeader({ onMenuClick }) {
//   const { profile } = useAuthStore()
//   const location    = useLocation()

//   // Derive page title from path
//   const title = NAV_GROUPS
//     .flatMap(g => g.items)
//     .find(i => i.path === location.pathname)?.label ?? 'Admin Portal'

//   return (
//     <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-5 flex-shrink-0">
//       <div className="flex items-center gap-3">
//         <button
//           onClick={onMenuClick}
//           className="lg:hidden p-2 rounded-lg text-navy-700 hover:bg-gray-100 transition-colors"
//         >
//           <Menu size={20} />
//         </button>
//         <h1 className="font-display font-700 text-navy-900 text-base">{title}</h1>
//       </div>
//       <div className="flex items-center gap-3">
//         <button className="relative p-2 rounded-lg text-navy-600 hover:bg-gray-100 transition-colors">
//           <Bell size={18} />
//           <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-crimson-600" />
//         </button>
//         <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center font-display font-700 text-gold-400 text-xs">
//           {profile?.firstName?.[0]}{profile?.lastName?.[0]}
//         </div>
//       </div>
//     </header>
//   )
// }

// export default function AdminLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   return (
//     <div className="flex h-screen bg-slate-academy overflow-hidden">
//       <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
//         <main className="flex-1 overflow-y-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   )
// }


// FILE: src/portals/admin/components/AdminLayout.jsx

import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, UserCheck, BookOpen, GraduationCap,
  ClipboardList, BarChart2, CreditCard, Award, FileText,
  PieChart, Shield, Settings, LogOut, Menu, X,
  ChevronDown, Bell
} from 'lucide-react'
import { logOut } from '@/firebase/auth'
import useAuthStore from '@/shared/store/authStore'
import toast from 'react-hot-toast'

const NAV_GROUPS = [
  { label: 'Overview',   items: [{ label: 'Dashboard',    path: '/admin/dashboard',    icon: LayoutDashboard }] },
  { label: 'People',     items: [{ label: 'Students',     path: '/admin/students',     icon: Users }, { label: 'Lecturers', path: '/admin/lecturers', icon: UserCheck }] },
  { label: 'Academics',  items: [
    { label: 'Programs',    path: '/admin/programs',    icon: BookOpen },
    { label: 'Courses',     path: '/admin/courses',     icon: GraduationCap },
    { label: 'Admissions',  path: '/admin/admissions',  icon: ClipboardList },
    { label: 'Results',     path: '/admin/results',     icon: BarChart2 },
  ]},
  { label: 'Operations', items: [
    { label: 'Finance',      path: '/admin/finance',      icon: CreditCard },
    { label: 'Certificates', path: '/admin/certificates', icon: Award },
    { label: 'Content',      path: '/admin/content',      icon: FileText },
  ]},
  { label: 'System',     items: [
    { label: 'Reports',  path: '/admin/reports',  icon: PieChart },
    { label: 'Roles',    path: '/admin/roles',    icon: Shield },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ]},
]

function Sidebar({ open, onClose }) {
  const navigate    = useNavigate()
  const location    = useLocation()
  const { profile } = useAuthStore()
  const [collapsed, setCollapsed] = useState({})

  const handleLogout = async () => {
    try { await logOut(); toast.success('Signed out.'); navigate('/login', { replace: true }) }
    catch { toast.error('Sign out failed.') }
  }

  const initials = `${profile?.firstName?.[0] ?? 'A'}${profile?.lastName?.[0] ?? ''}`.toUpperCase()

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />
        )}
      </AnimatePresence>

      <aside className={`fixed top-0 left-0 h-full w-64 bg-navy-900 z-40 flex flex-col
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>

        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-500/20 flex items-center justify-center">
              <GraduationCap size={16} className="text-gold-400" />
            </div>
            <div className="leading-tight">
              <span className="block font-display font-800 text-white text-xs tracking-wide">Pridelands</span>
              <span className="block font-display font-600 text-gold-400 text-[10px] tracking-wider">Admin Portal</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white"><X size={18} /></button>
        </div>

        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-white/5">
            <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center font-display font-700 text-navy-900 text-xs flex-shrink-0">{initials}</div>
            <div className="min-w-0 flex-1">
              <p className="font-display font-700 text-white text-xs truncate">{profile?.firstName} {profile?.lastName}</p>
              <p className="text-gold-400 text-[10px] capitalize">{profile?.role?.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3 scrollbar-thin">
          {NAV_GROUPS.map((group) => {
            const isCollapsed = collapsed[group.label]
            return (
              <div key={group.label} className="mb-1">
                <button onClick={() => setCollapsed(p => ({ ...p, [group.label]: !p[group.label] }))}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-navy-500 hover:text-navy-300 transition-colors mb-0.5">
                  <span className="text-[10px] font-display font-700 tracking-widest uppercase">{group.label}</span>
                  <ChevronDown size={11} className={`transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      {group.items.map(({ label, path, icon: Icon }) => (
                        <NavLink key={path} to={path} onClick={onClose}
                          className={() => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display font-500
                            transition-all duration-150 mb-0.5 group
                            ${location.pathname === path ? 'bg-gold-500/15 text-gold-400 font-600' : 'text-navy-300 hover:bg-white/8 hover:text-white'}`}>
                          <Icon size={15} className="flex-shrink-0" />
                          <span className="truncate text-sm">{label}</span>
                          {location.pathname === path && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400" />}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-display font-500 text-navy-400 hover:bg-crimson-600/15 hover:text-crimson-400 transition-all">
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}

function AdminHeader({ onMenuClick }) {
  const { profile } = useAuthStore()
  const location    = useLocation()
  const title = NAV_GROUPS.flatMap(g => g.items).find(i => i.path === location.pathname)?.label ?? 'Admin Portal'

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-5 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg text-navy-700 hover:bg-gray-100 transition-colors"><Menu size={20} /></button>
        <h1 className="font-display font-700 text-navy-900 text-base">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg text-navy-600 hover:bg-gray-100 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-crimson-600" />
        </button>
        <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center font-display font-700 text-gold-400 text-xs">
          {profile?.firstName?.[0]}{profile?.lastName?.[0]}
        </div>
      </div>
    </header>
  )
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="flex h-screen bg-slate-academy overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto"><Outlet /></main>
      </div>
    </div>
  )
}