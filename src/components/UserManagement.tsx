import React, { useState } from 'react';
import { UserAccount, Department } from '../types';
import { api } from '../services/api';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Pencil, 
  Trash2, 
  Check, 
  X, 
  Lock, 
  ShieldAlert,
  UserCheck
} from 'lucide-react';

interface UserManagementProps {
  users: UserAccount[];
  departments: Department[];
  onRefreshUsers: () => void;
  currentUser: UserAccount;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  departments,
  onRefreshUsers,
  currentUser
}) => {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userForm, setUserForm] = useState<Partial<UserAccount>>({
    name: '',
    email: '',
    role: 'faculty',
    departmentId: 'dept-cs',
    status: 'Active',
    permissions: ['course_management', 'grade_entry', 'attendance_tracking']
  });

  const roleDefinitions = [
    {
      role: 'super_admin',
      label: 'Chancellor / Super Admin',
      description: 'Unrestricted governance across all campuses, endowments, user credentials, and institutional databases.',
      permissions: ['All System Permissions', 'Security Audit', 'Budget Control', 'User CRUD', 'Export Reports']
    },
    {
      role: 'dean',
      label: 'Academic Dean',
      description: 'Departmental authority over faculty appointments, course curriculum approvals, student appeals, and department reports.',
      permissions: ['Department Governance', 'Faculty Review', 'Grade Overrides', 'Student Roster', 'Audio Logs']
    },
    {
      role: 'faculty',
      label: 'Faculty / Professor',
      description: 'Instructional control over assigned courses, grade entry, lecture audio recordings, and student advisement.',
      permissions: ['Course Syllabi', 'Grade Entry', 'Class Attendance', 'Record Audio Logs']
    },
    {
      role: 'student',
      label: 'Enrolled Student',
      description: 'Self-service access to personal GPA progression, registered courses, transcripts, and open audio archives.',
      permissions: ['Personal Analytics', 'Course Materials', 'Public Archives', 'Transcript View']
    }
  ];

  const permissionMatrix = [
    { feature: 'Institution-Wide KPIs & Budgets', super_admin: true, dean: true, faculty: false, student: false },
    { feature: 'Departmental Drill-Downs', super_admin: true, dean: true, faculty: true, student: false },
    { feature: 'Personal Performance Analytics', super_admin: true, dean: true, faculty: true, student: true },
    { feature: 'Student & Course Record CRUD', super_admin: true, dean: true, faculty: false, student: false },
    { feature: 'Grade Entry & Adjustments', super_admin: true, dean: true, faculty: true, student: false },
    { feature: 'User Accounts & Role Assignment', super_admin: true, dean: false, faculty: false, student: false },
    { feature: 'Listen to Senate Audio Archives', super_admin: true, dean: true, faculty: true, student: true },
    { feature: 'Record New Audio Sessions', super_admin: true, dean: true, faculty: true, student: false },
    { feature: 'Export Official PDF Reports', super_admin: true, dean: true, faculty: false, student: false },
  ];

  const handleSaveAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createUser(userForm);
      setIsAddUserModalOpen(false);
      onRefreshUsers();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSubmitting(true);
    try {
      await api.updateUser(editingUser.id, userForm);
      setEditingUser(null);
      onRefreshUsers();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: UserAccount) => {
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    await api.updateUser(user.id, { status: newStatus });
    onRefreshUsers();
  };

  const handleDeleteUser = async (user: UserAccount) => {
    if (user.id === 'usr-1') {
      alert('Root Chancellor account cannot be deleted.');
      return;
    }
    if (confirm(`Revoke credentials and remove user account: ${user.name}?`)) {
      await api.deleteUser(user.id);
      onRefreshUsers();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="liquid-glass-card rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            User Account & Role-Based Access Control (RBAC)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage institutional user privileges, authentication status, and multi-tiered role policies
          </p>
        </div>

        <button
          onClick={() => {
            setUserForm({
              name: '',
              email: '',
              role: 'faculty',
              departmentId: 'dept-cs',
              status: 'Active',
              permissions: ['course_management', 'grade_entry']
            });
            setIsAddUserModalOpen(true);
          }}
          className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Create User
        </button>
      </div>

      {/* Role Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roleDefinitions.map((rd) => (
          <div key={rd.role} className="liquid-glass rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-cyan-300 uppercase tracking-wider text-[11px] font-mono">{rd.role}</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400/80" />
              </div>
              <h3 className="text-sm font-semibold text-white tracking-tight">{rd.label}</h3>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{rd.description}</p>
            </div>
            <div className="mt-3 pt-3 border-t border-white/[0.08] text-[10px] text-slate-300">
              <span className="text-slate-400">Sample Permissions:</span> {rd.permissions.slice(0, 3).join(', ')}
            </div>
          </div>
        ))}
      </div>

      {/* Users Accounts Table */}
      <div className="liquid-glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">Active User Directory</h3>
            <p className="text-xs text-slate-400">Institutional accounts with assigned roles and credentials</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">{users.length} Enrolled Users</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Role Policy</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3">Last Active</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {users.map((u) => {
                const isCurrent = u.id === currentUser.id;
                const avatarSrc = u.role === 'super_admin' 
                  ? '/src/assets/images/avatar_chancellor_black_1793096183885.jpg'
                  : u.role === 'dean'
                  ? '/src/assets/images/avatar_dean_black_1793096182639.jpg'
                  : u.role === 'student'
                  ? '/src/assets/images/avatar_student_black_1793096183680.jpg'
                  : '/src/assets/images/avatar_chancellor_black_1793096183885.jpg';

                return (
                  <tr key={u.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/30 shadow-sm">
                          <img
                            src={avatarSrc}
                            alt={u.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="w-full h-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white -z-10 absolute inset-0">
                            {u.name.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            {u.name}
                            {isCurrent && (
                              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-800">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold font-mono ${
                        u.role === 'super_admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                        u.role === 'dean' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                        u.role === 'faculty' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                        'bg-slate-700/40 text-slate-300 border border-white/10'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {departments.find(d => d.id === u.departmentId)?.name || 'General / Central Admin'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={u.id === 'usr-1'}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors cursor-pointer ${
                          u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                        }`}
                        title="Click to toggle status"
                      >
                        {u.status}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Pending'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingUser(u);
                            setUserForm({ ...u });
                          }}
                          className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-white/[0.06] rounded-md transition-colors cursor-pointer"
                          title="Edit User Role"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {u.id !== 'usr-1' && (
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permission Matrix Table */}
      <div className="liquid-glass-card rounded-2xl p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-white tracking-tight">Institutional Role-Based Permission Matrix</h3>
          <p className="text-xs text-slate-400">Capability privileges enforced across system API routes and client views</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">System Module / Action</th>
                <th className="py-2.5 px-3 text-center">Super Admin</th>
                <th className="py-2.5 px-3 text-center">Dean</th>
                <th className="py-2.5 px-3 text-center">Faculty</th>
                <th className="py-2.5 px-3 text-center">Student</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {permissionMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/[0.03]">
                  <td className="py-3 px-3 font-medium text-slate-200">{item.feature}</td>
                  <td className="py-3 px-3 text-center">
                    {item.super_admin ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {item.dean ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {item.faculty ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {item.student ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="liquid-glass-card rounded-2xl max-w-md w-full p-6 border border-white/20 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white tracking-tight">Create Institutional User</h3>
              <button onClick={() => setIsAddUserModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddUser} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="liquid-glass-input w-full p-2 rounded-lg"
                  placeholder="e.g. Dr. Jordan Bennett"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Institutional Email</label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="liquid-glass-input w-full p-2 rounded-lg"
                  placeholder="jordan.b@university.edu"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Assigned Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                    className="liquid-glass-input w-full p-2 rounded-lg bg-slate-900"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="dean">Academic Dean</option>
                    <option value="faculty">Faculty Member</option>
                    <option value="student">Student</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Department</label>
                  <select
                    value={userForm.departmentId}
                    onChange={(e) => setUserForm({ ...userForm, departmentId: e.target.value })}
                    className="liquid-glass-input w-full p-2 rounded-lg bg-slate-900"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.code} - {d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-300 hover:text-white rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg cursor-pointer transition-all shadow-md"
                >
                  {isSubmitting ? 'Provisioning...' : 'Provision Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="liquid-glass-card rounded-2xl max-w-md w-full p-6 border border-white/20 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white tracking-tight">Edit User Account</h3>
              <button onClick={() => setEditingUser(null)} className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="liquid-glass-input w-full p-2 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Assigned Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                    className="liquid-glass-input w-full p-2 rounded-lg bg-slate-900"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="dean">Academic Dean</option>
                    <option value="faculty">Faculty Member</option>
                    <option value="student">Student</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Status</label>
                  <select
                    value={userForm.status}
                    onChange={(e) => setUserForm({ ...userForm, status: e.target.value as any })}
                    className="liquid-glass-input w-full p-2 rounded-lg bg-slate-900"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs text-slate-300 hover:text-white rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg cursor-pointer transition-all shadow-md"
                >
                  {isSubmitting ? 'Updating...' : 'Save Privileges'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
