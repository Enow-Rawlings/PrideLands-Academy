
import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  ArrowRight, ArrowLeft, CheckCircle, User, GraduationCap,
  FileText, Send, Upload, AlertCircle, PartyPopper
} from 'lucide-react'
import { PROGRAMS_DATA } from '@/lib/programsData'

// Validation Schemas (one per step) 
const step1Schema = z.object({
  programId: z.string().min(1, 'Please select a programme'),
  intake: z.string().min(1, 'Please select an intake'),
})

const step2Schema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName:  z.string().min(2, 'Last name is required'),
  email:     z.string().email('Enter a valid email address'),
  phone:     z.string().min(8, 'Enter a valid phone number'),
  dob:       z.string().min(1, 'Date of birth is required'),
  gender:    z.string().min(1, 'Please select a gender'),
  nationality: z.string().min(2, 'Nationality is required'),
  country:   z.string().min(2, 'Country of residence is required'),
})

const step3Schema = z.object({
  lastSchool:    z.string().min(2, 'School/institution name is required'),
  qualification: z.string().min(1, 'Please select your highest qualification'),
  graduationYear: z.string().min(4, 'Enter a valid year'),
  gpa:           z.string().optional(),
})

const step4Schema = z.object({
  transcriptUploaded: z.boolean().refine((v) => v === true, 'Please confirm document is ready'),
  idUploaded:         z.boolean().refine((v) => v === true, 'Please confirm document is ready'),
  photoUploaded:      z.boolean().refine((v) => v === true, 'Please confirm document is ready'),
  statementOfPurpose: z.string().min(30, 'Please write at least a few sentences (min 30 characters)'),
})

const STEPS = [
  { id: 1, title: 'Programme',     icon: GraduationCap },
  { id: 2, title: 'Personal Info', icon: User },
  { id: 3, title: 'Education',     icon: FileText },
  { id: 4, title: 'Documents',     icon: Upload },
  { id: 5, title: 'Review',        icon: Send },
]

const INTAKES = ['September 2026', 'February 2027', 'June 2027 (Short Courses Only)']
const QUALIFICATIONS = ['WAEC / GCE A-Level', 'High School Diploma', 'HND', "Bachelor's Degree", 'Other']
const GENDERS = ['Female', 'Male', 'Prefer not to say']

//  Step Indicator 
function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-between mb-10 overflow-x-auto pb-2">
      {STEPS.map((step, i) => {
        const Icon = step.icon
        const isDone = current > step.id
        const isActive = current === step.id
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center flex-shrink-0 min-w-[70px]">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                isDone ? 'bg-gold-500 text-navy-900' : isActive ? 'bg-navy-900 text-gold-400 ring-4 ring-navy-900/10' : 'bg-gray-100 text-gray-400'
              }`}>
                {isDone ? <CheckCircle size={18} /> : <Icon size={17} />}
              </div>
              <span className={`text-xs font-display font-600 text-center ${isActive ? 'text-navy-900' : isDone ? 'text-gold-600' : 'text-gray-400'}`}>
                {step.title}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 transition-colors duration-300 ${current > step.id ? 'bg-gold-500' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

//  Field wrapper 
function Field({ label, error, children, required = true }) {
  return (
    <div>
      <label className="label">{label}{required && <span className="text-crimson-600 ml-0.5">*</span>}</label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-crimson-600 text-xs mt-1.5">
          <AlertCircle size={12} /> {error.message}
        </p>
      )}
    </div>
  )
}

//  Document checkbox row 
function DocCheckbox({ label, hint, checked, onChange, error }) {
  return (
    <div>
      <label className={`flex items-start gap-3 p-4 rounded-academy border cursor-pointer transition-all duration-200 ${
        checked ? 'border-gold-500 bg-gold-500/5' : 'border-gray-200 hover:border-gray-300'
      }`}>
        <input type="checkbox" checked={checked} onChange={onChange} className="mt-0.5 w-4 h-4 accent-gold-500" />
        <div className="flex-1">
          <p className="font-display font-600 text-navy-900 text-sm">{label}</p>
          <p className="text-gray-400 text-xs mt-0.5">{hint}</p>
        </div>
        {checked && <CheckCircle size={18} className="text-gold-500 flex-shrink-0" />}
      </label>
      {error && (
        <p className="flex items-center gap-1.5 text-crimson-600 text-xs mt-1.5 ml-1">
          <AlertCircle size={12} /> {error.message}
        </p>
      )}
    </div>
  )
}

// 
//  MAIN PAGE
// 
export default function Apply() {
  const [searchParams] = useSearchParams()
  const preselectedProgram = searchParams.get('program') || ''

  const [currentStep, setCurrentStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [appId, setAppId] = useState('')

  const [formData, setFormData] = useState({
    programId: preselectedProgram,
    intake: '',
    firstName: '', lastName: '', email: '', phone: '', dob: '', gender: '', nationality: '', country: '',
    lastSchool: '', qualification: '', graduationYear: '', gpa: '',
    transcriptUploaded: false, idUploaded: false, photoUploaded: false, statementOfPurpose: '',
  })

  const schemas = { 1: step1Schema, 2: step2Schema, 3: step3Schema, 4: step4Schema }

  const {
    register, handleSubmit, formState: { errors }, watch, setValue,
  } = useForm({
    resolver: zodResolver(schemas[currentStep] || z.object({})),
    defaultValues: formData,
    mode: 'onChange',
  })

  const watched = watch()

  const goNext = async (data) => {
    const updated = { ...formData, ...data }
    setFormData(updated)
    if (currentStep < 5) {
      setCurrentStep((s) => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goBack = () => {
    setCurrentStep((s) => Math.max(1, s - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFinalSubmit = () => {
    // we Generate a mock application ID — we replace with real Firebase doc ID on integration
    const id = 'PLA-' + Date.now().toString().slice(-8)
    setAppId(id)
    setSubmitted(true)
    toast.success('Application submitted successfully!')
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Senior man, here we will replace with real Firebase Firestore write:
    // await addDoc(collection(db, 'applications'), { ...formData, status: 'pending', createdAt: serverTimestamp() })
  }

  const selectedProgram = PROGRAMS_DATA.find((p) => p.id === formData.programId)

  //  SUCCESS SCREEN 
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-academy px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-lg w-full text-center card p-10"
        >
          <div className="w-20 h-20 rounded-full bg-gold-500/15 flex items-center justify-center mx-auto mb-6">
            <PartyPopper size={36} className="text-gold-500" />
          </div>
          <h1 className="font-display font-800 text-navy-900 text-2xl mb-3">Application Submitted!</h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Thank you, <strong>{formData.firstName}</strong>. Your application for{' '}
            <strong>{selectedProgram?.title || 'your selected programme'}</strong> has been received.
            Our admissions team will review it within 5–7 working days.
          </p>
          <div className="bg-slate-academy rounded-academy p-4 mb-8">
            <p className="text-gray-400 text-xs mb-1">Your Application Reference</p>
            <p className="font-display font-800 text-navy-900 text-lg tracking-wider">{appId}</p>
          </div>
          <p className="text-gray-400 text-xs mb-6">
            A confirmation email has been sent to <strong>{formData.email}</strong>. Save your reference number for tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/" className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-navy-900 text-white font-display font-600 text-sm rounded-academy hover:bg-navy-800 transition-all">
              Back to Home
            </Link>
            <Link to="/programs" className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-navy-900 font-display font-600 text-sm rounded-academy hover:border-navy-900 transition-all">
              Explore More Programs
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  //  WIZARD 
  return (
    <div className="min-h-screen bg-slate-academy">

      {/* Header strip */}
      <div className="bg-navy-900 py-10">
        <div className="container-academy px-4 md:px-8">
          <p className="text-white/50 text-xs mb-3">
            <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Apply</span>
          </p>
          <h1 className="font-display font-800 text-white text-2xl md:text-3xl">Online Application</h1>
          <p className="text-navy-300 text-sm mt-1">Complete all 5 steps to submit your application.</p>
        </div>
      </div>

      <div className="container-academy px-4 md:px-8 py-12">
        <div className="max-w-3xl mx-auto">

          <StepIndicator current={currentStep} />

          <div className="card p-6 md:p-10">
            <AnimatePresence mode="wait">

              {/* ── STEP 1: PROGRAMME SELECTION ── */}
              {currentStep === 1 && (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSubmit(goNext)}
                  className="space-y-6"
                >
                  <h2 className="font-display font-700 text-navy-900 text-xl mb-1">Choose Your Programme</h2>
                  <p className="text-gray-500 text-sm mb-6">Select the programme and intake you wish to apply for.</p>

                  <Field label="Programme" error={errors.programId}>
                    <select {...register('programId')} className="input" defaultValue={formData.programId}>
                      <option value="">Select a programme...</option>
                      {PROGRAMS_DATA.filter((p) => !p.comingSoon).map((p) => (
                        <option key={p.id} value={p.id}>{p.title} — {p.type}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Preferred Intake" error={errors.intake}>
                    <select {...register('intake')} className="input" defaultValue={formData.intake}>
                      <option value="">Select an intake...</option>
                      {INTAKES.map((intake) => <option key={intake} value={intake}>{intake}</option>)}
                    </select>
                  </Field>

                  <div className="flex justify-end pt-4">
                    <button type="submit" className="inline-flex items-center gap-2 px-7 py-3.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all active:scale-95">
                      Continue <ArrowRight size={15} />
                    </button>
                  </div>
                </motion.form>
              )}

              {/* ── STEP 2: PERSONAL INFO ── */}
              {currentStep === 2 && (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSubmit(goNext)}
                  className="space-y-5"
                >
                  <h2 className="font-display font-700 text-navy-900 text-xl mb-1">Personal Information</h2>
                  <p className="text-gray-500 text-sm mb-6">Tell us a bit about yourself.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="First Name" error={errors.firstName}>
                      <input {...register('firstName')} className="input" placeholder="e.g. Amara" defaultValue={formData.firstName} />
                    </Field>
                    <Field label="Last Name" error={errors.lastName}>
                      <input {...register('lastName')} className="input" placeholder="e.g. Diallo" defaultValue={formData.lastName} />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Email Address" error={errors.email}>
                      <input {...register('email')} type="email" className="input" placeholder="you@example.com" defaultValue={formData.email} />
                    </Field>
                    <Field label="Phone Number" error={errors.phone}>
                      <input {...register('phone')} className="input" placeholder="+237 6XX XXX XXX" defaultValue={formData.phone} />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Date of Birth" error={errors.dob}>
                      <input {...register('dob')} type="date" className="input" defaultValue={formData.dob} />
                    </Field>
                    <Field label="Gender" error={errors.gender}>
                      <select {...register('gender')} className="input" defaultValue={formData.gender}>
                        <option value="">Select...</option>
                        {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Nationality" error={errors.nationality}>
                      <input {...register('nationality')} className="input" placeholder="e.g. Senegalese" defaultValue={formData.nationality} />
                    </Field>
                    <Field label="Country of Residence" error={errors.country}>
                      <input {...register('country')} className="input" placeholder="e.g. Senegal" defaultValue={formData.country} />
                    </Field>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button type="button" onClick={goBack} className="inline-flex items-center gap-2 px-6 py-3.5 border border-gray-200 text-navy-700 font-display font-600 text-sm rounded-academy hover:border-navy-900 hover:text-navy-900 transition-all">
                      <ArrowLeft size={15} /> Back
                    </button>
                    <button type="submit" className="inline-flex items-center gap-2 px-7 py-3.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all active:scale-95">
                      Continue <ArrowRight size={15} />
                    </button>
                  </div>
                </motion.form>
              )}

              {/* ── STEP 3: EDUCATION ── */}
              {currentStep === 3 && (
                <motion.form
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSubmit(goNext)}
                  className="space-y-5"
                >
                  <h2 className="font-display font-700 text-navy-900 text-xl mb-1">Educational Background</h2>
                  <p className="text-gray-500 text-sm mb-6">Tell us about your most recent academic qualification.</p>

                  <Field label="Last School / Institution Attended" error={errors.lastSchool}>
                    <input {...register('lastSchool')} className="input" placeholder="e.g. Lycée Bilingue de Yaoundé" defaultValue={formData.lastSchool} />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Highest Qualification" error={errors.qualification}>
                      <select {...register('qualification')} className="input" defaultValue={formData.qualification}>
                        <option value="">Select...</option>
                        {QUALIFICATIONS.map((q) => <option key={q} value={q}>{q}</option>)}
                      </select>
                    </Field>
                    <Field label="Year of Graduation" error={errors.graduationYear}>
                      <input {...register('graduationYear')} className="input" placeholder="e.g. 2024" defaultValue={formData.graduationYear} />
                    </Field>
                  </div>

                  <Field label="GPA / Average Grade (optional)" error={errors.gpa} required={false}>
                    <input {...register('gpa')} className="input" placeholder="e.g. 14/20 or 3.6/4.0" defaultValue={formData.gpa} />
                  </Field>

                  <div className="flex justify-between pt-4">
                    <button type="button" onClick={goBack} className="inline-flex items-center gap-2 px-6 py-3.5 border border-gray-200 text-navy-700 font-display font-600 text-sm rounded-academy hover:border-navy-900 hover:text-navy-900 transition-all">
                      <ArrowLeft size={15} /> Back
                    </button>
                    <button type="submit" className="inline-flex items-center gap-2 px-7 py-3.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all active:scale-95">
                      Continue <ArrowRight size={15} />
                    </button>
                  </div>
                </motion.form>
              )}

              {/* ── STEP 4: DOCUMENTS ── */}
              {currentStep === 4 && (
                <motion.form
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSubmit(goNext)}
                  className="space-y-5"
                >
                  <h2 className="font-display font-700 text-navy-900 text-xl mb-1">Documents & Statement</h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Document upload will be enabled once Cloudinary is connected. For now, confirm you have these ready.
                  </p>

                  <DocCheckbox
                    label="Academic Transcript / Certificate"
                    hint="WAEC, GCE A-Level, or equivalent — PDF or image"
                    checked={watched.transcriptUploaded}
                    onChange={(e) => setValue('transcriptUploaded', e.target.checked, { shouldValidate: true })}
                    error={errors.transcriptUploaded}
                  />
                  <DocCheckbox
                    label="National ID / Passport"
                    hint="Valid government-issued identification"
                    checked={watched.idUploaded}
                    onChange={(e) => setValue('idUploaded', e.target.checked, { shouldValidate: true })}
                    error={errors.idUploaded}
                  />
                  <DocCheckbox
                    label="Passport-Sized Photograph"
                    hint="Recent photo, white or plain background"
                    checked={watched.photoUploaded}
                    onChange={(e) => setValue('photoUploaded', e.target.checked, { shouldValidate: true })}
                    error={errors.photoUploaded}
                  />

                  <Field label="Statement of Purpose" error={errors.statementOfPurpose}>
                    <textarea
                      {...register('statementOfPurpose')}
                      rows={5}
                      className="input resize-none"
                      placeholder="Tell us why you want to join this programme and what you hope to achieve..."
                      defaultValue={formData.statementOfPurpose}
                    />
                  </Field>

                  <div className="flex justify-between pt-4">
                    <button type="button" onClick={goBack} className="inline-flex items-center gap-2 px-6 py-3.5 border border-gray-200 text-navy-700 font-display font-600 text-sm rounded-academy hover:border-navy-900 hover:text-navy-900 transition-all">
                      <ArrowLeft size={15} /> Back
                    </button>
                    <button type="submit" className="inline-flex items-center gap-2 px-7 py-3.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all active:scale-95">
                      Continue <ArrowRight size={15} />
                    </button>
                  </div>
                </motion.form>
              )}

              {/* ── STEP 5: REVIEW & SUBMIT ── */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <h2 className="font-display font-700 text-navy-900 text-xl mb-1">Review Your Application</h2>
                  <p className="text-gray-500 text-sm mb-6">Please confirm all details are correct before submitting.</p>

                  <div className="space-y-4">
                    <div className="p-5 rounded-academy bg-slate-academy border border-gray-100">
                      <p className="font-display font-700 text-navy-900 text-sm mb-3 flex items-center gap-2">
                        <GraduationCap size={16} className="text-gold-600" /> Programme
                      </p>
                      <p className="text-gray-600 text-sm">{selectedProgram?.title || '—'}</p>
                      <p className="text-gray-400 text-xs mt-1">Intake: {formData.intake}</p>
                    </div>

                    <div className="p-5 rounded-academy bg-slate-academy border border-gray-100">
                      <p className="font-display font-700 text-navy-900 text-sm mb-3 flex items-center gap-2">
                        <User size={16} className="text-gold-600" /> Personal Information
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <p><span className="text-gray-400">Name:</span> {formData.firstName} {formData.lastName}</p>
                        <p><span className="text-gray-400">Email:</span> {formData.email}</p>
                        <p><span className="text-gray-400">Phone:</span> {formData.phone}</p>
                        <p><span className="text-gray-400">DOB:</span> {formData.dob}</p>
                        <p><span className="text-gray-400">Gender:</span> {formData.gender}</p>
                        <p><span className="text-gray-400">Nationality:</span> {formData.nationality}</p>
                      </div>
                    </div>

                    <div className="p-5 rounded-academy bg-slate-academy border border-gray-100">
                      <p className="font-display font-700 text-navy-900 text-sm mb-3 flex items-center gap-2">
                        <FileText size={16} className="text-gold-600" /> Education
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <p><span className="text-gray-400">School:</span> {formData.lastSchool}</p>
                        <p><span className="text-gray-400">Qualification:</span> {formData.qualification}</p>
                        <p><span className="text-gray-400">Year:</span> {formData.graduationYear}</p>
                        {formData.gpa && <p><span className="text-gray-400">GPA:</span> {formData.gpa}</p>}
                      </div>
                    </div>

                    <div className="p-5 rounded-academy bg-slate-academy border border-gray-100">
                      <p className="font-display font-700 text-navy-900 text-sm mb-3 flex items-center gap-2">
                        <Upload size={16} className="text-gold-600" /> Documents
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.transcriptUploaded && <span className="badge-green">Transcript ✓</span>}
                        {formData.idUploaded && <span className="badge-green">ID ✓</span>}
                        {formData.photoUploaded && <span className="badge-green">Photo ✓</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-academy bg-gold-500/10 border border-gold-500/30">
                    <AlertCircle size={18} className="text-gold-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-600 text-xs leading-relaxed">
                      By submitting, you confirm that all information provided is accurate. False information may result in disqualification from the admissions process.
                    </p>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button type="button" onClick={goBack} className="inline-flex items-center gap-2 px-6 py-3.5 border border-gray-200 text-navy-700 font-display font-600 text-sm rounded-academy hover:border-navy-900 hover:text-navy-900 transition-all">
                      <ArrowLeft size={15} /> Back
                    </button>
                    <button onClick={handleFinalSubmit} className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold-500 text-navy-900 font-display font-700 text-sm rounded-academy hover:bg-gold-400 hover:shadow-gold transition-all active:scale-95">
                      Submit Application <Send size={15} />
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          <p className="text-center text-gray-400 text-xs mt-6">
            Need help? <Link to="/contact" className="text-navy-900 underline hover:text-gold-600">Contact our admissions team</Link>
          </p>

        </div>
      </div>
    </div>
  )
}