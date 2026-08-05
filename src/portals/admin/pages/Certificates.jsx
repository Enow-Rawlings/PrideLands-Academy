// FILE: src/portals/admin/pages/Certificates.jsx

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Plus, Search, Download, Eye, X, GraduationCap } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'
import {
  getCertificates, createCertificate,
  getStudents, orderBy
} from '@/firebase/firestore'

function formatDate(val) {
  if (!val) return '—'
  const d = val?.toDate ? val.toDate() : new Date(val)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function generateCertNumber() {
  return `PLA-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

// Issue certificate modal
function IssueCertModal({ students, onClose, onIssued }) {
  const [form,      setForm]      = useState({ studentId: '', program: '', issueDate: new Date().toISOString().slice(0, 10) })
  const [issuing,   setIssuing]   = useState(false)

  const selectedStudent = students.find(s => s.id === form.studentId)

  const handleIssue = async () => {
    if (!form.studentId || !form.program) { toast.error('Select a student and programme.'); return }
    setIssuing(true)
    try {
      const certNumber = generateCertNumber()
      const cert = {
        studentId:   form.studentId,
        studentName: `${selectedStudent?.firstName ?? ''} ${selectedStudent?.lastName ?? ''}`,
        program:     form.program,
        issueDate:   form.issueDate,
        certNumber,
        status:      'issued',
      }
      const id = await createCertificate(cert)
      onIssued({ id, ...cert })
      toast.success(`Certificate ${certNumber} issued.`)
      onClose()
    } catch { toast.error('Failed to issue certificate.') }
    finally { setIssuing(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-7">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-700 text-navy-900 text-base">Issue Certificate</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-navy-900 transition-colors"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label">Student</label>
            <select className="input" value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))}>
              <option value="">Select a student...</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName} — {s.studentId ?? s.id?.slice(0, 8)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Programme Completed</label>
            <input className="input" placeholder="e.g. BSc. Artificial Intelligence"
              value={form.program} onChange={e => setForm(f => ({ ...f, program: e.target.value }))} />
          </div>
          <div>
            <label className="label">Issue Date</label>
            <input type="date" className="input" value={form.issueDate}
              onChange={e => setForm(f => ({ ...f, issueDate: e.target.value }))} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 text-navy-700 font-display font-600 text-sm rounded-academy hover:border-navy-900 transition-all">
            Cancel
          </button>
          <button onClick={handleIssue} disabled={issuing}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all disabled:opacity-60">
            {issuing
              ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              : <><Award size={14} /> Issue Certificate</>}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// Preview modal
function CertPreviewModal({ cert, onClose }) {
  const verifyUrl = `${window.location.origin}/verify?cert=${cert.certNumber}`
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <p className="font-display font-700 text-navy-900 text-sm">Certificate — {cert.certNumber}</p>
          <div className="flex gap-2">
            <button onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 text-white font-display font-600 text-xs rounded-lg hover:bg-navy-800 transition-all">
              <Download size={12} /> PDF
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-navy-900 p-1 transition-colors"><X size={18} /></button>
          </div>
        </div>
        <div className="p-8 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full border border-white/5 -translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center">
                <GraduationCap size={20} className="text-gold-400" />
              </div>
              <div className="text-left">
                <p className="font-display font-800 text-white text-sm">PrideLands Academy</p>
                <p className="text-white/50 text-xs">Raising African Excellence</p>
              </div>
            </div>
            <p className="text-gold-400 font-display font-600 text-xs tracking-widest uppercase mb-4">Certificate of Completion</p>
            <p className="text-white/70 text-sm mb-2">This is to certify that</p>
            <h2 className="font-display font-900 text-white text-2xl mb-2">{cert.studentName}</h2>
            <p className="text-white/70 text-sm mb-1">has successfully completed</p>
            <h3 className="font-display font-700 text-gold-400 text-lg mb-4">{cert.program}</h3>
            <p className="text-white/50 text-xs mb-6">Issued: {cert.issueDate} · Cert No: {cert.certNumber}</p>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="w-24 h-px bg-white/30 mb-1 mx-auto" />
                <p className="text-white/50 text-xs">Director's Signature</p>
              </div>
              <div className="bg-white p-2 rounded-lg">
                <QRCodeSVG value={verifyUrl} size={60} />
              </div>
              <div className="text-center">
                <div className="w-24 h-px bg-white/30 mb-1 mx-auto" />
                <p className="text-white/50 text-xs">Registrar's Seal</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function Certificates() {
  const [certs,     setCerts]     = useState([])
  const [students,  setStudents]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [showIssue, setShowIssue] = useState(false)
  const [preview,   setPreview]   = useState(null)

  useEffect(() => {
    Promise.all([
      getCertificates([orderBy('createdAt', 'desc')]),
      getStudents(),
    ]).then(([c, s]) => { setCerts(c); setStudents(s) })
      .catch(console.error).finally(() => setLoading(false))
  }, [])

  const filtered = certs.filter(c =>
    !search ||
    `${c.studentName ?? ''} ${c.program ?? ''} ${c.certNumber ?? ''}`.toLowerCase().includes(search.toLowerCase())
  )

  const handleIssued = (cert) => setCerts(prev => [cert, ...prev])

  return (
    <div className="portal-page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-800 text-navy-900 text-xl">Certificates</h2>
          <p className="text-gray-400 text-sm mt-0.5">{certs.length} certificates issued</p>
        </div>
        <button onClick={() => setShowIssue(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all">
          <Plus size={15} /> Issue Certificate
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search by student name, programme or cert number..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="input pl-9 py-2.5 text-sm w-full sm:max-w-sm" />
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 rounded-academy" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Award size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">{search ? 'No certificates match your search.' : 'No certificates issued yet.'}</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-academy">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Programme</th>
                  <th>Cert Number</th>
                  <th className="text-center">Issue Date</th>
                  <th className="text-center">QR</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cert, i) => (
                  <motion.tr key={cert.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                    <td className="font-display font-600 text-sm">{cert.studentName ?? '—'}</td>
                    <td className="text-gray-500 text-sm">{cert.program ?? '—'}</td>
                    <td className="font-mono text-xs text-gold-600 font-600">{cert.certNumber}</td>
                    <td className="text-center text-gray-500 text-sm">{formatDate(cert.createdAt)}</td>
                    <td className="text-center">
                      <div className="flex justify-center">
                        <QRCodeSVG
                          value={`${window.location.origin}/verify?cert=${cert.certNumber}`}
                          size={32}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setPreview(cert)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-navy-900 hover:bg-gray-100 transition-all">
                          <Eye size={13} />
                        </button>
                        <button onClick={() => setPreview(cert)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-navy-900 hover:bg-gray-100 transition-all">
                          <Download size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100">
            <p className="text-gray-400 text-xs">Showing {filtered.length} of {certs.length} certificates</p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showIssue && <IssueCertModal students={students} onClose={() => setShowIssue(false)} onIssued={handleIssued} />}
        {preview   && <CertPreviewModal cert={preview} onClose={() => setPreview(null)} />}
      </AnimatePresence>
    </div>
  )
}