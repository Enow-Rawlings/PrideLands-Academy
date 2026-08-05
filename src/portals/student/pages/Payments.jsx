

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  CreditCard, CheckCircle, Clock, AlertCircle,
  ArrowRight, Download, ExternalLink
} from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '@/shared/store/authStore'
import { getPayments, where, orderBy } from '@/firebase/firestore'

function statusBadge(status) {
  switch (status) {
    case 'paid':     return 'badge bg-emerald-100 text-emerald-700'
    case 'pending':  return 'badge bg-gold-500/15 text-gold-700'
    case 'overdue':  return 'badge bg-crimson-600/10 text-crimson-600'
    default:         return 'badge bg-gray-100 text-gray-500'
  }
}

function statusIcon(status) {
  switch (status) {
    case 'paid':    return <CheckCircle size={14} className="text-emerald-600" />
    case 'pending': return <Clock size={14} className="text-gold-600" />
    case 'overdue': return <AlertCircle size={14} className="text-crimson-600" />
    default:        return null
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount)
}

function formatDate(val) {
  if (!val) return '—'
  const d = val?.toDate ? val.toDate() : new Date(val)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Payments() {
  const { profile }   = useAuthStore()
  const [payments,    setPayments]   = useState([])
  const [loading,     setLoading]    = useState(true)
  const [paying,      setPaying]     = useState(null) // id of payment being processed

  useEffect(() => {
    if (!profile?.uid) return
    getPayments([where('studentId', '==', profile.uid), orderBy('createdAt', 'desc')])
      .then(setPayments)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [profile?.uid])

  const outstanding = payments.filter((p) => p.status !== 'paid')
  const paid        = payments.filter((p) => p.status === 'paid')
  const totalOwed   = outstanding.reduce((s, p) => s + (p.amount ?? 0), 0)
  const totalPaid   = paid.reduce((s, p) => s + (p.amount ?? 0), 0)

  // Initiate FapShi payment
  // TODO: Replace this stub with real FapShi API call
  const handlePay = async (payment) => {
    setPaying(payment.id)
    try {
      // Stub — replace with:
      // const res = await fetch(`${import.meta.env.VITE_FAPSHI_BASE_URL}/initiate-pay`, {
      //   method: 'POST',
      //   headers: { 'apiuser': '...', 'apikey': import.meta.env.VITE_FAPSHI_API_KEY, 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ amount: payment.amount, email: profile.email, externalId: payment.id, redirectUrl: window.location.href }),
      // })
      // const { link } = await res.json()
      // window.open(link, '_blank')
      toast('FapShi payment gateway will be connected soon.', { icon: '💳' })
    } catch {
      toast.error('Payment initiation failed. Try again.')
    } finally {
      setPaying(null)
    }
  }

  if (loading) {
    return (
      <div className="portal-page">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-academy" />)}
        </div>
        <div className="skeleton h-64 rounded-academy" />
      </div>
    )
  }

  return (
    <div className="portal-page max-w-4xl">
      <h2 className="font-display font-800 text-navy-900 text-xl mb-6">Payments & Fees</h2>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Outstanding Balance', value: formatCurrency(totalOwed), icon: AlertCircle, color: totalOwed > 0 ? 'bg-crimson-600' : 'bg-emerald-600' },
          { label: 'Total Paid',          value: formatCurrency(totalPaid),  icon: CheckCircle, color: 'bg-emerald-600' },
          { label: 'Total Invoices',      value: payments.length,            icon: CreditCard,  color: 'bg-navy-900' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="card p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
              <s.icon size={18} className="text-white" />
            </div>
            <div>
              <p className="font-display font-800 text-navy-900 text-lg leading-tight">{s.value}</p>
              <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Outstanding */}
      {outstanding.length > 0 && (
        <div className="mb-6">
          <h3 className="font-display font-700 text-navy-900 text-sm mb-3">Outstanding Invoices</h3>
          <div className="space-y-3">
            {outstanding.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4 border-l-4 border-crimson-600">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {statusIcon(p.status)}
                    <p className="font-display font-700 text-navy-900 text-sm">{p.description ?? 'Tuition Fee'}</p>
                  </div>
                  <p className="text-gray-400 text-xs">
                    Due: {formatDate(p.dueDate)} · Ref: {p.reference ?? p.id?.slice(0, 8)}
                  </p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="font-display font-800 text-navy-900">{formatCurrency(p.amount)}</p>
                    <span className={statusBadge(p.status)}>{p.status}</span>
                  </div>
                  <button
                    onClick={() => handlePay(p)}
                    disabled={paying === p.id}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy-900 text-white font-display font-700 text-xs rounded-academy hover:bg-navy-800 transition-all active:scale-95 disabled:opacity-60 flex-shrink-0"
                  >
                    {paying === p.id
                      ? <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      : <><CreditCard size={13} /> Pay Now</>
                    }
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Payment history */}
      <div>
        <h3 className="font-display font-700 text-navy-900 text-sm mb-3">Payment History</h3>
        {paid.length === 0 ? (
          <div className="card p-10 text-center">
            <CreditCard size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No payment records found.</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table-academy">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Reference</th>
                    <th className="text-center">Date</th>
                    <th className="text-center">Status</th>
                    <th className="text-right">Amount</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {paid.map((p) => (
                    <tr key={p.id}>
                      <td className="font-display font-600 text-sm">{p.description ?? 'Tuition Fee'}</td>
                      <td className="text-gray-400 text-xs font-mono">{p.reference ?? p.id?.slice(0, 10)}</td>
                      <td className="text-center text-gray-500 text-sm">{formatDate(p.paidAt ?? p.createdAt)}</td>
                      <td className="text-center">
                        <span className={statusBadge(p.status)}>{p.status}</span>
                      </td>
                      <td className="text-right font-display font-700 text-navy-900 text-sm">{formatCurrency(p.amount)}</td>
                      <td className="text-right">
                        <button className="p-1.5 text-gray-400 hover:text-navy-900 transition-colors" title="Download receipt">
                          <Download size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* FapShi info note */}
      <div className="mt-6 p-4 rounded-academy bg-slate-academy border border-gray-100 flex items-start gap-3">
        <ExternalLink size={15} className="text-gold-600 flex-shrink-0 mt-0.5" />
        <p className="text-gray-500 text-xs leading-relaxed">
          Payments are processed securely via <strong>FapShi</strong>. Accepted methods include mobile money (MTN, Orange), bank transfer, and card. Contact Finance if you need a payment plan.
        </p>
      </div>
    </div>
  )
}

