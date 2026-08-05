import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Users, Clock, Search } from 'lucide-react'
import useAuthStore from '@/shared/store/authStore'
import { getCourses, getEnrollments, where } from '@/firebase/firestore'

export default function LecturerCourses() {
  const { profile } = useAuthStore()
  const [courses,   setCourses] = useState([])
  const [counts,    setCounts]  = useState({})
  const [loading,   setLoading] = useState(true)
  const [search,    setSearch]  = useState('')

  useEffect(() => {
    if (!profile?.uid) return
    async function load() {
      try {
        const c = await getCourses([where('lecturerId', '==', profile.uid)])
        setCourses(c)
        const all = await getEnrollments()
        const map = {}
        c.forEach(course => { map[course.id] = all.filter(e => e.courseId === course.id).length })
        setCounts(map)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    load()
  }, [profile?.uid])

  const filtered = courses.filter(c =>
    !search || `${c.title ?? ''} ${c.code ?? ''}`.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="portal-page">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-48 rounded-academy" />)}
      </div>
    </div>
  )

  return (
    <div className="portal-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-800 text-navy-900 text-xl">My Courses</h2>
          <p className="text-gray-400 text-sm mt-0.5">{courses.length} course{courses.length !== 1 ? 's' : ''} assigned</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search courses..." value={search}
            onChange={e => setSearch(e.target.value)} className="input pl-9 py-2 text-sm w-full sm:w-52" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <BookOpen size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="font-display font-600 text-navy-900 mb-1">No courses found</p>
          <p className="text-gray-400 text-sm">{search ? 'Try a different search.' : 'No courses assigned yet.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course, i) => (
            <motion.div key={course.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="card p-6 flex flex-col group hover:-translate-y-0.5 transition-transform duration-300">
              <div className="w-full h-1.5 rounded-full bg-navy-900 mb-4" />
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="badge-navy text-xs">{course.code ?? 'N/A'}</span>
                <span className={`badge text-xs ${course.status === 'active' ? 'badge-green' : 'bg-gray-100 text-gray-500'}`}>
                  {course.status ?? 'active'}
                </span>
              </div>
              <h3 className="font-display font-700 text-navy-900 text-base leading-snug mb-3 flex-1">
                {course.title ?? 'Untitled Course'}
              </h3>
              <div className="space-y-2 text-xs text-gray-400 mb-5">
                <div className="flex items-center gap-2">
                  <Users size={12} className="text-gold-500" />
                  {counts[course.id] ?? 0} students enrolled
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-gold-500" />
                  {course.credits ?? '—'} credits · {course.semester ?? 'Current Semester'}
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={12} className="text-gold-500" />
                  {course.schedule ?? 'Schedule TBA'}
                </div>
              </div>
              <div className="flex gap-2 mt-auto">
                <Link to={`/lecturer/attendance?course=${course.id}`}
                  className="flex-1 text-center py-2 bg-navy-900 text-white font-display font-600 text-xs rounded-lg hover:bg-navy-800 transition-colors">
                  Attendance
                </Link>
                <Link to={`/lecturer/results?course=${course.id}`}
                  className="flex-1 text-center py-2 border border-gray-200 text-navy-700 font-display font-600 text-xs rounded-lg hover:border-navy-900 transition-colors">
                  Results
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}