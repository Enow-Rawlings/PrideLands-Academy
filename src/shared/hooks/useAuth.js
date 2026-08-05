

// It listens to Firebase Auth state changes and keeps the
// Zustand store in sync automatically.

import { useEffect } from 'react'
import { subscribeToAuthState, getUserProfile, updateLastLogin } from '@/firebase/auth'
import useAuthStore from '@/shared/store/authStore'

export default function useAuth() {
  const { setAuth, clearAuth, setLoading } = useAuthStore()

  useEffect(() => {
    setLoading(true)

    const unsubscribe = subscribeToAuthState(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid)
          setAuth(firebaseUser, profile)
          // Fire-and-forget last login update
          updateLastLogin(firebaseUser.uid).catch(() => {})
        } catch (err) {
          // Profile missing — treat as logged out
          console.error('useAuth: profile fetch failed', err)
          clearAuth()
        }
      } else {
        clearAuth()
      }
    })

    // Cleanup on unmount
    return () => unsubscribe()
  }, [setAuth, clearAuth, setLoading])
}