import React, { useState, useEffect } from 'react';
import { UserAccount, Department } from '../types';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle,
  BookOpen
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  departments: Department[];
  initialMode?: 'signin' | 'signup';
  onLogin: (email?: string, role?: string) => Promise<void>;
  onSignup: (data: {
    name: string;
    email: string;
    password: string;
    role: 'super_admin' | 'dean' | 'faculty' | 'student';
    departmentId?: string;
    studentId?: string;
    facultyId?: string;
    level?: string;
    specialization?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  onLogout: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  departments,
  initialMode = 'signin',
  onLogin,
  onSignup,
  onLogout
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Sign In state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupRole, setSignupRole] = useState<'student' | 'faculty' | 'dean' | 'super_admin'>('student');
  const [signupDepartmentId, setSignupDepartmentId] = useState(departments[0]?.id || 'dept-cs');
  const [signupLevel, setSignupLevel] = useState<'Undergraduate' | 'Postgraduate' | 'Doctoral'>('Undergraduate');
  const [signupStudentId, setSignupStudentId] = useState('');
  const [signupFacultyRank, setSignupFacultyRank] = useState('Assistant Professor');
  const [signupSpecialization, setSignupSpecialization] = useState('Computer Systems & Machine Learning');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage('');
      setSuccessMessage('');
      if (!signupStudentId) {
        setSignupStudentId(`UNI-2026-${Math.floor(100 + Math.random() * 900)}`);
      }
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await onLogin(loginEmail);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickRole = async (role: string, emailPreset: string) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await onLogin(emailPreset, role);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Quick login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (signupPassword.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await onSignup({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        role: signupRole,
        departmentId: signupDepartmentId,
        studentId: signupRole === 'student' ? signupStudentId : undefined,
        facultyId: signupRole === 'faculty' ? `FAC-0${Math.floor(60 + Math.random() * 40)}` : undefined,
        level: signupRole === 'student' ? signupLevel : undefined,
        specialization: signupRole === 'faculty' ? signupSpecialization : undefined
      });

      if (res.success) {
        setSuccessMessage('Account registered successfully! Logging you in...');
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setErrorMessage(res.error || 'Registration failed. Institutional email may already be in use.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const demoAccounts = [
    {
      role: 'super_admin',
      name: 'Chancellor Arthur Pendelton',
      email: 'admin@university.edu',
      label: 'Super Admin',
      desc: 'Full system and budget governance',
      avatar: '/src/assets/images/avatar_chancellor_black_1793096183885.jpg'
    },
    {
      role: 'dean',
      name: 'Dr. Eleanor Vance',
      email: 'dean.cs@university.edu',
      label: 'Academic Dean',
      desc: 'CS Department management',
      avatar: '/src/assets/images/avatar_dean_black_1793096182639.jpg'
    },
    {
      role: 'faculty',
      name: 'Prof. Marcus Holloway',
      email: 'prof.holloway@university.edu',
      label: 'Faculty Member',
      desc: 'Courses & grade submissions',
      avatar: '/src/assets/images/avatar_chancellor_black_1793096183885.jpg'
    },
    {
      role: 'student',
      name: 'Alex Rivera',
      email: 'alex.rivera@student.edu',
      label: 'Honors Student',
      desc: 'Personal performance & courses',
      avatar: '/src/assets/images/avatar_student_black_1793096183680.jpg'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="liquid-glass-luminous rounded-2xl max-w-lg w-full p-6 border border-white/25 shadow-2xl animate-in zoom-in-95 my-6">
        
        {/* Header & Tabs */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.12]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-300" />
            <h3 className="text-base font-bold text-white tracking-tight">
              UNI METRICS Authentication
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="mt-4 p-1 rounded-xl bg-slate-900/90 border border-white/10 flex items-center gap-1">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMessage(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'signin'
                ? 'bg-gradient-to-r from-cyan-100 via-sky-50 to-white text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMessage(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-cyan-100 via-sky-50 to-white text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Sign Up / Register
          </button>
        </div>

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div className="mt-3 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ================= MODE: SIGN IN ================= */}
        {mode === 'signin' && (
          <div className="mt-4 space-y-4">
            {/* Active Session Info */}
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400">Current Authenticated Session:</div>
                <div className="text-xs font-semibold text-white mt-0.5">{currentUser.name}</div>
                <div className="text-[10px] text-cyan-300 font-mono">Role: {currentUser.role}</div>
              </div>
              <button
                type="button"
                onClick={() => { onLogout(); onClose(); }}
                className="px-3 py-1.5 text-xs text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/25 rounded-lg transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </div>

            {/* Quick Demo Switcher */}
            <div>
              <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Instant Demo Account Switcher
              </div>
              <div className="space-y-2">
                {demoAccounts.map((acc) => {
                  const isActive = currentUser.role === acc.role;
                  return (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => handleQuickRole(acc.role, acc.email)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isActive
                          ? 'bg-white/[0.16] border-white/40 text-white shadow-[0_2px_12px_rgba(255,255,255,0.1)]'
                          : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.08] text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover border-2 border-white/30 shrink-0 shadow-sm"
                        />
                        <div>
                          <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                            {acc.name}
                            <span className="text-[10px] font-mono text-cyan-300 px-1.5 py-0.2 rounded bg-slate-900/80 border border-white/10">
                              {acc.label}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-300 mt-0.5">{acc.desc}</div>
                        </div>
                      </div>
                      {isActive ? (
                        <CheckCircle className="w-4 h-4 text-cyan-300 shrink-0 ml-2" />
                      ) : (
                        <LogIn className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Manual Credentials Form */}
            <form onSubmit={handleLoginSubmit} className="pt-3 border-t border-white/[0.08] space-y-3 text-xs">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Or Sign In with Credentials
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Institutional Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="user@university.edu"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="liquid-glass-input w-full pl-8 pr-3 py-2 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="liquid-glass-input w-full pl-8 pr-3 py-2 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-xs text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer"
                >
                  Need an account? Sign Up →
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-1.5 font-semibold text-slate-950 bg-gradient-to-r from-cyan-100 via-sky-50 to-white hover:brightness-105 rounded-lg shadow-md transition-all cursor-pointer"
                  >
                    {isSubmitting ? 'Authenticating...' : 'Sign In'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ================= MODE: SIGN UP ================= */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="mt-4 space-y-3.5 text-xs">
            
            {/* Role Segmented Buttons */}
            <div>
              <label className="text-slate-300 font-medium block mb-1.5">
                Registering As (Institutional Role)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { role: 'student', label: 'Student', icon: GraduationCap },
                  { role: 'faculty', label: 'Faculty', icon: BookOpen },
                  { role: 'dean', label: 'Dean', icon: Building2 },
                  { role: 'super_admin', label: 'Admin', icon: ShieldCheck }
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setSignupRole(item.role as any)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      signupRole === item.role
                        ? 'bg-white/[0.18] border-white/50 text-white shadow-sm'
                        : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-4 h-4 text-cyan-300" />
                    <span className="font-semibold text-[11px]">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Full Legal Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kendra Washington"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="liquid-glass-input w-full pl-8 pr-3 py-2 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Institutional Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="kendra.w@university.edu"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="liquid-glass-input w-full pl-8 pr-3 py-2 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Department Assignment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Academic Department</label>
                <select
                  value={signupDepartmentId}
                  onChange={(e) => setSignupDepartmentId(e.target.value)}
                  className="liquid-glass-input w-full p-2 rounded-lg bg-slate-900 cursor-pointer"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>

              {/* Conditional Role Details */}
              {signupRole === 'student' && (
                <div>
                  <label className="text-slate-400 block mb-1">Cohort / Degree Level</label>
                  <select
                    value={signupLevel}
                    onChange={(e) => setSignupLevel(e.target.value as any)}
                    className="liquid-glass-input w-full p-2 rounded-lg bg-slate-900 cursor-pointer"
                  >
                    <option value="Undergraduate">Undergraduate Honors</option>
                    <option value="Postgraduate">Postgraduate (MS)</option>
                    <option value="Doctoral">Doctoral (PhD)</option>
                  </select>
                </div>
              )}

              {signupRole === 'faculty' && (
                <div>
                  <label className="text-slate-400 block mb-1">Academic Rank</label>
                  <select
                    value={signupFacultyRank}
                    onChange={(e) => setSignupFacultyRank(e.target.value)}
                    className="liquid-glass-input w-full p-2 rounded-lg bg-slate-900 cursor-pointer"
                  >
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Full Professor">Full Professor</option>
                    <option value="Lecturer">Lecturer</option>
                  </select>
                </div>
              )}

              {(signupRole === 'dean' || signupRole === 'super_admin') && (
                <div>
                  <label className="text-slate-400 block mb-1">Administrative Office</label>
                  <input
                    type="text"
                    disabled
                    value={signupRole === 'dean' ? 'Office of the Dean' : 'Chancellor Executive Registry'}
                    className="liquid-glass-input w-full p-2 rounded-lg bg-slate-900/60 text-slate-400"
                  />
                </div>
              )}
            </div>

            {/* If Student: Matriculation ID */}
            {signupRole === 'student' && (
              <div>
                <label className="text-slate-400 block mb-1">Assigned Student Matriculation ID</label>
                <input
                  type="text"
                  required
                  value={signupStudentId}
                  onChange={(e) => setSignupStudentId(e.target.value)}
                  className="liquid-glass-input w-full p-2 rounded-lg font-mono text-cyan-300 font-semibold"
                />
              </div>
            )}

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Account Password (min 6 chars)</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="liquid-glass-input w-full pl-8 pr-3 py-2 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    className="liquid-glass-input w-full pl-8 pr-3 py-2 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-xs text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer"
              >
                ← Already have an account? Sign In
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 font-semibold text-slate-950 bg-gradient-to-r from-cyan-100 via-sky-50 to-white hover:brightness-105 rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? 'Creating Account...' : 'Complete Sign Up'}
                </button>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
