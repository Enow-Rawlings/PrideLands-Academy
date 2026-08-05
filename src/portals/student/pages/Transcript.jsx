

import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Download, Printer, GraduationCap, AlertCircle } from 'lucide-react'
import useAuthStore from '@/shared/store/authStore'
import { getResults, where, orderBy } from '@/firebase/firestore'

function gradeToGp(grade) {
  const map = { 'A+':4.0,'A':4.0,'A-':3.7,'B+':3.3,'B':3.0,'B-':2.7,'C+':2.3,'C':2.0,'C-':1.7,'D':1.0,'F':0.0 }
  return map[grade] ?? 0
}

function gradeColor(grade) {
  if (!grade) return 'text-gray-400'
  if (['A+','A','A-'].includes(grade)) return 'text-emerald-600'
  if (['B+','B','B-'].includes(grade)) return 'text-blue-600'
  if (['C+','C','C-'].includes(grade)) return 'text-gold-600'
  return 'text-crimson-600'
}

export default function Transcript() {
  const { profile }  = useAuthStore()
  const [results,    setResults]  = useState([])
  const [loading,    setLoading]  = useState(true)
  const printRef     = useRef(null)

  useEffect(() => {
    if (!profile?.uid) return
    getResults([where('studentId','==',profile.uid), orderBy('createdAt','asc')])
      .then(setResults).catch(console.error).finally(() => setLoading(false))
  }, [profile?.uid])

  const bySemester = results.reduce((acc, r) => {
    const key = r.semester ?? 'Unknown'
    if (!acc[key]) acc[key] = []
    acc[key].push(r)
    return acc
  }, {})

  const allGraded    = results.filter(r => r.grade && r.credits)
  const totalCredits = allGraded.reduce((s,r) => s + (r.credits ?? 0), 0)
  const totalPoints  = allGraded.reduce((s,r) => s + gradeToGp(r.grade) * (r.credits ?? 0), 0)
  const cgpa         = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '—'

  const handlePrint = () => window.print()

  if (loading) return (
    <div className="portal-page max-w-3xl">
      {[...Array(3)].map((_,i) => <div key={i} className="skeleton h-40 rounded-academy mb-4" />)}
    </div>
  )

  return (
    <div className="portal-page max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-800 text-navy-900 text-xl">Academic Transcript</h2>
        <div className="flex gap-2">
          <button onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-navy-700 font-display font-600 text-sm rounded-academy hover:border-navy-900 transition-all">
            <Printer size={14} /> Print
          </button>
          <button onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-navy-900 text-white font-display font-600 text-sm rounded-academy hover:bg-navy-800 transition-all">
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>

      {/* Transcript document */}
      <div ref={printRef} className="card p-8 print:shadow-none">

        {/* Header */}
        <div className="text-center border-b-2 border-navy-900 pb-6 mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center">
              <GraduationCap size={20} className="text-gold-400" />
            </div>
            <div className="text-left">
              <p className="font-display font-800 text-navy-900 text-base">PrideLands Academy</p>
              <p className="text-gray-400 text-xs">Raising African Excellence</p>
            </div>
          </div>
          <h2 className="font-display font-700 text-navy-900 text-lg mt-3">OFFICIAL ACADEMIC TRANSCRIPT</h2>
          <p className="text-gray-400 text-xs mt-1">Yaoundé, Cameroon · info@pridelandsacademy.com</p>
        </div>

        {/* Student info */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-academy rounded-xl">
          {[
            { label: 'Student Name',  value: `${profile?.firstName ?? ''} ${profile?.lastName ?? ''}` },
            { label: 'Student ID',    value: profile?.studentId ?? '—' },
            { label: 'Programme',     value: profile?.program ?? '—' },
            { label: 'Date Issued',   value: new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }) },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-gray-400 text-xs">{label}</p>
              <p className="font-display font-700 text-navy-900 text-sm">{value}</p>
            </div>
          ))}
        </div>

        {/* Results by semester */}
        {results.length === 0 ? (
          <div className="text-center py-10">
            <AlertCircle size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No results available yet.</p>
          </div>
        ) : (
          Object.entries(bySemester).map(([semester, semResults]) => {
            const semGraded  = semResults.filter(r => r.grade && r.credits)
            const semCredits = semGraded.reduce((s,r) => s + r.credits, 0)
            const semPoints  = semGraded.reduce((s,r) => s + gradeToGp(r.grade) * r.credits, 0)
            const semGPA     = semCredits > 0 ? (semPoints / semCredits).toFixed(2) : '—'

            return (
              <div key={semester} className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-display font-700 text-navy-900 text-sm">{semester}</h4>
                  <span className="text-xs text-gray-400 font-display">Semester GPA: <strong className="text-navy-900">{semGPA}</strong></span>
                </div>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-navy-900 text-white">
                      <th className="text-left px-3 py-2 font-display font-600 text-xs rounded-tl-lg">Code</th>
                      <th className="text-left px-3 py-2 font-display font-600 text-xs">Course Title</th>
                      <th className="text-center px-3 py-2 font-display font-600 text-xs">Credits</th>
                      <th className="text-center px-3 py-2 font-display font-600 text-xs">Score</th>
                      <th className="text-center px-3 py-2 font-display font-600 text-xs rounded-tr-lg">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semResults.map((r, i) => (
                      <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-academy'}>
                        <td className="px-3 py-2.5 font-display font-600 text-navy-900 text-xs">{r.courseCode ?? '—'}</td>
                        <td className="px-3 py-2.5 text-gray-600 text-xs">{r.courseTitle ?? '—'}</td>
                        <td className="px-3 py-2.5 text-center text-gray-500 text-xs">{r.credits ?? '—'}</td>
                        <td className="px-3 py-2.5 text-center text-gray-500 text-xs">{r.score != null ? `${r.score}/100` : '—'}</td>
                        <td className={`px-3 py-2.5 text-center font-display font-700 text-xs ${gradeColor(r.grade)}`}>{r.grade ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          })
        )}

        {/* CGPA summary */}
        {results.length > 0 && (
          <div className="border-t-2 border-navy-900 pt-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-700 text-navy-900 text-sm">Cumulative GPA (CGPA)</p>
                <p className="text-gray-400 text-xs">Based on {totalCredits} credit hours</p>
              </div>
              <div className="text-right">
                <p className="font-display font-900 text-navy-900 text-3xl">{cgpa}</p>
                <p className="text-gray-400 text-xs">out of 4.0</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-xs">
            This transcript is an unofficial copy. Official transcripts carry the institution seal and Registrar's signature.
          </p>
          <p className="text-gray-400 text-xs mt-1">Generated on {new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}</p>
        </div>
      </div>
    </div>
  )
}