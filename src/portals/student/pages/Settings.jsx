

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Shield, Moon, Globe, Trash2, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '@/shared/store/authStore'
import { updateUser } from '@/firebase/firestore'

function ToggleRow({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div>
        <p className="font-display font-600 text-navy-900 text-sm">{label}</p>
        <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${value ? 'bg-navy-900' : 'bg-gray-200'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="card p-6">
      <h3 className="font-display font-700 text-navy-900 text-sm flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
        <Icon size={15} className="text-gold-600" /> {title}
      </h3>
      {children}
    </div>
  )
}

export default function Settings() {
  const { profile, patchProfile } = useAuthStore()

  const [notifs, setNotifs] = useState({
    announcements: profile?.settings?.notifs?.announcements ?? true,
    results:       profile?.settings?.notifs?.results       ?? true,
    payments:      profile?.settings?.notifs?.payments      ?? true,
    assignments:   profile?.settings?.notifs?.assignments   ?? true,
    email:         profile?.settings?.notifs?.email         ?? true,
  })

  const [privacy, setPrivacy] = useState({
    showProfile:   profile?.settings?.privacy?.showProfile   ?? true,
    showResults:   profile?.settings?.privacy?.showResults   ?? false,
  })

  const [saving, setSaving] = useState(false)

  const save = async (key, val) => {
    setSaving(true)
    try {
      const settings = { ...profile?.settings, [key]: val }
      await updateUser(profile.uid, { settings })
      patchProfile({ settings })
      toast.success('Settings saved.')
    } catch { toast.error('Failed to save. Try again.') }
    finally { setSaving(false) }
  }

  const handleNotif = (key, val) => {
    const updated = { ...notifs, [key]: val }
    setNotifs(updated)
    save('notifs', updated)
  }

  const handlePrivacy = (key, val) => {
    const updated = { ...privacy, [key]: val }
    setPrivacy(updated)
    save('privacy', updated)
  }

  return (
    <div className="portal-page max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-800 text-navy-900 text-xl">Settings</h2>
        {saving && <span className="text-gold-600 text-xs font-display font-600 flex items-center gap-1">
          <span className="w-3 h-3 rounded-full border-2 border-gold-500 border-t-transparent animate-spin"/> Saving...
        </span>}
      </div>

      <div className="space-y-5">

        {/* Notifications */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}>
          <SectionCard title="Notifications" icon={Bell}>
            <ToggleRow label="Announcements"    desc="New campus and academic announcements"   value={notifs.announcements} onChange={(v) => handleNotif('announcements',v)} />
            <ToggleRow label="Results Published" desc="When lecturers publish your grades"      value={notifs.results}       onChange={(v) => handleNotif('results',v)} />
            <ToggleRow label="Payment Reminders" desc="Upcoming and overdue payment alerts"     value={notifs.payments}      onChange={(v) => handleNotif('payments',v)} />
            <ToggleRow label="Assignment Deadlines" desc="Reminders 24 hours before due dates" value={notifs.assignments}   onChange={(v) => handleNotif('assignments',v)} />
            <ToggleRow label="Email Notifications" desc="Receive the above via email as well"   value={notifs.email}         onChange={(v) => handleNotif('email',v)} />
          </SectionCard>
        </motion.div>

        {/* Privacy */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}>
          <SectionCard title="Privacy" icon={Shield}>
            <ToggleRow label="Show My Profile to Classmates" desc="Allow other students to see your basic profile" value={privacy.showProfile} onChange={(v) => handlePrivacy('showProfile',v)} />
            <ToggleRow label="Show Academic Results"         desc="Allow classmates to see your published grades"  value={privacy.showResults} onChange={(v) => handlePrivacy('showResults',v)} />
          </SectionCard>
        </motion.div>

        {/* Account info */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
          <SectionCard title="Account" icon={Globe}>
            <div className="space-y-3">
              {[
                { label: 'Email Address',  value: profile?.email },
                { label: 'Student ID',     value: profile?.studentId },
                { label: 'Account Role',   value: 'Student' },
                { label: 'Member Since',   value: profile?.enrollmentYear ?? '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-400 text-sm">{label}</span>
                  <span className="font-display font-600 text-navy-900 text-sm">{value ?? '—'}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-slate-academy flex items-start gap-2">
              <AlertCircle size={14} className="text-gold-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-500 text-xs leading-relaxed">
                To change your email address or request account deletion, contact the IT Support desk.
              </p>
            </div>
          </SectionCard>
        </motion.div>

      </div>
    </div>
  )
}
