

import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Award, Download, QrCode, Eye, X, GraduationCap } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import useAuthStore from '@/shared/store/authStore'
import { getCertificates, where } from '@/firebase/firestore'

function CertModal({ cert, profile, onClose }) {
  const verifyUrl = `${window.location.origin}/verify?cert=${cert.certNumber}`
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">

        {/* Close */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <p className="font-display font-700 text-navy-900 text-sm">Certificate Preview</p>
          <div className="flex gap-2">
            <button onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 text-white font-display font-600 text-xs rounded-lg hover:bg-navy-800 transition-all">
              <Download size={12} /> Download
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-navy-900 transition-colors p-1">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Certificate body */}
        <div className="p-8 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-center relative overflow-hidden">
          {/* Decorative rings */}
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full border border-white/5 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full border border-white/5 translate-x-1/2 translate-y-1/2" />

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
            <h2 className="font-display font-900 text-white text-2xl mb-2">
              {profile?.firstName} {profile?.lastName}
            </h2>
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

            <p className="text-white/30 text-xs mt-4">Verify at: {verifyUrl}</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function Certificates() {
  const { profile }  = useAuthStore()
  const [certs,      setCerts]   = useState([])
  const [loading,    setLoading] = useState(true)
  const [viewing,    setViewing] = useState(null)

  useEffect(() => {
    if (!profile?.uid) return
    getCertificates([where('studentId','==',profile.uid)])
      .then(setCerts).catch(console.error).finally(() => setLoading(false))
  }, [profile?.uid])

  if (loading) return (
    <div className="portal-page">
      {[...Array(2)].map((_,i) => <div key={i} className="skeleton h-40 rounded-academy mb-4" />)}
    </div>
  )

  return (
    <div className="portal-page max-w-3xl">
      <h2 className="font-display font-800 text-navy-900 text-xl mb-6">My Certificates</h2>

      {certs.length === 0 ? (
        <div className="card p-12 text-center">
          <Award size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="font-display font-600 text-navy-900 mb-1">No certificates yet</p>
          <p className="text-gray-400 text-sm">Certificates will appear here once you complete your programme.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {certs.map((cert, i) => (
            <motion.div key={cert.id}
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.08 }}
              className="card overflow-hidden"
            >
              <div className="flex items-center gap-5 p-6">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-navy-900 flex items-center justify-center flex-shrink-0">
                  <Award size={24} className="text-gold-400" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-display font-700 text-navy-900 text-base">{cert.program}</p>
                  <p className="text-gray-400 text-xs mt-0.5">Issued: {cert.issueDate}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="badge-gold text-xs">Cert No: {cert.certNumber}</span>
                    <span className="badge badge-green text-xs">Verified</span>
                  </div>
                </div>

                {/* QR + actions */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="hidden sm:block bg-white p-1.5 border border-gray-100 rounded-lg">
                    <QRCodeSVG
                      value={`${window.location.origin}/verify?cert=${cert.certNumber}`}
                      size={56}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => setViewing(cert)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-navy-900 text-white font-display font-600 text-xs rounded-lg hover:bg-navy-800 transition-all">
                      <Eye size={12} /> View
                    </button>
                    <button onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-navy-700 font-display font-600 text-xs rounded-lg hover:border-navy-900 transition-all">
                      <Download size={12} /> PDF
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {viewing && <CertModal cert={viewing} profile={profile} onClose={() => setViewing(null)} />}
    </div>
  )
}
