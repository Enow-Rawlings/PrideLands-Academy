
// import {
//   collection, doc,
//   getDoc, getDocs, addDoc, setDoc, updateDoc, deleteDoc,
//   query, where, orderBy, limit, startAfter,
//   onSnapshot, serverTimestamp, writeBatch,
// } from 'firebase/firestore'
// import { db } from './config'

// // 
// //  GENERIC HELPERS

// // Get a single document
// export async function getDocument(collectionName, id) {
//   const snap = await getDoc(doc(db, collectionName, id))
//   return snap.exists() ? { id: snap.id, ...snap.data() } : null
// }

// // Get all documents in a collection (with optional constraints)
// export async function getDocuments(collectionName, constraints = []) {
//   const ref  = collection(db, collectionName)
//   const q    = constraints.length ? query(ref, ...constraints) : ref
//   const snap = await getDocs(q)
//   return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
// }

// // Create a document (auto-ID)
// export async function createDocument(collectionName, data) {
//   const ref = await addDoc(collection(db, collectionName), {
//     ...data,
//     createdAt: serverTimestamp(),
//     updatedAt: serverTimestamp(),
//   })
//   return ref.id
// }

// // Set a document (known ID, overwrites)
// export async function setDocument(collectionName, id, data) {
//   await setDoc(doc(db, collectionName, id), {
//     ...data,
//     updatedAt: serverTimestamp(),
//   })
// }

// // Update fields on an existing document
// export async function updateDocument(collectionName, id, data) {
//   await updateDoc(doc(db, collectionName, id), {
//     ...data,
//     updatedAt: serverTimestamp(),
//   })
// }

// // Delete a document
// export async function deleteDocument(collectionName, id) {
//   await deleteDoc(doc(db, collectionName, id))
// }

// // Real-time listener — returns unsubscribe function
// export function subscribeToDocument(collectionName, id, callback) {
//   return onSnapshot(doc(db, collectionName, id), (snap) => {
//     callback(snap.exists() ? { id: snap.id, ...snap.data() } : null)
//   })
// }

// export function subscribeToCollection(collectionName, constraints = [], callback) {
//   const ref = collection(db, collectionName)
//   const q   = constraints.length ? query(ref, ...constraints) : ref
//   return onSnapshot(q, (snap) => {
//     callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
//   })
// }

// // Batch write (atomic multi-doc updates)
// export async function batchWrite(operations) {
//   const batch = writeBatch(db)
//   operations.forEach(({ type, collectionName, id, data }) => {
//     const ref = doc(db, collectionName, id)
//     if (type === 'set')    batch.set(ref, { ...data, updatedAt: serverTimestamp() })
//     if (type === 'update') batch.update(ref, { ...data, updatedAt: serverTimestamp() })
//     if (type === 'delete') batch.delete(ref)
//   })
//   await batch.commit()
// }

// // ═══════════════════════════════════════════════════════════════
// //  DOMAIN-SPECIFIC HELPERS
// //  These wrap the generic helpers with collection names baked in,
// //  so portal pages just call e.g. getStudent(id) not getDocument('students', id)
// // ═══════════════════════════════════════════════════════════════

// // ── Users ───────────────────────────────────────────────────────
// export const getUser           = (id)       => getDocument('users', id)
// export const updateUser        = (id, data) => updateDocument('users', id, data)

// // ── Students ────────────────────────────────────────────────────
// export const getStudent        = (id)       => getDocument('students', id)
// export const getStudents       = (c=[])     => getDocuments('students', c)
// export const createStudent     = (data)     => createDocument('students', data)
// export const updateStudent     = (id, data) => updateDocument('students', id, data)

// // ── Lecturers ───────────────────────────────────────────────────
// export const getLecturer       = (id)       => getDocument('lecturers', id)
// export const getLecturers      = (c=[])     => getDocuments('lecturers', c)
// export const createLecturer    = (data)     => createDocument('lecturers', data)
// export const updateLecturer    = (id, data) => updateDocument('lecturers', id, data)

// // ── Programs ────────────────────────────────────────────────────
// export const getPrograms       = ()         => getDocuments('programs')
// export const getProgram        = (id)       => getDocument('programs', id)
// export const createProgram     = (data)     => createDocument('programs', data)
// export const updateProgram     = (id, data) => updateDocument('programs', id, data)

// // ── Courses ─────────────────────────────────────────────────────
// export const getCourses        = (c=[])     => getDocuments('courses', c)
// export const getCourse         = (id)       => getDocument('courses', id)
// export const createCourse      = (data)     => createDocument('courses', data)
// export const updateCourse      = (id, data) => updateDocument('courses', id, data)

// // ── Enrollments ─────────────────────────────────────────────────
// export const getEnrollments    = (c=[])     => getDocuments('enrollments', c)
// export const createEnrollment  = (data)     => createDocument('enrollments', data)

// // ── Assignments ─────────────────────────────────────────────────
// export const getAssignments    = (c=[])     => getDocuments('assignments', c)
// export const getAssignment     = (id)       => getDocument('assignments', id)
// export const createAssignment  = (data)     => createDocument('assignments', data)
// export const updateAssignment  = (id, data) => updateDocument('assignments', id, data)

// // ── Submissions ─────────────────────────────────────────────────
// export const getSubmissions    = (c=[])     => getDocuments('submissions', c)
// export const createSubmission  = (data)     => createDocument('submissions', data)
// export const updateSubmission  = (id, data) => updateDocument('submissions', id, data)

// // ── Results ─────────────────────────────────────────────────────
// export const getResults        = (c=[])     => getDocuments('results', c)
// export const createResult      = (data)     => createDocument('results', data)
// export const updateResult      = (id, data) => updateDocument('results', id, data)

// // ── Payments ────────────────────────────────────────────────────
// export const getPayments       = (c=[])     => getDocuments('payments', c)
// export const createPayment     = (data)     => createDocument('payments', data)
// export const updatePayment     = (id, data) => updateDocument('payments', id, data)

// // ── Certificates ────────────────────────────────────────────────
// export const getCertificates   = (c=[])     => getDocuments('certificates', c)
// export const getCertificate    = (id)       => getDocument('certificates', id)
// export const createCertificate = (data)     => createDocument('certificates', data)

// // ── Applications ────────────────────────────────────────────────
// export const getApplications   = (c=[])     => getDocuments('applications', c)
// export const getApplication    = (id)       => getDocument('applications', id)
// export const createApplication = (data)     => createDocument('applications', data)
// export const updateApplication = (id, data) => updateDocument('applications', id, data)

// // ── Announcements ───────────────────────────────────────────────
// export const getAnnouncements  = (c=[])     => getDocuments('announcements', c)
// export const createAnnouncement= (data)     => createDocument('announcements', data)

// // ── News / Content ──────────────────────────────────────────────
// export const getNewsItems      = (c=[])     => getDocuments('news', c)
// export const createNewsItem    = (data)     => createDocument('news', data)
// export const updateNewsItem    = (id, data) => updateDocument('news', id, data)
// export const deleteNewsItem    = (id)       => deleteDocument('news', id)

// // ── Tickets (support) ───────────────────────────────────────────
// export const getTickets        = (c=[])     => getDocuments('tickets', c)
// export const createTicket      = (data)     => createDocument('tickets', data)
// export const updateTicket      = (id, data) => updateDocument('tickets', id, data)

// // ── Timetable ───────────────────────────────────────────────────
// export const getTimetable      = (c=[])     => getDocuments('timetable', c)
// export const createTimetableSlot = (data)   => createDocument('timetable', data)

// // ── Re-export Firestore query helpers so callers don't need to
// //    import from firebase/firestore directly
// export { where, orderBy, limit, startAfter, serverTimestamp }

// FILE: src/firebase/firestore.js
// ─────────────────────────────────────────────────────────────────
// Reusable Firestore CRUD helpers.
// All portal pages import from here — never call Firestore directly
// from a component. This keeps data logic separate from UI.
// ─────────────────────────────────────────────────────────────────

// FILE: src/firebase/firestore.js
// ─────────────────────────────────────────────────────────────────
// Reusable Firestore CRUD helpers.
// All portal pages import from here — never call Firestore directly
// from a component. This keeps data logic separate from UI.
// ─────────────────────────────────────────────────────────────────

import {
  collection, doc,
  getDoc, getDocs, addDoc, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, startAfter,
  onSnapshot, serverTimestamp, writeBatch,
} from 'firebase/firestore'
import { db } from './config'

// ═══════════════════════════════════════════════════════════════
//  GENERIC HELPERS
// ═══════════════════════════════════════════════════════════════

// Get a single document
export async function getDocument(collectionName, id) {
  const snap = await getDoc(doc(db, collectionName, id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

// Get all documents in a collection (with optional constraints)
export async function getDocuments(collectionName, constraints = []) {
  const ref  = collection(db, collectionName)
  const q    = constraints.length ? query(ref, ...constraints) : ref
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

// Create a document (auto-ID)
export async function createDocument(collectionName, data) {
  const ref = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

// Set a document (known ID, overwrites)
export async function setDocument(collectionName, id, data) {
  await setDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

// Update fields on an existing document
export async function updateDocument(collectionName, id, data) {
  await updateDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

// Delete a document
export async function deleteDocument(collectionName, id) {
  await deleteDoc(doc(db, collectionName, id))
}

// Real-time listener — returns unsubscribe function
export function subscribeToDocument(collectionName, id, callback) {
  return onSnapshot(doc(db, collectionName, id), (snap) => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null)
  })
}

export function subscribeToCollection(collectionName, constraints = [], callback) {
  const ref = collection(db, collectionName)
  const q   = constraints.length ? query(ref, ...constraints) : ref
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

// Batch write (atomic multi-doc updates)
export async function batchWrite(operations) {
  const batch = writeBatch(db)
  operations.forEach(({ type, collectionName, id, data }) => {
    const ref = doc(db, collectionName, id)
    if (type === 'set')    batch.set(ref, { ...data, updatedAt: serverTimestamp() })
    if (type === 'update') batch.update(ref, { ...data, updatedAt: serverTimestamp() })
    if (type === 'delete') batch.delete(ref)
  })
  await batch.commit()
}

// ═══════════════════════════════════════════════════════════════
//  DOMAIN-SPECIFIC HELPERS
//  These wrap the generic helpers with collection names baked in,
//  so portal pages just call e.g. getStudent(id) not getDocument('students', id)
// ═══════════════════════════════════════════════════════════════

// ── Users ───────────────────────────────────────────────────────
export const getUser           = (id)       => getDocument('users', id)
export const updateUser        = (id, data) => updateDocument('users', id, data)

// ── Students ────────────────────────────────────────────────────
export const getStudent        = (id)       => getDocument('students', id)
export const getStudents       = (c=[])     => getDocuments('students', c)
export const createStudent     = (data)     => createDocument('students', data)
export const updateStudent     = (id, data) => updateDocument('students', id, data)

// ── Lecturers ───────────────────────────────────────────────────
export const getLecturer       = (id)       => getDocument('lecturers', id)
export const getLecturers      = (c=[])     => getDocuments('lecturers', c)
export const createLecturer    = (data)     => createDocument('lecturers', data)
export const updateLecturer    = (id, data) => updateDocument('lecturers', id, data)

// ── Programs ────────────────────────────────────────────────────
export const getPrograms       = ()         => getDocuments('programs')
export const getProgram        = (id)       => getDocument('programs', id)
export const createProgram     = (data)     => createDocument('programs', data)
export const updateProgram     = (id, data) => updateDocument('programs', id, data)
export const deleteProgram     = (id)       => deleteDocument('programs', id)

// ── Courses ─────────────────────────────────────────────────────
export const getCourses        = (c=[])     => getDocuments('courses', c)
export const getCourse         = (id)       => getDocument('courses', id)
export const createCourse      = (data)     => createDocument('courses', data)
export const updateCourse      = (id, data) => updateDocument('courses', id, data)
export const deleteCourse      = (id)       => deleteDocument('courses', id)

// ── Enrollments ─────────────────────────────────────────────────
export const getEnrollments    = (c=[])     => getDocuments('enrollments', c)
export const createEnrollment  = (data)     => createDocument('enrollments', data)

// ── Assignments ─────────────────────────────────────────────────
export const getAssignments    = (c=[])     => getDocuments('assignments', c)
export const getAssignment     = (id)       => getDocument('assignments', id)
export const createAssignment  = (data)     => createDocument('assignments', data)
export const updateAssignment  = (id, data) => updateDocument('assignments', id, data)

// ── Submissions ─────────────────────────────────────────────────
export const getSubmissions    = (c=[])     => getDocuments('submissions', c)
export const createSubmission  = (data)     => createDocument('submissions', data)
export const updateSubmission  = (id, data) => updateDocument('submissions', id, data)

// ── Results ─────────────────────────────────────────────────────
export const getResults        = (c=[])     => getDocuments('results', c)
export const createResult      = (data)     => createDocument('results', data)
export const updateResult      = (id, data) => updateDocument('results', id, data)
export const deleteResult      = (id)       => deleteDocument('results', id)

// ── Payments ────────────────────────────────────────────────────
export const getPayments       = (c=[])     => getDocuments('payments', c)
export const createPayment     = (data)     => createDocument('payments', data)
export const updatePayment     = (id, data) => updateDocument('payments', id, data)

// ── Certificates ────────────────────────────────────────────────
export const getCertificates   = (c=[])     => getDocuments('certificates', c)
export const getCertificate    = (id)       => getDocument('certificates', id)
export const createCertificate = (data)     => createDocument('certificates', data)

// ── Applications ────────────────────────────────────────────────
export const getApplications   = (c=[])     => getDocuments('applications', c)
export const getApplication    = (id)       => getDocument('applications', id)
export const createApplication = (data)     => createDocument('applications', data)
export const updateApplication = (id, data) => updateDocument('applications', id, data)

// ── Announcements ───────────────────────────────────────────────
export const getAnnouncements  = (c=[])     => getDocuments('announcements', c)
export const createAnnouncement= (data)     => createDocument('announcements', data)

// ── News / Content ──────────────────────────────────────────────
export const getNewsItems      = (c=[])     => getDocuments('news', c)
export const createNewsItem    = (data)     => createDocument('news', data)
export const updateNewsItem    = (id, data) => updateDocument('news', id, data)
export const deleteNewsItem    = (id)       => deleteDocument('news', id)

// ── Tickets (support) ───────────────────────────────────────────
export const getTickets        = (c=[])     => getDocuments('tickets', c)
export const createTicket      = (data)     => createDocument('tickets', data)
export const updateTicket      = (id, data) => updateDocument('tickets', id, data)

// ── Timetable ───────────────────────────────────────────────────
export const getTimetable      = (c=[])     => getDocuments('timetable', c)
export const createTimetableSlot = (data)   => createDocument('timetable', data)

// ── Re-export Firestore query helpers so callers don't need to
//    import from firebase/firestore directly
export { where, orderBy, limit, startAfter, serverTimestamp }