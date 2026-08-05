// // FILE: src/portals/admin/pages/Finance.jsx

// import React, { useEffect, useState } from 'react'
// import { motion } from 'framer-motion'
// import {
//   CreditCard, TrendingUp, AlertCircle,
//   CheckCircle, Search, Download, Filter
// } from 'lucide-react'
// import { getPayments, updatePayment, orderBy } from '@/firebase/firestore'
// import toast from 'react-hot-toast'
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   Tooltip, ResponsiveContainer
// } from 'recharts'

// function formatCurrency(v) {
//   return new Intl.NumberFormat('fr-CM', {
//     style: 'currency', currency: 'XAF', maximumFractionDigits: 0
//   }).format(v ?? 0)
// }

// function formatDate(val) {
//   if (!val) return '—'
//   const d = val?.toDate ? val.toDate() : new Date(val)
//   return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
// }

// function statusBadge(s) {
//   switch (s) {
//     case 'paid':    return 'badge badge-green'
//     case 'pending': return 'badge bg-gold-500/15 text-gold-700'
//     case 'overdue': return 'badge badge-red'
//     default:        return 'badge bg-gray-100 text-gray-500'
//   }
// }

// // Mock monthly revenue — replace with real Firestore aggregation
// const monthlyData = [
//   { month: 'Sep', revenue: 4200000 },
//   { month: 'Oct', revenue: 5800000 },
//   { month: 'Nov', revenue: 3900000 },
//   { month: 'Dec', revenue: 2100000 },
//   { month: 'Jan', revenue: 6700000 },
//   { month: 'Feb', revenue: 7200000 },
//   { month: 'Mar', revenue: 5500000 },
//   { month: 'Apr', revenue: 8100000 },
//   { month: 'May', revenue: 6300000 },
// ]

// export default function Finance() {
//   const [payments,   setPayments]   = useState([])
//   const [loading,    setLoading]    = useState(true)
//   const [search,     setSearch]     = useState('')
//   const [statusFilter, setStatusFilter] = useState('all')
//   const [marking,    setMarking]    = useState(null)

//   useEffect(() => {
//     getPayments([orderBy('createdAt', 'desc')])
//       .then(setPayments).catch(console.error).finally(() => setLoading(false))
//   }, [])

//   const filtered = payments.filter(p => {
//     const matchSearch = !search ||
//       `${p.studentName ?? ''} ${p.description ?? ''} ${p.reference ?? ''}`.toLowerCase().includes(search.toLowerCase())
//     const matchStatus = statusFilter === 'all' || p.status === statusFilter
//     return matchSearch && matchStatus
//   })

//   const totalPaid      = payments.filter(p => p.status === 'paid').reduce((s, p) => s + (p.amount ?? 0), 0)
//   const totalPending   = payments.filter(p => p.status === 'pending').reduce((s, p) => s + (p.amount ?? 0), 0)
//   const totalOverdue   = payments.filter(p => p.status === 'overdue').reduce((s, p) => s + (p.amount ?? 0), 0)

//   const markAsPaid = async (payment) => {
//     setMarking(payment.id)
//     try {
//       await updatePayment(payment.id, { status: 'paid', paidAt: new Date() })
//       setPayments(prev => prev.map(p => p.id === payment.id ? { ...p, status: 'paid' } : p))
//       toast.success('Payment marked as paid.')
//     } catch { toast.error('Update failed.') }
//     finally { setMarking(null) }
//   }

//   return (
//     <div className="portal-page">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h2 className="font-display font-800 text-navy-900 text-xl">Finance Management</h2>
//           <p className="text-gray-400 text-sm mt-0.5">{payments.length} total transactions</p>
//         </div>
//         <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-navy-700 font-display font-600 text-sm rounded-academy hover:border-navy-900 transition-all">
//           <Download size={14} /> Export CSV
//         </button>
//       </div>

//       {/* KPI cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//         {[
//           { label: 'Total Collected',    value: totalPaid,    icon: CheckCircle,  color: 'bg-emerald-600' },
//           { label: 'Pending Payments',   value: totalPending, icon: CreditCard,   color: 'bg-gold-500' },
//           { label: 'Overdue Balance',    value: totalOverdue, icon: AlertCircle,  color: 'bg-crimson-600' },
//         ].map((s, i) => (
//           <motion.div key={s.label}
//             initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
//             className="card p-5 flex items-center gap-4"
//           >
//             <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
//               <s.icon size={18} className="text-white" />
//             </div>
//             <div>
//               <p className="font-display font-800 text-navy-900 text-lg leading-tight">{formatCurrency(s.value)}</p>
//               <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Revenue chart */}
//       <motion.div
//         initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
//         className="card p-6 mb-6"
//       >
//         <h3 className="font-display font-700 text-navy-900 text-sm mb-5">Monthly Revenue (FCFA)</h3>
//         <ResponsiveContainer width="100%" height={200}>
//           <BarChart data={monthlyData}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//             <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
//             <YAxis tick={{ fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false}
//               tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
//             <Tooltip
//               formatter={v => formatCurrency(v)}
//               contentStyle={{ fontFamily: 'Inter', fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
//             />
//             <Bar dataKey="revenue" fill="#0A1628" radius={[4, 4, 0, 0]} />
//           </BarChart>
//         </ResponsiveContainer>
//       </motion.div>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row gap-3 mb-5">
//         <div className="relative flex-1">
//           <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input type="text" placeholder="Search by student, description or reference..."
//             value={search} onChange={e => setSearch(e.target.value)}
//             className="input pl-9 py-2.5 text-sm w-full" />
//         </div>
//         <div className="relative">
//           <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
//           <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
//             className="input pl-9 py-2.5 text-sm appearance-none pr-8">
//             <option value="all">All Status</option>
//             <option value="paid">Paid</option>
//             <option value="pending">Pending</option>
//             <option value="overdue">Overdue</option>
//           </select>
//         </div>
//       </div>

//       {/* Transactions table */}
//       {loading ? (
//         <div className="space-y-2">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-14 rounded-academy" />)}</div>
//       ) : filtered.length === 0 ? (
//         <div className="card p-12 text-center">
//           <CreditCard size={36} className="text-gray-300 mx-auto mb-3" />
//           <p className="text-gray-400 text-sm">No transactions found.</p>
//         </div>
//       ) : (
//         <div className="card overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="table-academy">
//               <thead>
//                 <tr>
//                   <th>Student</th>
//                   <th>Description</th>
//                   <th>Reference</th>
//                   <th className="text-center">Status</th>
//                   <th>Date</th>
//                   <th className="text-right">Amount</th>
//                   <th />
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((p, i) => (
//                   <motion.tr key={p.id}
//                     initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
//                     <td className="font-display font-600 text-sm">{p.studentName ?? '—'}</td>
//                     <td className="text-gray-500 text-sm">{p.description ?? 'Tuition Fee'}</td>
//                     <td className="font-mono text-xs text-gray-400">{p.reference ?? p.id?.slice(0, 10)}</td>
//                     <td className="text-center"><span className={statusBadge(p.status)}>{p.status}</span></td>
//                     <td className="text-gray-400 text-sm">{formatDate(p.createdAt)}</td>
//                     <td className="text-right font-display font-700 text-navy-900 text-sm">{formatCurrency(p.amount)}</td>
//                     <td>
//                       {p.status !== 'paid' && (
//                         <button onClick={() => markAsPaid(p)} disabled={marking === p.id}
//                           className="text-xs font-display font-600 text-emerald-600 hover:text-emerald-700 transition-colors whitespace-nowrap disabled:opacity-40">
//                           {marking === p.id
//                             ? <span className="w-3 h-3 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin inline-block" />
//                             : 'Mark Paid'
//                           }
//                         </button>
//                       )}
//                     </td>
//                   </motion.tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <div className="px-4 py-3 border-t border-gray-100">
//             <p className="text-gray-400 text-xs">Showing {filtered.length} of {payments.length} transactions</p>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


// FILE: src/portals/admin/pages/Finance.jsx

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, TrendingUp, AlertCircle, CheckCircle, Search, Download, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import { getPayments, updatePayment, orderBy } from '@/firebase/firestore'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function formatCurrency(v) {
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(v ?? 0)
}

function formatDate(val) {
  if (!val) return '—'
  const d = val?.toDate ? val.toDate() : new Date(val)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function statusBadge(s) {
  switch (s) {
    case 'paid':    return 'badge badge-green'
    case 'pending': return 'badge bg-gold-500/15 text-gold-700'
    case 'overdue': return 'badge badge-red'
    default:        return 'badge bg-gray-100 text-gray-500'
  }
}

const MONTHLY_DATA = [
  { month: 'Sep', revenue: 4200000 }, { month: 'Oct', revenue: 5800000 },
  { month: 'Nov', revenue: 3900000 }, { month: 'Dec', revenue: 2100000 },
  { month: 'Jan', revenue: 6700000 }, { month: 'Feb', revenue: 7200000 },
  { month: 'Mar', revenue: 5500000 }, { month: 'Apr', revenue: 8100000 },
  { month: 'May', revenue: 6300000 },
]

export default function Finance() {
  const [payments,     setPayments]     = useState([])
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [marking,      setMarking]      = useState(null)

  useEffect(() => {
    getPayments([orderBy('createdAt', 'desc')])
      .then(setPayments).catch(console.error).finally(() => setLoading(false))
  }, [])

  const filtered = payments.filter(p => {
    const matchSearch = !search ||
      `${p.studentName ?? ''} ${p.description ?? ''} ${p.reference ?? ''}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalPaid    = payments.filter(p => p.status === 'paid').reduce((s, p) => s + (p.amount ?? 0), 0)
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + (p.amount ?? 0), 0)
  const totalOverdue = payments.filter(p => p.status === 'overdue').reduce((s, p) => s + (p.amount ?? 0), 0)

  const markAsPaid = async (payment) => {
    setMarking(payment.id)
    try {
      await updatePayment(payment.id, { status: 'paid', paidAt: new Date() })
      setPayments(prev => prev.map(p => p.id === payment.id ? { ...p, status: 'paid' } : p))
      toast.success('Payment marked as paid.')
    } catch { toast.error('Update failed.') }
    finally { setMarking(null) }
  }

  return (
    <div className="portal-page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-800 text-navy-900 text-xl">Finance Management</h2>
          <p className="text-gray-400 text-sm mt-0.5">{payments.length} total transactions</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-navy-700 font-display font-600 text-sm rounded-academy hover:border-navy-900 transition-all">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Collected',  value: totalPaid,    icon: CheckCircle, color: 'bg-emerald-600' },
          { label: 'Pending Payments', value: totalPending, icon: CreditCard,  color: 'bg-gold-500' },
          { label: 'Overdue Balance',  value: totalOverdue, icon: AlertCircle, color: 'bg-crimson-600' },
        ].map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="card p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
              <s.icon size={18} className="text-white" />
            </div>
            <div>
              <p className="font-display font-800 text-navy-900 text-lg leading-tight">{formatCurrency(s.value)}</p>
              <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue chart */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="card p-6 mb-6">
        <h3 className="font-display font-700 text-navy-900 text-sm mb-5">Monthly Revenue (FCFA)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={MONTHLY_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false}
              tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} />
            <Tooltip formatter={v => formatCurrency(v)}
              contentStyle={{ fontFamily: 'Inter', fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
            <Bar dataKey="revenue" fill="#0A1628" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by student, description or reference..."
            value={search} onChange={e => setSearch(e.target.value)} className="input pl-9 py-2.5 text-sm w-full" />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="input pl-9 py-2.5 text-sm appearance-none pr-8">
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-academy" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <CreditCard size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No transactions found.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-academy">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Description</th>
                  <th>Reference</th>
                  <th className="text-center">Status</th>
                  <th>Date</th>
                  <th className="text-right">Amount</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <td className="font-display font-600 text-sm">{p.studentName ?? '—'}</td>
                    <td className="text-gray-500 text-sm">{p.description ?? 'Tuition Fee'}</td>
                    <td className="font-mono text-xs text-gray-400">{p.reference ?? p.id?.slice(0, 10)}</td>
                    <td className="text-center"><span className={statusBadge(p.status)}>{p.status}</span></td>
                    <td className="text-gray-400 text-sm">{formatDate(p.createdAt)}</td>
                    <td className="text-right font-display font-700 text-navy-900 text-sm">{formatCurrency(p.amount)}</td>
                    <td className="text-right">
                      {p.status !== 'paid' && (
                        <button onClick={() => markAsPaid(p)} disabled={marking === p.id}
                          className="text-xs font-display font-600 text-emerald-600 hover:text-emerald-700 transition-colors whitespace-nowrap disabled:opacity-40">
                          {marking === p.id
                            ? <span className="w-3 h-3 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin inline-block" />
                            : 'Mark Paid'}
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100">
            <p className="text-gray-400 text-xs">Showing {filtered.length} of {payments.length} transactions</p>
          </div>
        </div>
      )}
    </div>
  )
}