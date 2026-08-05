import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useAuth from '@/shared/hooks/useAuth'
import { AuthGuard, RoleGuard } from '@/shared/components/guards/AuthGuard'

// ── Public layout + pages ──────────────────────────────────────
import PublicLayout from '@/portals/public/components/PublicLayout'
const Home = lazy(() => import('@/portals/public/pages/Home'))
const About = lazy(() => import('@/portals/public/pages/About'))
const Leadership = lazy(() => import('@/portals/public/pages/Leadership'))
const Programs = lazy(() => import('@/portals/public/pages/Programs'))
const ProgramDetail = lazy(() => import('@/portals/public/pages/ProgramDetail'))
const Admissions = lazy(() => import('@/portals/public/pages/Admissions'))
const Apply = lazy(() => import('@/portals/public/pages/Apply'))
const StudentLife = lazy(() => import('@/portals/public/pages/StudentLife'))
const News = lazy(() => import('@/portals/public/pages/News'))
const Gallery = lazy(() => import('@/portals/public/pages/Gallery'))
const FAQ = lazy(() => import('@/portals/public/pages/FAQ'))
const Contact = lazy(() => import('@/portals/public/pages/Contact'))
const Verify = lazy(() => import('@/portals/public/pages/Verify'))
const Login = lazy(() => import('@/portals/public/pages/Login'))

// ── Student portal ─────────────────────────────────────────────
const StudentLayout = lazy(() => import('@/portals/student/components/StudentLayout'))
const StudentDashboard = lazy(() => import('@/portals/student/pages/Dashboard'))
const StudentProfile = lazy(() => import('@/portals/student/pages/Profile'))
const StudentCourses = lazy(() => import('@/portals/student/pages/Courses'))
const StudentMaterials = lazy(() => import('@/portals/student/pages/Materials'))
const StudentAssignments = lazy(() => import('@/portals/student/pages/Assignments'))
const StudentResults = lazy(() => import('@/portals/student/pages/Results'))
const StudentTranscript = lazy(() => import('@/portals/student/pages/Transcript'))
const StudentPayments = lazy(() => import('@/portals/student/pages/Payments'))
const StudentCerts = lazy(() => import('@/portals/student/pages/Certificates'))
const StudentTimetable = lazy(() => import('@/portals/student/pages/Timetable'))
const StudentAnnouncements = lazy(() => import('@/portals/student/pages/Announcements'))
const StudentSupport = lazy(() => import('@/portals/student/pages/Support'))
const StudentSettings = lazy(() => import('@/portals/student/pages/Settings'))

// ── Lecturer portal ────────────────────────────────────────────
const LecturerLayout = lazy(() => import('@/portals/lecturer/components/LecturerLayout'))
const LecturerDashboard = lazy(() => import('@/portals/lecturer/pages/Dashboard'))
const LecturerCourses = lazy(() => import('@/portals/lecturer/pages/Courses'))
const LecturerStudents = lazy(() => import('@/portals/lecturer/pages/Students'))
const LecturerAttendance = lazy(() => import('@/portals/lecturer/pages/Attendance'))
const LecturerAssessments = lazy(() => import('@/portals/lecturer/pages/Assessments'))
const LecturerResults = lazy(() => import('@/portals/lecturer/pages/ResultsEntry'))
const LecturerMaterials = lazy(() => import('@/portals/lecturer/pages/Materials'))
const LecturerAssignments = lazy(() => import('@/portals/lecturer/pages/Assignments'))
const LecturerProfile = lazy(() => import('@/portals/lecturer/pages/Profile'))

// ── Admin portal ───────────────────────────────────────────────
const AdminLayout = lazy(() => import('@/portals/admin/components/AdminLayout'))
const AdminDashboard = lazy(() => import('@/portals/admin/pages/Dashboard'))
const AdminStudents = lazy(() => import('@/portals/admin/pages/Students'))
const AdminLecturers = lazy(() => import('@/portals/admin/pages/Lecturers'))
const AdminPrograms = lazy(() => import('@/portals/admin/pages/Programs'))
const AdminCourses = lazy(() => import('@/portals/admin/pages/Courses'))
const AdminAdmissions = lazy(() => import('@/portals/admin/pages/Admissions'))
const AdminResults = lazy(() => import('@/portals/admin/pages/Results'))
const AdminFinance = lazy(() => import('@/portals/admin/pages/Finance'))
const AdminCerts = lazy(() => import('@/portals/admin/pages/Certificates'))
const AdminContent = lazy(() => import('@/portals/admin/pages/Content'))
const AdminReports = lazy(() => import('@/portals/admin/pages/Reports'))
const AdminRoles = lazy(() => import('@/portals/admin/pages/Roles'))
const AdminSettings = lazy(() => import('@/portals/admin/pages/Settings'))

// ─── Page loader ───────────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-navy-900 border-t-gold-500 animate-spin" />
      <p className="font-display font-600 text-navy-900 text-sm tracking-wide">Loading...</p>
    </div>
  </div>
)

// ─── Root component — mounts auth listener ──────────────────────
function AppRoutes() {
  useAuth()

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Public Website ──────────────────────────────────── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:id" element={<ProgramDetail />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/student-life" element={<StudentLife />} />
          <Route path="/news" element={<News />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/verify" element={<Verify />} />
        </Route>

        {/* ── Auth ────────────────────────────────────────────── */}
        <Route path="/login" element={<Login />} />

        {/* ── Student Portal ──────────────────────────────────── */}
        <Route element={<AuthGuard />}>
          <Route element={<RoleGuard allowedRoles={['student']} />}>
            <Route element={<StudentLayout />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/profile" element={<StudentProfile />} />
              <Route path="/student/courses" element={<StudentCourses />} />
              <Route path="/student/materials" element={<StudentMaterials />} />
              <Route path="/student/assignments" element={<StudentAssignments />} />
              <Route path="/student/results" element={<StudentResults />} />
              <Route path="/student/transcript" element={<StudentTranscript />} />
              <Route path="/student/payments" element={<StudentPayments />} />
              <Route path="/student/certificates" element={<StudentCerts />} />
              <Route path="/student/timetable" element={<StudentTimetable />} />
              <Route path="/student/announcements" element={<StudentAnnouncements />} />
              <Route path="/student/support" element={<StudentSupport />} />
              <Route path="/student/settings" element={<StudentSettings />} />
            </Route>
          </Route>
        </Route>

        {/* ── Lecturer Portal ─────────────────────────────────── */}
        <Route element={<AuthGuard />}>
          <Route element={<RoleGuard allowedRoles={['lecturer']} />}>
            <Route element={<LecturerLayout />}>
              <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
              <Route path="/lecturer/courses" element={<LecturerCourses />} />
              <Route path="/lecturer/students" element={<LecturerStudents />} />
              <Route path="/lecturer/attendance" element={<LecturerAttendance />} />
              <Route path="/lecturer/assessments" element={<LecturerAssessments />} />
              <Route path="/lecturer/results" element={<LecturerResults />} />
              <Route path="/lecturer/materials" element={<LecturerMaterials />} />
              <Route path="/lecturer/assignments" element={<LecturerAssignments />} />
              <Route path="/lecturer/profile" element={<LecturerProfile />} />
            </Route>
          </Route>
        </Route>

        {/* ── Admin Portal ────────────────────────────────────── */}
        <Route element={<AuthGuard />}>
          <Route element={<RoleGuard allowedRoles={['admin', 'super_admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<AdminStudents />} />
              <Route path="/admin/lecturers" element={<AdminLecturers />} />
              <Route path="/admin/programs" element={<AdminPrograms />} />
              <Route path="/admin/courses" element={<AdminCourses />} />
              <Route path="/admin/admissions" element={<AdminAdmissions />} />
              <Route path="/admin/results" element={<AdminResults />} />
              <Route path="/admin/finance" element={<AdminFinance />} />
              <Route path="/admin/certificates" element={<AdminCerts />} />
              <Route path="/admin/content" element={<AdminContent />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/roles" element={<AdminRoles />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Route>

        {/* ── Fallback ────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' },
          success: { iconTheme: { primary: '#C9A84C', secondary: '#fff' } },
          error: { iconTheme: { primary: '#B91C1C', secondary: '#fff' } },
        }}
      />
      <AppRoutes />
    </BrowserRouter>
  )
}
