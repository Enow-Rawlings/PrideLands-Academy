// FILE: src/firebase/config.js
// ─────────────────────────────────────────────────────────────────
// Firebase project configuration.
// Replace all values below with your real Firebase project credentials.
//
// HOW TO GET THESE VALUES:
//   1. Go to https://console.firebase.google.com
//   2. Create a project (or open existing)
//   3. Project Settings → Your apps → Add app (Web)
//   4. Copy the firebaseConfig object and paste the values below
//   5. In .env file at project root, set each VITE_ variable
//
// NEVER commit real credentials to git. Use .env (already in .gitignore)
// ─────────────────────────────────────────────────────────────────

import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth }                          from 'firebase/auth'
import { getFirestore }                     from 'firebase/firestore'
import { getStorage }                       from 'firebase/storage'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

// Prevent re-initialization on hot reload
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db   = getFirestore(app)
export const storage = getStorage(app)

export default app