// // FILE: src/portals/admin/pages/Students.jsx

// import React, { useEffect, useState } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import {
//   Users, Search, Plus, Edit2, Trash2, Eye,
//   X, AlertCircle, Save, Filter
// } from 'lucide-react'
// import toast from 'react-hot-toast'
// import { getStudents, updateStudent, deleteDocument } from '@/firebase/firestore'

// const STATUS_OPTIONS = ['active', 'suspended', 'graduated', 'withdrawn']

// function formatDate(val) {
//   if (!val) return '—'
//   const d = val?.toDate ? val.toDate() : new Date(val)
//   return d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })
// }

// function statusBadge(s) {
//   switch (s) {
//     case 'active':    return 'badge badge-green'
//     case 'suspended': return 'badge badge-red'
//     case 'graduated': return 'badge bg-blue-100 text-blue-700'
//     case 'withdrawn': return 'badge bg-gray-100 text-gray-500'
//     default:          return 'badge bg-gray-100 text-gray-500'
//   }
// }

// // Edit/view student drawer
// function StudentDrawer({ student, onClose, onSave }) {
//   const [form,   setForm]   = useState(student ?? {})
//   const [saving, setSaving] = useState(false)

//   const handleSave = async () => {
//     setSaving(true)
//     try {
//       await updateStudent(student.id, form)
//       onSave({ ...student, ...form })
//       toast.success('Student updated.')
//       onClose()
//     } catch { toast.error('Update failed.') }
//     finally { setSaving(false) }
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
//       <motion.div
//         initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
//         transition={{ duration: 0.3, ease: 'easeInOut' }}
//         className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl"
//       >
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//           <h3 className="font-display font-700 text-navy-900 text-base">
//             {student?.firstName} {student?.lastName}
//           </h3>
//           <button onClick={onClose} className="text-gray-400 hover:text-navy-900 transition-colors">
//             <X size={20} />
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-6 space-y-4">
//           {[
//             { key:'firstName',    label:'First Name' },
//             { key:'lastName',     label:'Last Name' },
//             { key:'email',        label:'Email',       type:'email' },
//             { key:'phone',        label:'Phone' },
//             { key:'program',      label:'Programme' },
//             { key:'level',        label:'Level / Year' },
//             { key:'studentId',    label:'Student ID' },
//             { key:'nationality',  label:'Nationality' },
//           ].map(({ key, label, type='text' }) => (
//             <div key={key}>
//               <label className="label">{label}</label>
//               <input type={type} value={form[key] ?? ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
//                 className="input" />
//             </div>
//           ))}
//           <div>
//             <label className="label">Status</label>
//             <select value={form.status ?? 'active'} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
//               className="input">
//               {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
//             </select>
//           </div>
//         </div>

//         <div className="p-6 border-t border-gray-100 flex gap-3">
//           <button onClick={onClose}
//             className="flex-1 py-2.5 border border-gray-200 text-navy-700 font-display font-600 text-sm rounded-academy hover:border-navy-900 transition-all">
//             Cancel
//           </button>
//           <button onClick={handleSave} disabled={saving}
//             className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all disabled:opacity-60">
//             {saving ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"/> : <><Save size={14}/> Save</>}
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   )
// }

// export default function Students() {
//   const [students,  setStudents]  = useState([])
//   const [loading,   setLoading]   = useState(true)
//   const [search,    setSearch]    = useState('')
//   const [statusFilter, setStatusFilter] = useState('all')
//   const [selected,  setSelected]  = useState(null) // for drawer
//   const [deleting,  setDeleting]  = useState(null)

//   useEffect(() => {
//     getStudents()
//       .then(setStudents).catch(console.error).finally(() => setLoading(false))
//   }, [])

//   const filtered = students.filter(s => {
//     const matchSearch = !search ||
//       `${s.firstName} ${s.lastName} ${s.email} ${s.studentId}`.toLowerCase().includes(search.toLowerCase())
//     const matchStatus = statusFilter === 'all' || s.status === statusFilter
//     return matchSearch && matchStatus
//   })

//   const handleDelete = async (student) => {
//     if (!window.confirm(`Delete ${student.firstName} ${student.lastName}? This cannot be undone.`)) return
//     setDeleting(student.id)
//     try {
//       await deleteDocument('students', student.id)
//       setStudents(prev => prev.filter(s => s.id !== student.id))
//       toast.success('Student deleted.')
//     } catch { toast.error('Delete failed.') }
//     finally { setDeleting(null) }
//   }

//   const handleSave = (updated) => {
//     setStudents(prev => prev.map(s => s.id === updated.id ? updated : s))
//   }

//   return (
//     <div className="portal-page">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <div>
//           <h2 className="font-display font-800 text-navy-900 text-xl">Students</h2>
//           <p className="text-gray-400 text-sm mt-0.5">{students.length} total students</p>
//         </div>
//         <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all">
//           <Plus size={15} /> Add Student
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row gap-3 mb-5">
//         <div className="relative flex-1">
//           <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input type="text" placeholder="Search by name, email, or ID..."
//             value={search} onChange={e => setSearch(e.target.value)}
//             className="input pl-9 py-2.5 text-sm w-full" />
//         </div>
//         <div className="relative">
//           <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
//           <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
//             className="input pl-9 py-2.5 text-sm appearance-none pr-8">
//             <option value="all">All Status</option>
//             {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
//           </select>
//         </div>
//       </div>

//       {/* Table */}
//       {loading ? (
//         <div className="space-y-2">{[...Array(6)].map((_,i) => <div key={i} className="skeleton h-14 rounded-academy"/>)}</div>
//       ) : filtered.length === 0 ? (
//         <div className="card p-12 text-center">
//           <Users size={36} className="text-gray-300 mx-auto mb-3"/>
//           <p className="font-display font-600 text-navy-900 mb-1">No students found</p>
//           <p className="text-gray-400 text-sm">{search ? 'Try a different search term.' : 'No students enrolled yet.'}</p>
//         </div>
//       ) : (
//         <div className="card overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="table-academy">
//               <thead>
//                 <tr>
//                   <th>Student</th>
//                   <th>ID</th>
//                   <th>Programme</th>
//                   <th className="text-center">Status</th>
//                   <th>Enrolled</th>
//                   <th className="text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((student, i) => (
//                   <motion.tr key={student.id}
//                     initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i * 0.03 }}>
//                     <td>
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center font-display font-700 text-gold-400 text-xs flex-shrink-0">
//                           {student.firstName?.[0]}{student.lastName?.[0]}
//                         </div>
//                         <div>
//                           <p className="font-display font-600 text-navy-900 text-sm">{student.firstName} {student.lastName}</p>
//                           <p className="text-gray-400 text-xs">{student.email}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="font-mono text-xs text-gray-500">{student.studentId ?? '—'}</td>
//                     <td className="text-gray-500 text-sm">{student.program ?? '—'}</td>
//                     <td className="text-center">
//                       <span className={statusBadge(student.status)}>{student.status ?? 'active'}</span>
//                     </td>
//                     <td className="text-gray-400 text-sm">{formatDate(student.createdAt)}</td>
//                     <td>
//                       <div className="flex items-center justify-end gap-1.5">
//                         <button onClick={() => setSelected(student)}
//                           className="p-1.5 rounded-lg text-gray-400 hover:text-navy-900 hover:bg-gray-100 transition-all">
//                           <Edit2 size={13} />
//                         </button>
//                         <button onClick={() => handleDelete(student)} disabled={deleting === student.id}
//                           className="p-1.5 rounded-lg text-gray-400 hover:text-crimson-600 hover:bg-crimson-600/8 transition-all disabled:opacity-40">
//                           <Trash2 size={13} />
//                         </button>
//                       </div>
//                     </td>
//                   </motion.tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
//             <p className="text-gray-400 text-xs">Showing {filtered.length} of {students.length} students</p>
//           </div>
//         </div>
//       )}

//       {/* Edit Drawer */}
//       <AnimatePresence>
//         {selected && (
//           <StudentDrawer
//             student={selected}
//             onClose={() => setSelected(null)}
//             onSave={handleSave}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }

// second template

// FILE: src/portals/admin/pages/Students.jsx

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Search, Plus, Edit2, Trash2, X, Save, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import { getStudents, updateStudent, deleteDocument } from '@/firebase/firestore'

const STATUS_OPTIONS = ['active', 'suspended', 'graduated', 'withdrawn']

function formatDate(val) {
  if (!val) return '—'
  const d = val?.toDate ? val.toDate() : new Date(val)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function statusBadge(s) {
  switch (s) {
    case 'active':    return 'badge badge-green'
    case 'suspended': return 'badge badge-red'
    case 'graduated': return 'badge bg-blue-100 text-blue-700'
    case 'withdrawn': return 'badge bg-gray-100 text-gray-500'
    default:          return 'badge badge-green'
  }
}

function StudentDrawer({ student, onClose, onSave }) {
  const [form, setForm]     = useState(student ?? {})
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateStudent(student.id, form)
      onSave({ ...student, ...form })
      toast.success('Student updated.')
      onClose()
    } catch { toast.error('Update failed.') }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-display font-700 text-navy-900 text-base">{student?.firstName} {student?.lastName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-navy-900 transition-colors"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {[
            { key: 'firstName',   label: 'First Name' },
            { key: 'lastName',    label: 'Last Name' },
            { key: 'email',       label: 'Email', type: 'email' },
            { key: 'phone',       label: 'Phone' },
            { key: 'program',     label: 'Programme' },
            { key: 'level',       label: 'Level / Year' },
            { key: 'studentId',   label: 'Student ID' },
            { key: 'nationality', label: 'Nationality' },
          ].map(({ key, label, type = 'text' }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input type={type} value={form[key] ?? ''} onChange={e => set(key, e.target.value)} className="input" />
            </div>
          ))}
          <div>
            <label className="label">Status</label>
            <select value={form.status ?? 'active'} onChange={e => set('status', e.target.value)} className="input">
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 text-navy-700 font-display font-600 text-sm rounded-academy hover:border-navy-900 transition-all">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all disabled:opacity-60">
            {saving ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <><Save size={14} /> Save</>}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function Students() {
  const [students,  setStudents]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected,  setSelected]  = useState(null)
  const [deleting,  setDeleting]  = useState(null)

  useEffect(() => {
    getStudents().then(setStudents).catch(console.error).finally(() => setLoading(false))
  }, [])

  const filtered = students.filter(s => {
    const matchSearch = !search ||
      `${s.firstName} ${s.lastName} ${s.email} ${s.studentId}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || s.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleDelete = async (student) => {
    if (!window.confirm(`Delete ${student.firstName} ${student.lastName}? This cannot be undone.`)) return
    setDeleting(student.id)
    try {
      await deleteDocument('students', student.id)
      setStudents(prev => prev.filter(s => s.id !== student.id))
      toast.success('Student deleted.')
    } catch { toast.error('Delete failed.') }
    finally { setDeleting(null) }
  }

  const handleSave = (updated) => setStudents(prev => prev.map(s => s.id === updated.id ? updated : s))

  return (
    <div className="portal-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-800 text-navy-900 text-xl">Students</h2>
          <p className="text-gray-400 text-sm mt-0.5">{students.length} total students</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all">
          <Plus size={15} /> Add Student
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name, email or ID..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="input pl-9 py-2.5 text-sm w-full" />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="input pl-9 py-2.5 text-sm appearance-none pr-8">
            <option value="all">All Status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-14 rounded-academy" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Users size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="font-display font-600 text-navy-900 mb-1">No students found</p>
          <p className="text-gray-400 text-sm">{search ? 'Try a different search.' : 'No students enrolled yet.'}</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-academy">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>ID</th>
                  <th>Programme</th>
                  <th className="text-center">Status</th>
                  <th>Enrolled</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center font-display font-700 text-gold-400 text-xs flex-shrink-0">
                          {s.firstName?.[0]}{s.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-display font-600 text-navy-900 text-sm">{s.firstName} {s.lastName}</p>
                          <p className="text-gray-400 text-xs">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-xs text-gray-500">{s.studentId ?? '—'}</td>
                    <td className="text-gray-500 text-sm">{s.program ?? '—'}</td>
                    <td className="text-center"><span className={statusBadge(s.status)}>{s.status ?? 'active'}</span></td>
                    <td className="text-gray-400 text-sm">{formatDate(s.createdAt)}</td>
                    <td>
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setSelected(s)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-navy-900 hover:bg-gray-100 transition-all">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(s)} disabled={deleting === s.id}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-crimson-600 hover:bg-crimson-600/8 transition-all disabled:opacity-40">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100">
            <p className="text-gray-400 text-xs">Showing {filtered.length} of {students.length} students</p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected && <StudentDrawer student={selected} onClose={() => setSelected(null)} onSave={handleSave} />}
      </AnimatePresence>
    </div>
  )
}