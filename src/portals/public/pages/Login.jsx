import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, GraduationCap, AlertCircle, ArrowRight, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { signIn, resetPassword, getDefaultPath } from '@/firebase/auth'
import useAuthStore from '@/shared/store/authStore'
import { IMAGES, COLORS } from '@/lib/theme'

// ─── Schemas ───────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const resetSchema = z.object({
  email: z.string().email('Enter a valid email address'),
})

// ─── Field wrapper ──────────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-crimson-600 text-xs mt-1.5">
          <AlertCircle size={12} /> {error.message}
        </p>
      )}
    </div>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, profile, loading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  // Redirect destination after login (supports ?from= or state.from)
  const from = location.state?.from?.pathname
    ?? new URLSearchParams(location.search).get('from')
    ?? null

  // If already logged in, redirect immediately
  useEffect(() => {
    if (!loading && user && profile) {
      const dest = from ?? getDefaultPath(profile.role)
      navigate(dest, { replace: true })
    }
  }, [user, profile, loading, navigate, from])

  // ── Login form ─────────────────────────────────────────────────
  const {
    register: loginRegister,
    handleSubmit: handleLogin,
    formState: { errors: loginErrors },
    setError: setLoginError,
  } = useForm({ resolver: zodResolver(loginSchema) })

  // ── Reset form ─────────────────────────────────────────────────
  const {
    register: resetRegister,
    handleSubmit: handleReset,
    formState: { errors: resetErrors },
  } = useForm({ resolver: zodResolver(resetSchema) })

  // ── Handle login submit ────────────────────────────────────────
  const onLogin = async ({ email, password }) => {
    setSubmitting(true)
    try {
      const { profile: p } = await signIn(email, password)
      toast.success(`Welcome back, ${p.firstName || p.name || 'there'}!`)
      const dest = from ?? getDefaultPath(p.role)
      navigate(dest, { replace: true })
    } catch (err) {
      const msg = firebaseErrorMsg(err.code)
      setLoginError('root', { message: msg })
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Handle password reset submit ──────────────────────────────
  const onReset = async ({ email }) => {
    setSubmitting(true)
    try {
      await resetPassword(email)
      setResetSent(true)
      toast.success('Password reset email sent!')
    } catch (err) {
      toast.error('Could not send reset email. Check the address and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* ── Left panel — branding ─────────────────────────────── */}
      <div className="hidden lg:flex relative overflow-hidden">
        <img
          src={IMAGES.campus1}
          alt="PrideLands Academy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy-900/80" />
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `radial-gradient(circle at 30% 70%, ${COLORS.secondary} 0%, transparent 60%)` }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2.5 w-fit">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center">
              <GraduationCap size={22} className="text-gold-400" />
            </div>
            <div className="leading-tight">
              <span className="block font-display font-800 text-white text-sm tracking-wide">Pridelands</span>
              <span className="block font-display font-600 text-gold-400 text-xs tracking-wider">Academy</span>
            </div>
          </Link>

          <div>
            <blockquote
              className="text-white/90 font-display font-700 leading-snug mb-4"
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}
            >
              "Building Wealth.<br />Shaping Futures."
            </blockquote>
            <p className="text-white/50 text-sm">— PrideLands Academy, Raising African Excellence</p>
          </div>

          <div className="flex gap-8">
            {[
              { value: '500+', label: 'Students' },
              { value: '95%', label: 'Employment Rate' },
              { value: '15+', label: 'Countries' },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display font-800 text-white text-xl">{s.value}</p>
                <p className="text-white/50 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ────────────────────────────────── */}
      <div className="flex items-center justify-center px-6 py-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-navy-900 flex items-center justify-center">
              <GraduationCap size={18} className="text-gold-500" />
            </div>
            <div className="leading-tight">
              <span className="block font-display font-800 text-navy-900 text-sm">Pridelands</span>
              <span className="block font-display font-600 text-gold-500 text-xs">Academy</span>
            </div>
          </Link>

          {!resetMode ? (
            <>
              <h1 className="font-display font-800 text-navy-900 text-2xl mb-1">Sign in to your portal</h1>
              <p className="text-gray-500 text-sm mb-8">Enter your credentials to access your dashboard.</p>

              {loginErrors.root && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-academy bg-crimson-600/8 border border-crimson-600/20 mb-5"
                >
                  <AlertCircle size={16} className="text-crimson-600 flex-shrink-0" />
                  <p className="text-crimson-600 text-sm">{loginErrors.root.message}</p>
                </motion.div>
              )}

              <form onSubmit={handleLogin(onLogin)} className="space-y-5">
                <Field label="Email Address" error={loginErrors.email}>
                  <input
                    {...loginRegister('email')}
                    type="email"
                    className="input"
                    placeholder="you@pridelandsacademy.com"
                    autoComplete="email"
                    autoFocus
                  />
                </Field>

                <Field label="Password" error={loginErrors.password}>
                  <div className="relative">
                    <input
                      {...loginRegister('password')}
                      type={showPassword ? 'text' : 'password'}
                      className="input pr-11"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy-900 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </Field>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                    <input type="checkbox" className="accent-gold-500" />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() => setResetMode(true)}
                    className="text-navy-900 font-display font-600 hover:text-gold-600 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <>
                      Sign In <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-gray-400 text-xs mt-8">
                Not a student yet?{' '}
                <Link to="/apply" className="text-navy-900 font-display font-600 hover:text-gold-600 transition-colors">
                  Apply for Admission
                </Link>
              </p>
              <p className="text-center mt-3">
                <Link to="/" className="text-gray-400 text-xs hover:text-navy-900 transition-colors">
                  ← Back to Website
                </Link>
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setResetMode(false)
                  setResetSent(false)
                }}
                className="flex items-center gap-1.5 text-gray-400 text-sm font-display font-600 hover:text-navy-900 transition-colors mb-8"
              >
                ← Back to Sign In
              </button>

              {!resetSent ? (
                <>
                  <h1 className="font-display font-800 text-navy-900 text-2xl mb-1">Reset your password</h1>
                  <p className="text-gray-500 text-sm mb-8">Enter your registered email address. We'll send you a password reset link.</p>

                  <form onSubmit={handleReset(onReset)} className="space-y-5">
                    <Field label="Email Address" error={resetErrors.email}>
                      <input
                        {...resetRegister('email')}
                        type="email"
                        className="input"
                        placeholder="you@pridelandsacademy.com"
                        autoFocus
                      />
                    </Field>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all active:scale-95 disabled:opacity-60"
                    >
                      {submitting ? (
                        <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : (
                        <>
                          <Mail size={15} /> Send Reset Link
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-gold-500/15 flex items-center justify-center mx-auto mb-5">
                    <Mail size={28} className="text-gold-500" />
                  </div>
                  <h2 className="font-display font-800 text-navy-900 text-xl mb-2">Check your inbox</h2>
                  <p className="text-gray-500 text-sm leading-relaxed">A password reset link has been sent to your email address. Check your spam folder if you don't see it.</p>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

// ─── Firebase error code → readable message ─────────────────────
function firebaseErrorMsg(code) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password. Please try again.'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a moment and try again.'
    case 'auth/user-disabled':
      return 'This account has been suspended. Contact administration.'
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.'
    default:
      return 'Sign in failed. Please try again or contact support.'
  }
}
