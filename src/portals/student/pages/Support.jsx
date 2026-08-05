

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { HelpCircle, Send, Clock, CheckCircle, AlertCircle, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '@/shared/store/authStore'
import { getTickets, createTicket, where, orderBy } from '@/firebase/firestore'

const schema = z.object({
  subject:  z.string().min(4, 'Enter a subject'),
  category: z.string().min(1, 'Select a category'),
  message:  z.string().min(20, 'Please describe your issue (min. 20 characters)'),
})

const CATEGORIES = ['Academic','Finance','Technical / Portal','Accommodation','General']

function statusBadge(s) {
  switch (s) {
    case 'open':        return 'badge bg-gold-500/15 text-gold-700'
    case 'in_progress': return 'badge bg-blue-100 text-blue-700'
    case 'resolved':    return 'badge badge-green'
    default:            return 'badge bg-gray-100 text-gray-500'
  }
}

function formatDate(val) {
  if (!val) return '—'
  const d = val?.toDate ? val.toDate() : new Date(val)
  return d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })
}

export default function Support() {
  const { profile }  = useAuthStore()
  const [tickets,    setTickets]  = useState([])
  const [loading,    setLoading]  = useState(true)
  const [showForm,   setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, formState:{ errors }, reset } = useForm({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (!profile?.uid) return
    getTickets([where('studentId','==',profile.uid), orderBy('createdAt','desc')])
      .then(setTickets).catch(console.error).finally(() => setLoading(false))
  }, [profile?.uid])

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const id = await createTicket({
        ...data, studentId: profile.uid,
        studentName: `${profile.firstName} ${profile.lastName}`,
        status: 'open',
      })
      setTickets((prev) => [{ id, ...data, status:'open', createdAt: new Date() }, ...prev])
      toast.success('Support ticket raised. We\'ll respond within 24–48 hours.')
      setShowForm(false)
      reset()
    } catch { toast.error('Failed to submit ticket. Try again.') }
    finally { setSubmitting(false) }
  }

  return (
    <div className="portal-page max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-800 text-navy-900 text-xl">Support</h2>
          <p className="text-gray-400 text-sm mt-0.5">Raise a ticket and track your requests</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-navy-900 text-white font-display font-600 text-sm rounded-academy hover:bg-navy-800 transition-all">
          {showForm ? <><X size={14}/> Cancel</> : <><Plus size={14}/> New Ticket</>}
        </button>
      </div>

      {/* New ticket form */}
      {showForm && (
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
          className="card p-6 mb-6 border-l-4 border-gold-500">
          <h3 className="font-display font-700 text-navy-900 text-sm mb-4">New Support Ticket</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Subject</label>
                <input {...register('subject')} className="input" placeholder="Brief description of your issue" />
                {errors.subject && <p className="text-crimson-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11}/>{errors.subject.message}</p>}
              </div>
              <div>
                <label className="label">Category</label>
                <select {...register('category')} className="input">
                  <option value="">Select...</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="text-crimson-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11}/>{errors.category.message}</p>}
              </div>
            </div>
            <div>
              <label className="label">Message</label>
              <textarea {...register('message')} rows={4} className="input resize-none"
                placeholder="Describe your issue in detail..." />
              {errors.message && <p className="text-crimson-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11}/>{errors.message.message}</p>}
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all disabled:opacity-60">
                {submitting
                  ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"/>
                  : <><Send size={13}/> Submit Ticket</>}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Ticket list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_,i) => <div key={i} className="skeleton h-20 rounded-academy" />)}
        </div>
      ) : tickets.length === 0 ? (
        <div className="card p-12 text-center">
          <HelpCircle size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="font-display font-600 text-navy-900 mb-1">No tickets yet</p>
          <p className="text-gray-400 text-sm">Use the button above to raise your first support request.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t, i) => (
            <motion.div key={t.id}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.05 }}
              className="card p-5 flex items-start gap-4"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                t.status === 'resolved' ? 'bg-emerald-100' : t.status === 'in_progress' ? 'bg-blue-100' : 'bg-gold-500/15'
              }`}>
                {t.status === 'resolved'
                  ? <CheckCircle size={16} className="text-emerald-600"/>
                  : t.status === 'in_progress'
                  ? <Clock size={16} className="text-blue-600"/>
                  : <HelpCircle size={16} className="text-gold-600"/>
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-display font-700 text-navy-900 text-sm">{t.subject}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className={statusBadge(t.status)}>{t.status?.replace('_',' ')}</span>
                  <span>{t.category}</span>
                  <span>{formatDate(t.createdAt)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
