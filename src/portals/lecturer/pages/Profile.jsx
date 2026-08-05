import React from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, BookOpen } from 'lucide-react'
import useAuthStore from '@/shared/store/authStore'

export default function LecturerProfile() {
  const { profile } = useAuthStore()
  const initials = `${profile?.firstName?.[0] ?? ''}${profile?.lastName?.[0] ?? ''}`.toUpperCase()

  return (
    <div className="portal-page max-w-3xl">
      <h2 className="font-display font-800 text-navy-900 text-xl mb-6">My Profile</h2>
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="card p-7">
        <div className="flex items-center gap-5 mb-7 pb-7 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-navy-900 flex items-center justify-center font-display font-800 text-gold-400 text-xl flex-shrink-0">
            {initials}
          </div>
          <div>
            <h3 className="font-display font-800 text-navy-900 text-lg">{profile?.firstName} {profile?.lastName}</h3>
            <p className="text-gray-400 text-sm">{profile?.department ?? 'Faculty Member'}</p>
            <span className="badge-gold text-xs mt-1 inline-block">Lecturer</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: Mail,    label:'Email',      value: profile?.email },
            { icon: Phone,   label:'Phone',      value: profile?.phone ?? '—' },
            { icon: BookOpen,label:'Department', value: profile?.department ?? '—' },
            { icon: User,    label:'Lecturer ID',value: profile?.lecturerId ?? '—' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 p-4 rounded-lg bg-slate-academy">
              <Icon size={15} className="text-gold-500 flex-shrink-0" />
              <div>
                <p className="text-gray-400 text-xs">{label}</p>
                <p className="font-display font-600 text-navy-900 text-sm">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
