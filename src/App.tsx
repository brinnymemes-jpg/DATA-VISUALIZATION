import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { 
  Department, 
  Course, 
  Student, 
  Faculty, 
  UserAccount, 
  FilterState, 
  InstitutionalKpis 
} from './types';

import { LiquidBackground } from './components/LiquidBackground';
import { TopNav } from './components/TopNav';
import { FilterBar } from './components/FilterBar';
import { InstitutionDashboard } from './components/InstitutionDashboard';
import { DepartmentDashboard } from './components/DepartmentDashboard';
import { PersonalPerformance } from './components/PersonalPerformance';
import { ManageRecords } from './components/ManageRecords';
import { UserManagement } from './components/UserManagement';
import { ExportReportModal } from './components/ExportReportModal';
import { LoginModal } from './components/LoginModal';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('institution');
  const [currentUser, setCurrentUser] = useState<UserAccount>({
    id: 'usr-1',
    name: 'Chancellor Arthur Pendelton',
    email: 'admin@university.edu',
    role: 'super_admin',
    status: 'Active',
    permissions: ['all_access', 'system_config', 'audit_logs', 'user_management', 'records_crud', 'export_reports', 'manage_budgets']
  });

  // Global filters
  const [filters, setFilters] = useState<FilterState>({
    session: '2026-2027',
    departmentId: 'all',
    courseId: 'all',
    level: 'all',
    semester: 'all'
  });

  // State data collections
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);

  // Institution dashboard aggregates
  const [institutionData, setInstitutionData] = useState<{
    kpis: InstitutionalKpis;
    enrollmentTrends: any[];
    gradeDistribution: any[];
    departmentBudgetComparison: any[];
    departmentalRatios: any[];
    departments: Department[];
  }>({
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
    enrollmentTrends: [],
    gradeDistribution: [],
    departmentBudgetComparison: [],
    departmentalRatios: [],
    departments: []
  });

  // Modals
  const [isExportReportOpen, setIsExportReportOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  // Department selected for deep-dive
  const [selectedDeptId, setSelectedDeptId] = useState<string>('dept-cs');

  // Load all foundational institutional data
  const loadAllData = async () => {
    try {
      const [depts, crs, stds, fac, usrList] = await Promise.all([
        api.getDepartments(),
        api.getCourses(),
        api.getStudents(),
        api.getFaculty(),
        api.getUsers()
      ]);

      if (depts && depts.length > 0) setDepartments(depts);
      if (crs) setCourses(crs);
      if (stds) setStudents(stds);
      if (fac) setFaculty(fac);
      if (usrList) setUsers(usrList);
    } catch (e) {
      console.error('Error fetching university data:', e);
    }
  };

  // Re-fetch institution KPIs whenever filters change
  const loadInstitutionAnalytics = async () => {
    try {
      const data = await api.getInstitutionData(filters);
      if (data) {
        setInstitutionData(data);
        if (data.departments && data.departments.length > 0 && departments.length === 0) {
          setDepartments(data.departments);
        }
      }
    } catch (e) {
      console.error('Error loading institution analytics:', e);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    loadInstitutionAnalytics();
  }, [filters]);

  // Auth actions
  const handleLogin = async (email?: string, role?: string) => {
    const res = await api.login(email, role);
    if (res?.user) {
      setCurrentUser(res.user);
    }
  };

  const handleSignup = async (data: any) => {
    const res = await api.signup(data);
    if (res?.success && res.user) {
      setCurrentUser(res.user);
      await loadAllData();
      await loadInstitutionAnalytics();
      return { success: true };
    }
    return { success: false, error: res?.error || 'Registration failed' };
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser({
      id: 'usr-guest',
      name: 'Guest Observer',
      email: 'guest@university.edu',
      role: 'student',
      status: 'Active',
      permissions: ['view_personal_performance']
    });
  };

  const handleQuickSwitchRole = async (role: string) => {
    let email = 'admin@university.edu';
    if (role === 'dean') email = 'dean.cs@university.edu';
    if (role === 'faculty') email = 'prof.holloway@university.edu';
    if (role === 'student') email = 'alex.rivera@student.edu';
    await handleLogin(email, role);
  };

  // Navigation callbacks
  const handleSelectDepartment = (deptId: string) => {
    setSelectedDeptId(deptId);
    setCurrentView('department');
  };

  const handleNavigateToRecords = (deptId: string) => {
    setFilters(prev => ({ ...prev, departmentId: deptId }));
    setCurrentView('records');
  };

  return (
    <div className="min-h-screen flex flex-col relative text-slate-800 bg-[#f8fafc] selection:bg-blue-600/20 selection:text-blue-900">
      
      {/* Dynamic ambient liquid background */}
      <LiquidBackground />

      {/* Top Bar Contract Navigation */}
      <TopNav
        currentView={currentView}
        onSelectView={setCurrentView}
        currentUser={currentUser}
        onOpenLogin={(mode?: 'signin' | 'signup') => {
          setAuthModalMode(mode || 'signin');
          setIsLoginModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenExportReport={() => setIsExportReportOpen(true)}
        onQuickSwitchUser={handleQuickSwitchRole}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Dynamic Global Filter Bar (visible across dashboard views) */}
        {(currentView === 'institution' || currentView === 'department') && (
          <FilterBar
            filters={filters}
            onFilterChange={setFilters}
            departments={departments}
            courses={courses}
          />
        )}

        {/* VIEW 1: Institution Wide Dashboard */}
        {currentView === 'institution' && (
          <InstitutionDashboard
            kpis={institutionData.kpis}
            enrollmentTrends={institutionData.enrollmentTrends}
            gradeDistribution={institutionData.gradeDistribution}
            departmentBudgetComparison={institutionData.departmentBudgetComparison}
            departmentalRatios={institutionData.departmentalRatios}
            departments={departments}
            onSelectDepartment={handleSelectDepartment}
          />
        )}

        {/* VIEW 2: Departmental Hub */}
        {currentView === 'department' && (
          <DepartmentDashboard
            selectedDeptId={selectedDeptId}
            onSelectDepartment={setSelectedDeptId}
            departments={departments}
            onNavigateToRecords={handleNavigateToRecords}
          />
        )}

        {/* VIEW 3: Personal Performance Analytics */}
        {currentView === 'performance' && (
          <PersonalPerformance
            students={students}
          />
        )}

        {/* VIEW 4: Manage Records (CRUD) */}
        {currentView === 'records' && (
          <ManageRecords
            students={students}
            courses={courses}
            faculty={faculty}
            departments={departments}
            onRefreshData={loadAllData}
            preselectedDeptId={filters.departmentId !== 'all' ? filters.departmentId : undefined}
            currentUser={currentUser}
          />
        )}

        {/* VIEW 5: Manage User Accounts & Roles (RBAC) */}
        {currentView === 'users' && (
          <UserManagement
            users={users}
            departments={departments}
            onRefreshUsers={loadAllData}
            currentUser={currentUser}
          />
        )}

      </main>

      {/* Footer bar with quick link to User Roles & System Info */}
      <footer className="w-full border-t border-slate-200/90 bg-white/95 backdrop-blur-md py-4 text-xs text-slate-600 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-900">UNI METRICS</span>
            <span className="text-slate-300">·</span>
            <span>Data Visualization & Management for Universities</span>
            <span className="text-slate-300">·</span>
            <span className="font-mono text-blue-600 font-medium">Node.js Express Engine Active</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('users')}
              className={`hover:text-blue-600 transition-colors cursor-pointer ${currentView === 'users' ? 'text-blue-600 font-semibold' : ''}`}
            >
              Role & Access Control
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={() => setIsExportReportOpen(true)}
              className="hover:text-blue-600 transition-colors cursor-pointer font-medium"
            >
              Print Certified PDF
            </button>
          </div>
        </div>
      </footer>

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportReportOpen}
        onClose={() => setIsExportReportOpen(false)}
        kpis={institutionData.kpis}
        departments={departments}
        filters={filters}
      />

      {/* Login / Sign Up Account Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        departments={departments}
        initialMode={authModalMode}
        onLogin={handleLogin}
        onSignup={handleSignup}
        onLogout={handleLogout}
      />

    </div>
  );
}
