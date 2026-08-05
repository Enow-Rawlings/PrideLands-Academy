
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart2, Save, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '@/shared/store/authStore'
import {
  getCourses, getEnrollments, getResults,
  createResult, updateDocument,
  where
} from '@/firebase/firestore'

const GRADES = [
  { grade:'A+', min:90 }, { grade:'A', min:85 }, { grade:'A-', min:80 },
  { grade:'B+', min:75 }, { grade:'B', min:70 }, { grade:'B-', min:65 },
  { grade:'C+', min:60 }, { grade:'C', min:55 }, { grade:'C-', min:50 },
  { grade:'D',  min:45 }, { grade:'F', min:0 },
]

function scoreToGrade(score) {
  if (score == null || score === '') return ''
  const n = Number(score)
  return GRADES.find(g => n >= g.min)?.grade ?? 'F'
}

export default function ResultsEntry() {
  const { profile }  = useAuthStore()
  const [courses,    setCourses]   = useState([])
  const [selected,   setSelected]  = useState(null)
  const [semester,   setSemester]  = useState('Semester 1 2024/2025')
  const [rows,       setRows]      = useState([]) // { studentId, name, existingId, score, grade }
  const [loading,    setLoading]   = useState(true)
  const [saving,     setSaving]    = useState(false)

  useEffect(() => {
    if (!profile?.uid) return
    getCourses([where('lecturerId','==',profile.uid)])
      .then(c => { setCourses(c); if (c.length) setSelected(c[0]) })
      .catch(console.error).finally(() => setLoading(false))
  }, [profile?.uid])

  useEffect(() => {
    if (!selected?.id) return
    async function load() {
      setLoading(true)
      try {
        const enrollments = await getEnrollments([where('courseId','==',selected.id)])
        const results     = await getResults([where('courseId','==',selected.id), where('semester','==',semester)])
        const resultMap   = results.reduce((acc, r) => { acc[r.studentId] = r; return acc }, {})

        const rowData = await Promise.all(enrollments.map(async (e) => {
          const existing = resultMap[e.studentId]
          return {
            studentId:  e.studentId,
            name:       e.studentName ?? e.studentId?.slice(0,8),
            existingId: existing?.id ?? null,
            score:      existing?.score ?? '',
            grade:      existing?.grade ?? '',
          }
        }))
        setRows(rowData)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    load()
  }, [selected?.id, semester])

  const updateRow = (studentId, score) => {
    setRows(prev => prev.map(r =>
      r.studentId === studentId
        ? { ...r, score, grade: scoreToGrade(score) }
        : r
    ))
  }

  const handleSave = async () => {
    const incomplete = rows.filter(r => r.score === '' || r.score == null)
    if (incomplete.length > 0) {
      toast.error(`${incomplete.length} student(s) have no score entered.`)
      return
    }
    setSaving(true)
    try {
      await Promise.all(rows.map(r => {
        const data = {
          studentId: r.studentId, courseId: selected.id,
          courseCode: selected.code, courseTitle: selected.title,
          semester, score: Number(r.score), grade: r.grade,
          credits: selected.credits, lecturerId: profile.uid,
        }
        return r.existingId
          ? updateDocument('results', r.existingId, data)
          : createResult(data)
      }))
      toast.success('Results saved successfully.')
    } catch { toast.error('Failed to save results. Try again.') }
    finally { setSaving(false) }
  }

  const graded   = rows.filter(r => r.score !== '').length
  const passing  = rows.filter(r => r.grade && r.grade !== 'F' && r.grade !== 'D').length

  return (
    <div className="portal-page max-w-4xl">
      <h2 className="font-display font-800 text-navy-900 text-xl mb-6">Results Entry</h2>

      {/* Controls */}
      <div className="card p-5 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Course</label>
            <select className="input" value={selected?.id ?? ''}
              onChange={e => setSelected(courses.find(c => c.id === e.target.value))}>
              {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Semester</label>
            <select className="input" value={semester} onChange={e => setSemester(e.target.value)}>
              {['Semester 1 2024/2025','Semester 2 2024/2025','Semester 1 2025/2026'].map(s =>
                <option key={s} value={s}>{s}</option>
              )}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={handleSave} disabled={saving || !rows.length}
              className="inline-flex items-center gap-2 w-full justify-center px-5 py-3 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all disabled:opacity-60">
              {saving ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"/>
                      : <><Save size={14}/> Publish Results</>}
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
      {rows.length > 0 && (
        <div className="flex gap-3 mb-5">
          <span className="badge-navy text-xs">{rows.length} Students</span>
          <span className="badge badge-green">{graded} Graded</span>
          <span className="badge bg-blue-100 text-blue-700">{passing} Passing</span>
          <span className="badge-red">{graded - passing} Failing</span>
        </div>
      )}

      {/* Grade table */}
      {loading ? (
        <div className="skeleton h-64 rounded-academy" />
      ) : rows.length === 0 ? (
        <div className="card p-12 text-center">
          <AlertCircle size={32} className="text-gray-300 mx-auto mb-3"/>
          <p className="text-gray-400 text-sm">No students enrolled in this course.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-academy">
              <thead>
                <tr>
                  <th>Student</th>
                  <th className="text-center">Score (/100)</th>
                  <th className="text-center">Grade</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <motion.tr key={row.studentId}
                    initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i * 0.03 }}>
                    <td className="font-display font-600">{row.name}</td>
                    <td className="text-center">
                      <input
                        type="number" min="0" max="100"
                        value={row.score}
                        onChange={e => updateRow(row.studentId, e.target.value)}
                        className="input text-center w-24 mx-auto py-1.5 text-sm"
                        placeholder="0–100"
                      />
                    </td>
                    <td className="text-center">
                      <span className={`badge text-xs font-display font-700 ${
                        !row.grade ? 'bg-gray-100 text-gray-400' :
                        ['A+','A','A-'].includes(row.grade) ? 'bg-emerald-100 text-emerald-700' :
                        ['B+','B','B-'].includes(row.grade) ? 'bg-blue-100 text-blue-700' :
                        ['C+','C','C-'].includes(row.grade) ? 'bg-gold-500/15 text-gold-700' :
                        'bg-crimson-600/10 text-crimson-600'
                      }`}>{row.grade || '—'}</span>
                    </td>
                    <td className="text-center">
                      {row.score !== '' && (
                        row.grade !== 'F' && row.grade !== 'D'
                          ? <CheckCircle size={15} className="text-emerald-500 mx-auto"/>
                          : <AlertCircle size={15} className="text-crimson-600 mx-auto"/>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}