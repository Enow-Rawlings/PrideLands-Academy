

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpen, ClipboardList, CreditCard, Bell,
  TrendingUp, Clock, ArrowRight, CheckCircle, AlertCircle
} from 'lucide-react'
import useAuthStore from '@/shared/store/authStore'
import {
  getEnrollments, getResults, getPayments,
  getAnnouncements, getAssignments,
  where, orderBy, limit
} from '@/firebase/firestore'

const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
)

// ─── Stat card ─────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color, to, delay }) {
  const content = (
    <FadeUp delay={delay} className="card p-5 flex items-start gap-4 group hover:-translate-y-0.5 transition-transform duration-300">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={19} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-400 text-xs font-body mb-0.5">{label}</p>
        <p className="font-display font-800 text-navy-900 text-2xl leading-none">{value}</p>
        {sub && <p className="text-gray-400 text-xs mt-1">{sub}</p>}
      </div>
      {to && <ArrowRight size={14} className="text-gray-300 group-hover:text-gold-500 transition-colors mt-1" />}
    </FadeUp>
  )
  return to ? <Link to={to}>{content}</Link> : content
}

export default function Dashboard() {
  const { profile } = useAuthStore()
  const [data, setData] = useState({
    enrollments:   [],
    results:       [],
    payments:      [],
    announcements: [],
    assignments:   [],
    loading:       true,
  })

  useEffect(() => {
    if (!profile?.uid) return
    const uid = profile.uid

    async function load() {
      try {
        const [enrollments, results, payments, announcements, assignments] = await Promise.all([
          getEnrollments([where('studentId', '==', uid)]),
          getResults([where('studentId', '==', uid), orderBy('createdAt', 'desc'), limit(5)]),
          getPayments([where('studentId', '==', uid), orderBy('createdAt', 'desc'), limit(3)]),
          getAnnouncements([orderBy('createdAt', 'desc'), limit(5)]),
          getAssignments([where('studentId', '==', uid), orderBy('dueDate', 'asc'), limit(5)]),
        ])
        setData({ enrollments, results, payments, announcements, assignments, loading: false })
      } catch (err) {
        console.error('Dashboard load error:', err)
        setData((d) => ({ ...d, loading: false }))
      }
    }
    load()
  }, [profile?.uid])

  // ── Derived values ─────────────────────────────────────────────
  const cgpa = data.results.length
    ? (data.results.reduce((sum, r) => sum + (r.score ?? 0), 0) / data.results.length / 25).toFixed(2)
    : '—'

  const outstandingBalance = data.payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + (p.amount ?? 0), 0)

  const pendingAssignments = data.assignments.filter(
    (a) => a.status !== 'submitted'
  ).length

  // ── Skeleton ───────────────────────────────────────────────────
  if (data.loading) {
    return (
      <div className="portal-page">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-academy" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="skeleton h-64 rounded-academy lg:col-span-2" />
          <div className="skeleton h-64 rounded-academy" />
        </div>
      </div>
    )
  }

  return (
    <div className="portal-page">

      {/* ── Greeting ─────────────────────────────────────────── */}
      <FadeUp className="mb-6">
        <h2 className="font-display font-800 text-navy-900 text-xl">
          Good {getTimeOfDay()}, {profile?.firstName ?? 'Student'} 👋
        </h2>
        <p className="text-gray-400 text-sm mt-0.5">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </FadeUp>

      {/* ── Stat cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={BookOpen} label="Enrolled Courses" value={data.enrollments.length || 0}
          sub="This semester" color="bg-navy-900" to="/student/courses" delay={0.05}
        />
        <StatCard
          icon={TrendingUp} label="Current CGPA" value={cgpa}
          sub="Cumulative" color="bg-gold-500" to="/student/results" delay={0.1}
        />
        <StatCard
          icon={ClipboardList} label="Pending Tasks" value={pendingAssignments}
          sub="Assignments due" color="bg-blue-600" to="/student/assignments" delay={0.15}
        />
        <StatCard
          icon={CreditCard} label="Balance Due"
          value={outstandingBalance > 0 ? `${outstandingBalance.toLocaleString()} FCFA` : 'Paid'}
          sub="Outstanding fees" color={outstandingBalance > 0 ? 'bg-crimson-600' : 'bg-emerald-600'}
          to="/student/payments" delay={0.2}
        />
      </div>

      {/* ── Main grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Upcoming assignments */}
        <FadeUp delay={0.25} className="lg:col-span-2">
          <div className="card p-6 h-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-700 text-navy-900 text-sm">Upcoming Assignments</h3>
              <Link to="/student/assignments" className="text-xs text-gold-600 font-display font-600 hover:text-gold-700 transition-colors">
                View All
              </Link>
            </div>

            {data.assignments.length === 0 ? (
              <div className="text-center py-10">
                <CheckCircle size={32} className="text-emerald-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No pending assignments. You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.assignments.slice(0, 5).map((a) => {
                  const isOverdue = a.dueDate?.toDate?.() < new Date()
                  return (
                    <div key={a.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-academy border border-gray-100">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isOverdue ? 'bg-crimson-600' : 'bg-gold-500'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-600 text-navy-900 text-sm truncate">{a.title}</p>
                        <p className="text-gray-400 text-xs">{a.courseCode} · Due {formatDate(a.dueDate)}</p>
                      </div>
                      {isOverdue && (
                        <span className="badge-red text-xs flex-shrink-0">Overdue</span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </FadeUp>

        {/* Announcements */}
        <FadeUp delay={0.3}>
          <div className="card p-6 h-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-700 text-navy-900 text-sm flex items-center gap-2">
                <Bell size={14} className="text-gold-500" /> Announcements
              </h3>
              <Link to="/student/announcements" className="text-xs text-gold-600 font-display font-600 hover:text-gold-700 transition-colors">
                All
              </Link>
            </div>

            {data.announcements.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No announcements yet.</p>
            ) : (
              <div className="space-y-4">
                {data.announcements.slice(0, 4).map((a) => (
                  <div key={a.id} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0 mt-1.5" />
                    <div>
                      <p className="font-display font-600 text-navy-900 text-xs leading-snug">{a.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{formatDate(a.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FadeUp>

        {/* Recent results */}
        <FadeUp delay={0.35} className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-700 text-navy-900 text-sm">Recent Results</h3>
              <Link to="/student/results" className="text-xs text-gold-600 font-display font-600 hover:text-gold-700 transition-colors">
                Full Results
              </Link>
            </div>

            {data.results.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No results published yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-academy">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Score</th>
                      <th>Grade</th>
                      <th>Semester</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.results.map((r) => (
                      <tr key={r.id}>
                        <td className="font-display font-600">{r.courseCode ?? '—'}</td>
                        <td>{r.score ?? '—'}/100</td>
                        <td>
                          <span className={`badge text-xs ${gradeColor(r.grade)}`}>{r.grade ?? '—'}</span>
                        </td>
                        <td className="text-gray-400">{r.semester ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </FadeUp>

        {/* Quick links */}
        <FadeUp delay={0.4}>
          <div className="card p-6">
            <h3 className="font-display font-700 text-navy-900 text-sm mb-5">Quick Access</h3>
            <div className="space-y-2">
              {[
                { label: 'View Timetable',      path: '/student/timetable',    icon: Clock },
                { label: 'Download Transcript', path: '/student/transcript',   icon: BookOpen },
                { label: 'My Certificates',     path: '/student/certificates', icon: CheckCircle },
                { label: 'Make a Payment',      path: '/student/payments',     icon: CreditCard },
                { label: 'Raise a Ticket',      path: '/student/support',      icon: AlertCircle },
              ].map(({ label, path, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-academy transition-colors group"
                >
                  <Icon size={15} className="text-gold-500 flex-shrink-0" />
                  <span className="font-display font-600 text-navy-800 text-sm group-hover:text-navy-900 transition-colors">{label}</span>
                  <ArrowRight size={12} className="ml-auto text-gray-300 group-hover:text-gold-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </FadeUp>

      </div>
    </div>
  )
}

// ─── Helpers ───────────────────────────────────────────────────────
function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function formatDate(val) {
  if (!val) return '—'
  const d = val?.toDate ? val.toDate() : new Date(val)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function gradeColor(grade) {
  if (!grade) return 'bg-gray-100 text-gray-500'
  if (['A', 'A+', 'A-'].includes(grade)) return 'bg-emerald-100 text-emerald-700'
  if (['B', 'B+', 'B-'].includes(grade)) return 'bg-blue-100 text-blue-700'
  if (['C', 'C+', 'C-'].includes(grade)) return 'bg-gold-500/15 text-gold-700'
  return 'bg-crimson-600/10 text-crimson-600'
}