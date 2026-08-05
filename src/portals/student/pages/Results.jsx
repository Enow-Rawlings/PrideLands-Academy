
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Award, AlertCircle, ChevronDown } from 'lucide-react'
import useAuthStore from '@/shared/store/authStore'
import { getResults, where, orderBy } from '@/firebase/firestore'

function gradeColor(grade) {
  if (!grade) return 'bg-gray-100 text-gray-400'
  if (['A+','A','A-'].includes(grade)) return 'bg-emerald-100 text-emerald-700'
  if (['B+','B','B-'].includes(grade)) return 'bg-blue-100 text-blue-700'
  if (['C+','C','C-'].includes(grade)) return 'bg-gold-500/15 text-gold-700'
  return 'bg-crimson-600/10 text-crimson-600'
}

function gradeToGp(grade) {
  const map = { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0 }
  return map[grade] ?? 0
}

export default function Results() {
  const { profile } = useAuthStore()
  const [results,  setResults]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [openSem,  setOpenSem]  = useState(null)

  useEffect(() => {
    if (!profile?.uid) return
    getResults([where('studentId', '==', profile.uid), orderBy('createdAt', 'desc')])
      .then((data) => {
        setResults(data)
        // Open the first/latest semester by default
        const sems = [...new Set(data.map((r) => r.semester))].filter(Boolean)
        if (sems.length) setOpenSem(sems[0])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [profile?.uid])

  // Group by semester
  const bySemester = results.reduce((acc, r) => {
    const key = r.semester ?? 'Unknown'
    if (!acc[key]) acc[key] = []
    acc[key].push(r)
    return acc
  }, {})

  // Calculate CGPA
  const allGraded  = results.filter((r) => r.grade && r.credits)
  const totalCredits = allGraded.reduce((s, r) => s + (r.credits ?? 0), 0)
  const totalPoints  = allGraded.reduce((s, r) => s + (gradeToGp(r.grade) * (r.credits ?? 0)), 0)
  const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '—'

  if (loading) {
    return (
      <div className="portal-page">
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-academy mb-4" />)}
      </div>
    )
  }

  return (
    <div className="portal-page max-w-4xl">
      <h2 className="font-display font-800 text-navy-900 text-xl mb-6">Academic Results</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'CGPA',            value: cgpa,                    icon: TrendingUp, color: 'bg-navy-900' },
          { label: 'Courses Taken',   value: results.length,          icon: Award,      color: 'bg-gold-500' },
          { label: 'Credits Earned',  value: totalCredits || '—',     icon: Award,      color: 'bg-blue-600' },
          { label: 'Semesters',       value: Object.keys(bySemester).length, icon: Award, color: 'bg-emerald-600' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card p-4 flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
              <s.icon size={17} className="text-white" />
            </div>
            <div>
              <p className="font-display font-800 text-navy-900 text-xl leading-none">{s.value}</p>
              <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No results */}
      {results.length === 0 ? (
        <div className="card p-12 text-center">
          <TrendingUp size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="font-display font-600 text-navy-900 mb-1">No results published yet</p>
          <p className="text-gray-400 text-sm">Results will appear here once your lecturers publish them.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(bySemester).map(([semester, semResults]) => {
            const isOpen       = openSem === semester
            const semCredits   = semResults.filter((r) => r.grade && r.credits).reduce((s, r) => s + (r.credits ?? 0), 0)
            const semPoints    = semResults.filter((r) => r.grade && r.credits).reduce((s, r) => s + (gradeToGp(r.grade) * (r.credits ?? 0)), 0)
            const semGPA       = semCredits > 0 ? (semPoints / semCredits).toFixed(2) : '—'
            const hasUnsafe    = semResults.some((r) => r.grade === 'F' || r.grade === 'D')

            return (
              <motion.div
                key={semester}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="card overflow-hidden"
              >
                {/* Semester header */}
                <button
                  onClick={() => setOpenSem(isOpen ? null : semester)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-academy transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <h3 className="font-display font-700 text-navy-900 text-sm">{semester}</h3>
                    {hasUnsafe && (
                      <span className="flex items-center gap-1 badge bg-crimson-600/10 text-crimson-600 text-xs">
                        <AlertCircle size={10} /> Review needed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="font-display font-700 text-navy-900 text-sm">{semGPA}</p>
                      <p className="text-gray-400 text-xs">Semester GPA</p>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Results table */}
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="overflow-x-auto border-t border-gray-100">
                      <table className="table-academy">
                        <thead>
                          <tr>
                            <th>Course</th>
                            <th className="text-center">Credits</th>
                            <th className="text-center">Score</th>
                            <th className="text-center">Grade</th>
                            <th className="text-center">Grade Points</th>
                          </tr>
                        </thead>
                        <tbody>
                          {semResults.map((r) => (
                            <tr key={r.id}>
                              <td>
                                <p className="font-display font-600 text-navy-900 text-sm">{r.courseCode ?? '—'}</p>
                                <p className="text-gray-400 text-xs">{r.courseTitle ?? ''}</p>
                              </td>
                              <td className="text-center text-gray-500 text-sm">{r.credits ?? '—'}</td>
                              <td className="text-center text-gray-500 text-sm">{r.score != null ? `${r.score}/100` : '—'}</td>
                              <td className="text-center">
                                <span className={`badge text-xs ${gradeColor(r.grade)}`}>{r.grade ?? '—'}</span>
                              </td>
                              <td className="text-center font-display font-600 text-navy-900 text-sm">
                                {r.grade ? gradeToGp(r.grade).toFixed(1) : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-slate-academy">
                            <td className="px-4 py-3 font-display font-700 text-navy-900 text-sm">Semester Total</td>
                            <td className="px-4 py-3 text-center font-display font-700 text-navy-900 text-sm">{semCredits}</td>
                            <td className="px-4 py-3" />
                            <td className="px-4 py-3" />
                            <td className="px-4 py-3 text-center font-display font-700 text-gold-600 text-sm">GPA: {semGPA}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
