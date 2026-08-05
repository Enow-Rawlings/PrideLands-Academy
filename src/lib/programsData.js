
// import { IMAGES } from '@/lib/theme'

// export const TABS = [
//   'Technology & AI', 'Business Strategy', 'Entrepreneurship',
//   'Professional Development', 'Future Programs',
// ]

// export const PROGRAMS_DATA = [
//   {
//     id: 'ai', tab: 'Technology & AI', badge: 'Engineering', badgeColor: 'bg-blue-600',
//     title: 'BSc. Artificial Intelligence',
//     desc: 'Master the art of building intelligent systems, neural networks, machine learning, and ethical data governance.',
//     duration: '3 Years', type: 'Hons Degree', image: IMAGES.technology, path: '/programs/ai',
//     overview: 'This programme equips students with deep technical mastery in machine learning, neural networks, and AI ethics — preparing them to design intelligent systems that solve real African challenges, from agriculture to finance.',
//     modules: ['Foundations of Machine Learning', 'Neural Networks & Deep Learning', 'Natural Language Processing', 'Computer Vision', 'AI Ethics & Governance', 'Capstone: AI for Social Impact'],
//     careers: ['AI/ML Engineer', 'Data Scientist', 'Research Scientist', 'AI Product Manager'],
//     requirements: ['WAEC/GCE A-Level or equivalent', 'Strong Mathematics background', 'English proficiency'],
//     tuition: '850,000 FCFA / year', intake: 'September & February', mode: 'On-Campus / Hybrid',
//   },
//   // ... (full set of 14 programs — same shape — covering Data Science, Software
//   // Engineering, Business Administration, Finance, Marketing, Entrepreneurship,
//   // Social Enterprise, VC & Startup Finance, Project Management, HR, Executive
//   // Leadership, and 3 "Coming Soon 2026" programs: Medical Sciences, Law, Architecture)
// ]

// export function getProgramById(id) {
//   return PROGRAMS_DATA.find((p) => p.id === id)
// }


import { IMAGES } from '@/lib/theme'

export const TABS = [
  'Technology & AI', 'Business Strategy', 'Entrepreneurship',
  'Professional Development', 'Future Programs',
]

export const PROGRAMS_DATA = [
  {
    id: 'ai', tab: 'Technology & AI', badge: 'Engineering', badgeColor: 'bg-blue-600',
    title: 'BSc. Artificial Intelligence',
    desc: 'Master the art of building intelligent systems, neural networks, machine learning, and ethical data governance.',
    duration: '3 Years', type: 'Hons Degree', image: IMAGES.technology, path: '/programs/ai',
    overview: 'This programme equips students with deep technical mastery in machine learning, neural networks, and AI ethics — preparing them to design intelligent systems that solve real African challenges, from agriculture to finance.',
    modules: ['Foundations of Machine Learning', 'Neural Networks & Deep Learning', 'Natural Language Processing', 'Computer Vision', 'AI Ethics & Governance', 'Capstone: AI for Social Impact'],
    careers: ['AI/ML Engineer', 'Data Scientist', 'Research Scientist', 'AI Product Manager'],
    requirements: ['WAEC/GCE A-Level or equivalent', 'Strong Mathematics background', 'English proficiency'],
    tuition: '850,000 FCFA / year', intake: 'September & February', mode: 'On-Campus / Hybrid',
  },
  {
    id: 'data-science', tab: 'Technology & AI', badge: 'Engineering', badgeColor: 'bg-blue-600',
    title: 'BSc. Data Science',
    desc: 'Turn raw data into decisions — statistics, big data pipelines, and visualization for real-world impact.',
    duration: '3 Years', type: 'Hons Degree', image: IMAGES.technology, path: '/programs/data-science',
    overview: 'This programme builds strong statistical foundations alongside hands-on experience with big data tools, preparing graduates to extract insight from Africa\'s fastest-growing data sources — telecoms, agriculture, finance, and public health.',
    modules: ['Statistics for Data Science', 'Databases & Big Data Systems', 'Data Visualization', 'Predictive Analytics', 'Data Ethics & Privacy', 'Capstone: Data for Development'],
    careers: ['Data Analyst', 'Data Engineer', 'Business Intelligence Analyst', 'Data Scientist'],
    requirements: ['WAEC/GCE A-Level or equivalent', 'Strong Mathematics background', 'English proficiency'],
    tuition: '850,000 FCFA / year', intake: 'September & February', mode: 'On-Campus / Hybrid',
  },
  {
    id: 'software-engineering', tab: 'Technology & AI', badge: 'Engineering', badgeColor: 'bg-blue-600',
    title: 'BSc. Software Engineering',
    desc: 'Design, build, and ship production-grade software — from web and mobile apps to scalable systems.',
    duration: '3 Years', type: 'Hons Degree', image: IMAGES.engineering, path: '/programs/software-engineering',
    overview: 'This programme takes students from programming fundamentals to full-stack and systems-level engineering, with an emphasis on shipping real, deployable products rather than only theory.',
    modules: ['Programming Fundamentals', 'Data Structures & Algorithms', 'Web & Mobile Development', 'Software Architecture', 'Cybersecurity Fundamentals', 'Capstone: Industry Project'],
    careers: ['Software Engineer', 'Full-Stack Developer', 'Mobile Developer', 'DevOps Engineer'],
    requirements: ['WAEC/GCE A-Level or equivalent', 'Strong Mathematics background', 'English proficiency'],
    tuition: '850,000 FCFA / year', intake: 'September & February', mode: 'On-Campus / Hybrid',
  },
  {
    id: 'medical-sciences', tab: 'Future Programs', badge: 'Coming 2026', badgeColor: 'bg-gold-500',
    title: 'BSc. Medical Sciences',
    desc: 'A foundation programme for future health professionals, launching as part of our 2026 expansion.',
    duration: '4 Years', type: 'Hons Degree', image: IMAGES.health, path: '/programs/medical-sciences',
    overview: 'Launching alongside PrideLands Group\'s healthcare expansion, this programme will prepare students for further clinical training and health-sector careers across the continent.',
    modules: ['Human Anatomy & Physiology', 'Biochemistry', 'Public Health Fundamentals', 'Medical Ethics', 'Clinical Skills I', 'Capstone: Community Health Project'],
    careers: ['Pre-Clinical Track', 'Public Health Officer', 'Health Systems Researcher'],
    requirements: ['WAEC/GCE A-Level (Biology, Chemistry)', 'English proficiency'],
    tuition: 'To be announced', intake: 'Coming 2026', mode: 'On-Campus',
  },
  // TODO (Rawlings): add the remaining programs following the same shape —
  // Business Administration, Finance, Marketing, Entrepreneurship, Social
  // Enterprise, VC & Startup Finance, Project Management, HR, Executive
  // Leadership (all under 'Business Strategy' / 'Entrepreneurship' /
  // 'Professional Development'), plus 'Law' and 'Architecture' under
  // 'Future Programs'. Copy one of the objects above, change the id/tab/
  // title/desc/modules/careers/requirements, and push it into this array.
]

export function getProgramById(id) {
  return PROGRAMS_DATA.find((p) => p.id === id)
}