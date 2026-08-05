import React from 'react'
import { Settings as SettingsIcon } from 'lucide-react'
export default function Settings() {
  return (
    <div className="portal-page">
      <div className="card p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-14 h-14 rounded-2xl bg-navy-900 flex items-center justify-center mb-4">
          <Settings size={24} className="text-gold-400" />
        </div>
        <h2 className="font-display font-700 text-navy-900 text-xl mb-2">Settings</h2>
        <p className="text-gray-400 text-sm">This admin section is being built. Coming very soon.</p>
      </div>
    </div>
  )
}
