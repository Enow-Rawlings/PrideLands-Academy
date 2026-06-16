// FILE: src/portals/public/pages/Home.jsx
import React from 'react'
import HeroSection from '../components/HeroSection'
import WhyUsSection from '../components/WhyUsSection'
import ProgramsSection from '../components/ProgramsSection'
import AdmissionJourneySection from '../components/AdmissionJourneySection'
import TestimonialsSection from '../components/TestimonialsSection'
import NewsSection from '../components/NewsSection'
import { PartnersBar, CTASection } from '../components/CtaSection'

export default function Home() {
  return (
    <>
      <HeroSection />
      <WhyUsSection />
      <ProgramsSection />
      <AdmissionJourneySection />
      <TestimonialsSection />
      <NewsSection />
      <PartnersBar />
      <CTASection />
    </>
  )
}
