// FILE: src/portals/lecturer/pages/Dashboard.jsx

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Users, ClipboardList, BarChart2, ArrowRight, Clock } from 'lucide-react'
import useAuthStore from '@/shared/store/authStore'
import { getCourses, getEnrollments, getAssignments, getSubmissions, where, orderBy, limit } from '@/firebase/firestore'

const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
    transition={{ duration:0.4, delay }} className={className}>
    {children}
  </motion.div>
)

function StatCard({ icon: Icon, label, value, color, to, delay }) {
  const inner = (
    <FadeUp delay={delay} className="card p-5 flex items-center gap-4 group hover:-translate-y-0.5 transition-transform duration-300">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={19} className="text-white" />
      </div>
      <div className="flex-1">
        <p className="text-gray-400 text-xs mb-0.5">{label}</p>
        <p className="font-display font-800 text-navy-900 text-2xl leading-none">{value ?? '—'}</p>
      </div>
      {to && <ArrowRight size={14} className="text-gray-300 group-hover:text-gold-500 transition-colors" />}
    </FadeUp>
  )
  return to ? <Link to={to}>{inner}</Link> : inner
}

export default function LecturerDashboard() {
  const { profile } = useAuthStore()
  const [data, setData] = useState({ courses:[], totalStudents:0, pendingGrading:0, loading:true })

  useEffect(() => {
    if (!profile?.uid) return
    async function load() {
      try {
        const courses = await getCourses([where('lecturerId','==', profile.uid)])
        const courseIds = courses.map(c => c.id)
        let totalStudents = 0, pendingGrading = 0
        if (courseIds.length) {
          const enrollments  = await getEnrollments()
          const submissions  = await getSubmissions()
          totalStudents = enrollments.filter(e => courseIds.includes(e.courseId)).length
          pendingGrading = submissions.filter(s => courseIds.includes(s.courseId) && s.grade == null).length
        }
        setData({ courses, totalStudents, pendingGrading, loading:false })
      } catch (err) { console.error(err); setData(d => ({...d, loading:false})) }
    }
    load()
  }, [profile?.uid])

  if (data.loading) return (
    <div className="portal-page">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_,i) => <div key={i} className="skeleton h-24 rounded-academy"/>)}
      </div>
      <div className="skeleton h-64 rounded-academy" />
    </div>
  )

  return (
    <div className="portal-page">
      <FadeUp className="mb-6">
        <h2 className="font-display font-800 text-navy-900 text-xl">
          Welcome, {profile?.firstName} 👋
        </h2>
        <p className="text-gray-400 text-sm mt-0.5">
          {new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
        </p>
      </FadeUp>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={BookOpen}    label="My Courses"       value={data.courses.length}     color="bg-navy-900"    to="/lecturer/courses"     delay={0.05} />
        <StatCard icon={Users}       label="Total Students"   value={data.totalStudents}       color="bg-blue-600"    to="/lecturer/students"    delay={0.1}  />
        <StatCard icon={ClipboardList} label="Pending Grading" value={data.pendingGrading}    color="bg-gold-500"    to="/lecturer/assessments" delay={0.15} />
        <StatCard icon={BarChart2}   label="Courses Active"   value={data.courses.filter(c=>c.status==='active').length} color="bg-emerald-600" delay={0.2} />
      </div>

      {/* Course list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <FadeUp delay={0.25} className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-700 text-navy-900 text-sm">My Courses This Semester</h3>
              <Link to="/lecturer/courses" className="text-xs text-gold-600 font-display font-600 hover:text-gold-700">View All</Link>
            </div>
            {data.courses.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No courses assigned yet.</p>
            ) : (
              <div className="space-y-3">
                {data.courses.map((course) => (
                  <div key={course.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-academy">
                    <div className="w-9 h-9 rounded-lg bg-navy-900 flex items-center justify-center flex-shrink-0">
                      <BookOpen size={15} className="text-gold-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-600 text-navy-900 text-sm truncate">{course.title}</p>
                      <p className="text-gray-400 text-xs">{course.code} · {course.credits} credits</p>
                    </div>
                    <span className={`badge text-xs ${course.status === 'active' ? 'badge-green' : 'bg-gray-100 text-gray-500'}`}>
                      {course.status ?? 'active'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FadeUp>
      </div>
    </div>
  )
}