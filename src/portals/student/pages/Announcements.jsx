

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, ChevronDown, Info, AlertTriangle, Calendar } from 'lucide-react'
import useAuthStore from '@/shared/store/authStore'
import { getAnnouncements, orderBy } from '@/firebase/firestore'

const TYPE_CONFIG = {
  general:  { icon: Bell,          color: 'bg-navy-900/8 border-navy-900/20',   badge: 'badge-navy',  label: 'General' },
  academic: { icon: Info,          color: 'bg-blue-50 border-blue-200',         badge: 'bg-blue-100 text-blue-700 badge', label: 'Academic' },
  urgent:   { icon: AlertTriangle, color: 'bg-crimson-600/8 border-crimson-200',badge: 'badge-red',  label: 'Urgent' },
  event:    { icon: Calendar,      color: 'bg-gold-500/10 border-gold-300',     badge: 'badge-gold', label: 'Event' },
}

function formatDate(val) {
  if (!val) return ''
  const d = val?.toDate ? val.toDate() : new Date(val)
  return d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading,       setLoading]       = useState(true)
  const [openId,        setOpenId]        = useState(null)
  const [filter,        setFilter]        = useState('All')

  useEffect(() => {
    getAnnouncements([orderBy('createdAt','desc')])
      .then(setAnnouncements).catch(console.error).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'All'
    ? announcements
    : announcements.filter((a) => a.type === filter.toLowerCase())

  if (loading) return (
    <div className="portal-page max-w-3xl">
      {[...Array(4)].map((_,i) => <div key={i} className="skeleton h-16 rounded-academy mb-3" />)}
    </div>
  )

  return (
    <div className="portal-page max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-800 text-navy-900 text-xl">Announcements</h2>
        <span className="badge-navy text-xs">{announcements.length} total</span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-thin">
        {['All','General','Academic','Urgent','Event'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-display font-600 transition-all ${
              filter === f ? 'bg-navy-900 text-white' : 'bg-white border border-gray-200 text-navy-600 hover:border-navy-900'
            }`}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Bell size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No announcements at this time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a, i) => {
            const config = TYPE_CONFIG[a.type] ?? TYPE_CONFIG.general
            const Icon   = config.icon
            const isOpen = openId === a.id
            return (
              <motion.div key={a.id}
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.05 }}
                className={`rounded-academy border p-4 ${config.color}`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : a.id)}
                  className="w-full flex items-center gap-3 text-left"
                >
                  <Icon size={15} className="text-navy-700 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`${config.badge} text-[10px] px-2 py-0.5`}>{config.label}</span>
                      <span className="text-gray-400 text-xs">{formatDate(a.createdAt)}</span>
                    </div>
                    <p className="font-display font-700 text-navy-900 text-sm truncate">{a.title}</p>
                  </div>
                  <ChevronDown size={14} className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height:0, opacity:0 }}
                      animate={{ height:'auto', opacity:1 }}
                      exit={{ height:0, opacity:0 }}
                      transition={{ duration:0.22 }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-600 text-sm leading-relaxed mt-3 pt-3 border-t border-black/5 pl-6">
                        {a.body ?? 'No further details provided.'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
