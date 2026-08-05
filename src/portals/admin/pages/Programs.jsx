// import React from 'react'
// import { Settings } from 'lucide-react'
// export default function Programs() {
//   return (
//     <div className="portal-page">
//       <div className="card p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
//         <div className="w-14 h-14 rounded-2xl bg-navy-900 flex items-center justify-center mb-4">
//           <Settings size={24} className="text-gold-400" />
//         </div>
//         <h2 className="font-display font-700 text-navy-900 text-xl mb-2">Programs</h2>
//         <p className="text-gray-400 text-sm">This admin section is being built. Coming very soon.</p>
//       </div>
//     </div>
//   )
// }



import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Search, Plus, Edit2, Trash2, X, Save, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { getPrograms, createProgram, updateProgram, deleteProgram } from '@/firebase/firestore'
import { TABS, PROGRAMS_DATA } from '@/lib/programsData'

const BADGE_COLORS = [
  { label: 'Blue',   value: 'bg-blue-600' },
  { label: 'Navy',   value: 'bg-navy-900' },
  { label: 'Gold',   value: 'bg-gold-500' },
  { label: 'Crimson', value: 'bg-crimson-600' },
  { label: 'Green',  value: 'bg-emerald-600' },
]

// Turn a comma-separated string into a clean array of strings, and back again.
const toList = (str) => (str ?? '').split(',').map((s) => s.trim()).filter(Boolean)
const toText = (arr) => (Array.isArray(arr) ? arr.join(', ') : '')

function ProgramDrawer({ program, onClose, onSaved }) {
  const isNew = !program?.id
  const [form, setForm] = useState({
    title: '', tab: TABS[0], badge: '', badgeColor: BADGE_COLORS[0].value,
    desc: '', duration: '', type: '', tuition: '', intake: '', mode: '',
    image: '', overview: '',
    modulesText: toText(program?.modules),
    careersText: toText(program?.careers),
    requirementsText: toText(program?.requirements),
    comingSoon: false,
    ...program,
  })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Program title is required.'); return }
    setSaving(true)
    const payload = {
      title: form.title, tab: form.tab, badge: form.badge, badgeColor: form.badgeColor,
      desc: form.desc, duration: form.duration, type: form.type, tuition: form.tuition,
      intake: form.intake, mode: form.mode, image: form.image, overview: form.overview,
      modules: toList(form.modulesText), careers: toList(form.careersText),
      requirements: toList(form.requirementsText), comingSoon: !!form.comingSoon,
    }
    try {
      if (isNew) {
        const created = await createProgram(payload)
        onSaved({ id: created?.id ?? created, ...payload })
        toast.success('Program created.')
      } else {
        await updateProgram(program.id, payload)
        onSaved({ ...program, ...payload })
        toast.success('Program updated.')
      }
      onClose()
    } catch { toast.error('Save failed.') }
    finally { setSaving(false) }
  }

  const fields = [
    { key: 'title', label: 'Program Title', full: true },
    { key: 'badge', label: 'Badge Text (e.g. Engineering)' },
    { key: 'duration', label: 'Duration (e.g. 3 Years)' },
    { key: 'type', label: 'Type (e.g. Hons Degree)' },
    { key: 'tuition', label: 'Tuition (e.g. 850,000 FCFA / year)' },
    { key: 'intake', label: 'Intake (e.g. September & February)' },
    { key: 'mode', label: 'Mode (e.g. On-Campus / Hybrid)' },
    { key: 'image', label: 'Image URL', full: true },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="w-full max-w-lg bg-white h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-display font-700 text-navy-900 text-base">
            {isNew ? 'Add Program' : 'Edit Program'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-navy-900 transition-colors"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="label">Category</label>
            <select value={form.tab} onChange={(e) => set('tab', e.target.value)} className="input">
              {TABS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {fields.map(({ key, label, full }) => (
            <div key={key} className={full ? 'col-span-2' : ''}>
              <label className="label">{label}</label>
              <input type="text" value={form[key] ?? ''} onChange={(e) => set(key, e.target.value)} className="input" />
            </div>
          ))}

          <div>
            <label className="label">Badge Color</label>
            <select value={form.badgeColor} onChange={(e) => set('badgeColor', e.target.value)} className="input">
              {BADGE_COLORS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Short Description</label>
            <textarea rows={2} value={form.desc ?? ''} onChange={(e) => set('desc', e.target.value)} className="input" />
          </div>

          <div>
            <label className="label">Full Overview</label>
            <textarea rows={3} value={form.overview ?? ''} onChange={(e) => set('overview', e.target.value)} className="input" />
          </div>

          <div>
            <label className="label">Modules (comma-separated)</label>
            <textarea rows={2} value={form.modulesText ?? ''} onChange={(e) => set('modulesText', e.target.value)} className="input" />
          </div>

          <div>
            <label className="label">Career Paths (comma-separated)</label>
            <textarea rows={2} value={form.careersText ?? ''} onChange={(e) => set('careersText', e.target.value)} className="input" />
          </div>

          <div>
            <label className="label">Entry Requirements (comma-separated)</label>
            <textarea rows={2} value={form.requirementsText ?? ''} onChange={(e) => set('requirementsText', e.target.value)} className="input" />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer pt-1">
            <input type="checkbox" checked={!!form.comingSoon} onChange={(e) => set('comingSoon', e.target.checked)}
              className="w-4 h-4 rounded accent-navy-900" />
            <span className="text-sm text-navy-700">Mark as "Coming Soon"</span>
          </label>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 text-navy-700 font-display font-600 text-sm rounded-academy hover:border-navy-900 transition-all">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all disabled:opacity-60">
            {saving ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <><Save size={14} /> Save</>}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function Programs() {
  const [programs, setPrograms] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [seeding,  setSeeding]  = useState(false)

  const load = () => {
    setLoading(true)
    getPrograms().then(setPrograms).catch(console.error).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const filtered = programs.filter((p) => {
    const matchesCategory = category === 'All' || p.tab === category
    const matchesSearch = !search || `${p.title} ${p.badge} ${p.tab}`.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleDelete = async (p) => {
    if (!window.confirm(`Delete "${p.title}"? This can't be undone.`)) return
    setDeleting(p.id)
    try {
      await deleteProgram(p.id)
      setPrograms((prev) => prev.filter((x) => x.id !== p.id))
      toast.success('Program deleted.')
    } catch { toast.error('Delete failed.') }
    finally { setDeleting(null) }
  }

  const handleSaved = (saved) => {
    setPrograms((prev) => {
      const exists = prev.some((p) => p.id === saved.id)
      return exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...prev]
    })
  }

  // One-time convenience: load the 14 default programs from lib/programsData.js
  // into Firestore if the collection is still empty.
  const handleSeed = async () => {
    if (!window.confirm(`Seed ${PROGRAMS_DATA.length} default programs into the database?`)) return
    setSeeding(true)
    try {
      const created = []
      for (const p of PROGRAMS_DATA) {
        const { id: _localId, path: _path, ...rest } = p
        const doc = await createProgram(rest)
        created.push({ id: doc?.id ?? doc, ...rest })
      }
      setPrograms((prev) => [...created, ...prev])
      toast.success('Default programs seeded.')
    } catch { toast.error('Seeding failed.') }
    finally { setSeeding(false) }
  }

  return (
    <div className="portal-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-800 text-navy-900 text-xl">Programs</h2>
          <p className="text-gray-400 text-sm mt-0.5">{programs.length} total programs</p>
        </div>
        <div className="flex items-center gap-2">
          {programs.length === 0 && !loading && (
            <button onClick={handleSeed} disabled={seeding}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-navy-700 font-display font-600 text-sm rounded-academy hover:border-navy-900 transition-all disabled:opacity-60">
              {seeding ? <span className="w-4 h-4 rounded-full border-2 border-navy-900 border-t-transparent animate-spin" /> : <Sparkles size={14} />}
              Seed Defaults
            </button>
          )}
          <button onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all">
            <Plus size={15} /> Add Program
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by title or badge..."
            value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9 py-2.5 text-sm w-full" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input py-2.5 text-sm sm:max-w-xs">
          <option value="All">All Categories</option>
          {TABS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-academy" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <BookOpen size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="font-display font-600 text-navy-900 mb-1">No programs found</p>
          <p className="text-gray-400 text-sm">
            {programs.length === 0 ? 'Add your first program, or seed the defaults above.' : 'Try a different search or category.'}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-academy">
              <thead>
                <tr>
                  <th>Program</th>
                  <th>Category</th>
                  <th>Duration</th>
                  <th>Tuition</th>
                  <th className="text-center">Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-white text-xs font-display font-600 flex-shrink-0 ${p.badgeColor || 'bg-navy-900'}`}>
                          {p.badge || 'General'}
                        </span>
                        <p className="font-display font-600 text-navy-900 text-sm">{p.title}</p>
                      </div>
                    </td>
                    <td className="text-gray-500 text-sm">{p.tab ?? '—'}</td>
                    <td className="text-gray-500 text-sm">{p.duration ?? '—'}</td>
                    <td className="text-gray-500 text-sm">{p.tuition ?? '—'}</td>
                    <td className="text-center">
                      <span className={p.comingSoon ? 'badge bg-gold-500/15 text-gold-700' : 'badge badge-green'}>
                        {p.comingSoon ? 'Coming Soon' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setSelected(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-navy-900 hover:bg-gray-100 transition-all">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(p)} disabled={deleting === p.id}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-crimson-600 hover:bg-crimson-600/8 transition-all disabled:opacity-40">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100">
            <p className="text-gray-400 text-xs">Showing {filtered.length} of {programs.length} programs</p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected && <ProgramDrawer program={selected} onClose={() => setSelected(null)} onSaved={handleSaved} />}
        {creating && <ProgramDrawer program={null} onClose={() => setCreating(false)} onSaved={handleSaved} />}
      </AnimatePresence>
    </div>
  )
}