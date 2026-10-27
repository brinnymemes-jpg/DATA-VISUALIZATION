import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Relational Institutional In-Memory Database with Pre-seeded Records
interface Department {
  id: string;
  code: string;
  name: string;
  dean: string;
  facultyCount: number;
  studentCount: number;
  averageGpa: number;
  budgetAllocated: number; // in USD
  budgetSpent: number;
  researchGrants: number;
  passRate: number;
  satisfactionRate: number;
  description: string;
}

interface Course {
  id: string;
  code: string;
  title: string;
  departmentId: string;
  credits: number;
  instructor: string;
  semester: string;
  session: string;
  level: 'Undergraduate' | 'Postgraduate' | 'Doctoral';
  enrolled: number;
  capacity: number;
  passRate: number;
  averageGrade: string;
}

interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  departmentId: string;
  session: string;
  semester: string;
  level: 'Undergraduate' | 'Postgraduate' | 'Doctoral';
  gpa: number;
  creditsCompleted: number;
  status: 'Active' | 'Graduated' | 'Probation' | 'On Leave';
  enrollmentDate: string;
  advisor: string;
  avatar?: string;
}

interface Faculty {
  id: string;
  facultyId: string;
  name: string;
  email: string;
  departmentId: string;
  rank: 'Full Professor' | 'Associate Professor' | 'Assistant Professor' | 'Lecturer';
  specialization: string;
  coursesCount: number;
  rating: number; // out of 5.0
  publicationsCount: number;
  avatar?: string;
}

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'dean' | 'faculty' | 'student';
  departmentId?: string;
  status: 'Active' | 'Suspended';
  permissions: string[];
  avatar?: string;
  lastLogin?: string;
}

interface AudioLog {
  id: string;
  title: string;
  speaker: string;
  role: string;
  departmentId: string;
  meetingType: 'Senate Session' | 'Dean Board' | 'Faculty Council' | 'Public Lecture' | 'Academic Grievance';
  date: string;
  durationSec: number;
  summary: string;
  transcript: { time: string; speaker: string; text: string }[];
  tags: string[];
  audioSampleTone?: 'academic' | 'debate' | 'briefing';
}

// Initial Relational State
let departments: Department[] = [
  {
    id: 'dept-cs',
    code: 'CS',
    name: 'Computer Science & AI',
    dean: 'Dr. Eleanor Vance',
    facultyCount: 42,
    studentCount: 1420,
    averageGpa: 3.58,
    budgetAllocated: 6400000,
    budgetSpent: 5820000,
    researchGrants: 12500000,
    passRate: 93.4,
    satisfactionRate: 91.2,
    description: 'Specializing in generative intelligence, quantum computing, systems engineering, and cybersecurity architecture.'
  },
  {
    id: 'dept-eng',
    code: 'ENG',
    name: 'Electrical & Mechanical Engineering',
    dean: 'Prof. Marcus Holloway',
    facultyCount: 56,
    studentCount: 1850,
    averageGpa: 3.42,
    budgetAllocated: 8900000,
    budgetSpent: 8410000,
    researchGrants: 18200000,
    passRate: 88.7,
    satisfactionRate: 87.5,
    description: 'Robotics, aerospace composites, sustainable power grids, and advanced mechatronic fabrication.'
  },
  {
    id: 'dept-bio',
    code: 'BIO',
    name: 'Biomedical & Life Sciences',
    dean: 'Dr. Soraya Chen',
    facultyCount: 38,
    studentCount: 1120,
    averageGpa: 3.65,
    budgetAllocated: 7200000,
    budgetSpent: 6940000,
    researchGrants: 16400000,
    passRate: 94.8,
    satisfactionRate: 93.0,
    description: 'Genomic therapeutics, neural interfaces, cellular immunology, and bioinformatics algorithms.'
  },
  {
    id: 'dept-biz',
    code: 'BIZ',
    name: 'Business & Economic Analytics',
    dean: 'Prof. Jonathan Sterling',
    facultyCount: 34,
    studentCount: 1680,
    averageGpa: 3.39,
    budgetAllocated: 4800000,
    budgetSpent: 4210000,
    researchGrants: 5900000,
    passRate: 90.1,
    satisfactionRate: 89.4,
    description: 'Quantitative macro-finance, computational decision science, institutional leadership, and market modeling.'
  },
  {
    id: 'dept-law',
    code: 'LAW',
    name: 'School of Law & Governance',
    dean: 'Hon. Justice Patricia Ross',
    facultyCount: 28,
    studentCount: 780,
    averageGpa: 3.51,
    budgetAllocated: 3900000,
    budgetSpent: 3650000,
    researchGrants: 4100000,
    passRate: 92.5,
    satisfactionRate: 88.0,
    description: 'Constitutional law, algorithmic ethics regulation, intellectual property, and public policy formulation.'
  },
  {
    id: 'dept-hum',
    code: 'HUM',
    name: 'Humanities & Interactive Design',
    dean: 'Dr. Leila Aris',
    facultyCount: 30,
    studentCount: 890,
    averageGpa: 3.61,
    budgetAllocated: 3100000,
    budgetSpent: 2890000,
    researchGrants: 2800000,
    passRate: 95.1,
    satisfactionRate: 92.8,
    description: 'Philosophy of technology, spatial interaction design, computational linguistics, and digital heritage.'
  }
];

let courses: Course[] = [
  { id: 'crs-1', code: 'CS-301', title: 'Data Structures & Algorithmic Complexity', departmentId: 'dept-cs', credits: 4, instructor: 'Dr. Alan Turing-Ward', semester: 'First Semester', session: '2026-2027', level: 'Undergraduate', enrolled: 184, capacity: 200, passRate: 91.5, averageGrade: '3.62' },
  { id: 'crs-2', code: 'CS-402', title: 'Deep Learning & Neural Architectures', departmentId: 'dept-cs', credits: 4, instructor: 'Dr. Eleanor Vance', semester: 'First Semester', session: '2026-2027', level: 'Postgraduate', enrolled: 92, capacity: 95, passRate: 95.6, averageGrade: '3.78' },
  { id: 'crs-3', code: 'CS-204', title: 'Database Systems & Relational Theory', departmentId: 'dept-cs', credits: 3, instructor: 'Prof. David Codd', semester: 'Second Semester', session: '2026-2027', level: 'Undergraduate', enrolled: 210, capacity: 220, passRate: 89.2, averageGrade: '3.41' },
  { id: 'crs-4', code: 'ENG-210', title: 'Circuits, Signals & Embedded Systems', departmentId: 'dept-eng', credits: 4, instructor: 'Prof. Marcus Holloway', semester: 'First Semester', session: '2026-2027', level: 'Undergraduate', enrolled: 156, capacity: 160, passRate: 86.4, averageGrade: '3.32' },
  { id: 'crs-5', code: 'ENG-435', title: 'Autonomous Robotics & Mechatronics', departmentId: 'dept-eng', credits: 4, instructor: 'Dr. Keiko Tanaka', semester: 'First Semester', session: '2026-2027', level: 'Postgraduate', enrolled: 68, capacity: 70, passRate: 92.0, averageGrade: '3.59' },
  { id: 'crs-6', code: 'BIO-110', title: 'Molecular Genetics & CRISPR Engineering', departmentId: 'dept-bio', credits: 4, instructor: 'Dr. Soraya Chen', semester: 'First Semester', session: '2026-2027', level: 'Undergraduate', enrolled: 175, capacity: 180, passRate: 93.8, averageGrade: '3.68' },
  { id: 'crs-7', code: 'BIO-501', title: 'Computational Systems Biology', departmentId: 'dept-bio', credits: 3, instructor: 'Prof. Henrik Lind', semester: 'Second Semester', session: '2026-2027', level: 'Doctoral', enrolled: 32, capacity: 35, passRate: 97.0, averageGrade: '3.89' },
  { id: 'crs-8', code: 'BIZ-305', title: 'Econometrics & Predictive Analytics', departmentId: 'dept-biz', credits: 3, instructor: 'Prof. Jonathan Sterling', semester: 'First Semester', session: '2026-2027', level: 'Undergraduate', enrolled: 142, capacity: 150, passRate: 87.9, averageGrade: '3.35' },
  { id: 'crs-9', code: 'LAW-220', title: 'Constitutional Rights in Digital Age', departmentId: 'dept-law', credits: 3, instructor: 'Hon. Justice Patricia Ross', semester: 'First Semester', session: '2026-2027', level: 'Undergraduate', enrolled: 110, capacity: 120, passRate: 94.1, averageGrade: '3.55' },
  { id: 'crs-10', code: 'HUM-180', title: 'Philosophy of Human-Machine Symbiosis', departmentId: 'dept-hum', credits: 3, instructor: 'Dr. Leila Aris', semester: 'First Semester', session: '2026-2027', level: 'Undergraduate', enrolled: 130, capacity: 130, passRate: 96.2, averageGrade: '3.71' }
];

let students: Student[] = [
  { id: 'stu-1', studentId: 'UNI-2023-881', name: 'Alex Rivera', email: 'alex.rivera@student.edu', departmentId: 'dept-cs', session: '2026-2027', semester: 'First Semester', level: 'Undergraduate', gpa: 3.88, creditsCompleted: 98, status: 'Active', enrollmentDate: '2023-09-01', advisor: 'Dr. Eleanor Vance' },
  { id: 'stu-2', studentId: 'UNI-2023-412', name: 'Maya Lin', email: 'maya.lin@student.edu', departmentId: 'dept-cs', session: '2026-2027', semester: 'First Semester', level: 'Undergraduate', gpa: 3.94, creditsCompleted: 104, status: 'Active', enrollmentDate: '2023-09-01', advisor: 'Dr. Alan Turing-Ward' },
  { id: 'stu-3', studentId: 'UNI-2024-105', name: 'Derrick O\'Connor', email: 'derrick.oc@student.edu', departmentId: 'dept-eng', session: '2026-2027', semester: 'First Semester', level: 'Undergraduate', gpa: 3.42, creditsCompleted: 68, status: 'Active', enrollmentDate: '2024-09-01', advisor: 'Prof. Marcus Holloway' },
  { id: 'stu-4', studentId: 'UNI-2022-779', name: 'Elena Rostova', email: 'elena.rostova@student.edu', departmentId: 'dept-bio', session: '2026-2027', semester: 'First Semester', level: 'Postgraduate', gpa: 3.91, creditsCompleted: 34, status: 'Active', enrollmentDate: '2025-01-15', advisor: 'Dr. Soraya Chen' },
  { id: 'stu-5', studentId: 'UNI-2024-990', name: 'Zaid Al-Mansoor', email: 'zaid.al@student.edu', departmentId: 'dept-biz', session: '2026-2027', semester: 'First Semester', level: 'Undergraduate', gpa: 3.65, creditsCompleted: 58, status: 'Active', enrollmentDate: '2024-09-01', advisor: 'Prof. Jonathan Sterling' },
  { id: 'stu-6', studentId: 'UNI-2023-301', name: 'Sophia Sterling', email: 'sophia.s@student.edu', departmentId: 'dept-law', session: '2026-2027', semester: 'First Semester', level: 'Undergraduate', gpa: 3.73, creditsCompleted: 86, status: 'Active', enrollmentDate: '2023-09-01', advisor: 'Hon. Justice Patricia Ross' },
  { id: 'stu-7', studentId: 'UNI-2025-014', name: 'Lucas Thorne', email: 'lucas.thorne@student.edu', departmentId: 'dept-hum', session: '2026-2027', semester: 'First Semester', level: 'Undergraduate', gpa: 3.52, creditsCompleted: 28, status: 'Active', enrollmentDate: '2025-09-01', advisor: 'Dr. Leila Aris' },
  { id: 'stu-8', studentId: 'UNI-2022-202', name: 'Amina Idris', email: 'amina.idris@student.edu', departmentId: 'dept-cs', session: '2025-2026', semester: 'Second Semester', level: 'Doctoral', gpa: 3.97, creditsCompleted: 48, status: 'Active', enrollmentDate: '2024-01-10', advisor: 'Dr. Eleanor Vance' },
  { id: 'stu-9', studentId: 'UNI-2023-644', name: 'Gabriel Santos', email: 'gabriel.santos@student.edu', departmentId: 'dept-eng', session: '2026-2027', semester: 'First Semester', level: 'Undergraduate', gpa: 2.82, creditsCompleted: 52, status: 'Probation', enrollmentDate: '2023-09-01', advisor: 'Dr. Keiko Tanaka' }
];

let facultyList: Faculty[] = [
  { id: 'fac-1', facultyId: 'FAC-010', name: 'Dr. Eleanor Vance', email: 'dean.cs@university.edu', departmentId: 'dept-cs', rank: 'Full Professor', specialization: 'Deep Learning & Neural Systems', coursesCount: 3, rating: 4.9, publicationsCount: 48 },
  { id: 'fac-2', facultyId: 'FAC-014', name: 'Prof. Marcus Holloway', email: 'marcus.h@university.edu', departmentId: 'dept-eng', rank: 'Full Professor', specialization: 'Signal Processing & Control Systems', coursesCount: 4, rating: 4.7, publicationsCount: 62 },
  { id: 'fac-3', facultyId: 'FAC-021', name: 'Dr. Soraya Chen', email: 'soraya.c@university.edu', departmentId: 'dept-bio', rank: 'Associate Professor', specialization: 'CRISPR Bioengineering', coursesCount: 2, rating: 4.8, publicationsCount: 34 },
  { id: 'fac-4', facultyId: 'FAC-033', name: 'Prof. Jonathan Sterling', email: 'jonathan.s@university.edu', departmentId: 'dept-biz', rank: 'Full Professor', specialization: 'Algorithmic Financial Markets', coursesCount: 3, rating: 4.6, publicationsCount: 51 },
  { id: 'fac-5', facultyId: 'FAC-045', name: 'Dr. Alan Turing-Ward', email: 'alan.tw@university.edu', departmentId: 'dept-cs', rank: 'Associate Professor', specialization: 'Graph Theory & Complexity', coursesCount: 4, rating: 4.85, publicationsCount: 29 },
  { id: 'fac-6', facultyId: 'FAC-052', name: 'Dr. Keiko Tanaka', email: 'keiko.t@university.edu', departmentId: 'dept-eng', rank: 'Assistant Professor', specialization: 'Swarm Robotics', coursesCount: 2, rating: 4.75, publicationsCount: 19 }
];

let users: UserAccount[] = [
  {
    id: 'usr-1',
    name: 'Chancellor Arthur Pendelton',
    email: 'admin@university.edu',
    role: 'super_admin',
    status: 'Active',
    avatar: '/src/assets/images/avatar_chancellor_black_1793096183885.jpg',
    permissions: ['all_access', 'system_config', 'audit_logs', 'user_management', 'records_crud', 'export_reports', 'manage_budgets'],
    lastLogin: '2026-10-26T17:15:00Z'
  },
  {
    id: 'usr-2',
    name: 'Dr. Eleanor Vance',
    email: 'dean.cs@university.edu',
    role: 'dean',
    departmentId: 'dept-cs',
    status: 'Active',
    avatar: '/src/assets/images/avatar_dean_black_1793096182639.jpg',
    permissions: ['department_manage', 'faculty_review', 'student_records', 'grade_approval', 'export_reports', 'audio_logs'],
    lastLogin: '2026-10-26T16:40:00Z'
  },
  {
    id: 'usr-3',
    name: 'Prof. Marcus Holloway',
    email: 'prof.holloway@university.edu',
    role: 'faculty',
    departmentId: 'dept-eng',
    status: 'Active',
    avatar: '/src/assets/images/avatar_chancellor_black_1793096183885.jpg',
    permissions: ['course_management', 'grade_entry', 'attendance_tracking', 'view_audio_logs'],
    lastLogin: '2026-10-25T14:20:00Z'
  },
  {
    id: 'usr-4',
    name: 'Alex Rivera',
    email: 'alex.rivera@student.edu',
    role: 'student',
    departmentId: 'dept-cs',
    status: 'Active',
    avatar: '/src/assets/images/avatar_student_black_1793096183680.jpg',
    permissions: ['view_personal_performance', 'view_course_materials', 'view_transcripts', 'listen_public_lectures'],
    lastLogin: '2026-10-26T17:28:00Z'
  }
];

let audioLogs: AudioLog[] = [
  {
    id: 'aud-1',
    title: 'Senate Plenum: 2026-2027 Academic Budget & AI Curriculum Integration',
    speaker: 'Chancellor Arthur Pendelton',
    role: 'University Chancellor',
    departmentId: 'dept-cs',
    meetingType: 'Senate Session',
    date: '2026-10-18',
    durationSec: 320,
    summary: 'Resolution passed approving 18% expansion of computing lab infrastructure and cross-disciplinary AI electives for engineering and biology.',
    tags: ['Academic Senate', 'Budget Allocation', 'Curriculum Reform', 'AI Infrastructure'],
    audioSampleTone: 'academic',
    transcript: [
      { time: '00:00', speaker: 'Chancellor Arthur Pendelton', text: 'I call the University Senate assembly to order for the review of the capital budget allocation.' },
      { time: '00:45', speaker: 'Dr. Eleanor Vance', text: 'Thank you Chancellor. The Computer Science and AI department has seen an 18 percent year-over-year surge in enrollment.' },
      { time: '01:30', speaker: 'Prof. Marcus Holloway', text: 'Engineering strongly endorses the cross-departmental lab cluster. Dual-use compute will power both robotics simulation and genomic sequencers.' },
      { time: '02:40', speaker: 'Chancellor Arthur Pendelton', text: 'The vote is unanimous. The $3.2M high-performance GPU cluster endowment is confirmed for the 2026-2027 session.' }
    ]
  },
  {
    id: 'aud-2',
    title: 'Departmental Board: Retention Strategy & Honors Capstone Evaluation',
    speaker: 'Dr. Eleanor Vance',
    role: 'Dean of Computer Science',
    departmentId: 'dept-cs',
    meetingType: 'Dean Board',
    date: '2026-10-22',
    durationSec: 245,
    summary: 'Dean Vance outlines peer tutoring impact on CS-301 pass rates and introduces industry-sponsored capstone scholarships.',
    tags: ['Student Retention', 'CS Department', 'Tutoring', 'Capstone'],
    audioSampleTone: 'briefing',
    transcript: [
      { time: '00:00', speaker: 'Dr. Eleanor Vance', text: 'Welcome faculty chairs. Let us analyze midterm retention metrics across our core undergraduate sequence.' },
      { time: '00:50', speaker: 'Dr. Alan Turing-Ward', text: 'In CS-301, algorithmic complexity benchmarks improved by 6.4 percentage points after instituting mandatory lab recitations.' },
      { time: '01:55', speaker: 'Dr. Eleanor Vance', text: 'Excellent. Let us ensure all students on academic warning receive direct faculty advising before the withdrawal deadline.' }
    ]
  },
  {
    id: 'aud-3',
    title: 'Distinguished Lecture: Quantum Topologies in Neural Computation',
    speaker: 'Guest Lecturer Dr. Julian Thorne (MIT)',
    role: 'Visiting Chair of Informatics',
    departmentId: 'dept-cs',
    meetingType: 'Public Lecture',
    date: '2026-10-12',
    durationSec: 410,
    summary: 'Exploration of non-Euclidean latent manifolds and cryogenic hardware benchmarks for high-dimensional inference.',
    tags: ['Quantum Computing', 'Neural Networks', 'Keynote', 'Research'],
    audioSampleTone: 'debate',
    transcript: [
      { time: '00:00', speaker: 'Dean Eleanor Vance', text: 'It is my privilege to introduce Dr. Julian Thorne for this session’s President Distinguished Lecture.' },
      { time: '00:35', speaker: 'Dr. Julian Thorne', text: 'Today we ask: what happens when optimization loss surfaces fold into Riemannian quantum Hilbert spaces?' },
      { time: '02:15', speaker: 'Dr. Julian Thorne', text: 'Our empirical results demonstrate linear scaling in parameter reduction while preserving topological semantic density.' }
    ]
  },
  {
    id: 'aud-4',
    title: 'Academic Grievance Hearing: Grade Re-evaluation Case #GR-2026-09',
    speaker: 'Ombudsperson & Board Committee',
    role: 'Hearing Tribunal',
    departmentId: 'dept-eng',
    meetingType: 'Academic Grievance',
    date: '2026-10-08',
    durationSec: 195,
    summary: 'Review of automated code plagiarism check false positive for ENG-210 embedded signal final submission.',
    tags: ['Ombuds', 'Ethics', 'Grade Appeal', 'Policy'],
    audioSampleTone: 'briefing',
    transcript: [
      { time: '00:00', speaker: 'Ombudsperson Dr. Keller', text: 'Constituting the formal review panel for student case GR-2026-09 regarding the ENG-210 laboratory test.' },
      { time: '01:10', speaker: 'Prof. Marcus Holloway', text: 'Having inspected the source commits, the boilerplates aligned with the supplied starter template, not unauthorized collaboration.' },
      { time: '02:20', speaker: 'Ombudsperson Dr. Keller', text: 'Case dismissed with full grade reinstatement and recorded in institutional audit log.' }
    ]
  }
];

// Current logged in session helper
let currentUser: UserAccount = users[0]; // Default to Super Admin Arthur Pendelton

/* ==========================================================================
   REST API ROUTES
   ========================================================================== */

// Auth Endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, role } = req.body;
  let matched = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  
  if (!matched && role) {
    matched = users.find(u => u.role === role);
  }
  
  if (!matched) {
    // If not found, create or default to admin
    matched = users[0];
  }
  
  matched.lastLogin = new Date().toISOString();
  currentUser = matched;
  return res.json({ success: true, user: currentUser });
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, role, departmentId, studentId, facultyId, level, specialization } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Full name, email address, and password are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.status(409).json({ error: 'An account with this institutional email is already registered.' });
  }

  const userRole: 'super_admin' | 'dean' | 'faculty' | 'student' = role || 'student';
  const targetDeptId = departmentId || 'dept-cs';

  // Determine permissions based on role
  let permissions: string[] = [];
  if (userRole === 'super_admin') {
    permissions = ['all_access', 'system_config', 'audit_logs', 'user_management', 'records_crud', 'export_reports', 'manage_budgets'];
  } else if (userRole === 'dean') {
    permissions = ['department_manage', 'faculty_review', 'student_records', 'grade_approval', 'export_reports', 'audio_logs'];
  } else if (userRole === 'faculty') {
    permissions = ['course_management', 'grade_entry', 'attendance_tracking', 'view_audio_logs'];
  } else {
    permissions = ['view_personal_performance', 'view_course_materials', 'view_transcripts', 'listen_public_lectures'];
  }

  const avatar = userRole === 'student'
    ? '/src/assets/images/avatar_student_black_1793096183680.jpg'
    : userRole === 'dean'
    ? '/src/assets/images/avatar_dean_black_1793096182639.jpg'
    : '/src/assets/images/avatar_chancellor_black_1793096183885.jpg';

  const newUser: UserAccount = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    role: userRole,
    departmentId: targetDeptId,
    status: 'Active',
    avatar,
    permissions,
    lastLogin: new Date().toISOString()
  };

  users.push(newUser);

  // If registering as a student, create student profile record automatically
  if (userRole === 'student') {
    const newStudentId = studentId || `UNI-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newStudent: Student = {
      id: `stu-${Date.now()}`,
      studentId: newStudentId,
      name: name.trim(),
      email: cleanEmail,
      departmentId: targetDeptId,
      session: '2026-2027',
      semester: 'First Semester',
      level: level || 'Undergraduate',
      gpa: 3.65,
      creditsCompleted: 30,
      status: 'Active',
      enrollmentDate: new Date().toISOString().split('T')[0],
      advisor: 'Dr. Eleanor Vance',
      avatar
    };
    students.unshift(newStudent);
  } else if (userRole === 'faculty') {
    const newFacId = facultyId || `FAC-0${facultyList.length + 10}`;
    const newFac: Faculty = {
      id: `fac-${Date.now()}`,
      facultyId: newFacId,
      name: name.trim(),
      email: cleanEmail,
      departmentId: targetDeptId,
      rank: 'Assistant Professor',
      specialization: specialization || 'Computer Science & Systems',
      coursesCount: 2,
      rating: 4.8,
      publicationsCount: 6,
      avatar
    };
    facultyList.unshift(newFac);
  }

  currentUser = newUser;
  return res.status(201).json({ success: true, user: currentUser });
});

app.post('/api/auth/logout', (_req, res) => {
  currentUser = users[0];
  return res.json({ success: true });
});

app.get('/api/auth/me', (_req, res) => {
  return res.json({ user: currentUser });
});

// Institutional Wide Dashboard
app.get('/api/dashboard/institution', (req, res) => {
  const { session, departmentId, courseId, level } = req.query as Record<string, string>;
  
  // Calculate aggregate metrics
  let filteredStudents = [...students];
  let filteredCourses = [...courses];
  let filteredDepts = [...departments];

  if (departmentId && departmentId !== 'all') {
    filteredStudents = filteredStudents.filter(s => s.departmentId === departmentId);
    filteredCourses = filteredCourses.filter(c => c.departmentId === departmentId);
    filteredDepts = filteredDepts.filter(d => d.id === departmentId);
  }

  if (session && session !== 'all') {
    filteredStudents = filteredStudents.filter(s => s.session === session);
    filteredCourses = filteredCourses.filter(c => c.session === session);
  }

  if (level && level !== 'all') {
    filteredStudents = filteredStudents.filter(s => s.level === level);
    filteredCourses = filteredCourses.filter(c => c.level === level);
  }

  if (courseId && courseId !== 'all') {
    filteredCourses = filteredCourses.filter(c => c.id === courseId);
  }

  const totalStudents = filteredDepts.reduce((acc, d) => acc + d.studentCount, 0);
  const totalFaculty = filteredDepts.reduce((acc, d) => acc + d.facultyCount, 0);
  const totalBudget = filteredDepts.reduce((acc, d) => acc + d.budgetAllocated, 0);
  const totalSpent = filteredDepts.reduce((acc, d) => acc + d.budgetSpent, 0);
  const totalGrants = filteredDepts.reduce((acc, d) => acc + d.researchGrants, 0);
  const avgGpa = filteredDepts.length > 0 ? (filteredDepts.reduce((acc, d) => acc + d.averageGpa, 0) / filteredDepts.length).toFixed(2) : '3.50';
  const overallPassRate = filteredDepts.length > 0 ? (filteredDepts.reduce((acc, d) => acc + d.passRate, 0) / filteredDepts.length).toFixed(1) : '92.4';
  const facultyStudentRatio = totalFaculty > 0 ? `1:${Math.round(totalStudents / totalFaculty)}` : '1:16';

  // Multi-Year Enrollment Historical Trend
  const enrollmentTrends = [
    { session: '2023-2024', undergrad: 6850, postgrad: 1420, doctoral: 310, total: 8580 },
    { session: '2024-2025', undergrad: 7200, postgrad: 1610, doctoral: 340, total: 9150 },
    { session: '2025-2026', undergrad: 7640, postgrad: 1780, doctoral: 380, total: 9800 },
    { session: '2026-2027', undergrad: 8120, postgrad: 1950, doctoral: 420, total: 10490 }
  ];

  // Grade Distribution Bell Curve
  const gradeDistribution = [
    { grade: 'A+ (4.0)', percentage: 22.4, count: 2350 },
    { grade: 'A (3.7-3.9)', percentage: 29.1, count: 3052 },
    { grade: 'B+ (3.3-3.6)', percentage: 25.8, count: 2706 },
    { grade: 'B (3.0-3.2)', percentage: 14.3, count: 1500 },
    { grade: 'C (2.0-2.9)', percentage: 6.2, count: 650 },
    { grade: 'Probation (<2.0)', percentage: 2.2, count: 231 }
  ];

  // Budget Allocation vs Expenditure by Department
  const departmentBudgetComparison = departments.map(d => ({
    name: d.code,
    fullName: d.name,
    allocated: d.budgetAllocated / 1000000,
    spent: d.budgetSpent / 1000000,
    utilizationPercent: Math.round((d.budgetSpent / d.budgetAllocated) * 100)
  }));

  // Faculty to Student Ratios by Department
  const departmentalRatios = departments.map(d => ({
    code: d.code,
    name: d.name,
    ratio: Math.round(d.studentCount / d.facultyCount),
    students: d.studentCount,
    faculty: d.facultyCount
  }));

  return res.json({
    kpis: {
      totalStudents,
      totalFaculty,
      activeDepartments: filteredDepts.length,
      averageGpa: parseFloat(avgGpa),
      overallPassRate: parseFloat(overallPassRate),
      facultyStudentRatio,
      totalBudgetUSD: totalBudget,
      totalSpentUSD: totalSpent,
      totalGrantsUSD: totalGrants,
      retentionRate: 91.8,
      graduationRate: 88.4
    },
    enrollmentTrends,
    gradeDistribution,
    departmentBudgetComparison,
    departmentalRatios,
    departments: filteredDepts
  });
});

// Departmental Dashboard
app.get('/api/dashboard/department/:deptId', (req, res) => {
  const { deptId } = req.params;
  const dept = departments.find(d => d.id === deptId) || departments[0];
  const deptCourses = courses.filter(c => c.departmentId === dept.id);
  const deptFaculty = facultyList.filter(f => f.departmentId === dept.id);
  const deptStudents = students.filter(s => s.departmentId === dept.id);

  // Departmental GPA progression across last 4 semesters
  const semesterProgression = [
    { semester: 'Fall 2024', avgGpa: (dept.averageGpa - 0.12).toFixed(2), retention: 89.2 },
    { semester: 'Spring 2025', avgGpa: (dept.averageGpa - 0.08).toFixed(2), retention: 90.1 },
    { semester: 'Fall 2025', avgGpa: (dept.averageGpa - 0.03).toFixed(2), retention: 91.0 },
    { semester: 'Spring 2026', avgGpa: dept.averageGpa.toFixed(2), retention: dept.passRate }
  ];

  // Faculty workload distribution
  const facultyWorkload = deptFaculty.map(f => ({
    name: f.name,
    courses: f.coursesCount,
    rating: f.rating,
    publications: f.publicationsCount,
    workloadHours: f.coursesCount * 8 + 12 // estimated teaching + research
  }));

  // Course performance matrix
  const coursePerformance = deptCourses.map(c => ({
    id: c.id,
    code: c.code,
    title: c.title,
    instructor: c.instructor,
    enrolled: c.enrolled,
    capacity: c.capacity,
    passRate: c.passRate,
    avgGrade: c.averageGrade,
    level: c.level
  }));

  return res.json({
    department: dept,
    facultyList: deptFaculty,
    studentCount: deptStudents.length > 0 ? deptStudents.length : dept.studentCount,
    semesterProgression,
    facultyWorkload,
    coursePerformance
  });
});

// Personal Performance View (Student / Faculty)
app.get('/api/performance/student/:studentId', (req, res) => {
  const { studentId } = req.params;
  const student = students.find(s => s.id === studentId || s.studentId === studentId) || students[0];
  const dept = departments.find(d => d.id === student.departmentId);

  // Term-by-Term GPA Progression
  const gpaHistory = [
    { term: 'Year 1 Fall', gpa: 3.72, cumulative: 3.72, credits: 16, attendance: 96 },
    { term: 'Year 1 Spring', gpa: 3.81, cumulative: 3.76, credits: 18, attendance: 94 },
    { term: 'Year 2 Fall', gpa: 3.90, cumulative: 3.81, credits: 16, attendance: 98 },
    { term: 'Year 2 Spring', gpa: 3.88, cumulative: 3.83, credits: 16, attendance: 92 },
    { term: 'Year 3 Fall', gpa: 3.94, cumulative: 3.86, credits: 16, attendance: 97 },
    { term: 'Year 3 Spring (Current)', gpa: student.gpa, cumulative: student.gpa, credits: 16, attendance: 95 }
  ];

  // Competency Radar Dimensions (Scale 0 to 100)
  const competencyRadar = [
    { subject: 'Theoretical Foundations', score: 92, benchmark: 80 },
    { subject: 'Algorithmics & Systems', score: 96, benchmark: 78 },
    { subject: 'Practical Lab & Projects', score: 88, benchmark: 75 },
    { subject: 'Research Methodology', score: 90, benchmark: 70 },
    { subject: 'Peer Collaboration', score: 94, benchmark: 82 },
    { subject: 'Technical Communication', score: 89, benchmark: 77 }
  ];

  // Enrolled Courses with Active Grades
  const enrolledCourses = [
    { code: 'CS-402', title: 'Deep Learning & Neural Architectures', credits: 4, instructor: 'Dr. Eleanor Vance', midterm: 96, currentScore: 94.5, grade: 'A', attendance: 98 },
    { code: 'CS-301', title: 'Data Structures & Algorithmic Complexity', credits: 4, instructor: 'Dr. Alan Turing-Ward', midterm: 98, currentScore: 97.0, grade: 'A+', attendance: 100 },
    { code: 'CS-204', title: 'Database Systems & Relational Theory', credits: 3, instructor: 'Prof. David Codd', midterm: 91, currentScore: 92.0, grade: 'A', attendance: 94 },
    { code: 'HUM-180', title: 'Philosophy of Human-Machine Symbiosis', credits: 3, instructor: 'Dr. Leila Aris', midterm: 94, currentScore: 93.5, grade: 'A', attendance: 95 }
  ];

  return res.json({
    student,
    department: dept,
    gpaHistory,
    competencyRadar,
    enrolledCourses,
    summary: {
      overallAttendance: 96.2,
      standing: 'Dean\'s Honors List',
      projectedGraduation: 'Spring 2027',
      classRank: 'Top 3% of Cohort'
    }
  });
});

// Records Management (CRUD: Students)
app.get('/api/records/students', (req, res) => {
  const { search, departmentId, status } = req.query as Record<string, string>;
  let list = [...students];

  if (search) {
    const s = search.toLowerCase();
    list = list.filter(item => item.name.toLowerCase().includes(s) || item.studentId.toLowerCase().includes(s) || item.email.toLowerCase().includes(s));
  }
  if (departmentId && departmentId !== 'all') {
    list = list.filter(item => item.departmentId === departmentId);
  }
  if (status && status !== 'all') {
    list = list.filter(item => item.status === status);
  }

  return res.json(list);
});

app.post('/api/records/students', (req, res) => {
  const newStudent: Student = {
    id: `stu-${Date.now()}`,
    studentId: req.body.studentId || `UNI-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    name: req.body.name,
    email: req.body.email,
    departmentId: req.body.departmentId || 'dept-cs',
    session: req.body.session || '2026-2027',
    semester: req.body.semester || 'First Semester',
    level: req.body.level || 'Undergraduate',
    gpa: parseFloat(req.body.gpa) || 3.5,
    creditsCompleted: parseInt(req.body.creditsCompleted) || 0,
    status: req.body.status || 'Active',
    enrollmentDate: req.body.enrollmentDate || new Date().toISOString().split('T')[0],
    advisor: req.body.advisor || 'Assigned Faculty'
  };
  students.unshift(newStudent);
  return res.status(201).json(newStudent);
});

app.put('/api/records/students/:id', (req, res) => {
  const { id } = req.params;
  const index = students.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: 'Student not found' });
  
  students[index] = { ...students[index], ...req.body };
  return res.json(students[index]);
});

app.delete('/api/records/students/:id', (req, res) => {
  const { id } = req.params;
  const index = students.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: 'Student not found' });
  
  const removed = students.splice(index, 1);
  return res.json({ success: true, removed: removed[0] });
});

// Records Management (CRUD: Courses)
app.get('/api/records/courses', (req, res) => {
  const { search, departmentId } = req.query as Record<string, string>;
  let list = [...courses];
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(c => c.code.toLowerCase().includes(s) || c.title.toLowerCase().includes(s) || c.instructor.toLowerCase().includes(s));
  }
  if (departmentId && departmentId !== 'all') {
    list = list.filter(c => c.departmentId === departmentId);
  }
  return res.json(list);
});

app.post('/api/records/courses', (req, res) => {
  const newCourse: Course = {
    id: `crs-${Date.now()}`,
    code: req.body.code,
    title: req.body.title,
    departmentId: req.body.departmentId || 'dept-cs',
    credits: parseInt(req.body.credits) || 3,
    instructor: req.body.instructor,
    semester: req.body.semester || 'First Semester',
    session: req.body.session || '2026-2027',
    level: req.body.level || 'Undergraduate',
    enrolled: parseInt(req.body.enrolled) || 0,
    capacity: parseInt(req.body.capacity) || 100,
    passRate: parseFloat(req.body.passRate) || 90.0,
    averageGrade: req.body.averageGrade || '3.50'
  };
  courses.unshift(newCourse);
  return res.status(201).json(newCourse);
});

app.put('/api/records/courses/:id', (req, res) => {
  const { id } = req.params;
  const index = courses.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Course not found' });
  
  courses[index] = { ...courses[index], ...req.body };
  return res.json(courses[index]);
});

app.delete('/api/records/courses/:id', (req, res) => {
  const { id } = req.params;
  const index = courses.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Course not found' });
  
  const removed = courses.splice(index, 1);
  return res.json({ success: true, removed: removed[0] });
});

// Records Management (CRUD: Faculty)
app.get('/api/records/faculty', (_req, res) => {
  return res.json(facultyList);
});

app.post('/api/records/faculty', (req, res) => {
  const newFaculty: Faculty = {
    id: `fac-${Date.now()}`,
    facultyId: req.body.facultyId || `FAC-0${facultyList.length + 10}`,
    name: req.body.name,
    email: req.body.email,
    departmentId: req.body.departmentId || 'dept-cs',
    rank: req.body.rank || 'Assistant Professor',
    specialization: req.body.specialization || 'Applied Research',
    coursesCount: parseInt(req.body.coursesCount) || 2,
    rating: parseFloat(req.body.rating) || 4.5,
    publicationsCount: parseInt(req.body.publicationsCount) || 10
  };
  facultyList.unshift(newFaculty);
  return res.status(201).json(newFaculty);
});

app.put('/api/records/faculty/:id', (req, res) => {
  const { id } = req.params;
  const index = facultyList.findIndex(f => f.id === id);
  if (index === -1) return res.status(404).json({ error: 'Faculty not found' });
  
  facultyList[index] = { ...facultyList[index], ...req.body };
  return res.json(facultyList[index]);
});

app.delete('/api/records/faculty/:id', (req, res) => {
  const { id } = req.params;
  const index = facultyList.findIndex(f => f.id === id);
  if (index === -1) return res.status(404).json({ error: 'Faculty not found' });
  
  const removed = facultyList.splice(index, 1);
  return res.json({ success: true, removed: removed[0] });
});

// User Accounts & Role Management
app.get('/api/users', (_req, res) => {
  return res.json(users);
});

app.post('/api/users', (req, res) => {
  const newUser: UserAccount = {
    id: `usr-${Date.now()}`,
    name: req.body.name,
    email: req.body.email,
    role: req.body.role || 'faculty',
    departmentId: req.body.departmentId,
    status: req.body.status || 'Active',
    permissions: req.body.permissions || ['basic_access'],
    lastLogin: undefined
  };
  users.push(newUser);
  return res.status(201).json(newUser);
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });

  users[index] = { ...users[index], ...req.body };
  return res.json(users[index]);
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  if (id === 'usr-1') {
    return res.status(400).json({ error: 'Cannot delete primary root Chancellor administrator.' });
  }
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  
  const removed = users.splice(index, 1);
  return res.json({ success: true, removed: removed[0] });
});

// Audio Logs Archive
app.get('/api/audio-logs', (_req, res) => {
  return res.json(audioLogs);
});

app.post('/api/audio-logs', (req, res) => {
  const newLog: AudioLog = {
    id: `aud-${Date.now()}`,
    title: req.body.title || 'Untitled Audio Session',
    speaker: req.body.speaker || currentUser.name,
    role: req.body.role || (currentUser.role === 'dean' ? 'Dean' : 'Faculty Member'),
    departmentId: req.body.departmentId || 'dept-cs',
    meetingType: req.body.meetingType || 'Faculty Council',
    date: req.body.date || new Date().toISOString().split('T')[0],
    durationSec: parseInt(req.body.durationSec) || 180,
    summary: req.body.summary || 'Live recorded session captured through institutional audio log interface.',
    tags: req.body.tags || ['Campus Recording', 'Live Audio'],
    audioSampleTone: req.body.audioSampleTone || 'academic',
    transcript: req.body.transcript || [
      { time: '00:00', speaker: currentUser.name, text: 'Audio recording initiated. Session minutes and transcript logged automatically.' },
      { time: '00:15', speaker: currentUser.name, text: 'All action items and votes registered in the central institutional archive.' }
    ]
  };
  audioLogs.unshift(newLog);
  return res.status(201).json(newLog);
});

app.delete('/api/audio-logs/:id', (req, res) => {
  const { id } = req.params;
  const index = audioLogs.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ error: 'Audio log not found' });
  const removed = audioLogs.splice(index, 1);
  return res.json({ success: true, removed: removed[0] });
});

// Departments list
app.get('/api/departments', (_req, res) => {
  return res.json(departments);
});

/* ==========================================================================
   Vite Dev Server Integration / Static Build Delivery
   ========================================================================== */

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UNI METRICS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
