import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardList, Plus, Eye, Trash2, X, Save,
  Clock, Users, CheckCircle, AlertCircle, ChevronDown
} from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '@/shared/store/authStore'
import {
  getCourses, getDocuments, createDocument,
  updateDocument, deleteDocument,
  where, orderBy
} from '@/firebase/firestore'

function formatDate(val) {
  if (!val) return '—'
  const d = val?.toDate ? val.toDate() : new Date(val)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function isOverdue(dueDate) {
  if (!dueDate) return false
  const d = dueDate?.toDate ? dueDate.toDate() : new Date(dueDate)
  return d < new Date()
}

// ── Assignment form modal ──────────────────────────────────────────
function AssignmentModal({ courses, assignment, onClose, onSaved }) {
  const { profile } = useAuthStore()
  const isEdit = !!assignment?.id
  const [form, setForm] = useState(
    assignment ?? {
      courseId: courses[0]?.id ?? '',
      title: '', description: '',
      dueDate: '', totalMarks: 100,
      instructions: ''
    }
  )
  const [saving, setSaving] = useState(false)
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = async () => {
    if (!form.courseId || !form.title || !form.dueDate) {
      toast.error('Course, title and due date are required.')
      return
    }
    setSaving(true)
    try {
      const data = { ...form, lecturerId: profile.uid }
      if (isEdit) {
        await updateDocument('assignments', assignment.id, data)
        onSaved({ ...assignment, ...data })
        toast.success('Assignment updated.')
      } else {
        const id = await createDocument('assignments', data)
        onSaved({ id, ...data, createdAt: new Date() })
        toast.success('Assignment created.')
      }
      onClose()
    } catch { toast.error('Failed to save. Try again.') }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-7">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-700 text-navy-900 text-base">
            {isEdit ? 'Edit Assignment' : 'New Assignment'}
          </h3>
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

          <div>
            <label className="label">Assignment Title <span className="text-crimson-600">*</span></label>
            <input className="input" placeholder="e.g. Research Paper — AI Ethics"
              value={form.title} onChange={e => set('title', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Due Date & Time <span className="text-crimson-600">*</span></label>
              <input type="datetime-local" className="input"
                value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
            </div>
            <div>
              <label className="label">Total Marks</label>
              <input type="number" min="1" max="200" className="input"
                value={form.totalMarks} onChange={e => set('totalMarks', Number(e.target.value))} />
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea rows={3} className="input resize-none"
              placeholder="Brief overview of what students need to do..."
              value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          <div>
            <label className="label">Detailed Instructions (optional)</label>
            <textarea rows={4} className="input resize-none"
              placeholder="Step-by-step instructions, formatting requirements, submission guidelines..."
              value={form.instructions} onChange={e => set('instructions', e.target.value)} />
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
              : <><Save size={14} /> {isEdit ? 'Update' : 'Publish'}</>}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Submissions drawer ─────────────────────────────────────────────
function SubmissionsDrawer({ assignment, submissions, onClose, onGrade }) {
  const [grading,  setGrading]  = useState({}) // { submissionId: score }
  const [saving,   setSaving]   = useState(null)

  const handleGrade = async (sub) => {
    const score = Number(grading[sub.id])
    if (isNaN(score) || score < 0 || score > assignment.totalMarks) {
      toast.error(`Enter a score between 0 and ${assignment.totalMarks}.`)
      return
    }
    setSaving(sub.id)
    try {
      await updateDocument('submissions', sub.id, { grade: score, gradedAt: new Date() })
      onGrade(sub.id, score)
      toast.success('Grade saved.')
    } catch { toast.error('Failed to save grade.') }
    finally { setSaving(null) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-display font-700 text-navy-900 text-base">Submissions</h3>
            <p className="text-gray-400 text-xs mt-0.5">{assignment.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-navy-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No submissions yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub) => (
                <div key={sub.id} className="card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-display font-700 text-navy-900 text-sm">
                      {sub.studentName ?? sub.studentId?.slice(0, 10)}
                    </p>
                    {sub.grade != null
                      ? <span className="badge badge-green text-xs">{sub.grade}/{assignment.totalMarks}</span>
                      : <span className="badge bg-gold-500/15 text-gold-700 text-xs">Ungraded</span>
                    }
                  </div>

                  {sub.text && (
                    <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-3 bg-slate-academy rounded-lg p-3">
                      {sub.text}
                    </p>
                  )}

                  <p className="text-gray-400 text-xs mb-3">
                    Submitted: {formatDate(sub.submittedAt)}
                  </p>

                  {/* Grade input */}
                  <div className="flex gap-2">
                    <input type="number" min="0" max={assignment.totalMarks}
                      placeholder={`0–${assignment.totalMarks}`}
                      defaultValue={sub.grade ?? ''}
                      onChange={e => setGrading(g => ({ ...g, [sub.id]: e.target.value }))}
                      className="input py-2 text-sm flex-1" />
                    <button onClick={() => handleGrade(sub)} disabled={saving === sub.id}
                      className="px-4 py-2 bg-navy-900 text-white font-display font-600 text-xs rounded-lg hover:bg-navy-800 transition-all disabled:opacity-60">
                      {saving === sub.id
                        ? <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />
                        : 'Grade'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────
export default function LecturerAssignments() {
  const { profile }    = useAuthStore()
  const [courses,      setCourses]      = useState([])
  const [assignments,  setAssignments]  = useState([])
  const [submissions,  setSubmissions]  = useState([])
  const [loading,      setLoading]      = useState(true)
  const [modal,        setModal]        = useState(null)  // null | 'new' | assignment obj
  const [drawer,       setDrawer]       = useState(null)  // assignment obj for submissions
  const [expandedId,   setExpandedId]   = useState(null)
  const [deleting,     setDeleting]     = useState(null)

  useEffect(() => {
    if (!profile?.uid) return
    async function load() {
      try {
        const [c, a, s] = await Promise.all([
          getCourses([where('lecturerId', '==', profile.uid)]),
          getDocuments('assignments', [where('lecturerId', '==', profile.uid), orderBy('dueDate', 'asc')]),
          getDocuments('submissions'),
        ])
        setCourses(c)
        setAssignments(a)
        setSubmissions(s)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    load()
  }, [profile?.uid])

  const courseCode = (id) => courses.find(c => c.id === id)?.code ?? '—'

  const submissionsFor = (assignmentId) =>
    submissions.filter(s => s.assignmentId === assignmentId)

  const handleSaved = (saved) => {
    setAssignments(prev => {
      const exists = prev.find(a => a.id === saved.id)
      return exists
        ? prev.map(a => a.id === saved.id ? saved : a)
        : [saved, ...prev].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    })
  }

  const handleDelete = async (assignment) => {
    if (!window.confirm(`Delete "${assignment.title}"? This cannot be undone.`)) return
    setDeleting(assignment.id)
    try {
      await deleteDocument('assignments', assignment.id)
      setAssignments(prev => prev.filter(a => a.id !== assignment.id))
      toast.success('Assignment deleted.')
    } catch { toast.error('Delete failed.') }
    finally { setDeleting(null) }
  }

  const handleGrade = (submissionId, score) => {
    setSubmissions(prev =>
      prev.map(s => s.id === submissionId ? { ...s, grade: score } : s)
    )
  }

  if (loading) return (
    <div className="portal-page">
      {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-academy mb-3" />)}
    </div>
  )

  return (
    <div className="portal-page max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-800 text-navy-900 text-xl">Assignments</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {assignments.length} published ·{' '}
            {submissions.filter(s => s.grade == null).length} awaiting grading
          </p>
        </div>
        <button onClick={() => setModal('new')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all">
          <Plus size={15} /> New Assignment
        </button>
      </div>

      {assignments.length === 0 ? (
        <div className="card p-12 text-center">
          <ClipboardList size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="font-display font-600 text-navy-900 mb-1">No assignments yet</p>
          <p className="text-gray-400 text-sm">Publish your first assignment to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((a, i) => {
            const subs       = submissionsFor(a.id)
            const graded     = subs.filter(s => s.grade != null).length
            const overdue    = isOverdue(a.dueDate)
            const isExpanded = expandedId === a.id

            return (
              <motion.div key={a.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card overflow-hidden"
              >
                {/* Header row */}
                <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className={`w-1.5 h-12 rounded-full flex-shrink-0 ${overdue ? 'bg-crimson-600' : 'bg-gold-500'}`} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="badge-navy text-xs">{courseCode(a.courseId)}</span>
                      {overdue
                        ? <span className="badge badge-red text-xs">Overdue</span>
                        : <span className="badge badge-green text-xs">Active</span>
                      }
                    </div>
                    <p className="font-display font-700 text-navy-900 text-sm">{a.title}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> Due: {formatDate(a.dueDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={11} /> {subs.length} submitted
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle size={11} /> {graded} graded
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setDrawer(a)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-navy-900 text-white font-display font-600 text-xs rounded-lg hover:bg-navy-800 transition-all">
                      <Eye size={12} /> Submissions ({subs.length})
                    </button>
                    <button onClick={() => setModal(a)}
                      className="p-2 rounded-lg border border-gray-200 text-navy-700 hover:border-navy-900 transition-all">
                      <Eye size={13} />
                    </button>
                    <button onClick={() => handleDelete(a)} disabled={deleting === a.id}
                      className="p-2 rounded-lg text-gray-400 hover:text-crimson-600 hover:bg-crimson-600/8 transition-all disabled:opacity-40">
                      <Trash2 size={13} />
                    </button>
                    <button onClick={() => setExpandedId(isExpanded ? null : a.id)}
                      className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:border-gray-300 transition-all">
                      <ChevronDown size={13} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden border-t border-gray-100"
                    >
                      <div className="px-6 py-4 space-y-3">
                        {a.description && (
                          <div>
                            <p className="text-xs font-display font-700 text-gray-400 uppercase tracking-wider mb-1">Description</p>
                            <p className="text-gray-600 text-sm leading-relaxed">{a.description}</p>
                          </div>
                        )}
                        {a.instructions && (
                          <div>
                            <p className="text-xs font-display font-700 text-gray-400 uppercase tracking-wider mb-1">Instructions</p>
                            <p className="text-gray-600 text-sm leading-relaxed">{a.instructions}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <AlertCircle size={11} />
                          Total marks: {a.totalMarks}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {modal && (
          <AssignmentModal
            courses={courses}
            assignment={modal === 'new' ? null : modal}
            onClose={() => setModal(null)}
            onSaved={handleSaved}
          />
        )}
        {drawer && (
          <SubmissionsDrawer
            assignment={drawer}
            submissions={submissionsFor(drawer.id)}
            onClose={() => setDrawer(null)}
            onGrade={handleGrade}
          />
        )}
      </AnimatePresence>
    </div>
  )
}