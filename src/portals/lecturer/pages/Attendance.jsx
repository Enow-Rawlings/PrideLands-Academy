
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ClipboardCheck, CheckCircle, X, Clock, Save, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '@/shared/store/authStore'
import {
  getCourses, getEnrollments, getDocuments,
  createDocument, updateDocument,
  where, orderBy
} from '@/firebase/firestore'

function formatDate(d = new Date()) {
  return d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })
}

const STATUS_CONFIG = {
  present: { label:'Present', color:'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  absent:  { label:'Absent',  color:'bg-crimson-600/10 text-crimson-600', icon: X },
  late:    { label:'Late',    color:'bg-gold-500/15 text-gold-700', icon: Clock },
}

export default function Attendance() {
  const { profile }   = useAuthStore()
  const [courses,     setCourses]    = useState([])
  const [selected,    setSelected]   = useState(null)
  const [students,    setStudents]   = useState([])
  const [attendance,  setAttendance] = useState({}) // { studentId: 'present'|'absent'|'late' }
  const [loading,     setLoading]    = useState(true)
  const [saving,      setSaving]     = useState(false)
  const [date,        setDate]       = useState(new Date().toISOString().slice(0,10))

  useEffect(() => {
    if (!profile?.uid) return
    getCourses([where('lecturerId','==',profile.uid)])
      .then((c) => { setCourses(c); if (c.length) setSelected(c[0]) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [profile?.uid])

  useEffect(() => {
    if (!selected?.id) return
    async function load() {
      setLoading(true)
      try {
        const enrollments = await getEnrollments([where('courseId','==',selected.id)])
        // Fetch user profiles for enrolled students
        const studentProfiles = await Promise.all(
          enrollments.map(e => getDocuments('users', [where('__name__','==',e.studentId)]).then(r => r[0]))
        )
        setStudents(studentProfiles.filter(Boolean))
        // Check if attendance already recorded for selected date
        const existing = await getDocuments('attendance', [
          where('courseId','==',selected.id),
          where('date','==',date)
        ])
        if (existing.length) {
          const map = {}
          existing.forEach(r => { map[r.studentId] = r.status })
          setAttendance(map)
        } else {
          // Default all to present
          const map = {}
          studentProfiles.filter(Boolean).forEach(s => { map[s.uid] = 'present' })
          setAttendance(map)
        }
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    load()
  }, [selected?.id, date])

  const toggle = (uid, status) => setAttendance(prev => ({ ...prev, [uid]: status }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await Promise.all(
        Object.entries(attendance).map(([studentId, status]) =>
          createDocument('attendance', {
            courseId: selected.id, studentId, date, status,
            lecturerId: profile.uid, markedAt: new Date()
          })
        )
      )
      toast.success('Attendance saved successfully.')
    } catch { toast.error('Failed to save attendance.') }
    finally { setSaving(false) }
  }

  const present = Object.values(attendance).filter(s => s === 'present').length
  const absent  = Object.values(attendance).filter(s => s === 'absent').length
  const late    = Object.values(attendance).filter(s => s === 'late').length

  return (
    <div className="portal-page max-w-4xl">
      <h2 className="font-display font-800 text-navy-900 text-xl mb-6">Attendance</h2>

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
            <label className="label">Date</label>
            <input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="flex items-end">
            <button onClick={handleSave} disabled={saving || !students.length}
              className="inline-flex items-center gap-2 w-full justify-center px-5 py-3 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all disabled:opacity-60">
              {saving ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      : <><Save size={14}/> Save Attendance</>}
            </button>
          </div>
        </div>
      </div>

      {/* Summary badges */}
      {students.length > 0 && (
        <div className="flex gap-3 mb-5">
          <span className="badge badge-green">{present} Present</span>
          <span className="badge badge-red">{absent} Absent</span>
          <span className="badge bg-gold-500/15 text-gold-700">{late} Late</span>
        </div>
      )}

      {/* Student list */}
      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_,i) => <div key={i} className="skeleton h-16 rounded-academy"/>)}</div>
      ) : students.length === 0 ? (
        <div className="card p-12 text-center">
          <AlertCircle size={32} className="text-gray-300 mx-auto mb-3"/>
          <p className="text-gray-400 text-sm">No students enrolled in this course yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {students.map((student, i) => {
            const status = attendance[student.uid] ?? 'present'
            return (
              <motion.div key={student.uid}
                initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.04 }}
                className="card p-4 flex items-center gap-4"
              >
                <div className="w-9 h-9 rounded-full bg-navy-900 flex items-center justify-center font-display font-700 text-gold-400 text-xs flex-shrink-0">
                  {student.firstName?.[0]}{student.lastName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-600 text-navy-900 text-sm">{student.firstName} {student.lastName}</p>
                  <p className="text-gray-400 text-xs">{student.studentId ?? student.uid?.slice(0,8)}</p>
                </div>
                <div className="flex gap-1.5">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <button key={key} onClick={() => toggle(student.uid, key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-display font-600 border transition-all ${
                        status === key ? cfg.color + ' border-current' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                      }`}>
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}