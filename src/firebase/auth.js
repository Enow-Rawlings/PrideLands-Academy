

import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './config'
import { ROLES } from '@/lib/constants'

//  Sign In 
// Returns { user, profile } on success, throws on failure
export async function signIn(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  const profile    = await getUserProfile(credential.user.uid)
  return { user: credential.user, profile }
}

//  Sign Out 
export async function logOut() {
  await signOut(auth)
}

//  Password Reset 
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email)
}

//  Change Password (requires recent login) 
export async function changePassword(currentPassword, newPassword) {
  const user       = auth.currentUser
  const credential = EmailAuthProvider.credential(user.email, currentPassword)
  await reauthenticateWithCredential(user, credential)
  await updatePassword(user, newPassword)
}

//  Get user profile from Firestore 
// Every authenticated user has a document in /users/{uid}
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) throw new Error('User profile not found.')
  return { uid, ...snap.data() }
}

//  Create user profile in Firestore 
// Called by Admin when creating a new student/lecturer account
export async function createUserProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

//  Update last login timestamp 
export async function updateLastLogin(uid) {
  await setDoc(
    doc(db, 'users', uid),
    { lastLoginAt: serverTimestamp() },
    { merge: true }
  )
}

//  Auth state observer 
// Pass a callback; returns an unsubscribe function
export function subscribeToAuthState(callback) {
  return onAuthStateChanged(auth, callback)
}

//  Role redirect map 
// Given a role, returns the default landing path after login
export function getDefaultPath(role) {
  switch (role) {
    case ROLES.SUPER_ADMIN:
    case ROLES.ADMIN:
      return '/admin/dashboard'
    case ROLES.LECTURER:
      return '/lecturer/dashboard'
    case ROLES.STUDENT:
      return '/student/dashboard'
    default:
      return '/'
  }
}