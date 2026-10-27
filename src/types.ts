export interface Department {
  id: string;
  code: string;
  name: string;
  dean: string;
  facultyCount: number;
  studentCount: number;
  averageGpa: number;
  budgetAllocated: number;
  budgetSpent: number;
  researchGrants: number;
  passRate: number;
  satisfactionRate: number;
  description: string;
}

export interface Course {
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

export interface Student {
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

export interface Faculty {
  id: string;
  facultyId: string;
  name: string;
  email: string;
  departmentId: string;
  rank: 'Full Professor' | 'Associate Professor' | 'Assistant Professor' | 'Lecturer';
  specialization: string;
  coursesCount: number;
  rating: number;
  publicationsCount: number;
  avatar?: string;
}

export interface UserAccount {
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

export interface AudioTranscriptItem {
  time: string;
  speaker: string;
  text: string;
}

export interface AudioLog {
  id: string;
  title: string;
  speaker: string;
  role: string;
  departmentId: string;
  meetingType: 'Senate Session' | 'Dean Board' | 'Faculty Council' | 'Public Lecture' | 'Academic Grievance';
  date: string;
  durationSec: number;
  summary: string;
  transcript: AudioTranscriptItem[];
  tags: string[];
  audioSampleTone?: 'academic' | 'debate' | 'briefing';
}

export interface FilterState {
  session: string;
  departmentId: string;
  courseId: string;
  level: string;
  semester: string;
}

export interface InstitutionalKpis {
  totalStudents: number;
  totalFaculty: number;
  activeDepartments: number;
  averageGpa: number;
  overallPassRate: number;
  facultyStudentRatio: string;
  totalBudgetUSD: number;
  totalSpentUSD: number;
  totalGrantsUSD: number;
  retentionRate: number;
  graduationRate: number;
}
