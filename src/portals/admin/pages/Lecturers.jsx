// import React, { useEffect, useState } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { UserCheck, Search, Plus, Edit2, Trash2, Mail, Phone, X, Save } from 'lucide-react'
// import toast from 'react-hot-toast'
// import { getLecturers, updateLecturer, deleteDocument } from '@/firebase/firestore'

// function LecturerDrawer({ lecturer, onClose, onSave }) {
//   const [form, setForm]   = useState(lecturer ?? {})
//   const [saving, setSaving] = useState(false)
//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

//   const handleSave = async () => {
//     setSaving(true)
//     try {
//       await updateLecturer(lecturer.id, form)
//       onSave({ ...lecturer, ...form })
//       toast.success('Lecturer updated.')
//       onClose()
//     } catch { toast.error('Update failed.') }
//     finally { setSaving(false) }
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
//       <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
//         transition={{ duration: 0.3, ease: 'easeInOut' }}
//         className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl">
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//           <h3 className="font-display font-700 text-navy-900 text-base">Edit Lecturer</h3>
//           <button onClick={onClose} className="text-gray-400 hover:text-navy-900 transition-colors"><X size={20} /></button>
//         </div>
//         <div className="flex-1 overflow-y-auto p-6 space-y-4">
//           {[
//             { key: 'firstName',   label: 'First Name' },
//             { key: 'lastName',    label: 'Last Name' },
//             { key: 'email',       label: 'Email', type: 'email' },
//             { key: 'phone',       label: 'Phone' },
//             { key: 'department',  label: 'Department' },
//             { key: 'lecturerId',  label: 'Lecturer ID' },
//             { key: 'qualification', label: 'Highest Qualification' },
//           ].map(({ key, label, type = 'text' }) => (
//             <div key={key}>
//               <label className="label">{label}</label>
//               <input type={type} value={form[key] ?? ''}
//                 onChange={e => set(key, e.target.value)} className="input" />
//             </div>
//           ))}
//           <div>
//             <label className="label">Status</label>
//             <select value={form.status ?? 'active'} onChange={e => set('status', e.target.value)} className="input">
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//               <option value="on_leave">On Leave</option>
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
//             {saving ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <><Save size={14} /> Save</>}
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   )
// }

// export default function Lecturers() {
//   const [lecturers, setLecturers] = useState([])
//   const [loading,   setLoading]   = useState(true)
//   const [search,    setSearch]    = useState('')
//   const [selected,  setSelected]  = useState(null)
//   const [deleting,  setDeleting]  = useState(null)

//   useEffect(() => {
//     getLecturers().then(setLecturers).catch(console.error).finally(() => setLoading(false))
//   }, [])

//   const filtered = lecturers.filter(l =>
//     !search || `${l.firstName} ${l.lastName} ${l.email} ${l.department}`.toLowerCase().includes(search.toLowerCase())
//   )

//   const handleDelete = async (l) => {
//     if (!window.confirm(`Remove ${l.firstName} ${l.lastName}?`)) return
//     setDeleting(l.id)
//     try {
//       await deleteDocument('lecturers', l.id)
//       setLecturers(prev => prev.filter(x => x.id !== l.id))
//       toast.success('Lecturer removed.')
//     } catch { toast.error('Delete failed.') }
//     finally { setDeleting(null) }
//   }

//   const handleSave = (updated) => setLecturers(prev => prev.map(l => l.id === updated.id ? updated : l))

//   function statusBadge(s) {
//     switch (s) {
//       case 'active':   return 'badge badge-green'
//       case 'inactive': return 'badge bg-gray-100 text-gray-500'
//       case 'on_leave': return 'badge bg-gold-500/15 text-gold-700'
//       default:         return 'badge badge-green'
//     }
//   }

//   return (
//     <div className="portal-page">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <div>
//           <h2 className="font-display font-800 text-navy-900 text-xl">Lecturers</h2>
//           <p className="text-gray-400 text-sm mt-0.5">{lecturers.length} total lecturers</p>
//         </div>
//         <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all">
//           <Plus size={15} /> Add Lecturer
//         </button>
//       </div>

//       <div className="relative mb-5">
//         <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
//         <input type="text" placeholder="Search by name, email or department..."
//           value={search} onChange={e => setSearch(e.target.value)}
//           className="input pl-9 py-2.5 text-sm w-full sm:max-w-sm" />
//       </div>

//       {loading ? (
//         <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-academy" />)}</div>
//       ) : filtered.length === 0 ? (
//         <div className="card p-12 text-center">
//           <UserCheck size={36} className="text-gray-300 mx-auto mb-3" />
//           <p className="font-display font-600 text-navy-900 mb-1">No lecturers found</p>
//           <p className="text-gray-400 text-sm">{search ? 'Try a different search.' : 'No lecturers added yet.'}</p>
//         </div>
//       ) : (
//         <div className="card overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="table-academy">
//               <thead>
//                 <tr>
//                   <th>Lecturer</th>
//                   <th>Department</th>
//                   <th>Qualification</th>
//                   <th className="text-center">Status</th>
//                   <th className="text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((l, i) => (
//                   <motion.tr key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
//                     <td>
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center font-display font-700 text-gold-400 text-xs flex-shrink-0">
//                           {l.firstName?.[0]}{l.lastName?.[0]}
//                         </div>
//                         <div>
//                           <p className="font-display font-600 text-navy-900 text-sm">{l.firstName} {l.lastName}</p>
//                           <p className="text-gray-400 text-xs">{l.email}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="text-gray-500 text-sm">{l.department ?? '—'}</td>
//                     <td className="text-gray-500 text-sm">{l.qualification ?? '—'}</td>
//                     <td className="text-center"><span className={statusBadge(l.status)}>{l.status ?? 'active'}</span></td>
//                     <td>
//                       <div className="flex items-center justify-end gap-1.5">
//                         <a href={`mailto:${l.email}`} className="p-1.5 rounded-lg text-gray-400 hover:text-navy-900 hover:bg-gray-100 transition-all">
//                           <Mail size={13} />
//                         </a>
//                         <button onClick={() => setSelected(l)} className="p-1.5 rounded-lg text-gray-400 hover:text-navy-900 hover:bg-gray-100 transition-all">
//                           <Edit2 size={13} />
//                         </button>
//                         <button onClick={() => handleDelete(l)} disabled={deleting === l.id}
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
//           <div className="px-4 py-3 border-t border-gray-100">
//             <p className="text-gray-400 text-xs">Showing {filtered.length} of {lecturers.length} lecturers</p>
//           </div>
//         </div>
//       )}

//       <AnimatePresence>
//         {selected && <LecturerDrawer lecturer={selected} onClose={() => setSelected(null)} onSave={handleSave} />}
//       </AnimatePresence>
//     </div>
//   )
// }



import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserCheck, Search, Plus, Edit2, Trash2, Mail, Phone, X, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { getLecturers, updateLecturer, deleteDocument } from '@/firebase/firestore'

function LecturerDrawer({ lecturer, onClose, onSave }) {
  const [form, setForm]   = useState(lecturer ?? {})
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateLecturer(lecturer.id, form)
      onSave({ ...lecturer, ...form })
      toast.success('Lecturer updated.')
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
          <h3 className="font-display font-700 text-navy-900 text-base">Edit Lecturer</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-navy-900 transition-colors"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {[
            { key: 'firstName',   label: 'First Name' },
            { key: 'lastName',    label: 'Last Name' },
            { key: 'email',       label: 'Email', type: 'email' },
            { key: 'phone',       label: 'Phone' },
            { key: 'department',  label: 'Department' },
            { key: 'lecturerId',  label: 'Lecturer ID' },
            { key: 'qualification', label: 'Highest Qualification' },
          ].map(({ key, label, type = 'text' }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input type={type} value={form[key] ?? ''}
                onChange={e => set(key, e.target.value)} className="input" />
            </div>
          ))}
          <div>
            <label className="label">Status</label>
            <select value={form.status ?? 'active'} onChange={e => set('status', e.target.value)} className="input">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 text-navy-700 font-display font-600 text-sm rounded-academy hover:border-navy-900 transition-all">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all disabled:opacity-60">
            {saving ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <><Save size={14} /> Save</>}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function Lecturers() {
  const [lecturers, setLecturers] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [selected,  setSelected]  = useState(null)
  const [deleting,  setDeleting]  = useState(null)

  useEffect(() => {
    getLecturers().then(setLecturers).catch(console.error).finally(() => setLoading(false))
  }, [])

  const filtered = lecturers.filter(l =>
    !search || `${l.firstName} ${l.lastName} ${l.email} ${l.department}`.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (l) => {
    if (!window.confirm(`Remove ${l.firstName} ${l.lastName}?`)) return
    setDeleting(l.id)
    try {
      await deleteDocument('lecturers', l.id)
      setLecturers(prev => prev.filter(x => x.id !== l.id))
      toast.success('Lecturer removed.')
    } catch { toast.error('Delete failed.') }
    finally { setDeleting(null) }
  }

  const handleSave = (updated) => setLecturers(prev => prev.map(l => l.id === updated.id ? updated : l))

  function statusBadge(s) {
    switch (s) {
      case 'active':   return 'badge badge-green'
      case 'inactive': return 'badge bg-gray-100 text-gray-500'
      case 'on_leave': return 'badge bg-gold-500/15 text-gold-700'
      default:         return 'badge badge-green'
    }
  }

  return (
    <div className="portal-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-800 text-navy-900 text-xl">Lecturers</h2>
          <p className="text-gray-400 text-sm mt-0.5">{lecturers.length} total lecturers</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all">
          <Plus size={15} /> Add Lecturer
        </button>
      </div>

      <div className="relative mb-5">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search by name, email or department..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="input pl-9 py-2.5 text-sm w-full sm:max-w-sm" />
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-academy" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <UserCheck size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="font-display font-600 text-navy-900 mb-1">No lecturers found</p>
          <p className="text-gray-400 text-sm">{search ? 'Try a different search.' : 'No lecturers added yet.'}</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-academy">
              <thead>
                <tr>
                  <th>Lecturer</th>
                  <th>Department</th>
                  <th>Qualification</th>
                  <th className="text-center">Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l, i) => (
                  <motion.tr key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center font-display font-700 text-gold-400 text-xs flex-shrink-0">
                          {l.firstName?.[0]}{l.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-display font-600 text-navy-900 text-sm">{l.firstName} {l.lastName}</p>
                          <p className="text-gray-400 text-xs">{l.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-gray-500 text-sm">{l.department ?? '—'}</td>
                    <td className="text-gray-500 text-sm">{l.qualification ?? '—'}</td>
                    <td className="text-center"><span className={statusBadge(l.status)}>{l.status ?? 'active'}</span></td>
                    <td>
                      <div className="flex items-center justify-end gap-1.5">
                        <a href={`mailto:${l.email}`} className="p-1.5 rounded-lg text-gray-400 hover:text-navy-900 hover:bg-gray-100 transition-all">
                          <Mail size={13} />
                        </a>
                        <button onClick={() => setSelected(l)} className="p-1.5 rounded-lg text-gray-400 hover:text-navy-900 hover:bg-gray-100 transition-all">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(l)} disabled={deleting === l.id}
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
            <p className="text-gray-400 text-xs">Showing {filtered.length} of {lecturers.length} lecturers</p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected && <LecturerDrawer lecturer={selected} onClose={() => setSelected(null)} onSave={handleSave} />}
      </AnimatePresence>
    </div>
  )
}