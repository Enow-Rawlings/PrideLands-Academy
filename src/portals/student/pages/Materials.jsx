
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileText, Film, File, Download, Search,
  FolderOpen, ExternalLink
} from 'lucide-react'
import useAuthStore from '@/shared/store/authStore'
import {
  getEnrollments, getCourses, getDocuments,
  where, orderBy
} from '@/firebase/firestore'
import { collection } from 'firebase/firestore'

const TYPE_ICON = { pdf: FileText, video: Film, doc: File, other: File }
const TYPE_COLOR = {
  pdf:   'bg-crimson-600/10 text-crimson-600',
  video: 'bg-blue-100 text-blue-700',
  doc:   'bg-gold-500/15 text-gold-700',
  other: 'bg-gray-100 text-gray-500',
}

function formatDate(val) {
  if (!val) return ''
  const d = val?.toDate ? val.toDate() : new Date(val)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Materials() {
  const { profile }    = useAuthStore()
  const [params]       = useSearchParams()
  const presetCourse   = params.get('course')

  const [courses,    setCourses]    = useState([])
  const [materials,  setMaterials]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [activeCourse, setActiveCourse] = useState(presetCourse ?? 'all')
  const [search,     setSearch]     = useState('')

  useEffect(() => {
    if (!profile?.uid) return
    async function load() {
      try {
        const enrollments = await getEnrollments([where('studentId', '==', profile.uid)])
        const ids         = enrollments.map((e) => e.courseId).filter(Boolean)
        const allCourses  = await getCourses()
        const enrolled    = allCourses.filter((c) => ids.includes(c.id))
        setCourses(enrolled)

        const mats = await getDocuments('materials', [orderBy('createdAt', 'desc')])
        setMaterials(mats.filter((m) => ids.includes(m.courseId)))
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    load()
  }, [profile?.uid])

  const filtered = materials.filter((m) => {
    const matchCourse = activeCourse === 'all' || m.courseId === activeCourse
    const matchSearch = m.title?.toLowerCase().includes(search.toLowerCase())
    return matchCourse && matchSearch
  })

  if (loading) return (
    <div className="portal-page">
      <div className="skeleton h-12 rounded-academy mb-4 w-64" />
      {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-academy mb-3" />)}
    </div>
  )

  return (
    <div className="portal-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="font-display font-800 text-navy-900 text-xl">Learning Materials</h2>
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search materials..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="input pl-9 py-2 text-sm w-full sm:w-52" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Course sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-4 sticky top-6">
            <p className="font-display font-700 text-navy-900 text-xs uppercase tracking-wider mb-3">Courses</p>
            <button
              onClick={() => setActiveCourse('all')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-display font-500 mb-1 transition-all ${
                activeCourse === 'all' ? 'bg-navy-900 text-white font-600' : 'text-navy-700 hover:bg-slate-academy'
              }`}>
              All Courses
            </button>
            {courses.map((c) => (
              <button key={c.id} onClick={() => setActiveCourse(c.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-display font-500 mb-1 transition-all truncate ${
                  activeCourse === c.id ? 'bg-navy-900 text-white font-600' : 'text-navy-700 hover:bg-slate-academy'
                }`}>
                {c.code} — {c.title}
              </button>
            ))}
          </div>
        </div>

        {/* Materials list */}
        <div className="lg:col-span-3">
          {filtered.length === 0 ? (
            <div className="card p-12 text-center">
              <FolderOpen size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="font-display font-600 text-navy-900 mb-1">No materials found</p>
              <p className="text-gray-400 text-sm">
                {search ? 'Try a different search.' : 'Your lecturers haven\'t uploaded materials yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((m, i) => {
                const Icon  = TYPE_ICON[m.type] ?? File
                const color = TYPE_COLOR[m.type] ?? TYPE_COLOR.other
                return (
                  <motion.div key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="card p-4 flex items-center gap-4 hover:-translate-y-px transition-transform duration-200"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                      <Icon size={17} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-700 text-navy-900 text-sm truncate">{m.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {courses.find((c) => c.id === m.courseId)?.code ?? '—'} · {formatDate(m.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {m.url && (
                        <>
                          <a href={m.url} target="_blank" rel="noopener noreferrer"
                            className="p-2 rounded-lg border border-gray-200 text-navy-700 hover:bg-navy-900 hover:text-white hover:border-navy-900 transition-all">
                            <ExternalLink size={14} />
                          </a>
                          <a href={m.url} download
                            className="p-2 rounded-lg bg-navy-900 text-white hover:bg-navy-800 transition-all">
                            <Download size={14} />
                          </a>
                        </>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
