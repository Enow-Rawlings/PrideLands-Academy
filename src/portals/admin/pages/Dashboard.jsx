// // FILE: src/portals/admin/pages/Dashboard.jsx

// import React, { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import {
//   Users, UserCheck, BookOpen, CreditCard,
//   TrendingUp, ClipboardList, ArrowRight,
//   GraduationCap, AlertCircle
// } from 'lucide-react'
// import {
//   AreaChart, Area, XAxis, YAxis, CartesianGrid,
//   Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
// } from 'recharts'
// import { getStudents, getLecturers, getApplications, getPayments, where, orderBy, limit } from '@/firebase/firestore'

// const FadeUp = ({ children, delay = 0, className = '' }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 16 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.4, delay }}
//     className={className}
//   >
//     {children}
//   </motion.div>
// )

// // ─── Stat Card ─────────────────────────────────────────────────────
// function KPICard({ icon: Icon, label, value, change, color, to, delay }) {
//   const card = (
//     <FadeUp delay={delay} className="card p-5 group hover:-translate-y-0.5 transition-transform duration-300">
//       <div className="flex items-start justify-between mb-3">
//         <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
//           <Icon size={19} className="text-white" />
//         </div>
//         {change != null && (
//           <span className={`text-xs font-display font-600 px-2 py-1 rounded-full ${
//             change >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-crimson-600/10 text-crimson-600'
//           }`}>
//             {change >= 0 ? '+' : ''}{change}%
//           </span>
//         )}
//       </div>
//       <p className="font-display font-900 text-navy-900 text-3xl leading-none mb-1">
//         {value ?? <span className="skeleton w-12 h-7 rounded inline-block" />}
//       </p>
//       <p className="text-gray-400 text-sm">{label}</p>
//       {to && (
//         <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1 text-xs text-navy-700 font-display font-600 group-hover:text-gold-600 transition-colors">
//           View Details <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
//         </div>
//       )}
//     </FadeUp>
//   )
//   return to ? <Link to={to}>{card}</Link> : card
// }

// // ─── Mock chart data (replace with real Firestore aggregates) ─────
// const enrollmentData = [
//   { month: 'Sep', students: 180 },
//   { month: 'Oct', students: 210 },
//   { month: 'Nov', students: 245 },
//   { month: 'Dec', students: 240 },
//   { month: 'Jan', students: 280 },
//   { month: 'Feb', students: 320 },
//   { month: 'Mar', students: 355 },
//   { month: 'Apr', students: 390 },
//   { month: 'May', students: 420 },
//   { month: 'Jun', students: 450 },
// ]

// const programData = [
//   { name: 'Technology & AI', value: 35, color: '#0A1628' },
//   { name: 'Business',        value: 28, color: '#C9A84C' },
//   { name: 'Entrepreneurship',value: 18, color: '#3d5da8' },
//   { name: 'Prof. Dev.',      value: 12, color: '#1e3570' },
//   { name: 'Other',           value: 7,  color: '#9CA3AF' },
// ]

// export default function AdminDashboard() {
//   const [stats,    setStats]   = useState({ students:null, lecturers:null, applications:null, revenue:null })
//   const [recent,   setRecent]  = useState({ applications:[], payments:[] })
//   const [loading,  setLoading] = useState(true)

//   useEffect(() => {
//     async function load() {
//       try {
//         const [students, lecturers, applications, payments] = await Promise.all([
//           getStudents(),
//           getLecturers(),
//           getApplications([orderBy('createdAt','desc'), limit(5)]),
//           getPayments([orderBy('createdAt','desc'), limit(5)]),
//         ])

//         const revenue = payments
//           .filter(p => p.status === 'paid')
//           .reduce((s, p) => s + (p.amount ?? 0), 0)

//         setStats({
//           students:     students.length,
//           lecturers:    lecturers.length,
//           applications: applications.length,
//           revenue,
//         })
//         setRecent({ applications, payments })
//       } catch (err) { console.error(err) }
//       finally { setLoading(false) }
//     }
//     load()
//   }, [])

//   function formatCurrency(v) {
//     return new Intl.NumberFormat('fr-CM', { style:'currency', currency:'XAF', maximumFractionDigits:0 }).format(v)
//   }

//   function formatDate(val) {
//     if (!val) return '—'
//     const d = val?.toDate ? val.toDate() : new Date(val)
//     return d.toLocaleDateString('en-GB', { day:'numeric', month:'short' })
//   }

//   function statusBadge(s) {
//     switch (s) {
//       case 'pending':  return 'badge bg-gold-500/15 text-gold-700'
//       case 'approved': return 'badge badge-green'
//       case 'rejected': return 'badge badge-red'
//       case 'paid':     return 'badge badge-green'
//       default:         return 'badge bg-gray-100 text-gray-500'
//     }
//   }

//   return (
//     <div className="portal-page">

//       {/* Greeting */}
//       <FadeUp className="mb-6">
//         <h2 className="font-display font-800 text-navy-900 text-xl">Admin Dashboard</h2>
//         <p className="text-gray-400 text-sm mt-0.5">
//           {new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
//         </p>
//       </FadeUp>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <KPICard icon={Users}        label="Total Students"    value={stats.students}    change={12}  color="bg-navy-900"    to="/admin/students"   delay={0.05} />
//         <KPICard icon={UserCheck}    label="Lecturers"         value={stats.lecturers}   change={5}   color="bg-blue-600"    to="/admin/lecturers"  delay={0.1}  />
//         <KPICard icon={ClipboardList}label="New Applications"  value={stats.applications}change={18}  color="bg-gold-500"    to="/admin/admissions" delay={0.15} />
//         <KPICard icon={CreditCard}   label="Revenue (Paid)"
//           value={stats.revenue != null ? formatCurrency(stats.revenue) : null}
//           color="bg-emerald-600" to="/admin/finance" delay={0.2}
//         />
//       </div>

//       {/* Charts row */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

//         {/* Enrollment trend */}
//         <FadeUp delay={0.25} className="lg:col-span-2">
//           <div className="card p-6 h-full">
//             <div className="flex items-center justify-between mb-5">
//               <h3 className="font-display font-700 text-navy-900 text-sm">Enrollment Trend</h3>
//               <span className="badge-gold text-xs">2024/2025</span>
//             </div>
//             <ResponsiveContainer width="100%" height={200}>
//               <AreaChart data={enrollmentData}>
//                 <defs>
//                   <linearGradient id="studentGrad" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%"  stopColor="#0A1628" stopOpacity={0.15} />
//                     <stop offset="95%" stopColor="#0A1628" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis dataKey="month" tick={{ fontSize:11, fontFamily:'Inter' }} axisLine={false} tickLine={false} />
//                 <YAxis tick={{ fontSize:11, fontFamily:'Inter' }} axisLine={false} tickLine={false} />
//                 <Tooltip contentStyle={{ fontFamily:'Inter', fontSize:12, borderRadius:8, border:'1px solid #e5e7eb' }} />
//                 <Area type="monotone" dataKey="students" stroke="#0A1628" strokeWidth={2} fill="url(#studentGrad)" dot={false} activeDot={{ r:4, fill:'#C9A84C' }} />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </FadeUp>

//         {/* Programs pie */}
//         <FadeUp delay={0.3}>
//           <div className="card p-6 h-full">
//             <h3 className="font-display font-700 text-navy-900 text-sm mb-5">Students by Program</h3>
//             <ResponsiveContainer width="100%" height={200}>
//               <PieChart>
//                 <Pie data={programData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
//                   paddingAngle={3} dataKey="value">
//                   {programData.map((entry, i) => (
//                     <Cell key={i} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip contentStyle={{ fontFamily:'Inter', fontSize:11, borderRadius:8 }} />
//                 <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:10, fontFamily:'Inter' }} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </FadeUp>
//       </div>

//       {/* Recent activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

//         {/* Recent applications */}
//         <FadeUp delay={0.35}>
//           <div className="card p-6">
//             <div className="flex items-center justify-between mb-5">
//               <h3 className="font-display font-700 text-navy-900 text-sm">Recent Applications</h3>
//               <Link to="/admin/admissions" className="text-xs text-gold-600 font-display font-600 hover:text-gold-700">
//                 View All
//               </Link>
//             </div>
//             {recent.applications.length === 0 ? (
//               <p className="text-gray-400 text-sm text-center py-8">No applications yet.</p>
//             ) : (
//               <div className="space-y-3">
//                 {recent.applications.map((app) => (
//                   <div key={app.id} className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-full bg-navy-900/10 flex items-center justify-center font-display font-700 text-navy-900 text-xs flex-shrink-0">
//                       {app.firstName?.[0]}{app.lastName?.[0]}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="font-display font-600 text-navy-900 text-sm truncate">
//                         {app.firstName} {app.lastName}
//                       </p>
//                       <p className="text-gray-400 text-xs">{app.program} · {formatDate(app.createdAt)}</p>
//                     </div>
//                     <span className={statusBadge(app.status)}>{app.status}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </FadeUp>

//         {/* Recent payments */}
//         <FadeUp delay={0.4}>
//           <div className="card p-6">
//             <div className="flex items-center justify-between mb-5">
//               <h3 className="font-display font-700 text-navy-900 text-sm">Recent Payments</h3>
//               <Link to="/admin/finance" className="text-xs text-gold-600 font-display font-600 hover:text-gold-700">
//                 View All
//               </Link>
//             </div>
//             {recent.payments.length === 0 ? (
//               <p className="text-gray-400 text-sm text-center py-8">No payments yet.</p>
//             ) : (
//               <div className="space-y-3">
//                 {recent.payments.map((p) => (
//                   <div key={p.id} className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
//                       <CreditCard size={13} className="text-emerald-600" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="font-display font-600 text-navy-900 text-sm truncate">
//                         {p.description ?? 'Tuition Fee'}
//                       </p>
//                       <p className="text-gray-400 text-xs">{formatDate(p.createdAt)}</p>
//                     </div>
//                     <div className="text-right flex-shrink-0">
//                       <p className="font-display font-700 text-navy-900 text-sm">
//                         {formatCurrency(p.amount ?? 0)}
//                       </p>
//                       <span className={statusBadge(p.status)}>{p.status}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </FadeUp>
//       </div>
//     </div>
//   )
// }


// second template
// FILE: src/portals/admin/pages/Dashboard.jsx

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users, UserCheck, ClipboardList, CreditCard,
  ArrowRight, TrendingUp, GraduationCap
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import {
  getStudents, getLecturers, getApplications,
  getPayments, orderBy, limit
} from '@/firebase/firestore'

const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }} className={className}>
    {children}
  </motion.div>
)

const ENROLLMENT_DATA = [
  { month: 'Sep', students: 180 }, { month: 'Oct', students: 210 },
  { month: 'Nov', students: 245 }, { month: 'Dec', students: 240 },
  { month: 'Jan', students: 280 }, { month: 'Feb', students: 320 },
  { month: 'Mar', students: 355 }, { month: 'Apr', students: 390 },
  { month: 'May', students: 420 }, { month: 'Jun', students: 450 },
]

const PROGRAM_DATA = [
  { name: 'Technology & AI', value: 35, color: '#0A1628' },
  { name: 'Business',        value: 28, color: '#C9A84C' },
  { name: 'Entrepreneurship',value: 18, color: '#3d5da8' },
  { name: 'Prof. Dev.',      value: 12, color: '#1e3570' },
  { name: 'Other',           value: 7,  color: '#9CA3AF' },
]

function KPICard({ icon: Icon, label, value, change, color, to, delay }) {
  const card = (
    <FadeUp delay={delay} className="card p-5 group hover:-translate-y-0.5 transition-transform duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={19} className="text-white" />
        </div>
        {change != null && (
          <span className={`text-xs font-display font-600 px-2 py-1 rounded-full ${change >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-crimson-600/10 text-crimson-600'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <p className="font-display font-900 text-navy-900 text-3xl leading-none mb-1">
        {value ?? <span className="skeleton w-16 h-7 rounded inline-block" />}
      </p>
      <p className="text-gray-400 text-sm">{label}</p>
      {to && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1 text-xs text-navy-700 font-display font-600 group-hover:text-gold-600 transition-colors">
          View Details <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      )}
    </FadeUp>
  )
  return to ? <Link to={to}>{card}</Link> : card
}

function formatCurrency(v) {
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(v ?? 0)
}

function formatDate(val) {
  if (!val) return '—'
  const d = val?.toDate ? val.toDate() : new Date(val)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function statusBadge(s) {
  switch (s) {
    case 'pending':  return 'badge bg-gold-500/15 text-gold-700'
    case 'approved': return 'badge badge-green'
    case 'rejected': return 'badge badge-red'
    case 'paid':     return 'badge badge-green'
    default:         return 'badge bg-gray-100 text-gray-500'
  }
}

export default function AdminDashboard() {
  const [stats,   setStats]   = useState({ students: null, lecturers: null, applications: null, revenue: null })
  const [recent,  setRecent]  = useState({ applications: [], payments: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [students, lecturers, applications, payments] = await Promise.all([
          getStudents(),
          getLecturers(),
          getApplications([orderBy('createdAt', 'desc'), limit(5)]),
          getPayments([orderBy('createdAt', 'desc'), limit(5)]),
        ])
        const revenue = payments.filter(p => p.status === 'paid').reduce((s, p) => s + (p.amount ?? 0), 0)
        setStats({ students: students.length, lecturers: lecturers.length, applications: applications.length, revenue })
        setRecent({ applications, payments })
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <div className="portal-page">
      <FadeUp className="mb-6">
        <h2 className="font-display font-800 text-navy-900 text-xl">Admin Dashboard</h2>
        <p className="text-gray-400 text-sm mt-0.5">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </FadeUp>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard icon={Users}         label="Total Students"   value={stats.students}    change={12} color="bg-navy-900"    to="/admin/students"   delay={0.05} />
        <KPICard icon={UserCheck}     label="Lecturers"        value={stats.lecturers}   change={5}  color="bg-blue-600"    to="/admin/lecturers"  delay={0.1} />
        <KPICard icon={ClipboardList} label="New Applications" value={stats.applications}change={18} color="bg-gold-500"    to="/admin/admissions" delay={0.15} />
        <KPICard icon={CreditCard}    label="Revenue (Paid)"
          value={stats.revenue != null ? formatCurrency(stats.revenue) : null}
          color="bg-emerald-600" to="/admin/finance" delay={0.2} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <FadeUp delay={0.25} className="lg:col-span-2">
          <div className="card p-6 h-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-700 text-navy-900 text-sm">Enrollment Trend</h3>
              <span className="badge-gold text-xs">2024/2025</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={ENROLLMENT_DATA}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0A1628" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0A1628" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontFamily: 'Inter', fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
                <Area type="monotone" dataKey="students" stroke="#0A1628" strokeWidth={2}
                  fill="url(#grad)" dot={false} activeDot={{ r: 4, fill: '#C9A84C' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </FadeUp>

        <FadeUp delay={0.3}>
          <div className="card p-6 h-full">
            <h3 className="font-display font-700 text-navy-900 text-sm mb-5">Students by Program</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={PROGRAM_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  paddingAngle={3} dataKey="value">
                  {PROGRAM_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ fontFamily: 'Inter', fontSize: 11, borderRadius: 8 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, fontFamily: 'Inter' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </FadeUp>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <FadeUp delay={0.35}>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-700 text-navy-900 text-sm">Recent Applications</h3>
              <Link to="/admin/admissions" className="text-xs text-gold-600 font-display font-600 hover:text-gold-700">View All</Link>
            </div>
            {recent.applications.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No applications yet.</p>
            ) : (
              <div className="space-y-3">
                {recent.applications.map(app => (
                  <div key={app.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-navy-900/10 flex items-center justify-center font-display font-700 text-navy-900 text-xs flex-shrink-0">
                      {app.firstName?.[0]}{app.lastName?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-600 text-navy-900 text-sm truncate">{app.firstName} {app.lastName}</p>
                      <p className="text-gray-400 text-xs">{app.program ?? app.programId} · {formatDate(app.createdAt)}</p>
                    </div>
                    <span className={statusBadge(app.status)}>{app.status ?? 'pending'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FadeUp>

        <FadeUp delay={0.4}>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-700 text-navy-900 text-sm">Recent Payments</h3>
              <Link to="/admin/finance" className="text-xs text-gold-600 font-display font-600 hover:text-gold-700">View All</Link>
            </div>
            {recent.payments.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No payments yet.</p>
            ) : (
              <div className="space-y-3">
                {recent.payments.map(p => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <CreditCard size={13} className="text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-600 text-navy-900 text-sm truncate">{p.description ?? 'Tuition Fee'}</p>
                      <p className="text-gray-400 text-xs">{formatDate(p.createdAt)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-display font-700 text-navy-900 text-sm">{formatCurrency(p.amount)}</p>
                      <span className={statusBadge(p.status)}>{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FadeUp>
      </div>
    </div>
  )
}