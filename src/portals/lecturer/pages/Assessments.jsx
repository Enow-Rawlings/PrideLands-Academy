import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileCheck, Plus, Eye, X, Save, AlertCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '@/shared/store/authStore'
import {
  getCourses, getDocuments, createDocument, updateDocument,
  where, orderBy
} from '@/firebase/firestore'

function formatDate(val) {
  if (!val) return '—'
  const d = val?.toDate ? val.toDate() : new Date(val)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const TYPES = ['Quiz', 'Mid-Term Exam', 'Final Exam', 'Practical', 'Presentation', 'Group Project']

function AssessmentModal({ courses, assessment, onClose, onSaved }) {
  const { profile } = useAuthStore()
  const isEdit = !!assessment?.id
  const [form, setForm] = useState(
    assessment ?? { courseId: courses[0]?.id ?? '', title: '', type: 'Quiz', totalMarks: 100, date: '', description: '' }
  )
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!form.courseId || !form.title || !form.date) { toast.error('Fill in all required fields.'); return }
    setSaving(true)
    try {
      const data = { ...form, lecturerId: profile.uid }
      if (isEdit) {
        await updateDocument('assessments', assessment.id, data)
        onSaved({ ...assessment, ...data })
        toast.success('Assessment updated.')
      } else {
        const id = await createDocument('assessments', data)
        onSaved({ id, ...data })
        toast.success('Assessment created.')
      }
      onClose()
    } catch { toast.error('Failed to save assessment.') }
    finally { setSaving(false) }
  }

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-7">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-700 text-navy-900 text-base">
            {isEdit ? 'Edit Assessment' : 'New Assessment'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-navy-900 transition-colors"><X size={18} /></button>
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
              <label className="label">Assessment Title <span className="text-crimson-600">*</span></label>
              <input className="input" placeholder="e.g. Mid-Term Test 1" value={form.title}
                onChange={e => set('title', e.target.value)} />
            </div>
            <div>
              <label className="label">Type</label>
              <select className="input" value={form.type} onChange={e => set('type', e.target.value)}>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Date <span className="text-crimson-600">*</span></label>
              <input type="date" className="input" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div>
              <label className="label">Total Marks</label>
              <input type="number" className="input" value={form.totalMarks}
                onChange={e => set('totalMarks', Number(e.target.value))} />
            </div>
          </div>
          <div>
            <label className="label">Description / Instructions (optional)</label>
            <textarea rows={3} className="input resize-none" placeholder="Add any instructions or notes..."
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
            {saving ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    : <><Save size={14} /> Save</>}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function Assessments() {
  const { profile }    = useAuthStore()
  const [courses,      setCourses]      = useState([])
  const [assessments,  setAssessments]  = useState([])
  const [loading,      setLoading]      = useState(true)
  const [modal,        setModal]        = useState(null) // null | 'new' | assessment object

  useEffect(() => {
    if (!profile?.uid) return
    async function load() {
      try {
        const [c, a] = await Promise.all([
          getCourses([where('lecturerId', '==', profile.uid)]),
          getDocuments('assessments', [where('lecturerId', '==', profile.uid), orderBy('date', 'asc')]),
        ])
        setCourses(c)
        setAssessments(a)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    load()
  }, [profile?.uid])

  const handleSaved = (saved) => {
    setAssessments(prev => {
      const exists = prev.find(a => a.id === saved.id)
      return exists ? prev.map(a => a.id === saved.id ? saved : a) : [saved, ...prev]
    })
  }

  const courseCode = (id) => courses.find(c => c.id === id)?.code ?? '—'

  if (loading) return (
    <div className="portal-page">
      {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-20 rounded-academy mb-3" />)}
    </div>
  )

  return (
    <div className="portal-page max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-800 text-navy-900 text-xl">Assessments</h2>
          <p className="text-gray-400 text-sm mt-0.5">{assessments.length} assessments scheduled</p>
        </div>
        <button onClick={() => setModal('new')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all">
          <Plus size={15} /> New Assessment
        </button>
      </div>

      {assessments.length === 0 ? (
        <div className="card p-12 text-center">
          <FileCheck size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="font-display font-600 text-navy-900 mb-1">No assessments yet</p>
          <p className="text-gray-400 text-sm">Create your first assessment to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assessments.map((a, i) => {
            const isUpcoming = new Date(a.date) > new Date()
            return (
              <motion.div key={a.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className={`w-1.5 h-12 rounded-full flex-shrink-0 ${isUpcoming ? 'bg-gold-500' : 'bg-gray-200'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge-navy text-xs">{courseCode(a.courseId)}</span>
                    <span className="badge bg-blue-100 text-blue-700 text-xs">{a.type}</span>
                    {isUpcoming && <span className="badge badge-green text-xs">Upcoming</span>}
                  </div>
                  <p className="font-display font-700 text-navy-900 text-sm">{a.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1.5">
                    <Clock size={11} /> {formatDate(a.date)} · {a.totalMarks} marks
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setModal(a)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-navy-700 font-display font-600 text-xs rounded-lg hover:border-navy-900 transition-all">
                    <Eye size={12} /> Edit
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <AssessmentModal
            courses={courses}
            assessment={modal === 'new' ? null : modal}
            onClose={() => setModal(null)}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>
    </div>
  )
}