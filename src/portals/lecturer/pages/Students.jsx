import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, Filter, Mail, Phone } from 'lucide-react'
import useAuthStore from '@/shared/store/authStore'
import { getCourses, getEnrollments, getDocuments, where } from '@/firebase/firestore'

export default function LecturerStudents() {
  const { profile }  = useAuthStore()
  const [students,   setStudents]  = useState([])
  const [courses,    setCourses]   = useState([])
  const [loading,    setLoading]   = useState(true)
  const [search,     setSearch]    = useState('')
  const [courseFilter, setCourseFilter] = useState('all')

  useEffect(() => {
    if (!profile?.uid) return
    async function load() {
      try {
        const myCourses = await getCourses([where('lecturerId', '==', profile.uid)])
        setCourses(myCourses)
        const courseIds = myCourses.map(c => c.id)
        if (!courseIds.length) { setLoading(false); return }

        const enrollments = await getEnrollments()
        const myEnrollments = enrollments.filter(e => courseIds.includes(e.courseId))

        // Get unique student IDs with their courses
        const studentMap = {}
        myEnrollments.forEach(e => {
          if (!studentMap[e.studentId]) studentMap[e.studentId] = []
          studentMap[e.studentId].push(e.courseId)
        })

        // Fetch student profiles
        const profiles = await getDocuments('users')
        const enrolled = profiles
          .filter(p => studentMap[p.uid])
          .map(p => ({ ...p, courses: studentMap[p.uid] }))

        setStudents(enrolled)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    load()
  }, [profile?.uid])

  const filtered = students.filter(s => {
    const matchSearch = !search ||
      `${s.firstName ?? ''} ${s.lastName ?? ''} ${s.email ?? ''} ${s.studentId ?? ''}`.toLowerCase().includes(search.toLowerCase())
    const matchCourse = courseFilter === 'all' || s.courses?.includes(courseFilter)
    return matchSearch && matchCourse
  })

  if (loading) return (
    <div className="portal-page">
      {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-academy mb-3" />)}
    </div>
  )

  return (
    <div className="portal-page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-800 text-navy-900 text-xl">My Students</h2>
          <p className="text-gray-400 text-sm mt-0.5">{students.length} students across {courses.length} courses</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name, email or ID..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="input pl-9 py-2.5 text-sm w-full" />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)}
            className="input pl-9 py-2.5 text-sm appearance-none pr-8">
            <option value="all">All Courses</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Users size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="font-display font-600 text-navy-900 mb-1">No students found</p>
          <p className="text-gray-400 text-sm">{search ? 'Try a different search.' : 'No students enrolled in your courses yet.'}</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-academy">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Student ID</th>
                  <th>Courses</th>
                  <th className="text-center">Status</th>
                  <th className="text-right">Contact</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student, i) => (
                  <motion.tr key={student.uid ?? student.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center font-display font-700 text-gold-400 text-xs flex-shrink-0">
                          {student.firstName?.[0]}{student.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-display font-600 text-navy-900 text-sm">{student.firstName} {student.lastName}</p>
                          <p className="text-gray-400 text-xs">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-xs text-gray-500">{student.studentId ?? '—'}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {student.courses?.map(cid => {
                          const course = courses.find(c => c.id === cid)
                          return course ? (
                            <span key={cid} className="badge-navy text-xs">{course.code}</span>
                          ) : null
                        })}
                      </div>
                    </td>
                    <td className="text-center">
                      <span className={`badge text-xs ${student.status === 'active' || !student.status ? 'badge-green' : 'badge-red'}`}>
                        {student.status ?? 'active'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1.5">
                        {student.email && (
                          <a href={`mailto:${student.email}`}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-navy-900 hover:bg-gray-100 transition-all">
                            <Mail size={13} />
                          </a>
                        )}
                        {student.phone && (
                          <a href={`tel:${student.phone}`}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-navy-900 hover:bg-gray-100 transition-all">
                            <Phone size={13} />
                          </a>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100">
            <p className="text-gray-400 text-xs">Showing {filtered.length} of {students.length} students</p>
          </div>
        </div>
      )}
    </div>
  )
}