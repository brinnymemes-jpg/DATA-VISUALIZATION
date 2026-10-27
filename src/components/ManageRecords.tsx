import React, { useState } from 'react';
import { Student, Course, Faculty, Department } from '../types';
import { api } from '../services/api';
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  Filter, 
  X, 
  Check, 
  AlertTriangle,
  GraduationCap,
  BookOpen,
  Users
} from 'lucide-react';

interface ManageRecordsProps {
  students: Student[];
  courses: Course[];
  faculty: Faculty[];
  departments: Department[];
  onRefreshData: () => void;
  preselectedDeptId?: string;
  currentUser?: any;
}

export const ManageRecords: React.FC<ManageRecordsProps> = ({
  students,
  courses,
  faculty,
  departments,
  onRefreshData,
  preselectedDeptId,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'courses' | 'faculty'>('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>(preselectedDeptId || 'all');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<{ id: string; type: string; name: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for creating/editing
  const [studentForm, setStudentForm] = useState<Partial<Student>>({
    name: '',
    email: '',
    studentId: '',
    departmentId: 'dept-cs',
    session: '2026-2027',
    semester: 'First Semester',
    level: 'Undergraduate',
    gpa: 3.5,
    creditsCompleted: 30,
    status: 'Active',
    advisor: 'Dr. Eleanor Vance'
  });

  const [courseForm, setCourseForm] = useState<Partial<Course>>({
    code: '',
    title: '',
    departmentId: 'dept-cs',
    credits: 3,
    instructor: '',
    semester: 'First Semester',
    session: '2026-2027',
    level: 'Undergraduate',
    enrolled: 45,
    capacity: 100,
    passRate: 92.0,
    averageGrade: '3.50'
  });

  const [facultyForm, setFacultyForm] = useState<Partial<Faculty>>({
    name: '',
    email: '',
    departmentId: 'dept-cs',
    rank: 'Assistant Professor',
    specialization: '',
    coursesCount: 2,
    rating: 4.8,
    publicationsCount: 12
  });

  // Filtered lists
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'all' || s.departmentId === deptFilter;
    return matchesSearch && matchesDept;
  });

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'all' || c.departmentId === deptFilter;
    return matchesSearch && matchesDept;
  });

  const filteredFaculty = faculty.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'all' || f.departmentId === deptFilter;
    return matchesSearch && matchesDept;
  });

  // Handlers for CRUD
  const handleOpenAddModal = () => {
    if (activeTab === 'students') {
      setStudentForm({
        name: '',
        email: '',
        studentId: `UNI-2026-${Math.floor(100 + Math.random() * 900)}`,
        departmentId: departments[0]?.id || 'dept-cs',
        session: '2026-2027',
        semester: 'First Semester',
        level: 'Undergraduate',
        gpa: 3.5,
        creditsCompleted: 30,
        status: 'Active',
        advisor: 'Dr. Eleanor Vance'
      });
    } else if (activeTab === 'courses') {
      setCourseForm({
        code: 'CS-101',
        title: '',
        departmentId: departments[0]?.id || 'dept-cs',
        credits: 3,
        instructor: 'Dr. Eleanor Vance',
        semester: 'First Semester',
        session: '2026-2027',
        level: 'Undergraduate',
        enrolled: 40,
        capacity: 100,
        passRate: 92.0,
        averageGrade: '3.50'
      });
    } else {
      setFacultyForm({
        name: '',
        email: '',
        departmentId: departments[0]?.id || 'dept-cs',
        rank: 'Assistant Professor',
        specialization: 'Artificial Intelligence & Robotics',
        coursesCount: 2,
        rating: 4.8,
        publicationsCount: 15
      });
    }
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    if (activeTab === 'students') {
      setStudentForm({ ...item });
    } else if (activeTab === 'courses') {
      setCourseForm({ ...item });
    } else {
      setFacultyForm({ ...item });
    }
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (activeTab === 'students') {
        await api.createStudent(studentForm);
      } else if (activeTab === 'courses') {
        await api.createCourse(courseForm);
      } else {
        await api.createFaculty(facultyForm);
      }
      setIsAddModalOpen(false);
      onRefreshData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSubmitting(true);
    try {
      if (activeTab === 'students') {
        await api.updateStudent(editingItem.id, studentForm);
      } else if (activeTab === 'courses') {
        await api.updateCourse(editingItem.id, courseForm);
      } else {
        await api.updateFaculty(editingItem.id, facultyForm);
      }
      setEditingItem(null);
      onRefreshData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmItem) return;
    setIsSubmitting(true);
    try {
      if (deleteConfirmItem.type === 'student') {
        await api.deleteStudent(deleteConfirmItem.id);
      } else if (deleteConfirmItem.type === 'course') {
        await api.deleteCourse(deleteConfirmItem.id);
      } else if (deleteConfirmItem.type === 'faculty') {
        await api.deleteFaculty(deleteConfirmItem.id);
      }
      setDeleteConfirmItem(null);
      onRefreshData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDeptCode = (deptId: string) => {
    return departments.find(d => d.id === deptId)?.code || 'GEN';
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Tab Controls */}
      <div className="liquid-glass-card rounded-2xl p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Institutional Records Management
            </h2>
            <p className="text-xs text-slate-400">
              Full Create, Read, Update, and Delete access for Student rosters, Course catalog, and Faculty members
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-between md:justify-end">
            {/* Tab switchers */}
            <div className="p-1 rounded-xl bg-slate-900/80 border border-white/10 flex items-center gap-1">
              <button
                onClick={() => { setActiveTab('students'); setSearchTerm(''); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'students' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Students ({students.length})
              </button>
              <button
                onClick={() => { setActiveTab('courses'); setSearchTerm(''); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'courses' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Courses ({courses.length})
              </button>
              <button
                onClick={() => { setActiveTab('faculty'); setSearchTerm(''); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'faculty' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Faculty ({faculty.length})
              </button>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Record
            </button>
          </div>
        </div>

        {/* Search & Department Filter Bar */}
        <div className="mt-4 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={`Search ${activeTab} by name, code, or email...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="liquid-glass-input w-full pl-9 pr-3 py-2 text-xs rounded-xl"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="liquid-glass-input text-xs rounded-xl px-3 py-2 bg-slate-900/90 w-full sm:w-auto cursor-pointer"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table for Active Tab */}
      <div className="liquid-glass-card rounded-2xl p-5 overflow-hidden">
        
        {/* STUDENTS TABLE */}
        {activeTab === 'students' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Matriculation ID</th>
                  <th className="py-2.5 px-3">Dept</th>
                  <th className="py-2.5 px-3">Level / Cohort</th>
                  <th className="py-2.5 px-3 text-right">GPA</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                      No student records match search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{s.name}</div>
                        <div className="text-[11px] text-slate-400">{s.email}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-cyan-300 font-medium">{s.studentId}</td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300 font-semibold">
                          {getDeptCode(s.departmentId)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {s.level} · {s.session}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-cyan-300 font-bold tabular-nums">
                        {s.gpa.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          s.status === 'Active' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' :
                          s.status === 'Probation' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' :
                          'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(s)}
                            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-white/[0.06] rounded-md transition-colors cursor-pointer"
                            title="Edit Student Record"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmItem({ id: s.id, type: 'student', name: s.name })}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors cursor-pointer"
                            title="Delete Student Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* COURSES TABLE */}
        {activeTab === 'courses' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Course Code</th>
                  <th className="py-2.5 px-3">Course Title</th>
                  <th className="py-2.5 px-3">Dept</th>
                  <th className="py-2.5 px-3">Instructor</th>
                  <th className="py-2.5 px-3 text-center">Credits</th>
                  <th className="py-2.5 px-3 text-right">Enrolled</th>
                  <th className="py-2.5 px-3 text-right">Pass Rate</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                      No courses match search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((c) => (
                    <tr key={c.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-cyan-300">{c.code}</td>
                      <td className="py-3 px-3 font-semibold text-white">{c.title}</td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300 font-semibold">
                          {getDeptCode(c.departmentId)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300">{c.instructor}</td>
                      <td className="py-3 px-3 text-center font-mono text-slate-300">{c.credits}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-200 tabular-nums">
                        {c.enrolled} / {c.capacity}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-400 font-semibold tabular-nums">
                        {c.passRate}%
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(c)}
                            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-white/[0.06] rounded-md transition-colors cursor-pointer"
                            title="Edit Course Record"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmItem({ id: c.id, type: 'course', name: c.code })}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors cursor-pointer"
                            title="Delete Course Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* FACULTY TABLE */}
        {activeTab === 'faculty' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Faculty Member</th>
                  <th className="py-2.5 px-3">Faculty ID</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Academic Rank</th>
                  <th className="py-2.5 px-3">Specialization</th>
                  <th className="py-2.5 px-3 text-right">Teaching Rating</th>
                  <th className="py-2.5 px-3 text-right">Publications</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredFaculty.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                      No faculty records match search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredFaculty.map((f) => (
                    <tr key={f.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{f.name}</div>
                        <div className="text-[11px] text-slate-400">{f.email}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-cyan-300">{f.facultyId}</td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300 font-semibold">
                          {getDeptCode(f.departmentId)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300">{f.rank}</td>
                      <td className="py-3 px-3 text-slate-400 truncate max-w-[180px]">{f.specialization}</td>
                      <td className="py-3 px-3 text-right font-mono text-amber-400 font-bold tabular-nums">
                        ★ {f.rating.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-300 tabular-nums">
                        {f.publicationsCount} Papers
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(f)}
                            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-white/[0.06] rounded-md transition-colors cursor-pointer"
                            title="Edit Faculty Record"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmItem({ id: f.id, type: 'faculty', name: f.name })}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors cursor-pointer"
                            title="Delete Faculty Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* CREATE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="liquid-glass-card rounded-2xl max-w-lg w-full p-6 border border-white/20 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white tracking-tight">
                Add New {activeTab === 'students' ? 'Student Record' : activeTab === 'courses' ? 'Course' : 'Faculty Member'}
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="mt-4 space-y-3.5 text-xs">
              {activeTab === 'students' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={studentForm.name}
                        onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                        className="liquid-glass-input w-full p-2 rounded-lg"
                        placeholder="e.g. Samuel Vance"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Student ID</label>
                      <input
                        type="text"
                        required
                        value={studentForm.studentId}
                        onChange={(e) => setStudentForm({ ...studentForm, studentId: e.target.value })}
                        className="liquid-glass-input w-full p-2 rounded-lg font-mono"
                        placeholder="UNI-2026-101"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={studentForm.email}
                        onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                        className="liquid-glass-input w-full p-2 rounded-lg"
                        placeholder="samuel@student.edu"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Department</label>
                      <select
                        value={studentForm.departmentId}
                        onChange={(e) => setStudentForm({ ...studentForm, departmentId: e.target.value })}
                        className="liquid-glass-input w-full p-2 rounded-lg bg-slate-900"
                      >
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Semester</label>
                      <select
                        value={studentForm.semester || 'First Semester'}
                        onChange={(e) => setStudentForm({ ...studentForm, semester: e.target.value })}
                        className="liquid-glass-input w-full p-2 rounded-lg bg-slate-900"
                      >
                        <option value="First Semester">First Semester</option>
                        <option value="Second Semester">Second Semester</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Degree Level</label>
                      <select
                        value={studentForm.level}
                        onChange={(e) => setStudentForm({ ...studentForm, level: e.target.value as any })}
                        className="liquid-glass-input w-full p-2 rounded-lg bg-slate-900"
                      >
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Postgraduate">Postgraduate</option>
                        <option value="Doctoral">Doctoral</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">GPA (0-4.0)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="4.0"
                        required
                        value={studentForm.gpa}
                        onChange={(e) => setStudentForm({ ...studentForm, gpa: parseFloat(e.target.value) })}
                        className="liquid-glass-input w-full p-2 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Status</label>
                      <select
                        value={studentForm.status}
                        onChange={(e) => setStudentForm({ ...studentForm, status: e.target.value as any })}
                        className="liquid-glass-input w-full p-2 rounded-lg bg-slate-900"
                      >
                        <option value="Active">Active</option>
                        <option value="Probation">Probation</option>
                        <option value="Graduated">Graduated</option>
                        <option value="On Leave">On Leave</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'courses' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Course Code</label>
                      <input
                        type="text"
                        required
                        value={courseForm.code}
                        onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                        className="liquid-glass-input w-full p-2 rounded-lg font-mono"
                        placeholder="CS-450"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Department</label>
                      <select
                        value={courseForm.departmentId}
                        onChange={(e) => setCourseForm({ ...courseForm, departmentId: e.target.value })}
                        className="liquid-glass-input w-full p-2 rounded-lg bg-slate-900"
                      >
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Course Title</label>
                    <input
                      type="text"
                      required
                      value={courseForm.title}
                      onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                      className="liquid-glass-input w-full p-2 rounded-lg"
                      placeholder="e.g. Distributed Consensus Systems"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Semester</label>
                      <select
                        value={courseForm.semester || 'First Semester'}
                        onChange={(e) => setCourseForm({ ...courseForm, semester: e.target.value })}
                        className="liquid-glass-input w-full p-2 rounded-lg bg-slate-900"
                      >
                        <option value="First Semester">First Semester</option>
                        <option value="Second Semester">Second Semester</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Instructor</label>
                      <input
                        type="text"
                        required
                        value={courseForm.instructor}
                        onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                        className="liquid-glass-input w-full p-2 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Credits</label>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        required
                        value={courseForm.credits}
                        onChange={(e) => setCourseForm({ ...courseForm, credits: parseInt(e.target.value) })}
                        className="liquid-glass-input w-full p-2 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Capacity</label>
                      <input
                        type="number"
                        min="10"
                        max="500"
                        required
                        value={courseForm.capacity}
                        onChange={(e) => setCourseForm({ ...courseForm, capacity: parseInt(e.target.value) })}
                        className="liquid-glass-input w-full p-2 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'faculty' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={facultyForm.name}
                        onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                        className="liquid-glass-input w-full p-2 rounded-lg"
                        placeholder="Dr. Julia Sterling"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Academic Rank</label>
                      <select
                        value={facultyForm.rank}
                        onChange={(e) => setFacultyForm({ ...facultyForm, rank: e.target.value as any })}
                        className="liquid-glass-input w-full p-2 rounded-lg bg-slate-900"
                      >
                        <option value="Full Professor">Full Professor</option>
                        <option value="Associate Professor">Associate Professor</option>
                        <option value="Assistant Professor">Assistant Professor</option>
                        <option value="Lecturer">Lecturer</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={facultyForm.email}
                        onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                        className="liquid-glass-input w-full p-2 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Department</label>
                      <select
                        value={facultyForm.departmentId}
                        onChange={(e) => setFacultyForm({ ...facultyForm, departmentId: e.target.value })}
                        className="liquid-glass-input w-full p-2 rounded-lg bg-slate-900"
                      >
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Research Specialization</label>
                    <input
                      type="text"
                      required
                      value={facultyForm.specialization}
                      onChange={(e) => setFacultyForm({ ...facultyForm, specialization: e.target.value })}
                      className="liquid-glass-input w-full p-2 rounded-lg"
                      placeholder="e.g. High-throughput Genomic Informatics"
                    />
                  </div>
                </>
              )}

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-300 hover:text-white rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg cursor-pointer transition-all shadow-md"
                >
                  {isSubmitting ? 'Saving...' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="liquid-glass-card rounded-2xl max-w-lg w-full p-6 border border-white/20 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white tracking-tight">
                Edit {activeTab === 'students' ? 'Student' : activeTab === 'courses' ? 'Course' : 'Faculty'} Record
              </h3>
              <button 
                onClick={() => setEditingItem(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5 text-xs">
              {activeTab === 'students' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={studentForm.name}
                        onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                        className="liquid-glass-input w-full p-2 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">GPA</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="4.0"
                        required
                        value={studentForm.gpa}
                        onChange={(e) => setStudentForm({ ...studentForm, gpa: parseFloat(e.target.value) })}
                        className="liquid-glass-input w-full p-2 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Status</label>
                      <select
                        value={studentForm.status}
                        onChange={(e) => setStudentForm({ ...studentForm, status: e.target.value as any })}
                        className="liquid-glass-input w-full p-2 rounded-lg bg-slate-900"
                      >
                        <option value="Active">Active</option>
                        <option value="Probation">Probation</option>
                        <option value="Graduated">Graduated</option>
                        <option value="On Leave">On Leave</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Credits Completed</label>
                      <input
                        type="number"
                        required
                        value={studentForm.creditsCompleted}
                        onChange={(e) => setStudentForm({ ...studentForm, creditsCompleted: parseInt(e.target.value) })}
                        className="liquid-glass-input w-full p-2 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'courses' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-slate-300 font-medium block">Course Code</label>
                        <span className="text-[10px] font-mono text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">
                          Admin Editable
                        </span>
                      </div>
                      <input
                        type="text"
                        required
                        value={courseForm.code || ''}
                        onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value.toUpperCase() })}
                        className="liquid-glass-input w-full p-2 rounded-lg font-mono font-bold text-cyan-300 border-cyan-500/40 focus:border-cyan-400"
                        placeholder="e.g. CS-301"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Department</label>
                      <select
                        value={courseForm.departmentId}
                        onChange={(e) => setCourseForm({ ...courseForm, departmentId: e.target.value })}
                        className="liquid-glass-input w-full p-2 rounded-lg bg-slate-900"
                      >
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Course Title</label>
                      <input
                        type="text"
                        required
                        value={courseForm.title}
                        onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                        className="liquid-glass-input w-full p-2 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Instructor</label>
                      <input
                        type="text"
                        required
                        value={courseForm.instructor}
                        onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                        className="liquid-glass-input w-full p-2 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Enrolled Count</label>
                      <input
                        type="number"
                        required
                        value={courseForm.enrolled}
                        onChange={(e) => setCourseForm({ ...courseForm, enrolled: parseInt(e.target.value) })}
                        className="liquid-glass-input w-full p-2 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Pass Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={courseForm.passRate}
                        onChange={(e) => setCourseForm({ ...courseForm, passRate: parseFloat(e.target.value) })}
                        className="liquid-glass-input w-full p-2 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'faculty' && (
                <>
                  <div>
                    <label className="text-slate-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={facultyForm.name}
                      onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                      className="liquid-glass-input w-full p-2 rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Academic Rank</label>
                      <select
                        value={facultyForm.rank}
                        onChange={(e) => setFacultyForm({ ...facultyForm, rank: e.target.value as any })}
                        className="liquid-glass-input w-full p-2 rounded-lg bg-slate-900"
                      >
                        <option value="Full Professor">Full Professor</option>
                        <option value="Associate Professor">Associate Professor</option>
                        <option value="Assistant Professor">Assistant Professor</option>
                        <option value="Lecturer">Lecturer</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Teaching Rating</label>
                      <input
                        type="number"
                        step="0.05"
                        min="1"
                        max="5"
                        required
                        value={facultyForm.rating}
                        onChange={(e) => setFacultyForm({ ...facultyForm, rating: parseFloat(e.target.value) })}
                        className="liquid-glass-input w-full p-2 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs text-slate-300 hover:text-white rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg cursor-pointer transition-all shadow-md"
                >
                  {isSubmitting ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="liquid-glass-card rounded-2xl max-w-sm w-full p-6 border border-rose-500/30 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-white">Confirm Record Deletion</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete the {deleteConfirmItem.type} record for:
              <br />
              <strong className="text-white font-mono mt-1 block">{deleteConfirmItem.name}</strong>
              This will remove the entity from institutional databases.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setDeleteConfirmItem(null)}
                className="px-3.5 py-1.5 text-slate-300 hover:text-white rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
                className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg shadow-md transition-all cursor-pointer"
              >
                {isSubmitting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
