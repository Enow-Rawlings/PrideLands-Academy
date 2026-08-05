

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, MapPin, User, Calendar } from 'lucide-react'
import useAuthStore from '@/shared/store/authStore'
import { getTimetable, where } from '@/firebase/firestore'

const DAYS    = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const HOURS   = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00']
const COLORS  = [
  'bg-blue-100 border-blue-300 text-blue-800',
  'bg-gold-500/15 border-gold-400 text-gold-800',
  'bg-emerald-100 border-emerald-300 text-emerald-800',
  'bg-purple-100 border-purple-300 text-purple-800',
  'bg-crimson-600/10 border-crimson-300 text-crimson-800',
  'bg-cyan-100 border-cyan-300 text-cyan-800',
]

export default function Timetable() {
  const { profile }   = useAuthStore()
  const [slots,       setSlots]  = useState([])
  const [loading,     setLoading]= useState(true)
  const [view,        setView]   = useState('week') // 'week' | 'list'

  useEffect(() => {
    if (!profile?.uid) return
    getTimetable([where('studentId','==',profile.uid)])
      .then(setSlots).catch(console.error).finally(() => setLoading(false))
  }, [profile?.uid])

  // Map course codes to colors
  const courseColorMap = {}
  slots.forEach((s) => {
    if (!courseColorMap[s.courseCode]) {
      const idx = Object.keys(courseColorMap).length % COLORS.length
      courseColorMap[s.courseCode] = COLORS[idx]
    }
  })

  // Slot by day/hour
  const grid = {}
  slots.forEach((s) => {
    const key = `${s.day}-${s.startTime}`
    grid[key] = s
  })

  if (loading) return (
    <div className="portal-page">
      <div className="skeleton h-96 rounded-academy" />
    </div>
  )

  return (
    <div className="portal-page">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-800 text-navy-900 text-xl">My Timetable</h2>
        <div className="flex gap-2">
          {['week','list'].map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-2 rounded-lg text-sm font-display font-600 capitalize transition-all ${
                view === v ? 'bg-navy-900 text-white' : 'bg-white border border-gray-200 text-navy-600 hover:border-navy-900'
              }`}>{v} view</button>
          ))}
        </div>
      </div>

      {slots.length === 0 ? (
        <div className="card p-12 text-center">
          <Calendar size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="font-display font-600 text-navy-900 mb-1">No timetable yet</p>
          <p className="text-gray-400 text-sm">Your timetable will appear here once the academic office publishes it.</p>
        </div>
      ) : view === 'week' ? (
        /* ── Week grid view ── */
        <div className="card overflow-auto">
          <table className="w-full min-w-[640px] text-xs border-collapse">
            <thead>
              <tr>
                <th className="w-16 px-3 py-3 text-gray-400 font-display font-600 border-b border-r border-gray-100 text-left">Time</th>
                {DAYS.map((d) => (
                  <th key={d} className="px-3 py-3 font-display font-700 text-navy-900 border-b border-gray-100 text-center">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((hour) => (
                <tr key={hour} className="border-b border-gray-50">
                  <td className="px-3 py-2 text-gray-400 font-display font-600 border-r border-gray-100 text-xs whitespace-nowrap">{hour}</td>
                  {DAYS.map((day) => {
                    const slot = grid[`${day}-${hour}`]
                    return (
                      <td key={day} className="px-1 py-1 align-top min-w-[100px]">
                        {slot && (
                          <div className={`rounded-lg border px-2 py-1.5 ${courseColorMap[slot.courseCode] ?? COLORS[0]}`}>
                            <p className="font-display font-700 text-[11px] leading-tight">{slot.courseCode}</p>
                            <p className="text-[10px] opacity-70 truncate">{slot.room}</p>
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* ── List view ── */
        <div className="space-y-3">
          {DAYS.map((day) => {
            const daySlots = slots.filter((s) => s.day === day)
            if (!daySlots.length) return null
            return (
              <div key={day}>
                <h3 className="font-display font-700 text-navy-900 text-sm mb-2">{day}</h3>
                <div className="space-y-2">
                  {daySlots.sort((a,b) => a.startTime?.localeCompare(b.startTime)).map((slot, i) => (
                    <motion.div key={slot.id}
                      initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay: i * 0.05 }}
                      className="card p-4 flex items-center gap-4"
                    >
                      <div className={`w-2 h-10 rounded-full flex-shrink-0 ${courseColorMap[slot.courseCode]?.split(' ')[0] ?? 'bg-navy-900'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-700 text-navy-900 text-sm">{slot.courseCode} — {slot.courseTitle}</p>
                        <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><Clock size={11} /> {slot.startTime} – {slot.endTime}</span>
                          <span className="flex items-center gap-1"><MapPin size={11} /> {slot.room}</span>
                          <span className="flex items-center gap-1"><User size={11} /> {slot.lecturerName}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Legend */}
      {slots.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-5">
          {Object.entries(courseColorMap).map(([code, color]) => (
            <span key={code} className={`badge text-xs border ${color}`}>{code}</span>
          ))}
        </div>
      )}
    </div>
  )
}
