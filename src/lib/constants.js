
//Brand Identity
export const BRAND = {
  name: 'PrideLands Academy',
  parent: 'PrideLands Group',
  tagline: 'Raising African Excellence',
  taglineAlt: 'Building Wealth. Shaping Futures.',
  description:
    'A Pan-African institution of learning committed to transforming ambitious Africans into world-class professionals through quality education, innovation, and leadership development.',
  email: 'info@pridelandsacademy.com',
  admissionsEmail: 'admissions@pridelandsacademy.com',
  phone: '+237 672 900 000',
  address: 'Buea, Cameroon',
  website: 'https://pridelandsacademy.com',
  social: {
    facebook:  'https://facebook.com/pridelandsacademy',
    instagram: 'https://instagram.com/pridelandsacademy',
    twitter:   'https://twitter.com/pridelandsacademy',
    linkedin:  'https://linkedin.com/company/pridelandsacademy',
    youtube:   'https://youtube.com/@pridelandsacademy',
  },
};

//Brand Colors
export const COLORS = {
  navy:    '#0A1628',
  navyMid: '#1e3570',
  gold:    '#C9A84C',
  crimson: '#B91C1C',
  white:   '#FFFFFF',
  slate:   '#F8F9FB',
};

// Public Navigation
export const PUBLIC_NAV = [
  { label: 'Home',        path: '/' },
  { label: 'About Us',    path: '/about' },
  { label: 'Programs',    path: '/programs' },
  { label: 'Admissions',  path: '/admissions' },
  { label: 'Student Life',path: '/student-life' },
  { label: 'News',        path: '/news' },
  { label: 'Gallery',     path: '/gallery' },
  { label: 'Contact',     path: '/contact' },
];

//Programs 
export const PROGRAMS = [
  {
    id: 'bba',
    title: 'Business Administration',
    level: 'Bachelor\'s Degree',
    duration: '3 Years',
    icon: '💼',
    category: 'Business',
    description:
      'Build the strategic thinking and management skills to lead organisations in Africa and beyond.',
    requirements: ['WAEC/GCE A-Level or equivalent', 'English proficiency', 'Math at O-Level'],
    careers: ['Business Manager', 'Entrepreneur', 'Consultant', 'Operations Lead'],
    featured: true,
  },
  {
    id: 'bict',
    title: 'Information & Communication Technology',
    level: 'Bachelor\'s Degree',
    duration: '3 Years',
    icon: '💻',
    category: 'Technology',
    description:
      'Master software development, networking, and digital systems to drive Africa\'s tech revolution.',
    requirements: ['WAEC/GCE A-Level or equivalent', 'Strong math background', 'English proficiency'],
    careers: ['Software Developer', 'IT Manager', 'Systems Analyst', 'Network Engineer'],
    featured: true,
  },
  {
    id: 'bed',
    title: 'Education & Teaching',
    level: 'Bachelor\'s Degree',
    duration: '3 Years',
    icon: '📚',
    category: 'Education',
    description:
      'Develop passionate, skilled educators who will shape the next generation of African leaders.',
    requirements: ['WAEC/GCE A-Level or equivalent', 'English proficiency'],
    careers: ['Teacher', 'School Administrator', 'Curriculum Developer', 'Education Consultant'],
    featured: false,
  },
  {
    id: 'bfin',
    title: 'Finance & Accounting',
    level: 'Bachelor\'s Degree',
    duration: '3 Years',
    icon: '📊',
    category: 'Business',
    description:
      'Gain deep expertise in financial management, accounting, and investment to build African wealth.',
    requirements: ['WAEC/GCE A-Level or equivalent', 'Strong math background'],
    careers: ['Accountant', 'Financial Analyst', 'Auditor', 'Investment Banker'],
    featured: true,
  },
  {
    id: 'bpubh',
    title: 'Public Health',
    level: 'Bachelor\'s Degree',
    duration: '3 Years',
    icon: '🏥',
    category: 'Health',
    description:
      'Address Africa\'s pressing health challenges through research, policy, and community engagement.',
    requirements: ['WAEC/GCE A-Level or equivalent', 'Biology at O-Level'],
    careers: ['Public Health Officer', 'Health Policy Analyst', 'Community Health Worker'],
    featured: false,
  },
  {
    id: 'dipm',
    title: 'Diploma in Project Management',
    level: 'Diploma',
    duration: '1 Year',
    icon: '🎯',
    category: 'Professional',
    description:
      'A fast-track professional programme for executing high-impact projects across any industry.',
    requirements: ['HND or equivalent work experience', 'English proficiency'],
    careers: ['Project Manager', 'PMO Analyst', 'Programme Coordinator'],
    featured: true,
  },
];

//Stats 
export const STATS = [
  { value: 500,  suffix: '+', label: 'Students Enrolled',   icon: 'Users' },
  { value: 12,   suffix: '+', label: 'Academic Programs',   icon: 'BookOpen' },
  { value: 95,   suffix: '%', label: 'Graduate Employment', icon: 'TrendingUp' },
  { value: 15,   suffix: '+', label: 'African Countries',   icon: 'Globe' },
];

//Values 
export const VALUES = [
  {
    icon: 'Star',
    title: 'Excellence',
    description: 'We hold every student, faculty member, and programme to the highest standard of quality.',
  },
  {
    icon: 'Heart',
    title: 'African Identity',
    description: 'We are proudly Pan-African, rooting our education in the context and ambition of the continent.',
  },
  {
    icon: 'Lightbulb',
    title: 'Innovation',
    description: 'We encourage bold thinking, entrepreneurship, and solutions that transform African realities.',
  },
  {
    icon: 'Shield',
    title: 'Integrity',
    description: 'We build character alongside competence — graduates the world can trust.',
  },
  {
    icon: 'Globe',
    title: 'Global Vision',
    description: 'We prepare Africans to compete and lead on a global stage without losing their roots.',
  },
  {
    icon: 'Users',
    title: 'Community',
    description: 'We foster a culture of belonging, mentorship, and collective growth among our students.',
  },
];

// Admission Steps 
export const ADMISSION_STEPS = [
  {
    step: 1,
    title: 'Complete Online Application',
    description: 'Fill in your personal details, choose your programme, and submit your application form online.',
  },
  {
    step: 2,
    title: 'Upload Required Documents',
    description: 'Submit academic certificates, national ID, passport photo, and any supporting documents.',
  },
  {
    step: 3,
    title: 'Application Review',
    description: 'Our admissions team reviews your application within 5–7 working days and contacts you.',
  },
  {
    step: 4,
    title: 'Receive Admission Letter',
    description: 'Successful applicants receive an official offer letter via email and post.',
  },
  {
    step: 5,
    title: 'Pay Tuition & Enroll',
    description: 'Complete your first tuition payment and attend orientation to officially begin your journey.',
  },
];

//FAQ 
export const FAQS = [
  {
    question: 'What are the entry requirements for PrideLands Academy?',
    answer:
      'Generally, applicants need a WAEC, GCE A-Level, or equivalent qualification. Specific programmes may have additional requirements. Please check the individual programme pages for details.',
  },
  {
    question: 'How do I apply for admission?',
    answer:
      'Applications are submitted online through our Admissions portal. You will need to create an account, complete the application form, and upload required documents.',
  },
  {
    question: 'What is the academic calendar?',
    answer:
      'PrideLands Academy runs two semesters per academic year. The first semester typically begins in September and the second in February. Check the Admissions page for specific dates.',
  },
  {
    question: 'Are scholarships available?',
    answer:
      'Yes. PrideLands Group offers merit-based and need-based scholarships for qualifying students. Details are available during the admissions process.',
  },
  {
    question: 'What payment methods are accepted for tuition?',
    answer:
      'We accept payments via FapShi, bank transfer, and mobile money. You can manage all payments from your student portal.',
  },
  {
    question: 'Are certificates internationally recognised?',
    answer:
      'PrideLands Academy certificates include a QR verification system and are recognised across Africa. We are actively pursuing international accreditations.',
  },
  {
    question: 'Do you offer online or hybrid programmes?',
    answer:
      'Yes, several of our professional diploma programmes are available in hybrid format. Full online options are being developed and will be announced soon.',
  },
  {
    question: 'What is the student-to-lecturer ratio?',
    answer:
      'We maintain small cohorts to ensure personalised attention. Our average student-to-lecturer ratio is 20:1.',
  },
];

// Testimonials 
export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Enow Rawlings',
    program: 'Software Engineering, Class of 2026',
    country: 'Cameroon',
    quote:
      'PrideLands Academy gave me more than a degree. It gave me a vision of what Africa can become and the tools to contribute to it. My career took off the moment I graduated.',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'Mbi Vahid',
    program: 'ICT, Class of 2023',
    country: 'Cameroon',
    quote:
      'The practical, hands-on approach here is unmatched. I built my first real product during my second year and had a job offer before graduation.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'Emmanuella Enow',
    program: 'Finance & Accounting, Class of 2024',
    country: 'Cameroon',
    quote:
      'The faculty genuinely cares about your success. The mentorship I received here opened doors I did not even know existed. This is a school that invests in your future.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 4,
    name: 'Alfred Besong Egbe',
    program: 'Project Management Diploma, Class of 2024',
    country: 'Cameroon',
    quote:
      'As someone already working professionally, the diploma programme fit perfectly into my schedule. The quality of instruction matched any institution I had encountered.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
];


export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN:       'admin',
  LECTURER:    'lecturer',
  STUDENT:     'student',
};


export const ROUTES = {
  // Public
  HOME:          '/',
  ABOUT:         '/about',
  LEADERSHIP:    '/leadership',
  PROGRAMS:      '/programs',
  PROGRAM:       '/programs/:id',
  ADMISSIONS:    '/admissions',
  APPLY:         '/apply',
  STUDENT_LIFE:  '/student-life',
  NEWS:          '/news',
  GALLERY:       '/gallery',
  FAQ:           '/faq',
  CONTACT:       '/contact',
  VERIFY:        '/verify',

  // Auth
  LOGIN:         '/login',
  FORGOT_PW:     '/forgot-password',

  // Student
  STUDENT_DASH:         '/student/dashboard',
  STUDENT_PROFILE:      '/student/profile',
  STUDENT_COURSES:      '/student/courses',
  STUDENT_MATERIALS:    '/student/materials',
  STUDENT_ASSIGNMENTS:  '/student/assignments',
  STUDENT_RESULTS:      '/student/results',
  STUDENT_TRANSCRIPT:   '/student/transcript',
  STUDENT_PAYMENTS:     '/student/payments',
  STUDENT_CERTS:        '/student/certificates',
  STUDENT_TIMETABLE:    '/student/timetable',
  STUDENT_ANNOUNCEMENTS:'/student/announcements',
  STUDENT_SUPPORT:      '/student/support',
  STUDENT_SETTINGS:     '/student/settings',

  // Lecturer
  LECTURER_DASH:        '/lecturer/dashboard',
  LECTURER_COURSES:     '/lecturer/courses',
  LECTURER_STUDENTS:    '/lecturer/students',
  LECTURER_ATTENDANCE:  '/lecturer/attendance',
  LECTURER_ASSESSMENTS: '/lecturer/assessments',
  LECTURER_RESULTS:     '/lecturer/results',
  LECTURER_MATERIALS:   '/lecturer/materials',
  LECTURER_ASSIGNMENTS: '/lecturer/assignments',
  LECTURER_PROFILE:     '/lecturer/profile',

  // Admin
  ADMIN_DASH:       '/admin/dashboard',
  ADMIN_STUDENTS:   '/admin/students',
  ADMIN_LECTURERS:  '/admin/lecturers',
  ADMIN_PROGRAMS:   '/admin/programs',
  ADMIN_COURSES:    '/admin/courses',
  ADMIN_ADMISSIONS: '/admin/admissions',
  ADMIN_RESULTS:    '/admin/results',
  ADMIN_FINANCE:    '/admin/finance',
  ADMIN_CERTS:      '/admin/certificates',
  ADMIN_CONTENT:    '/admin/content',
  ADMIN_REPORTS:    '/admin/reports',
  ADMIN_ROLES:      '/admin/roles',
  ADMIN_SETTINGS:   '/admin/settings',
};


export const UNSPLASH = {
  hero:      'african-students-university',
  about:     'africa-education',
  campus:    'modern-campus-africa',
  programs:  'university-classroom',
  library:   'library-books-students',
  graduation:'graduation-africa',
};
