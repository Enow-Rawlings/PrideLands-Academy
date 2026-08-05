

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Clock, User, ChevronRight, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import useAuthStore from '@/shared/store/authStore'
import { getEnrollments, getCourses, where } from '@/firebase/firestore'

const SEMESTER_TABS = ['Current', 'All']

export default function Courses() {
  const { profile } = useAuthStore()
  const [tab,     setTab]     = useState('Current')
  const [search,  setSearch]  = useState('')
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.uid) return
    async function load() {
      try {
        const enrollments = await getEnrollments([where('studentId', '==', profile.uid)])
        const courseIds   = enrollments.map((e) => e.courseId).filter(Boolean)

        if (courseIds.length === 0) { setCourses([]); setLoading(false); return }

        // Fetch all enrolled courses
        const allCourses = await getCourses()
        const enrolled   = allCourses
          .filter((c) => courseIds.includes(c.id))
          .map((c) => ({
            ...c,
            enrollment: enrollments.find((e) => e.courseId === c.id),
          }))
        setCourses(enrolled)
      } catch (err) {
        console.error('Courses load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [profile?.uid])

  const filtered = courses.filter((c) => {
    const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase()) ||
                        c.code?.toLowerCase().includes(search.toLowerCase())
    const matchTab    = tab === 'All' || c.enrollment?.semester === 'current'
    return matchSearch && matchTab
  })

  if (loading) {
    return (
      <div className="portal-page">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-48 rounded-academy" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="portal-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-800 text-navy-900 text-xl">My Courses</h2>
          <p className="text-gray-400 text-sm mt-0.5">{courses.length} course{courses.length !== 1 ? 's' : ''} enrolled</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" placeholder="Search courses..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="input pl-9 py-2 text-sm w-full sm:w-52"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {SEMESTER_TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-display font-600 transition-all ${
              tab === t ? 'bg-navy-900 text-white' : 'bg-white border border-gray-200 text-navy-600 hover:border-navy-900'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <BookOpen size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="font-display font-600 text-navy-900 text-base mb-1">No courses found</p>
          <p className="text-gray-400 text-sm">
            {search ? 'Try a different search term.' : 'You are not enrolled in any courses yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card p-5 flex flex-col group hover:-translate-y-0.5 transition-transform duration-300"
            >
              {/* Color bar */}
              <div className="w-full h-1.5 rounded-full bg-navy-900 mb-4 opacity-80" />

              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="badge-navy text-xs">{course.code ?? 'N/A'}</span>
                <span className={`badge text-xs ${
                  course.enrollment?.semester === 'current'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {course.enrollment?.semester === 'current' ? 'Current' : 'Past'}
                </span>
              </div>

              <h3 className="font-display font-700 text-navy-900 text-sm leading-snug mb-3 flex-1">
                {course.title ?? 'Untitled Course'}
              </h3>

              <div className="space-y-2 text-xs text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <User size={12} className="text-gold-500" />
                  {course.lecturerName ?? 'TBA'}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-gold-500" />
                  {course.credits ?? '—'} Credits
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={12} className="text-gold-500" />
                  {course.schedule ?? 'Schedule TBA'}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className="font-display font-600 text-navy-900">{course.progress ?? 0}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-500 rounded-full transition-all duration-500"
                    style={{ width: `${course.progress ?? 0}%` }}
                  />
                </div>
              </div>

              <Link
                to={`/student/materials?course=${course.id}`}
                className="flex items-center justify-between text-xs font-display font-600 text-navy-700 hover:text-gold-600 transition-colors group/link"
              >
                View Materials
                <ChevronRight size={13} className="group-hover/link:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

