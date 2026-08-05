
// Global authentication state using Zustand.
// Every portal (student, lecturer, admin) reads from this store.


import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useAuthStore = create(
  devtools(
    (set, get) => ({
      user:        null,   // Firebase Auth user object
      profile:     null,   // Firestore user profile { uid, role, name, email, ... }
      loading:     true,   // true while checking auth on app load
      error:       null,   // login error message

      isAuthenticated: () => !!get().user,
      role:            () => get().profile?.role ?? null,
      isAdmin:         () => ['admin', 'super_admin'].includes(get().profile?.role),
      isLecturer:      () => get().profile?.role === 'lecturer',
      isStudent:       () => get().profile?.role === 'student',
      isSuperAdmin:    () => get().profile?.role === 'super_admin',

      //  Actions 
      setUser: (user) => set({ user }, false, 'setUser'),

      setProfile: (profile) => set({ profile }, false, 'setProfile'),

      setLoading: (loading) => set({ loading }, false, 'setLoading'),

      setError: (error) => set({ error }, false, 'setError'),

      // Called on successful login
      setAuth: (user, profile) =>
        set({ user, profile, loading: false, error: null }, false, 'setAuth'),

      // Called on logout or auth state change to null
      clearAuth: () =>
        set(
          { user: null, profile: null, loading: false, error: null },
          false,
          'clearAuth'
        ),

      // Update profile fields locally (after profile edit, no refetch needed)
      patchProfile: (data) =>
        set(
          (state) => ({ profile: { ...state.profile, ...data } }),
          false,
          'patchProfile'
        ),
    }),
    { name: 'AuthStore' }
  )
)

export default useAuthStore