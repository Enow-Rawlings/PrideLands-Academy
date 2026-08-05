// FILE: src/portals/student/pages/Profile.jsx

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import {
  User, Mail, Edit3, Save, X, AlertCircle, Lock, Camera
} from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '@/shared/store/authStore'
import { updateUser } from '@/firebase/firestore'
import { changePassword } from '@/firebase/auth'

const profileSchema = z.object({
  firstName:   z.string().min(2, 'Required'),
  lastName:    z.string().min(2, 'Required'),
  phone:       z.string().min(8, 'Enter a valid phone number'),
  nationality: z.string().min(2, 'Required'),
  country:     z.string().min(2, 'Required'),
  address:     z.string().optional(),
  dob:         z.string().optional(),
  bio:         z.string().max(300, 'Max 300 characters').optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Required'),
  newPassword:     z.string().min(8, 'Min. 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match', path: ['confirmPassword'],
})

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

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="card p-6">
      <h3 className="font-display font-700 text-navy-900 text-sm flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
        <Icon size={15} className="text-gold-600" /> {title}
      </h3>
      {children}
    </div>
  )
}

export default function Profile() {
  const { profile, patchProfile } = useAuthStore()
  const [editing, setEditing]    = useState(false)
  const [saving,  setSaving]     = useState(false)
  const [pwSaving,setPwSaving]   = useState(false)

  const initials = `${profile?.firstName?.[0] ?? ''}${profile?.lastName?.[0] ?? ''}`.toUpperCase()

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: profile ?? {},
  })

  useEffect(() => { if (profile) reset(profile) }, [profile, reset])

  const onSaveProfile = async (data) => {
    setSaving(true)
    try {
      await updateUser(profile.uid, data)
      patchProfile(data)
      setEditing(false)
      toast.success('Profile updated successfully.')
    } catch {
      toast.error('Update failed. Try again.')
    } finally { setSaving(false) }
  }

  const {
    register: pwReg, handleSubmit: handlePw,
    formState: { errors: pwErrors }, reset: resetPw,
  } = useForm({ resolver: zodResolver(passwordSchema) })

  const onChangePassword = async (data) => {
    setPwSaving(true)
    try {
      await changePassword(data.currentPassword, data.newPassword)
      resetPw()
      toast.success('Password changed successfully.')
    } catch (err) {
      toast.error(
        err.code === 'auth/wrong-password'
          ? 'Current password is incorrect.'
          : 'Failed to change password.'
      )
    } finally { setPwSaving(false) }
  }

  return (
    <div className="portal-page max-w-4xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-800 text-navy-900 text-xl">My Profile</h2>
          <p className="text-gray-400 text-sm mt-0.5">Manage your personal information and security</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-navy-900 text-white font-display font-600 text-sm rounded-academy hover:bg-navy-800 transition-all">
            <Edit3 size={14} /> Edit Profile
          </button>
        ) : (
          <button onClick={() => { setEditing(false); reset(profile) }}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-navy-700 font-display font-600 text-sm rounded-academy hover:border-navy-900 transition-all">
            <X size={14} /> Cancel
          </button>
        )}
      </div>

      {/* Avatar card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="card p-6 mb-5 flex flex-col sm:flex-row items-center gap-5">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-navy-900 flex items-center justify-center font-display font-800 text-gold-400 text-2xl">
            {initials}
          </div>
          {editing && (
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gold-500 flex items-center justify-center shadow-sm hover:bg-gold-400 transition-colors">
              <Camera size={13} className="text-navy-900" />
            </button>
          )}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-display font-800 text-navy-900 text-lg">{profile?.firstName} {profile?.lastName}</h3>
          <p className="text-gray-500 text-sm">{profile?.email}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
            {profile?.studentId && <span className="badge-navy text-xs">ID: {profile.studentId}</span>}
            {profile?.program   && <span className="badge-gold text-xs">{profile.program}</span>}
            <span className="badge badge-green text-xs">{profile?.status ?? 'Active'}</span>
          </div>
        </div>
      </motion.div>

      {/* Personal info */}
      <form onSubmit={handleSubmit(onSaveProfile)}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <SectionCard title="Personal Information" icon={User}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'firstName',   label: 'First Name' },
                { name: 'lastName',    label: 'Last Name' },
                { name: 'phone',       label: 'Phone Number' },
                { name: 'dob',         label: 'Date of Birth', type: 'date' },
                { name: 'nationality', label: 'Nationality' },
                { name: 'country',     label: 'Country of Residence' },
              ].map(({ name, label, type = 'text' }) => (
                <Field key={name} label={label} error={errors[name]}>
                  <input {...register(name)} type={type} disabled={!editing}
                    className="input disabled:bg-slate-academy disabled:text-gray-500 disabled:cursor-not-allowed" />
                </Field>
              ))}
              <div className="sm:col-span-2">
                <Field label="Home Address" error={errors.address}>
                  <input {...register('address')} disabled={!editing}
                    className="input disabled:bg-slate-academy disabled:text-gray-500 disabled:cursor-not-allowed" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Short Bio (optional)" error={errors.bio}>
                  <textarea {...register('bio')} rows={3} disabled={!editing}
                    className="input resize-none disabled:bg-slate-academy disabled:text-gray-500 disabled:cursor-not-allowed"
                    placeholder="A short introduction about yourself..." />
                </Field>
              </div>
            </div>
            {editing && (
              <div className="flex justify-end mt-5 pt-4 border-t border-gray-100">
                <button type="submit" disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all disabled:opacity-60">
                  {saving
                    ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    : <><Save size={14} /> Save Changes</>}
                </button>
              </div>
            )}
          </SectionCard>
        </motion.div>
      </form>

      {/* Academic info — read only */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-5">
        <SectionCard title="Academic Information" icon={Mail}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Student ID',           value: profile?.studentId },
              { label: 'Email Address',         value: profile?.email },
              { label: 'Programme',             value: profile?.program },
              { label: 'Level / Year',          value: profile?.level },
              { label: 'Enrolment Year',        value: profile?.enrollmentYear },
              { label: 'Expected Graduation',   value: profile?.expectedGraduation },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-lg bg-slate-academy">
                <p className="text-gray-400 text-xs mb-0.5">{label}</p>
                <p className="font-display font-600 text-navy-900 text-sm">{value ?? '—'}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-xs mt-4 flex items-center gap-1.5">
            <AlertCircle size={11} /> To update academic information, contact the Registrar's Office.
          </p>
        </SectionCard>
      </motion.div>

      {/* Change password */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-5">
        <SectionCard title="Change Password" icon={Lock}>
          <form onSubmit={handlePw(onChangePassword)} className="space-y-4 max-w-md">
            <Field label="Current Password" error={pwErrors.currentPassword}>
              <input {...pwReg('currentPassword')} type="password" className="input" placeholder="Enter current password" />
            </Field>
            <Field label="New Password" error={pwErrors.newPassword}>
              <input {...pwReg('newPassword')} type="password" className="input" placeholder="Min. 8 characters" />
            </Field>
            <Field label="Confirm New Password" error={pwErrors.confirmPassword}>
              <input {...pwReg('confirmPassword')} type="password" className="input" placeholder="Repeat new password" />
            </Field>
            <button type="submit" disabled={pwSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-navy-900 text-white font-display font-700 text-sm rounded-academy hover:bg-navy-800 transition-all disabled:opacity-60">
              {pwSaving
                ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                : <><Lock size={14} /> Update Password</>}
            </button>
          </form>
        </SectionCard>
      </motion.div>
    </div>
  )
}