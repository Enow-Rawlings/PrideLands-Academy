// FILE: src/shared/components/guards/AuthGuard.jsx
// ─────────────────────────────────────────────────────────────────
// Wrap any route that requires authentication.
// If not logged in → redirect to /login
// If loading → show spinner
//
// Usage in App.jsx:
//   <Route element={<AuthGuard />}>
//     <Route path="/student/dashboard" element={<Dashboard />} />
//   </Route>
// ─────────────────────────────────────────────────────────────────

import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuthStore from '@/shared/store/authStore'

// ─── Full-screen spinner ────────────────────────────────────────
function AuthLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-academy gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-navy-900 border-t-gold-500 animate-spin" />
      <p className="font-display font-600 text-navy-900 text-sm tracking-wide">
        Authenticating...
      </p>
    </div>
  )
}

// ─── AuthGuard — requires any authenticated user ────────────────
export function AuthGuard() {
  const { user, loading } = useAuthStore()
  const location          = useLocation()

  if (loading) return <AuthLoader />

  if (!user) {
    // Save the page they tried to visit so we can redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

// ─── RoleGuard — requires specific role(s) 
// allowedRoles: string[] — e.g. ['admin', 'super_admin']
export function RoleGuard({ allowedRoles }) {
  const { user, profile, loading } = useAuthStore()
  const location                   = useLocation()

  if (loading) return <AuthLoader />

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!allowedRoles.includes(profile?.role)) {
    // Logged in but wrong role → send to their own dashboard
    const redirects = {
      student:     '/student/dashboard',
      lecturer:    '/lecturer/dashboard',
      admin:       '/admin/dashboard',
      super_admin: '/admin/dashboard',
    }
    const fallback = redirects[profile?.role] ?? '/'
    return <Navigate to={fallback} replace />
  }

  return <Outlet />
}

export default AuthGuard