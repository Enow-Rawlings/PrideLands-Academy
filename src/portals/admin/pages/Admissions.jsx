// // FILE: src/portals/admin/pages/Admissions.jsx

// import React, { useEffect, useState } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import {
//   ClipboardList, Search, CheckCircle, X,
//   Clock, Eye, Filter, Calendar
// } from 'lucide-react'
// import toast from 'react-hot-toast'
// import { getApplications, updateApplication, orderBy } from '@/firebase/firestore'

// const STATUS_TABS = ['all', 'pending', 'approved', 'rejected']

// function formatDate(val) {
//   if (!val) return '—'
//   const d = val?.toDate ? val.toDate() : new Date(val)
//   return d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })
// }

// function statusBadge(s) {
//   switch (s) {
//     case 'pending':  return 'badge bg-gold-500/15 text-gold-700'
//     case 'approved': return 'badge badge-green'
//     case 'rejected': return 'badge badge-red'
//     default:         return 'badge bg-gray-100 text-gray-500'
//   }
// }

// function AppDetailModal({ app, onClose, onUpdate }) {
//   const [processing, setProcessing] = useState(false)

//   const handle = async (status) => {
//     setProcessing(true)
//     try {
//       await updateApplication(app.id, { status, reviewedAt: new Date() })
//       onUpdate({ ...app, status })
//       toast.success(`Application ${status}.`)
//       onClose()
//     } catch { toast.error('Action failed.') }
//     finally { setProcessing(false) }
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//       <motion.div initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }}
//         className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
//           <h3 className="font-display font-700 text-navy-900 text-base">Application Review</h3>
//           <button onClick={onClose} className="text-gray-400 hover:text-navy-900 transition-colors">
//             <X size={20} />
//           </button>
//         </div>

//         <div className="p-6 space-y-5">
//           {/* Applicant info */}
//           <div className="flex items-center gap-4 p-4 bg-slate-academy rounded-xl">
//             <div className="w-12 h-12 rounded-full bg-navy-900 flex items-center justify-center font-display font-800 text-gold-400 text-base flex-shrink-0">
//               {app.firstName?.[0]}{app.lastName?.[0]}
//             </div>
//             <div>
//               <p className="font-display font-800 text-navy-900">{app.firstName} {app.lastName}</p>
//               <p className="text-gray-400 text-sm">{app.email}</p>
//               <span className={statusBadge(app.status)}>{app.status}</span>
//             </div>
//           </div>

//           {/* Details grid */}
//           <div className="grid grid-cols-2 gap-3">
//             {[
//               { label:'Programme',        value: app.program ?? app.programId },
//               { label:'Intake',           value: app.intake },
//               { label:'Phone',            value: app.phone },
//               { label:'Nationality',      value: app.nationality },
//               { label:'Last School',      value: app.lastSchool },
//               { label:'Qualification',    value: app.qualification },
//               { label:'Graduation Year',  value: app.graduationYear },
//               { label:'Applied',          value: formatDate(app.createdAt) },
//             ].map(({ label, value }) => (
//               <div key={label} className="p-3 rounded-lg bg-slate-academy">
//                 <p className="text-gray-400 text-xs mb-0.5">{label}</p>
//                 <p className="font-display font-600 text-navy-900 text-sm">{value ?? '—'}</p>
//               </div>
//             ))}
//           </div>

//           {/* Statement of purpose */}
//           {app.statementOfPurpose && (
//             <div>
//               <p className="label mb-2">Statement of Purpose</p>
//               <p className="text-gray-600 text-sm leading-relaxed p-4 bg-slate-academy rounded-lg">
//                 {app.statementOfPurpose}
//               </p>
//             </div>
//           )}

//           {/* Document checklist */}
//           <div>
//             <p className="label mb-2">Documents Submitted</p>
//             <div className="flex flex-wrap gap-2">
//               {app.transcriptUploaded && <span className="badge badge-green">Transcript ✓</span>}
//               {app.idUploaded         && <span className="badge badge-green">ID ✓</span>}
//               {app.photoUploaded      && <span className="badge badge-green">Photo ✓</span>}
//             </div>
//           </div>
//         </div>

//         {/* Actions */}
//         {app.status === 'pending' && (
//           <div className="flex gap-3 px-6 pb-6">
//             <button onClick={() => handle('rejected')} disabled={processing}
//               className="flex-1 inline-flex items-center justify-center gap-2 py-3 border border-crimson-600 text-crimson-600 font-display font-700 text-sm rounded-academy hover:bg-crimson-600 hover:text-white transition-all disabled:opacity-60">
//               <X size={14}/> Reject
//             </button>
//             <button onClick={() => handle('approved')} disabled={processing}
//               className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white font-display font-700 text-sm rounded-academy hover:bg-emerald-500 transition-all disabled:opacity-60">
//               {processing
//                 ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"/>
//                 : <><CheckCircle size={14}/> Approve</>}
//             </button>
//           </div>
//         )}
//       </motion.div>
//     </div>
//   )
// }

// export default function Admissions() {
//   const [applications, setApplications] = useState([])
//   const [loading,      setLoading]      = useState(true)
//   const [search,       setSearch]       = useState('')
//   const [statusTab,    setStatusTab]    = useState('all')
//   const [viewing,      setViewing]      = useState(null)

//   useEffect(() => {
//     getApplications([orderBy('createdAt','desc')])
//       .then(setApplications).catch(console.error).finally(() => setLoading(false))
//   }, [])

//   const filtered = applications.filter(a => {
//     const matchSearch = !search ||
//       `${a.firstName} ${a.lastName} ${a.email} ${a.programId}`.toLowerCase().includes(search.toLowerCase())
//     const matchStatus = statusTab === 'all' || a.status === statusTab
//     return matchSearch && matchStatus
//   })

//   const counts = {
//     all:      applications.length,
//     pending:  applications.filter(a => a.status === 'pending').length,
//     approved: applications.filter(a => a.status === 'approved').length,
//     rejected: applications.filter(a => a.status === 'rejected').length,
//   }

//   const handleUpdate = (updated) => {
//     setApplications(prev => prev.map(a => a.id === updated.id ? updated : a))
//   }

//   return (
//     <div className="portal-page">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h2 className="font-display font-800 text-navy-900 text-xl">Admissions</h2>
//           <p className="text-gray-400 text-sm mt-0.5">{counts.pending} pending review</p>
//         </div>
//       </div>

//       {/* Status tabs */}
//       <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-thin">
//         {STATUS_TABS.map(s => (
//           <button key={s} onClick={() => setStatusTab(s)}
//             className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-display font-600 capitalize transition-all ${
//               statusTab === s ? 'bg-navy-900 text-white' : 'bg-white border border-gray-200 text-navy-600 hover:border-navy-900'
//             }`}>
//             {s} <span className="ml-1.5 opacity-60">({counts[s]})</span>
//           </button>
//         ))}
//       </div>

//       {/* Search */}
//       <div className="relative mb-5">
//         <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
//         <input type="text" placeholder="Search by name, email or programme..."
//           value={search} onChange={e => setSearch(e.target.value)}
//           className="input pl-9 py-2.5 text-sm w-full sm:max-w-sm" />
//       </div>

//       {/* Table */}
//       {loading ? (
//         <div className="space-y-2">{[...Array(5)].map((_,i) => <div key={i} className="skeleton h-14 rounded-academy"/>)}</div>
//       ) : filtered.length === 0 ? (
//         <div className="card p-12 text-center">
//           <ClipboardList size={36} className="text-gray-300 mx-auto mb-3"/>
//           <p className="text-gray-400 text-sm">No applications found.</p>
//         </div>
//       ) : (
//         <div className="card overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="table-academy">
//               <thead>
//                 <tr>
//                   <th>Applicant</th>
//                   <th>Programme</th>
//                   <th>Intake</th>
//                   <th className="text-center">Status</th>
//                   <th>Applied</th>
//                   <th className="text-right">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((app, i) => (
//                   <motion.tr key={app.id}
//                     initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i * 0.03 }}>
//                     <td>
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-full bg-navy-900/10 flex items-center justify-center font-display font-700 text-navy-900 text-xs flex-shrink-0">
//                           {app.firstName?.[0]}{app.lastName?.[0]}
//                         </div>
//                         <div>
//                           <p className="font-display font-600 text-navy-900 text-sm">{app.firstName} {app.lastName}</p>
//                           <p className="text-gray-400 text-xs">{app.email}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="text-gray-500 text-sm">{app.program ?? app.programId ?? '—'}</td>
//                     <td className="text-gray-500 text-sm">{app.intake ?? '—'}</td>
//                     <td className="text-center"><span className={statusBadge(app.status)}>{app.status ?? 'pending'}</span></td>
//                     <td className="text-gray-400 text-sm">{formatDate(app.createdAt)}</td>
//                     <td>
//                       <div className="flex items-center justify-end">
//                         <button onClick={() => setViewing(app)}
//                           className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 text-white font-display font-600 text-xs rounded-lg hover:bg-navy-800 transition-all">
//                           <Eye size={12}/> Review
//                         </button>
//                       </div>
//                     </td>
//                   </motion.tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <div className="px-4 py-3 border-t border-gray-100">
//             <p className="text-gray-400 text-xs">Showing {filtered.length} of {applications.length} applications</p>
//           </div>
//         </div>
//       )}

//       <AnimatePresence>
//         {viewing && (
//           <AppDetailModal app={viewing} onClose={() => setViewing(null)} onUpdate={handleUpdate} />
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }

// FILE: src/portals/admin/pages/Admissions.jsx

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ClipboardList, Search, CheckCircle, X, Eye, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import { getApplications, updateApplication, orderBy } from '@/firebase/firestore'

const STATUS_TABS = ['all', 'pending', 'approved', 'rejected']

function formatDate(val) {
  if (!val) return '—'
  const d = val?.toDate ? val.toDate() : new Date(val)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function statusBadge(s) {
  switch (s) {
    case 'pending':  return 'badge bg-gold-500/15 text-gold-700'
    case 'approved': return 'badge badge-green'
    case 'rejected': return 'badge badge-red'
    default:         return 'badge bg-gray-100 text-gray-500'
  }
}

function ReviewModal({ app, onClose, onUpdate }) {
  const [processing, setProcessing] = useState(false)

  const handle = async (status) => {
    setProcessing(true)
    try {
      await updateApplication(app.id, { status, reviewedAt: new Date() })
      onUpdate({ ...app, status })
      toast.success(`Application ${status}.`)
      onClose()
    } catch { toast.error('Action failed. Try again.') }
    finally { setProcessing(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="font-display font-700 text-navy-900 text-base">Application Review</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-navy-900 transition-colors"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Applicant header */}
          <div className="flex items-center gap-4 p-4 bg-slate-academy rounded-xl">
            <div className="w-12 h-12 rounded-full bg-navy-900 flex items-center justify-center font-display font-800 text-gold-400 text-base flex-shrink-0">
              {app.firstName?.[0]}{app.lastName?.[0]}
            </div>
            <div>
              <p className="font-display font-800 text-navy-900">{app.firstName} {app.lastName}</p>
              <p className="text-gray-400 text-sm">{app.email}</p>
              <span className={`${statusBadge(app.status)} mt-1 inline-block`}>{app.status ?? 'pending'}</span>
            </div>
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Programme',       value: app.program ?? app.programId },
              { label: 'Intake',          value: app.intake },
              { label: 'Phone',           value: app.phone },
              { label: 'Nationality',     value: app.nationality },
              { label: 'Last School',     value: app.lastSchool },
              { label: 'Qualification',   value: app.qualification },
              { label: 'Grad. Year',      value: app.graduationYear },
              { label: 'Applied On',      value: formatDate(app.createdAt) },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-lg bg-slate-academy">
                <p className="text-gray-400 text-xs mb-0.5">{label}</p>
                <p className="font-display font-600 text-navy-900 text-sm">{value ?? '—'}</p>
              </div>
            ))}
          </div>

          {/* Statement of purpose */}
          {app.statementOfPurpose && (
            <div>
              <p className="label mb-2">Statement of Purpose</p>
              <p className="text-gray-600 text-sm leading-relaxed p-4 bg-slate-academy rounded-lg">{app.statementOfPurpose}</p>
            </div>
          )}

          {/* Documents */}
          <div>
            <p className="label mb-2">Documents Submitted</p>
            <div className="flex flex-wrap gap-2">
              {app.transcriptUploaded && <span className="badge badge-green">Transcript ✓</span>}
              {app.idUploaded         && <span className="badge badge-green">ID ✓</span>}
              {app.photoUploaded      && <span className="badge badge-green">Photo ✓</span>}
              {!app.transcriptUploaded && !app.idUploaded && !app.photoUploaded && (
                <span className="text-gray-400 text-xs">No documents confirmed</span>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons — only show if still pending */}
        {(app.status === 'pending' || !app.status) && (
          <div className="flex gap-3 px-6 pb-6 sticky bottom-0 bg-white pt-4 border-t border-gray-100">
            <button onClick={() => handle('rejected')} disabled={processing}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 border-2 border-crimson-600 text-crimson-600 font-display font-700 text-sm rounded-academy hover:bg-crimson-600 hover:text-white transition-all disabled:opacity-60">
              <X size={14} /> Reject
            </button>
            <button onClick={() => handle('approved')} disabled={processing}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white font-display font-700 text-sm rounded-academy hover:bg-emerald-500 transition-all disabled:opacity-60">
              {processing
                ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                : <><CheckCircle size={14} /> Approve</>}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default function Admissions() {
  const [applications, setApplications] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState('')
  const [statusTab,    setStatusTab]    = useState('all')
  const [viewing,      setViewing]      = useState(null)

  useEffect(() => {
    getApplications([orderBy('createdAt', 'desc')])
      .then(setApplications).catch(console.error).finally(() => setLoading(false))
  }, [])

  const filtered = applications.filter(a => {
    const matchSearch = !search ||
      `${a.firstName} ${a.lastName} ${a.email} ${a.programId ?? ''}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusTab === 'all' || (a.status ?? 'pending') === statusTab
    return matchSearch && matchStatus
  })

  const counts = STATUS_TABS.reduce((acc, s) => {
    acc[s] = s === 'all' ? applications.length : applications.filter(a => (a.status ?? 'pending') === s).length
    return acc
  }, {})

  const handleUpdate = (updated) =>
    setApplications(prev => prev.map(a => a.id === updated.id ? updated : a))

  return (
    <div className="portal-page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-800 text-navy-900 text-xl">Admissions</h2>
          <p className="text-gray-400 text-sm mt-0.5">{counts.pending} pending review</p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-thin">
        {STATUS_TABS.map(s => (
          <button key={s} onClick={() => setStatusTab(s)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-display font-600 capitalize transition-all ${
              statusTab === s ? 'bg-navy-900 text-white' : 'bg-white border border-gray-200 text-navy-600 hover:border-navy-900'
            }`}>
            {s} <span className="ml-1.5 opacity-60">({counts[s]})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search by name, email or programme..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="input pl-9 py-2.5 text-sm w-full sm:max-w-sm" />
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-academy" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <ClipboardList size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No applications found.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-academy">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Programme</th>
                  <th>Intake</th>
                  <th className="text-center">Status</th>
                  <th>Applied</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app, i) => (
                  <motion.tr key={app.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-navy-900/10 flex items-center justify-center font-display font-700 text-navy-900 text-xs flex-shrink-0">
                          {app.firstName?.[0]}{app.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-display font-600 text-navy-900 text-sm">{app.firstName} {app.lastName}</p>
                          <p className="text-gray-400 text-xs">{app.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-gray-500 text-sm">{app.program ?? app.programId ?? '—'}</td>
                    <td className="text-gray-500 text-sm">{app.intake ?? '—'}</td>
                    <td className="text-center"><span className={statusBadge(app.status ?? 'pending')}>{app.status ?? 'pending'}</span></td>
                    <td className="text-gray-400 text-sm">{formatDate(app.createdAt)}</td>
                    <td>
                      <div className="flex justify-end">
                        <button onClick={() => setViewing(app)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 text-white font-display font-600 text-xs rounded-lg hover:bg-navy-800 transition-all">
                          <Eye size={12} /> Review
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100">
            <p className="text-gray-400 text-xs">Showing {filtered.length} of {applications.length} applications</p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {viewing && <ReviewModal app={viewing} onClose={() => setViewing(null)} onUpdate={handleUpdate} />}
      </AnimatePresence>
    </div>
  )
}