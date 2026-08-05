import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, FileText, Film, File, Trash2,
  Plus, X, Save, Search, ExternalLink
} from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '@/shared/store/authStore'
import {
  getCourses, getDocuments, createDocument, deleteDocument,
  where, orderBy
} from '@/firebase/firestore'

const TYPE_ICON  = { pdf: FileText, video: Film, doc: File, other: File }
const TYPE_COLOR = {
  pdf:   'bg-crimson-600/10 text-crimson-600',
  video: 'bg-blue-100 text-blue-700',
  doc:   'bg-gold-500/15 text-gold-700',
  other: 'bg-gray-100 text-gray-500',
}

function formatDate(val) {
  if (!val) return ''
  const d = val?.toDate ? val.toDate() : new Date(val)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function UploadModal({ courses, onClose, onUploaded }) {
  const { profile } = useAuthStore()
  const [form, setForm] = useState({
    courseId: courses[0]?.id ?? '', title: '', type: 'pdf', url: '', description: ''
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!form.courseId || !form.title || !form.url) {
      toast.error('Course, title and URL are required.')
      return
    }
    setSaving(true)
    try {
      const id = await createDocument('materials', { ...form, lecturerId: profile.uid })
      onUploaded({ id, ...form, createdAt: new Date() })
      toast.success('Material uploaded successfully.')
      onClose()
    } catch { toast.error('Upload failed. Try again.') }
    finally { setSaving(false) }
  }

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-7">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-700 text-navy-900 text-base">Upload Material</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-navy-900 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Course <span className="text-crimson-600">*</span></label>
            <select className="input" value={form.courseId} onChange={e => set('courseId', e.target.value)}>
              {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Title <span className="text-crimson-600">*</span></label>
              <input className="input" placeholder="e.g. Week 3 Lecture Notes"
                value={form.title} onChange={e => set('title', e.target.value)} />
            </div>
            <div>
              <label className="label">File Type</label>
              <select className="input" value={form.type} onChange={e => set('type', e.target.value)}>
                <option value="pdf">PDF</option>
                <option value="video">Video</option>
                <option value="doc">Document</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">
              File URL <span className="text-crimson-600">*</span>
              <span className="text-gray-400 font-body font-400 normal-case ml-1">
                (Cloudinary / Google Drive / YouTube link)
              </span>
            </label>
            <input className="input" placeholder="https://..."
              value={form.url} onChange={e => set('url', e.target.value)} />
            <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
              Direct Cloudinary upload coming soon — paste a public link for now.
            </p>
          </div>

          <div>
            <label className="label">Description (optional)</label>
            <textarea rows={2} className="input resize-none" placeholder="Brief description of this material..."
              value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 text-navy-700 font-display font-600 text-sm rounded-academy hover:border-navy-900 transition-all">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all disabled:opacity-60">
            {saving
              ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              : <><Save size={14} /> Upload</>}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function LecturerMaterials() {
  const { profile }  = useAuthStore()
  const [courses,    setCourses]    = useState([])
  const [materials,  setMaterials]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [showModal,  setShowModal]  = useState(false)
  const [search,     setSearch]     = useState('')
  const [courseFilter, setCourseFilter] = useState('all')
  const [deleting,   setDeleting]   = useState(null)

  useEffect(() => {
    if (!profile?.uid) return
    async function load() {
      try {
        const [c, m] = await Promise.all([
          getCourses([where('lecturerId', '==', profile.uid)]),
          getDocuments('materials', [where('lecturerId', '==', profile.uid), orderBy('createdAt', 'desc')]),
        ])
        setCourses(c)
        setMaterials(m)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    load()
  }, [profile?.uid])

  const filtered = materials.filter(m => {
    const matchSearch = !search || m.title?.toLowerCase().includes(search.toLowerCase())
    const matchCourse = courseFilter === 'all' || m.courseId === courseFilter
    return matchSearch && matchCourse
  })

  const handleUploaded = (mat) => setMaterials(prev => [mat, ...prev])

  const handleDelete = async (mat) => {
    if (!window.confirm(`Delete "${mat.title}"?`)) return
    setDeleting(mat.id)
    try {
      await deleteDocument('materials', mat.id)
      setMaterials(prev => prev.filter(m => m.id !== mat.id))
      toast.success('Material deleted.')
    } catch { toast.error('Delete failed.') }
    finally { setDeleting(null) }
  }

  const courseCode = (id) => courses.find(c => c.id === id)?.code ?? '—'

  if (loading) return (
    <div className="portal-page">
      {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-academy mb-3" />)}
    </div>
  )

  return (
    <div className="portal-page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-800 text-navy-900 text-xl">Learning Materials</h2>
          <p className="text-gray-400 text-sm mt-0.5">{materials.length} materials uploaded</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all">
          <Plus size={15} /> Upload Material
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search materials..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="input pl-9 py-2.5 text-sm w-full" />
        </div>
        <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)}
          className="input py-2.5 text-sm appearance-none">
          <option value="all">All Courses</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Upload size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="font-display font-600 text-navy-900 mb-1">No materials found</p>
          <p className="text-gray-400 text-sm">
            {search ? 'Try a different search.' : 'Upload your first course material to get started.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m, i) => {
            const Icon  = TYPE_ICON[m.type]  ?? File
            const color = TYPE_COLOR[m.type] ?? TYPE_COLOR.other
            return (
              <motion.div key={m.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="card p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-700 text-navy-900 text-sm truncate">{m.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {courseCode(m.courseId)} · {m.type?.toUpperCase()} · {formatDate(m.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {m.url && (
                    <a href={m.url} target="_blank" rel="noopener noreferrer"
                      className="p-2 rounded-lg border border-gray-200 text-navy-700 hover:bg-navy-900 hover:text-white hover:border-navy-900 transition-all">
                      <ExternalLink size={13} />
                    </a>
                  )}
                  <button onClick={() => handleDelete(m)} disabled={deleting === m.id}
                    className="p-2 rounded-lg text-gray-400 hover:text-crimson-600 hover:bg-crimson-600/8 transition-all disabled:opacity-40">
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <UploadModal courses={courses} onClose={() => setShowModal(false)} onUploaded={handleUploaded} />
        )}
      </AnimatePresence>
    </div>
  )
}