import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import {
  ShieldCheck, ShieldX, Search, GraduationCap,
  Award, Calendar, User, ArrowRight
} from 'lucide-react'
import { getDocuments, where } from '@/firebase/firestore'

export default function Verify() {
  const [params]    = useSearchParams()
  const prefilled   = params.get('cert') ?? ''

  const [certNo,    setCertNo]   = useState(prefilled)
  const [result,    setResult]   = useState(null)  // cert object | 'not_found'
  const [loading,   setLoading]  = useState(false)

  // Auto-search if cert number in URL
  useEffect(() => { if (prefilled) handleVerify(prefilled) }, [prefilled])

  async function handleVerify(number = certNo) {
    const q = number.trim().toUpperCase()
    if (!q) return
    setLoading(true)
    setResult(null)
    try {
      const certs = await getDocuments('certificates', [where('certNumber', '==', q)])
      setResult(certs.length > 0 ? certs[0] : 'not_found')
    } catch (err) {
      console.error(err)
      setResult('not_found')
    } finally { setLoading(false) }
  }

  const isFound = result && result !== 'not_found'

  return (
    <div className="min-h-screen bg-slate-academy flex flex-col">

      {/* Header */}
      <div className="bg-navy-900 py-12">
        <div className="container-academy px-4 md:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center">
              <GraduationCap size={20} className="text-gold-400" />
            </div>
            <div className="text-left">
              <p className="font-display font-800 text-white text-sm">PrideLands Academy</p>
              <p className="text-white/50 text-xs">Certificate Verification Portal</p>
            </div>
          </div>
          <h1 className="font-display font-900 text-white text-2xl md:text-3xl mb-3">
            Verify a Certificate
          </h1>
          <p className="text-white/65 text-sm max-w-md mx-auto">
            Enter a certificate number or scan a QR code to instantly verify the authenticity of a PrideLands Academy qualification.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="container-academy px-4 md:px-8 -mt-6 relative z-10 mb-8">
        <div className="max-w-xl mx-auto">
          <div className="card p-5">
            <label className="label mb-2">Certificate Number</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={certNo}
                onChange={e => setCertNo(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleVerify()}
                placeholder="e.g. PLA-2024-AB1234"
                className="input flex-1 font-mono tracking-wider"
                autoFocus
              />
              <button
                onClick={() => handleVerify()}
                disabled={loading || !certNo.trim()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all disabled:opacity-60 flex-shrink-0"
              >
                {loading
                  ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  : <><Search size={15} /> Verify</>
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="container-academy px-4 md:px-8 flex-1">
        <div className="max-w-xl mx-auto">

          {isFound && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card overflow-hidden"
            >
              {/* Status bar */}
              <div className="bg-emerald-600 px-6 py-4 flex items-center gap-3">
                <ShieldCheck size={24} className="text-white flex-shrink-0" />
                <div>
                  <p className="font-display font-700 text-white text-sm">Certificate Verified ✓</p>
                  <p className="text-white/70 text-xs">This is an authentic PrideLands Academy certificate.</p>
                </div>
              </div>

              {/* Certificate details */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { icon: User,      label: 'Student Name',      value: result.studentName },
                        { icon: Award,     label: 'Programme',         value: result.program },
                        { icon: Calendar,  label: 'Issue Date',        value: result.issueDate },
                        { icon: ShieldCheck, label: 'Cert. Number',    value: result.certNumber },
                        { icon: GraduationCap, label: 'Status',        value: result.status ?? 'Valid' },
                        { icon: Calendar,  label: 'Verified On',       value: new Date().toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-start gap-3 p-3 rounded-lg bg-slate-academy">
                          <Icon size={14} className="text-gold-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-gray-400 text-xs">{label}</p>
                            <p className="font-display font-700 text-navy-900 text-sm">{value ?? '—'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* QR */}
                  <div className="flex-shrink-0 hidden sm:block">
                    <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                      <QRCodeSVG
                        value={`${window.location.origin}/verify?cert=${result.certNumber}`}
                        size={80}
                      />
                    </div>
                    <p className="text-gray-400 text-[10px] text-center mt-1">Scan to verify</p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100">
                  <p className="text-gray-400 text-xs">
                    Issued by <strong>PrideLands Academy</strong>, Yaoundé, Cameroon ·{' '}
                    <a href="mailto:info@pridelandsacademy.com" className="text-navy-900 underline hover:text-gold-600">
                      info@pridelandsacademy.com
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {result === 'not_found' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card overflow-hidden"
            >
              <div className="bg-crimson-600 px-6 py-4 flex items-center gap-3">
                <ShieldX size={24} className="text-white flex-shrink-0" />
                <div>
                  <p className="font-display font-700 text-white text-sm">Certificate Not Found</p>
                  <p className="text-white/70 text-xs">We could not verify this certificate number.</p>
                </div>
              </div>
              <div className="p-6 text-center">
                <p className="text-gray-500 text-sm leading-relaxed mb-5">
                  The certificate number <strong className="text-navy-900 font-mono">{certNo}</strong> does not match any record in our system.
                  If you believe this is an error, contact the Registrar's Office directly.
                </p>
                <Link to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all">
                  Contact Registrar <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          )}

          {/* Instructions */}
          {!result && !loading && (
            <div className="card p-7 text-center">
              <Award size={40} className="text-gray-200 mx-auto mb-4" />
              <p className="font-display font-600 text-navy-900 text-sm mb-1">How to Verify</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Enter the certificate number printed on the document, or scan the QR code on the certificate using your phone camera.
              </p>
              <p className="text-gray-300 text-xs">Certificate numbers follow the format: <span className="font-mono text-navy-700">PLA-YEAR-XXXXXX</span></p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 mt-8 border-t border-gray-200">
        <Link to="/" className="text-gray-400 text-xs hover:text-navy-900 transition-colors">
          ← Back to PrideLands Academy Website
        </Link>
      </div>
    </div>
  )
}
