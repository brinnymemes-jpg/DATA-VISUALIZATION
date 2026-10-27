import {
  Department,
  Course,
  Student,
  Faculty,
  UserAccount,
  AudioLog,
  FilterState,
  InstitutionalKpis
} from '../types';

export const api = {
  // Auth
  async login(email?: string, role?: string): Promise<{ user: UserAccount }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return {
      user: {
        id: 'usr-1',
        name: 'Chancellor Arthur Pendelton',
        email: email || 'admin@university.edu',
        role: (role as any) || 'super_admin',
        status: 'Active',
        permissions: ['all_access', 'system_config', 'audit_logs', 'user_management', 'records_crud', 'export_reports', 'manage_budgets']
      }
    };
  },

  async signup(data: {
    name: string;
    email: string;
    password: string;
    role: 'super_admin' | 'dean' | 'faculty' | 'student';
    departmentId?: string;
    studentId?: string;
    facultyId?: string;
    level?: string;
    specialization?: string;
  }): Promise<{ success: boolean; user: UserAccount; error?: string }> {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, user: null as any, error: result.error || 'Registration failed' };
      }
      return result;
    } catch (e: any) {
      return { success: false, user: null as any, error: e.message || 'Connection error' };
    }
  },

  async getCurrentUser(): Promise<UserAccount> {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        return data.user;
      }
    } catch {
      // Fallback
    }
    return {
      id: 'usr-1',
      name: 'Chancellor Arthur Pendelton',
      email: 'admin@university.edu',
      role: 'super_admin',
      status: 'Active',
      permissions: ['all_access', 'system_config', 'audit_logs', 'user_management', 'records_crud', 'export_reports', 'manage_budgets']
    };
  },

  async logout(): Promise<boolean> {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      return res.ok;
    } catch {}
    return true;
  },

  // Institution Dashboard
  async getInstitutionData(filters: FilterState): Promise<{
    kpis: InstitutionalKpis;
    enrollmentTrends: any[];
    gradeDistribution: any[];
    departmentBudgetComparison: any[];
    departmentalRatios: any[];
    departments: Department[];
  }> {
    const params = new URLSearchParams({
      session: filters.session,
      departmentId: filters.departmentId,
      courseId: filters.courseId,
      level: filters.level
    });
    try {
      const res = await fetch(`/api/dashboard/institution?${params.toString()}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    return {
      kpis: {
        totalStudents: 7740,
        totalFaculty: 228,
        activeDepartments: 6,
        averageGpa: 3.53,
        overallPassRate: 92.4,
        facultyStudentRatio: '1:34',
        totalBudgetUSD: 34300000,
        totalSpentUSD: 31920000,
        totalGrantsUSD: 59900000,
        retentionRate: 91.8,
        graduationRate: 88.4
      },
      enrollmentTrends: [
        { session: '2023-2024', undergrad: 6850, postgrad: 1420, doctoral: 310, total: 8580 },
        { session: '2024-2025', undergrad: 7200, postgrad: 1610, doctoral: 340, total: 9150 },
        { session: '2025-2026', undergrad: 7640, postgrad: 1780, doctoral: 380, total: 9800 },
        { session: '2026-2027', undergrad: 8120, postgrad: 1950, doctoral: 420, total: 10490 }
      ],
      gradeDistribution: [
        { grade: 'A+ (4.0)', percentage: 22.4, count: 2350 },
        { grade: 'A (3.7-3.9)', percentage: 29.1, count: 3052 },
        { grade: 'B+ (3.3-3.6)', percentage: 25.8, count: 2706 },
        { grade: 'B (3.0-3.2)', percentage: 14.3, count: 1500 },
        { grade: 'C (2.0-2.9)', percentage: 6.2, count: 650 },
        { grade: 'Probation (<2.0)', percentage: 2.2, count: 231 }
      ],
      departmentBudgetComparison: [
        { name: 'CS', fullName: 'Computer Science & AI', allocated: 6.4, spent: 5.82, utilizationPercent: 91 },
        { name: 'ENG', fullName: 'Engineering', allocated: 8.9, spent: 8.41, utilizationPercent: 94 },
        { name: 'BIO', fullName: 'Biomedical Sciences', allocated: 7.2, spent: 6.94, utilizationPercent: 96 },
        { name: 'BIZ', fullName: 'Business Analytics', allocated: 4.8, spent: 4.21, utilizationPercent: 88 },
        { name: 'LAW', fullName: 'Law & Governance', allocated: 3.9, spent: 3.65, utilizationPercent: 93 },
        { name: 'HUM', fullName: 'Humanities & Design', allocated: 3.1, spent: 2.89, utilizationPercent: 93 }
      ],
      departmentalRatios: [
        { code: 'CS', name: 'Computer Science & AI', ratio: 34, students: 1420, faculty: 42 },
        { code: 'ENG', name: 'Engineering', ratio: 33, students: 1850, faculty: 56 },
        { code: 'BIO', name: 'Biomedical Sciences', ratio: 29, students: 1120, faculty: 38 },
        { code: 'BIZ', name: 'Business Analytics', ratio: 49, students: 1680, faculty: 34 },
        { code: 'LAW', name: 'Law & Governance', ratio: 28, students: 780, faculty: 28 },
        { code: 'HUM', name: 'Humanities & Design', ratio: 30, students: 890, faculty: 30 }
      ],
      departments: []
    };
  },

  // Department Dashboard
  async getDepartmentData(deptId: string): Promise<any> {
    try {
      const res = await fetch(`/api/dashboard/department/${deptId}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return null;
  },

  // Personal Performance
  async getStudentPerformance(studentId: string): Promise<any> {
    try {
      const res = await fetch(`/api/performance/student/${studentId}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return null;
  },

  // Departments
  async getDepartments(): Promise<Department[]> {
    try {
      const res = await fetch('/api/departments');
      if (res.ok) return await res.json();
    } catch {}
    return [
      { id: 'dept-cs', code: 'CS', name: 'Computer Science & AI', dean: 'Dr. Eleanor Vance', facultyCount: 42, studentCount: 1420, averageGpa: 3.58, budgetAllocated: 6400000, budgetSpent: 5820000, researchGrants: 12500000, passRate: 93.4, satisfactionRate: 91.2, description: 'Specializing in generative intelligence, quantum computing, systems engineering, and cybersecurity architecture.' },
      { id: 'dept-eng', code: 'ENG', name: 'Electrical & Mechanical Engineering', dean: 'Prof. Marcus Holloway', facultyCount: 56, studentCount: 1850, averageGpa: 3.42, budgetAllocated: 8900000, budgetSpent: 8410000, researchGrants: 18200000, passRate: 88.7, satisfactionRate: 87.5, description: 'Robotics, aerospace composites, sustainable power grids, and advanced mechatronic fabrication.' },
      { id: 'dept-bio', code: 'BIO', name: 'Biomedical & Life Sciences', dean: 'Dr. Soraya Chen', facultyCount: 38, studentCount: 1120, averageGpa: 3.65, budgetAllocated: 7200000, budgetSpent: 6940000, researchGrants: 16400000, passRate: 94.8, satisfactionRate: 93.0, description: 'Genomic therapeutics, neural interfaces, cellular immunology, and bioinformatics algorithms.' },
      { id: 'dept-biz', code: 'BIZ', name: 'Business & Economic Analytics', dean: 'Prof. Jonathan Sterling', facultyCount: 34, studentCount: 1680, averageGpa: 3.39, budgetAllocated: 4800000, budgetSpent: 4210000, researchGrants: 5900000, passRate: 90.1, satisfactionRate: 89.4, description: 'Quantitative macro-finance, computational decision science, institutional leadership, and market modeling.' },
      { id: 'dept-law', code: 'LAW', name: 'School of Law & Governance', dean: 'Hon. Justice Patricia Ross', facultyCount: 28, studentCount: 780, averageGpa: 3.51, budgetAllocated: 3900000, budgetSpent: 3650000, researchGrants: 4100000, passRate: 92.5, satisfactionRate: 88.0, description: 'Constitutional law, algorithmic ethics regulation, intellectual property, and public policy formulation.' },
      { id: 'dept-hum', code: 'HUM', name: 'Humanities & Interactive Design', dean: 'Dr. Leila Aris', facultyCount: 30, studentCount: 890, averageGpa: 3.61, budgetAllocated: 3100000, budgetSpent: 2890000, researchGrants: 2800000, passRate: 95.1, satisfactionRate: 92.8, description: 'Philosophy of technology, spatial interaction design, computational linguistics, and digital heritage.' }
    ];
  },

  // Students CRUD
  async getStudents(params?: { search?: string; departmentId?: string; status?: string }): Promise<Student[]> {
    const q = new URLSearchParams(params as any).toString();
    try {
      const res = await fetch(`/api/records/students?${q}`);
      if (res.ok) return await res.json();
    } catch {}
    return [];
  },

  async createStudent(student: Partial<Student>): Promise<Student> {
    const res = await fetch('/api/records/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    return await res.json();
  },

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    const res = await fetch(`/api/records/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return await res.json();
  },

  async deleteStudent(id: string): Promise<boolean> {
    const res = await fetch(`/api/records/students/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  // Courses CRUD
  async getCourses(params?: { search?: string; departmentId?: string }): Promise<Course[]> {
    const q = new URLSearchParams(params as any).toString();
    try {
      const res = await fetch(`/api/records/courses?${q}`);
      if (res.ok) return await res.json();
    } catch {}
    return [];
  },

  async createCourse(course: Partial<Course>): Promise<Course> {
    const res = await fetch('/api/records/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    });
    return await res.json();
  },

  async updateCourse(id: string, updates: Partial<Course>): Promise<Course> {
    const res = await fetch(`/api/records/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return await res.json();
  },

  async deleteCourse(id: string): Promise<boolean> {
    const res = await fetch(`/api/records/courses/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  // Faculty CRUD
  async getFaculty(): Promise<Faculty[]> {
    try {
      const res = await fetch('/api/records/faculty');
      if (res.ok) return await res.json();
    } catch {}
    return [];
  },

  async createFaculty(fac: Partial<Faculty>): Promise<Faculty> {
    const res = await fetch('/api/records/faculty', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fac)
    });
    return await res.json();
  },

  async updateFaculty(id: string, updates: Partial<Faculty>): Promise<Faculty> {
    const res = await fetch(`/api/records/faculty/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return await res.json();
  },

  async deleteFaculty(id: string): Promise<boolean> {
    const res = await fetch(`/api/records/faculty/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  // Users & Roles
  async getUsers(): Promise<UserAccount[]> {
    try {
      const res = await fetch('/api/users');
      if (res.ok) return await res.json();
    } catch {}
    return [];
  },

  async createUser(user: Partial<UserAccount>): Promise<UserAccount> {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    return await res.json();
  },

  async updateUser(id: string, updates: Partial<UserAccount>): Promise<UserAccount> {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return await res.json();
  },

  async deleteUser(id: string): Promise<boolean> {
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  // Audio Logs
  async getAudioLogs(): Promise<AudioLog[]> {
    try {
      const res = await fetch('/api/audio-logs');
      if (res.ok) return await res.json();
    } catch {}
    return [];
  },

  async createAudioLog(log: Partial<AudioLog>): Promise<AudioLog> {
    const res = await fetch('/api/audio-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log)
    });
    return await res.json();
  },

  async deleteAudioLog(id: string): Promise<boolean> {
    const res = await fetch(`/api/audio-logs/${id}`, { method: 'DELETE' });
    return res.ok;
  }
};
