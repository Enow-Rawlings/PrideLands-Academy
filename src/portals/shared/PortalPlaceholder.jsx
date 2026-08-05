import React from 'react'

export default function PortalPlaceholder({ title, description, eyebrow = 'Portal' }) {
  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-600">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold text-navy-900">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
    </div>
  )
}
