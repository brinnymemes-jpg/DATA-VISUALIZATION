import React, { useState } from 'react';
import { UserAccount } from '../types';
import { 
  BarChart3, 
  Building2, 
  UserCheck, 
  Database, 
  FileDown, 
  LogOut, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  ChevronDown 
} from 'lucide-react';

interface TopNavProps {
  currentView: string;
  onSelectView: (view: string) => void;
  currentUser: UserAccount;
  onOpenLogin: (initialMode?: 'signin' | 'signup') => void;
  onLogout: () => void;
  onOpenExportReport: () => void;
  onQuickSwitchUser: (role: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentView,
  onSelectView,
  currentUser,
  onOpenLogin,
  onLogout,
  onOpenExportReport,
  onQuickSwitchUser
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const navItems = [
    { id: 'institution', label: 'Institution Overview', icon: BarChart3 },
    { id: 'department', label: 'Departmental Hub', icon: Building2 },
    { id: 'performance', label: 'Personal Analytics', icon: UserCheck },
    { id: 'records', label: 'Record Management', icon: Database },
  ];

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Chancellor / Admin';
      case 'dean': return 'Academic Dean';
      case 'faculty': return 'Faculty Member';
      case 'student': return 'Honors Student';
      default: return role;
    }
  };

  const getUserAvatar = (role: string) => {
    switch (role) {
      case 'super_admin':
        return '/src/assets/images/avatar_chancellor_black_1793096183885.jpg';
      case 'dean':
        return '/src/assets/images/avatar_dean_black_1793096182639.jpg';
      case 'student':
        return '/src/assets/images/avatar_student_black_1793096183680.jpg';
      default:
        return '/src/assets/images/avatar_chancellor_black_1793096183885.jpg';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 border-b border-blue-400/30 shadow-[0_4px_30px_rgba(29,78,216,0.3)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#dashboard" 
          onClick={(e) => { e.preventDefault(); onSelectView('institution'); }} 
          className="text-lg font-bold tracking-tight text-white hover:text-cyan-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9]"></span>
          UNI METRICS
        </a>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                  isActive 
                    ? 'bg-white/[0.14] text-white border border-white/30 shadow-[0_2px_12px_rgba(255,255,255,0.1)]' 
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action & user account profile with light pearl blend */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenExportReport}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-100 via-sky-50 to-white hover:from-white hover:to-cyan-100 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] border border-white/60 transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-900" />
            Export Report
          </button>

          {/* User Account Capsule */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.18] shadow-[0_2px_10px_rgba(0,0,0,0.2)] transition-all cursor-pointer text-left"
              title="Click to switch account role or logout"
            >
              <div className="relative w-8 h-8 shrink-0">
                <img
                  src={getUserAvatar(currentUser.role)}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border-2 border-white/40 shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white -z-10 absolute inset-0">
                  {currentUser.name.charAt(0)}
                </div>
              </div>

              <div className="hidden md:block">
                <div className="text-xs font-semibold text-white max-w-[130px] truncate leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-cyan-300 font-medium leading-tight">
                  {getRoleLabel(currentUser.role)}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-300 ml-0.5" />
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowUserDropdown(false)} 
                />
                <div className="absolute right-0 mt-2 w-72 rounded-2xl liquid-glass-luminous border border-white/20 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2.5 border-b border-white/[0.12] flex items-center gap-3">
                    <img
                      src={getUserAvatar(currentUser.role)}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-white/40 shadow-sm shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-300 truncate">{currentUser.email}</div>
                      <div className="mt-0.5 flex items-center gap-1 text-[10px] text-cyan-300 font-medium">
                        <ShieldCheck className="w-3 h-3" />
                        {getRoleLabel(currentUser.role)}
                      </div>
                    </div>
                  </div>

                  <div className="py-1.5">
                    <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Role Context
                    </div>
                    
                    {/* Chancellor */}
                    <button
                      onClick={() => { onQuickSwitchUser('super_admin'); setShowUserDropdown(false); }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-white/[0.1] rounded-lg transition-colors flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img 
                          src="/src/assets/images/avatar_chancellor_black_1793096183885.jpg" 
                          alt="Chancellor" 
                          className="w-6 h-6 rounded-full object-cover border border-white/30 shrink-0" 
                        />
                        <span className="truncate">Chancellor Arthur Pendelton</span>
                      </div>
                      {currentUser.role === 'super_admin' && <span className="w-2 h-2 rounded-full bg-cyan-300 shrink-0" />}
                    </button>

                    {/* Dean */}
                    <button
                      onClick={() => { onQuickSwitchUser('dean'); setShowUserDropdown(false); }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-white/[0.1] rounded-lg transition-colors flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img 
                          src="/src/assets/images/avatar_dean_black_1793096182639.jpg" 
                          alt="Dean" 
                          className="w-6 h-6 rounded-full object-cover border border-white/30 shrink-0" 
                        />
                        <span className="truncate">Dean Dr. Eleanor Vance</span>
                      </div>
                      {currentUser.role === 'dean' && <span className="w-2 h-2 rounded-full bg-cyan-300 shrink-0" />}
                    </button>

                    {/* Student */}
                    <button
                      onClick={() => { onQuickSwitchUser('student'); setShowUserDropdown(false); }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-white/[0.1] rounded-lg transition-colors flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img 
                          src="/src/assets/images/avatar_student_black_1793096183680.jpg" 
                          alt="Student" 
                          className="w-6 h-6 rounded-full object-cover border border-white/30 shrink-0" 
                        />
                        <span className="truncate">Honors Student Alex Rivera</span>
                      </div>
                      {currentUser.role === 'student' && <span className="w-2 h-2 rounded-full bg-cyan-300 shrink-0" />}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-white/[0.1] flex items-center justify-between gap-1">
                    <button
                      onClick={() => { onOpenLogin('signin'); setShowUserDropdown(false); }}
                      className="px-2 py-1.5 text-xs text-slate-300 hover:text-white flex items-center gap-1 hover:bg-white/[0.06] rounded-md cursor-pointer transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      Sign In
                    </button>
                    <button
                      onClick={() => { onOpenLogin('signup'); setShowUserDropdown(false); }}
                      className="px-2 py-1.5 text-xs text-cyan-300 hover:text-white flex items-center gap-1 hover:bg-cyan-500/10 rounded-md cursor-pointer font-medium transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Sign Up
                    </button>
                    <button
                      onClick={() => { onLogout(); setShowUserDropdown(false); }}
                      className="px-2 py-1.5 text-xs text-rose-300 hover:text-rose-200 flex items-center gap-1 hover:bg-rose-500/10 rounded-md cursor-pointer transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Log Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Mobile Nav Strip */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 overflow-x-auto border-t border-blue-400/20 bg-blue-950/95">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isActive 
                  ? 'bg-white/[0.15] text-white border border-white/30' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
