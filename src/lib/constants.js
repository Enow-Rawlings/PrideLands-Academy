
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
  whatsapp: '+237000000000',      // ← swap in real number (digits only)
whatsappMessage: 'Hello PrideLands Academy, I have a question about',
mapEmbedUrl: 'https://www.google.com/maps/embed?...',  // ← swap with real embed src

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
  { label: 'Home',         path: '/' },
  {
    label: 'About',
    path: '/about',
    children: [
      { label: 'About Us',       path: '/about' },
      { label: 'Leadership Team',path: '/leadership' },
    ],
  },
  {
    label: 'Programs',
    path: '/programs',
    children: [
      { label: 'All Programs',   path: '/programs' },
      { label: 'Admissions',     path: '/admissions' },
      { label: 'Apply Now',      path: '/apply' },
    ],
  },
  { label: 'Student Life', path: '/student-life' },
  { label: 'News',         path: '/news' },
  { label: 'Gallery',      path: '/gallery' },
  { label: 'Contact',      path: '/contact' },
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

// ─── FAQS — categorized (used on FAQ page and Admissions page) ────
// To add a question: add an object to the relevant category array.
export const FAQ_CATEGORIES = [
  'All',
  'Admissions',
  'Programmes',
  'Tuition & Finance',
  'Student Life',
  'Technical / Portal',
]

export const FAQS_BY_CATEGORY = {
  Admissions: [
    {
      question: 'What are the entry requirements for PrideLands Academy?',
      answer: 'Generally, applicants need a WAEC, GCE A-Level, or equivalent qualification. Specific programmes may have additional requirements. Please check the individual programme pages for details.',
    },
    {
      question: 'How do I apply for admission?',
      answer: 'Applications are submitted online through our Admissions portal. You will need to create an account, complete the application form, and upload required documents including your academic transcripts and a valid ID.',
    },
    {
      question: 'What is the academic calendar?',
      answer: 'PrideLands Academy runs two main semesters per academic year. The first semester typically begins in September and the second in February. Short-course intakes are also available in June. Check the Admissions page for exact dates.',
    },
    {
      question: 'How long does the admissions review take?',
      answer: 'Our admissions committee reviews completed applications within 5–7 working days. You will receive an email notification of the outcome. Incomplete applications may take longer.',
    },
    {
      question: 'Can I apply for more than one programme?',
      answer: 'Yes, you may apply for up to two programmes in the same intake cycle. Each programme requires a separate application. We recommend applying to your first choice first.',
    },
    {
      question: 'Is there an application fee?',
      answer: 'No. PrideLands Academy does not charge an application fee. Our online application is completely free to submit.',
    },
  ],
  Programmes: [
    {
      question: 'What programmes does PrideLands Academy offer?',
      answer: 'We offer Bachelor\'s Degrees, Diplomas, and short Certificate courses across Technology & AI, Business Strategy, Entrepreneurship, and Professional Development. Visit the Programmes page for the full list.',
    },
    {
      question: 'Do you offer online or hybrid programmes?',
      answer: 'Yes. Several of our professional diploma and certificate programmes are available in hybrid or fully online format. Full-degree programmes are primarily on-campus with hybrid options available.',
    },
    {
      question: 'What is the student-to-lecturer ratio?',
      answer: 'We maintain small cohorts to ensure personalised attention. Our average student-to-lecturer ratio is 20:1, allowing for meaningful interaction and mentorship.',
    },
    {
      question: 'Are certificates internationally recognised?',
      answer: 'PrideLands Academy certificates include a QR verification system and are recognised across Africa. We are actively pursuing international accreditations with bodies in Europe and North America.',
    },
    {
      question: 'Can I transfer credits from another institution?',
      answer: 'Credit transfers are evaluated on a case-by-case basis by our academic team. You will need to submit your previous institution\'s transcripts and course outlines during the application process.',
    },
  ],
  'Tuition & Finance': [
    {
      question: 'Are scholarships available?',
      answer: 'Yes. PrideLands Group offers merit-based and need-based scholarships for qualifying students. We also offer the PrideLands Legacy Grant for dependents of PrideLands Group employees and partners. Details are available on the Admissions page.',
    },
    {
      question: 'What payment methods are accepted for tuition?',
      answer: 'We accept payments via FapShi, bank transfer, and mobile money. You can view your balance, payment history, and make payments directly from your student portal.',
    },
    {
      question: 'Is a payment plan available?',
      answer: 'Yes. Students can split their semester tuition into two installments — one at the start of the semester and one at the midpoint. Contact the Finance Office to set up a plan.',
    },
    {
      question: 'What happens if I miss a tuition payment?',
      answer: 'A grace period of 14 days applies after each payment deadline. After that, access to course materials and the student portal may be temporarily restricted until payment is received. Contact the Finance Office immediately if you are facing difficulties.',
    },
    {
      question: 'Does tuition cover accommodation?',
      answer: 'No. Tuition fees cover academic instruction, access to facilities, and course materials only. Accommodation is arranged and priced separately. Contact Student Affairs for accommodation options.',
    },
  ],
  'Student Life': [
    {
      question: 'What student clubs and activities are available?',
      answer: 'PrideLands Academy hosts a growing number of student-led clubs including the Entrepreneurship Club, Tech Society, Debate Club, Cultural Arts Association, and Sports teams. New clubs can be proposed through Student Affairs.',
    },
    {
      question: 'Is accommodation available on campus?',
      answer: 'On-campus accommodation is currently being developed. In the meantime, Student Affairs maintains a list of verified off-campus housing options near the campus.',
    },
    {
      question: 'What career support do students receive?',
      answer: 'Our Career Services team provides CV reviews, interview coaching, employer networking events, and direct placement assistance. We also host an annual Career Fair with 60+ employers on campus.',
    },
    {
      question: 'Do you have an exchange programme?',
      answer: 'Yes. PrideLands Academy has signed MOUs with partner universities in East Africa and is in discussion with institutions in Europe. Exchange opportunities are available for second and third-year students.',
    },
  ],
  'Technical / Portal': [
    {
      question: 'How do I access the Student Portal?',
      answer: 'Once enrolled, you will receive your login credentials by email. Visit the Student Portal Login page at the top of the website and enter your student ID and password. Contact IT Support if you have login issues.',
    },
    {
      question: 'I forgot my portal password. What do I do?',
      answer: 'Click "Forgot Password" on the login page and enter your registered email. A password reset link will be sent to you. If you no longer have access to that email, contact IT Support directly.',
    },
    {
      question: 'How do I download my transcript or certificate?',
      answer: 'Completed transcripts and certificates are available from within your Student Portal under the Transcript and Certificates sections respectively. Certificates include a QR code for employer verification.',
    },
    {
      question: 'What browsers are supported by the Student Portal?',
      answer: 'The portal works best on Chrome, Firefox, Edge, and Safari (latest versions). We recommend keeping your browser updated for the best experience. Mobile support is fully available.',
    },
  ],
}

// Flat list (for Admissions page and other quick-use cases)
export const FAQS = Object.values(FAQS_BY_CATEGORY).flat()

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

