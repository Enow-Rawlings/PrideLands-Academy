import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Search, Plus, Edit2, Trash2, X, Save, Users as UsersIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  getCourses, createCourse, updateCourse, deleteCourse,
  getLecturers, getPrograms, getEnrollments,
} from '@/firebase/firestore'

const STATUS_OPTIONS = ['active', 'inactive', 'archived']

function CourseDrawer({ course, lecturers, programs, onClose, onSaved }) {
  const isNew = !course?.id
  const [form, setForm] = useState({
    code: '', title: '', credits: '', schedule: '', semester: 'current',
    status: 'active', lecturerId: '', programId: '',
    ...course,
  })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.title.trim() || !form.code.trim()) {
      toast.error('Course code and title are required.')
      return
    }
    setSaving(true)
    const lecturer = lecturers.find((l) => l.id === form.lecturerId)
    const payload = {
      code: form.code, title: form.title, credits: form.credits, schedule: form.schedule,
      semester: form.semester, status: form.status, lecturerId: form.lecturerId || null,
      lecturerName: lecturer ? `${lecturer.firstName ?? ''} ${lecturer.lastName ?? ''}`.trim() : null,
      programId: form.programId || null,
    }
    try {
      if (isNew) {
        const created = await createCourse(payload)
        onSaved({ id: created?.id ?? created, ...payload })
        toast.success('Course created.')
      } else {
        await updateCourse(course.id, payload)
        onSaved({ ...course, ...payload })
        toast.success('Course updated.')
      }
      onClose()
    } catch { toast.error('Save failed.') }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-display font-700 text-navy-900 text-base">
            {isNew ? 'Add Course' : 'Edit Course'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-navy-900 transition-colors"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Course Code</label>
              <input type="text" value={form.code ?? ''} onChange={(e) => set('code', e.target.value)}
                placeholder="e.g. AI301" className="input" />
            </div>
            <div>
              <label className="label">Credits</label>
              <input type="number" value={form.credits ?? ''} onChange={(e) => set('credits', e.target.value)} className="input" />
            </div>
          </div>

          <div>
            <label className="label">Course Title</label>
            <input type="text" value={form.title ?? ''} onChange={(e) => set('title', e.target.value)} className="input" />
          </div>

          <div>
            <label className="label">Schedule</label>
            <input type="text" value={form.schedule ?? ''} onChange={(e) => set('schedule', e.target.value)}
              placeholder="e.g. Mon & Wed, 10:00 - 12:00" className="input" />
          </div>

          <div>
            <label className="label">Program</label>
            <select value={form.programId ?? ''} onChange={(e) => set('programId', e.target.value)} className="input">
              <option value="">— Not linked —</option>
              {programs.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Lecturer</label>
            <select value={form.lecturerId ?? ''} onChange={(e) => set('lecturerId', e.target.value)} className="input">
              <option value="">— Unassigned —</option>
              {lecturers.map((l) => (
                <option key={l.id} value={l.id}>{l.firstName} {l.lastName}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Semester</label>
              <select value={form.semester ?? 'current'} onChange={(e) => set('semester', e.target.value)} className="input">
                <option value="current">Current</option>
                <option value="past">Past</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select value={form.status ?? 'active'} onChange={(e) => set('status', e.target.value)} className="input">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
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

export default function Courses() {
  const [courses,   setCourses]   = useState([])
  const [lecturers, setLecturers] = useState([])
  const [programs,  setPrograms]  = useState([])
  const [counts,    setCounts]    = useState({})
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [status,    setStatus]    = useState('all')
  const [selected,  setSelected]  = useState(null)
  const [creating,  setCreating]  = useState(false)
  const [deleting,  setDeleting]  = useState(null)

  const load = () => {
    setLoading(true)
    Promise.all([getCourses(), getLecturers(), getPrograms(), getEnrollments()])
      .then(([c, l, p, e]) => {
        setCourses(c)
        setLecturers(l)
        setPrograms(p)
        const map = {}
        e.forEach((en) => { map[en.courseId] = (map[en.courseId] ?? 0) + 1 })
        setCounts(map)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const filtered = courses.filter((c) => {
    const matchesStatus = status === 'all' || (c.status ?? 'active') === status
    const matchesSearch = !search || `${c.title} ${c.code} ${c.lecturerName}`.toLowerCase().includes(search.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete "${c.code} — ${c.title}"?`)) return
    setDeleting(c.id)
    try {
      await deleteCourse(c.id)
      setCourses((prev) => prev.filter((x) => x.id !== c.id))
      toast.success('Course deleted.')
    } catch { toast.error('Delete failed.') }
    finally { setDeleting(null) }
  }

  const handleSaved = (saved) => {
    setCourses((prev) => {
      const exists = prev.some((c) => c.id === saved.id)
      return exists ? prev.map((c) => (c.id === saved.id ? saved : c)) : [saved, ...prev]
    })
  }

  function statusBadge(s) {
    switch (s) {
      case 'active':   return 'badge badge-green'
      case 'inactive': return 'badge bg-gray-100 text-gray-500'
      case 'archived': return 'badge bg-gold-500/15 text-gold-700'
      default:         return 'badge badge-green'
    }
  }

  return (
    <div className="portal-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-800 text-navy-900 text-xl">Courses</h2>
          <p className="text-gray-400 text-sm mt-0.5">{courses.length} total courses</p>
        </div>
        <button onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all">
          <Plus size={15} /> Add Course
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by code, title or lecturer..."
            value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9 py-2.5 text-sm w-full" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input py-2.5 text-sm sm:max-w-xs">
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-academy" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <BookOpen size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="font-display font-600 text-navy-900 mb-1">No courses found</p>
          <p className="text-gray-400 text-sm">{search ? 'Try a different search.' : 'No courses added yet.'}</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-academy">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Lecturer</th>
                  <th>Credits</th>
                  <th>Enrolled</th>
                  <th className="text-center">Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="badge-navy text-xs flex-shrink-0">{c.code ?? 'N/A'}</span>
                        <p className="font-display font-600 text-navy-900 text-sm">{c.title}</p>
                      </div>
                    </td>
                    <td className="text-gray-500 text-sm">{c.lecturerName ?? 'Unassigned'}</td>
                    <td className="text-gray-500 text-sm">{c.credits ?? '—'}</td>
                    <td className="text-gray-500 text-sm">
                      <span className="inline-flex items-center gap-1.5">
                        <UsersIcon size={12} className="text-gold-500" /> {counts[c.id] ?? 0}
                      </span>
                    </td>
                    <td className="text-center"><span className={statusBadge(c.status)}>{c.status ?? 'active'}</span></td>
                    <td>
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setSelected(c)} className="p-1.5 rounded-lg text-gray-400 hover:text-navy-900 hover:bg-gray-100 transition-all">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(c)} disabled={deleting === c.id}
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
            <p className="text-gray-400 text-xs">Showing {filtered.length} of {courses.length} courses</p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <CourseDrawer course={selected} lecturers={lecturers} programs={programs}
            onClose={() => setSelected(null)} onSaved={handleSaved} />
        )}
        {creating && (
          <CourseDrawer course={null} lecturers={lecturers} programs={programs}
            onClose={() => setCreating(false)} onSaved={handleSaved} />
        )}
      </AnimatePresence>
    </div>
  )
}