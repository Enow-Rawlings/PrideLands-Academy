

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ClipboardList, Upload, CheckCircle, Clock,
  AlertCircle, Eye, X
} from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '@/shared/store/authStore'
import {
  getAssignments, getSubmissions, createSubmission,
  updateSubmission, where, orderBy
} from '@/firebase/firestore'

const FILTERS = ['All', 'Pending', 'Submitted', 'Overdue', 'Graded']

function formatDate(val) {
  if (!val) return '—'
  const d = val?.toDate ? val.toDate() : new Date(val)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function getStatus(assignment, submission) {
  if (submission?.grade != null) return 'Graded'
  if (submission)                return 'Submitted'
  const due = assignment.dueDate?.toDate ? assignment.dueDate.toDate() : new Date(assignment.dueDate)
  if (due < new Date())          return 'Overdue'
  return 'Pending'
}

function statusBadge(status) {
  switch (status) {
    case 'Graded':    return 'badge bg-emerald-100 text-emerald-700'
    case 'Submitted': return 'badge bg-blue-100 text-blue-700'
    case 'Overdue':   return 'badge bg-crimson-600/10 text-crimson-600'
    default:          return 'badge bg-gold-500/15 text-gold-700'
  }
}

// Simple submission modal
function SubmitModal({ assignment, onClose, onSubmit, submitting }) {
  const [text, setText] = useState('')
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-7"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-700 text-navy-900 text-base">{assignment.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-navy-900 transition-colors">
            <X size={18} />
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-4">Due: {formatDate(assignment.dueDate)}</p>
        <div className="mb-4">
          <label className="label">Your Submission</label>
          <textarea
            rows={5} value={text} onChange={(e) => setText(e.target.value)}
            className="input resize-none"
            placeholder="Type your answer or paste your submission text here..."
          />
        </div>
        <p className="text-gray-400 text-xs mb-5 flex items-center gap-1.5">
          <AlertCircle size={11} />
          File upload will be enabled once Cloudinary is connected.
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 text-navy-700 font-display font-600 text-sm rounded-academy hover:border-navy-900 transition-all">
            Cancel
          </button>
          <button
            onClick={() => onSubmit(assignment.id, text)}
            disabled={!text.trim() || submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all disabled:opacity-60"
          >
            {submitting
              ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              : <><Upload size={13} /> Submit</>}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function Assignments() {
  const { profile }     = useAuthStore()
  const [assignments,   setAssignments]   = useState([])
  const [submissions,   setSubmissions]   = useState([])
  const [loading,       setLoading]       = useState(true)
  const [filter,        setFilter]        = useState('All')
  const [submitting,    setSubmitting]    = useState(false)
  const [activeAssign,  setActiveAssign]  = useState(null)

  useEffect(() => {
    if (!profile?.uid) return
    async function load() {
      try {
        const [a, s] = await Promise.all([
          getAssignments([where('studentId', '==', profile.uid), orderBy('dueDate', 'asc')]),
          getSubmissions([where('studentId', '==', profile.uid)]),
        ])
        setAssignments(a)
        setSubmissions(s)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    load()
  }, [profile?.uid])

  const subMap = submissions.reduce((acc, s) => { acc[s.assignmentId] = s; return acc }, {})

  const enriched = assignments.map((a) => ({
    ...a, submission: subMap[a.id], status: getStatus(a, subMap[a.id]),
  }))

  const filtered = filter === 'All' ? enriched : enriched.filter((a) => a.status === filter)

  const handleSubmit = async (assignmentId, text) => {
    setSubmitting(true)
    try {
      const existing = subMap[assignmentId]
      if (existing) {
        await updateSubmission(existing.id, { text, submittedAt: new Date() })
      } else {
        await createSubmission({ assignmentId, studentId: profile.uid, text, submittedAt: new Date(), status: 'submitted' })
      }
      toast.success('Assignment submitted successfully.')
      setActiveAssign(null)
      // Refresh
      const s = await getSubmissions([where('studentId', '==', profile.uid)])
      setSubmissions(s)
    } catch { toast.error('Submission failed. Try again.') }
    finally { setSubmitting(false) }
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
          <p className="text-gray-400 text-sm mt-0.5">{enriched.filter(a => a.status === 'Pending' || a.status === 'Overdue').length} pending</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-thin">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-display font-600 transition-all ${
              filter === f ? 'bg-navy-900 text-white' : 'bg-white border border-gray-200 text-navy-600 hover:border-navy-900'
            }`}>
            {f}
            <span className="ml-1.5 opacity-60">
              ({f === 'All' ? enriched.length : enriched.filter(a => a.status === f).length})
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <CheckCircle size={36} className="text-emerald-400 mx-auto mb-3" />
          <p className="font-display font-600 text-navy-900 mb-1">
            {filter === 'All' ? 'No assignments yet' : `No ${filter.toLowerCase()} assignments`}
          </p>
          <p className="text-gray-400 text-sm">Check back when your lecturers post new tasks.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`card p-5 flex flex-col sm:flex-row gap-4 sm:items-center border-l-4 ${
                a.status === 'Overdue'   ? 'border-crimson-600' :
                a.status === 'Graded'   ? 'border-emerald-500' :
                a.status === 'Submitted'? 'border-blue-500'    : 'border-gold-500'
              }`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={statusBadge(a.status)}>{a.status}</span>
                  <span className="text-gray-400 text-xs">{a.courseCode}</span>
                </div>
                <p className="font-display font-700 text-navy-900 text-sm">{a.title}</p>
                <p className="text-gray-400 text-xs mt-1 flex items-center gap-1.5">
                  <Clock size={11} /> Due: {formatDate(a.dueDate)}
                  {a.submission?.grade != null && (
                    <span className="ml-3 text-emerald-600 font-600">Grade: {a.submission.grade}/{a.totalMarks}</span>
                  )}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {a.submission && (
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-navy-700 font-display font-600 text-xs rounded-academy hover:border-navy-900 transition-all">
                    <Eye size={12} /> View
                  </button>
                )}
                {(a.status === 'Pending' || a.status === 'Overdue') && (
                  <button onClick={() => setActiveAssign(a)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy-900 text-white font-display font-700 text-xs rounded-academy hover:bg-navy-800 transition-all">
                    <Upload size={12} /> Submit
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeAssign && (
        <SubmitModal
          assignment={activeAssign}
          onClose={() => setActiveAssign(null)}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}
    </div>
  )
}

