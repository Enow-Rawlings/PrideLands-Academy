import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Public layout + pages
import PublicLayout from '@/portals/public/components/PublicLayout'

const Home        = lazy(() => import('@/portals/public/pages/Home'))
const About       = lazy(() => import('@/portals/public/pages/About'))
const Leadership  = lazy(() => import('@/portals/public/pages/Leadership'))
const Programs    = lazy(() => import('@/portals/public/pages/Programs'))
const ProgramDetail = lazy(() => import('@/portals/public/pages/ProgramDetail'))
const Admissions  = lazy(() => import('@/portals/public/pages/Admissions'))
const Apply       = lazy(() => import('@/portals/public/pages/Apply'))
const StudentLife = lazy(() => import('@/portals/public/pages/StudentLife'))
const News        = lazy(() => import('@/portals/public/pages/News'))
const Gallery     = lazy(() => import('@/portals/public/pages/Gallery'))
const FAQ         = lazy(() => import('@/portals/public/pages/FAQ'))
const Contact     = lazy(() => import('@/portals/public/pages/Contact'))
const Verify      = lazy(() => import('@/portals/public/pages/Verify'))

// Auth
const Login       = lazy(() => import('@/portals/public/pages/Login'))

// Page loader
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-navy-900 border-t-gold-500 animate-spin" />
      <p className="font-display font-600 text-navy-900 text-sm tracking-wide">Loading...</p>
    </div>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' },
          success: { iconTheme: { primary: '#C9A84C', secondary: '#fff' } },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>

         
          <Route element={<PublicLayout />}>
            <Route path="/"               element={<Home />} />
            <Route path="/about"          element={<About />} />
            <Route path="/leadership"     element={<Leadership />} />
            <Route path="/programs"       element={<Programs />} />
            <Route path="/programs/:id"   element={<ProgramDetail />} />
            <Route path="/admissions"     element={<Admissions />} />
            <Route path="/apply"          element={<Apply />} />
            <Route path="/student-life"   element={<StudentLife />} />
            <Route path="/news"           element={<News />} />
            <Route path="/gallery"        element={<Gallery />} />
            <Route path="/faq"            element={<FAQ />} />
            <Route path="/contact"        element={<Contact />} />
            <Route path="/verify"         element={<Verify />} />
          </Route>

          <Route path="/login"            element={<Login />} />

          
          <Route path="/student/*"        element={<PageLoader />} />

          <Route path="/lecturer/*"       element={<PageLoader />} />

          <Route path="/admin/*"          element={<PageLoader />} />

          <Route path="*"                 element={<Navigate to="/" replace />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
