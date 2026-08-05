// import React from 'react'
// import { Settings } from 'lucide-react'
// export default function Results() {
//   return (
//     <div className="portal-page">
//       <div className="card p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
//         <div className="w-14 h-14 rounded-2xl bg-navy-900 flex items-center justify-center mb-4">
//           <Settings size={24} className="text-gold-400" />
//         </div>
//         <h2 className="font-display font-700 text-navy-900 text-xl mb-2">Results</h2>
//         <p className="text-gray-400 text-sm">This admin section is being built. Coming very soon.</p>
//       </div>
//     </div>
//   )
// }


import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart2, Search, Plus, Edit2, Trash2, X, Save, TrendingUp, Award, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  getResults, createResult, updateResult, deleteResult,
  getStudents, getLecturers, getCourses,
} from '@/firebase/firestore'

const GRADE_SCALE = [
  { grade: 'A+', min: 90 }, { grade: 'A', min: 85 }, { grade: 'A-', min: 80 },
  { grade: 'B+', min: 75 }, { grade: 'B', min: 70 }, { grade: 'B-', min: 65 },
  { grade: 'C+', min: 60 }, { grade: 'C', min: 55 }, { grade: 'C-', min: 50 },
  { grade: 'D', min: 45 }, { grade: 'F', min: 0 },
]
const scoreToGrade = (score) => {
  if (score === '' || score == null) return ''
  const n = Number(score)
  return GRADE_SCALE.find((g) => n >= g.min)?.grade ?? 'F'
}
const isPassing = (grade) => grade && grade !== 'F' && grade !== 'D'
function gradeBadge(grade) {
  if (!grade) return 'badge bg-gray-100 text-gray-400'
  if (['A+', 'A', 'A-'].includes(grade)) return 'badge bg-emerald-100 text-emerald-700'
  if (['B+', 'B', 'B-'].includes(grade)) return 'badge bg-blue-100 text-blue-700'
  if (['C+', 'C', 'C-'].includes(grade)) return 'badge bg-gold-500/15 text-gold-700'
  return 'badge bg-crimson-600/10 text-crimson-600'
}

function ResultDrawer({ result, students, courses, onClose, onSaved }) {
  const isNew = !result?.id
  const [form, setForm] = useState({
    studentId: '', courseId: '', semester: 'Semester 1 2024/2025', score: '',
    ...result,
  })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.studentId || (!form.courseId && isNew) || form.score === '') {
      toast.error('Student, course and score are required.')
      return
    }
    setSaving(true)
    const course = courses.find((c) => c.id === form.courseId) ?? {}
    const grade = scoreToGrade(form.score)
    const payload = {
      studentId: form.studentId,
      courseId: form.courseId || result?.courseId,
      courseCode: course.code ?? result?.courseCode,
      courseTitle: course.title ?? result?.courseTitle,
      credits: course.credits ?? result?.credits,
      lecturerId: course.lecturerId ?? result?.lecturerId ?? null,
      semester: form.semester,
      score: Number(form.score),
      grade,
    }
    try {
      if (isNew) {
        const created = await createResult(payload)
        onSaved({ id: created?.id ?? created, ...payload })
        toast.success('Result added.')
      } else {
        await updateResult(result.id, payload)
        onSaved({ ...result, ...payload })
        toast.success('Result updated.')
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
            {isNew ? 'Add Result' : 'Correct Result'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-navy-900 transition-colors"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isNew ? (
            <>
              <div>
                <label className="label">Student</label>
                <select value={form.studentId} onChange={(e) => set('studentId', e.target.value)} className="input">
                  <option value="">— Select student —</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Course</label>
                <select value={form.courseId} onChange={(e) => set('courseId', e.target.value)} className="input">
                  <option value="">— Select course —</option>
                  {courses.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
                </select>
              </div>
            </>
          ) : (
            <div className="card p-3 bg-slate-academy">
              <p className="font-display font-600 text-navy-900 text-sm">{result.courseCode} — {result.courseTitle}</p>
              <p className="text-gray-400 text-xs mt-0.5">Student ID: {result.studentId}</p>
            </div>
          )}

          <div>
            <label className="label">Semester</label>
            <select value={form.semester} onChange={(e) => set('semester', e.target.value)} className="input">
              {['Semester 1 2024/2025', 'Semester 2 2024/2025', 'Semester 1 2025/2026'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Score (/100)</label>
            <input type="number" min="0" max="100" value={form.score}
              onChange={(e) => set('score', e.target.value)} className="input" />
            {form.score !== '' && (
              <p className="text-xs text-gray-400 mt-1.5">Grade preview: <span className={gradeBadge(scoreToGrade(form.score))}>{scoreToGrade(form.score)}</span></p>
            )}
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

export default function Results() {
  const [results,   setResults]   = useState([])
  const [students,  setStudents]  = useState([])
  const [lecturers, setLecturers] = useState([])
  const [courses,   setCourses]   = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [semester,  setSemester]  = useState('all')
  const [selected,  setSelected]  = useState(null)
  const [creating,  setCreating]  = useState(false)
  const [deleting,  setDeleting]  = useState(null)

  const load = () => {
    setLoading(true)
    Promise.all([getResults(), getStudents(), getLecturers(), getCourses()])
      .then(([r, s, l, c]) => { setResults(r); setStudents(s); setLecturers(l); setCourses(c) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const studentMap  = useMemo(() => Object.fromEntries(students.map((s) => [s.id, `${s.firstName ?? ''} ${s.lastName ?? ''}`.trim()])), [students])
  const lecturerMap = useMemo(() => Object.fromEntries(lecturers.map((l) => [l.id, `${l.firstName ?? ''} ${l.lastName ?? ''}`.trim()])), [lecturers])

  const semesters = useMemo(() => [...new Set(results.map((r) => r.semester))].filter(Boolean), [results])

  const enriched = results.map((r) => ({
    ...r,
    studentName: studentMap[r.studentId] || r.studentId?.slice(0, 8) || 'Unknown',
    lecturerName: lecturerMap[r.lecturerId] || '—',
  }))

  const filtered = enriched.filter((r) => {
    const matchesSemester = semester === 'all' || r.semester === semester
    const matchesSearch = !search || `${r.studentName} ${r.courseCode} ${r.courseTitle}`.toLowerCase().includes(search.toLowerCase())
    return matchesSemester && matchesSearch
  })

  const graded = enriched.filter((r) => r.grade)
  const avgScore = graded.length ? (graded.reduce((s, r) => s + (r.score ?? 0), 0) / graded.length).toFixed(1) : '—'
  const passRate = graded.length ? Math.round((graded.filter((r) => isPassing(r.grade)).length / graded.length) * 100) : 0

  const handleDelete = async (r) => {
    if (!window.confirm(`Delete this result for ${r.studentName} in ${r.courseCode}?`)) return
    setDeleting(r.id)
    try {
      await deleteResult(r.id)
      setResults((prev) => prev.filter((x) => x.id !== r.id))
      toast.success('Result deleted.')
    } catch { toast.error('Delete failed.') }
    finally { setDeleting(null) }
  }

  const handleSaved = (saved) => {
    setResults((prev) => {
      const exists = prev.some((r) => r.id === saved.id)
      return exists ? prev.map((r) => (r.id === saved.id ? saved : r)) : [saved, ...prev]
    })
  }

  return (
    <div className="portal-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-800 text-navy-900 text-xl">Results</h2>
          <p className="text-gray-400 text-sm mt-0.5">{results.length} total results across all courses</p>
        </div>
        <button onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all">
          <Plus size={15} /> Add Result
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Results', value: results.length, icon: BarChart2, color: 'bg-navy-900' },
          { label: 'Average Score', value: avgScore,       icon: TrendingUp, color: 'bg-blue-600' },
          { label: 'Pass Rate',     value: `${passRate}%`, icon: Award,      color: 'bg-emerald-600' },
          { label: 'Semesters',     value: semesters.length, icon: AlertCircle, color: 'bg-gold-500' },
        ].map((s) => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
              <s.icon size={17} className="text-white" />
            </div>
            <div>
              <p className="font-display font-800 text-navy-900 text-xl leading-none">{s.value}</p>
              <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by student or course..."
            value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9 py-2.5 text-sm w-full" />
        </div>
        <select value={semester} onChange={(e) => setSemester(e.target.value)} className="input py-2.5 text-sm sm:max-w-xs">
          <option value="all">All Semesters</option>
          {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-14 rounded-academy" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <BarChart2 size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="font-display font-600 text-navy-900 mb-1">No results found</p>
          <p className="text-gray-400 text-sm">{search ? 'Try a different search.' : 'No results have been published yet.'}</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-academy">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Semester</th>
                  <th className="text-center">Score</th>
                  <th className="text-center">Grade</th>
                  <th>Lecturer</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                    <td className="font-display font-600 text-navy-900 text-sm">{r.studentName}</td>
                    <td>
                      <p className="text-navy-900 text-sm">{r.courseCode ?? '—'}</p>
                      <p className="text-gray-400 text-xs">{r.courseTitle ?? ''}</p>
                    </td>
                    <td className="text-gray-500 text-sm">{r.semester ?? '—'}</td>
                    <td className="text-center text-gray-500 text-sm">{r.score != null ? `${r.score}/100` : '—'}</td>
                    <td className="text-center"><span className={gradeBadge(r.grade)}>{r.grade ?? '—'}</span></td>
                    <td className="text-gray-500 text-sm">{r.lecturerName}</td>
                    <td>
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setSelected(r)} className="p-1.5 rounded-lg text-gray-400 hover:text-navy-900 hover:bg-gray-100 transition-all">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(r)} disabled={deleting === r.id}
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
            <p className="text-gray-400 text-xs">Showing {filtered.length} of {results.length} results</p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <ResultDrawer result={selected} students={students} courses={courses}
            onClose={() => setSelected(null)} onSaved={handleSaved} />
        )}
        {creating && (
          <ResultDrawer result={null} students={students} courses={courses}
            onClose={() => setCreating(false)} onSaved={handleSaved} />
        )}
      </AnimatePresence>
    </div>
  )
}