import React, { useState, useEffect } from 'react';
import { Department } from '../types';
import { api } from '../services/api';
import { 
  Building2, 
  BookOpen, 
  Award, 
  DollarSign, 
  CheckCircle2, 
  Star,
  Users
} from 'lucide-react';

interface DepartmentDashboardProps {
  selectedDeptId: string;
  onSelectDepartment: (deptId: string) => void;
  departments: Department[];
  onNavigateToRecords: (deptId: string) => void;
}

export const DepartmentDashboard: React.FC<DepartmentDashboardProps> = ({
  selectedDeptId,
  onSelectDepartment,
  departments,
  onNavigateToRecords
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const activeDept = departments.find(d => d.id === selectedDeptId) || departments[0] || {
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
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.getDepartmentData(activeDept.id).then((res) => {
      if (isMounted) {
        setData(res);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [activeDept.id]);

  const courseList = data?.coursePerformance || [
    { id: 'crs-1', code: 'CS-301', title: 'Data Structures & Algorithmic Complexity', instructor: 'Dr. Alan Turing-Ward', enrolled: 184, capacity: 200, passRate: 91.5, avgGrade: '3.62', level: 'Undergraduate' },
    { id: 'crs-2', code: 'CS-402', title: 'Deep Learning & Neural Architectures', instructor: 'Dr. Eleanor Vance', enrolled: 92, capacity: 95, passRate: 95.6, avgGrade: '3.78', level: 'Postgraduate' },
    { id: 'crs-3', code: 'CS-204', title: 'Database Systems & Relational Theory', instructor: 'Prof. David Codd', enrolled: 210, capacity: 220, passRate: 89.2, avgGrade: '3.41', level: 'Undergraduate' }
  ];

  const facultyList = data?.facultyWorkload || [
    { name: 'Dr. Eleanor Vance', courses: 3, rating: 4.9, publications: 48, workloadHours: 36 },
    { name: 'Dr. Alan Turing-Ward', courses: 4, rating: 4.85, publications: 29, workloadHours: 44 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Department Selector Segmented Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {departments.map((d) => {
          const isSelected = d.id === activeDept.id;
          return (
            <button
              key={d.id}
              onClick={() => onSelectDepartment(d.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                  : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              <span className="font-mono text-[11px] opacity-75">{d.code}</span>
              <span>{d.name}</span>
            </button>
          );
        })}
      </div>

      {/* Dean & Department Header Card */}
      <div className="liquid-glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            {/* Dean Avatar or Fallback */}
            <div className="relative shrink-0">
              <img
                src="/src/assets/images/avatar_dean_black_1793096182639.jpg"
                alt={activeDept.dean}
                referrerPolicy="no-referrer"
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/30 shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-bold text-xl text-white border border-white/20 shadow-xl -z-10 absolute inset-0">
                {activeDept.dean.charAt(0)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  Department of {activeDept.code}
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-400">Accredited Unit</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                {activeDept.name}
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
                {activeDept.description}
              </p>
              <div className="mt-2 text-xs text-slate-400">
                Academic Leadership: <strong className="text-white">{activeDept.dean}</strong>, Dean & Chair
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 sm:gap-4 self-stretch sm:self-auto shrink-0 justify-between sm:justify-start">
            <div className="text-right">
              <div className="text-[11px] text-slate-400">Research Grants</div>
              <div className="text-lg font-bold font-mono text-cyan-300 tabular-nums">
                ${(activeDept.researchGrants / 1000000).toFixed(1)}M
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-right">
              <div className="text-[11px] text-slate-400">Pass Rate</div>
              <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                {activeDept.passRate}%
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <button
              onClick={() => onNavigateToRecords(activeDept.id)}
              className="px-3 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              Filter Records
            </button>
          </div>

        </div>
      </div>

      {/* Department KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="liquid-glass rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-1 text-xl font-bold font-mono text-white tabular-nums">
            {activeDept.studentCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Active Cohorts</div>
        </div>

        <div className="liquid-glass rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Faculty Scholars</span>
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-1 text-xl font-bold font-mono text-white tabular-nums">
            {activeDept.facultyCount}
          </div>
          <div className="text-[11px] text-cyan-300 mt-0.5">Ratio 1:{Math.round(activeDept.studentCount / activeDept.facultyCount)}</div>
        </div>

        <div className="liquid-glass rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Department Avg GPA</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-1 text-xl font-bold font-mono text-white tabular-nums">
            {activeDept.averageGpa.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-400 mt-0.5">Top 15% Institutional</div>
        </div>

        <div className="liquid-glass rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Student Satisfaction</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-1 text-xl font-bold font-mono text-white tabular-nums">
            {activeDept.satisfactionRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Annual Campus Survey</div>
        </div>
      </div>

      {/* Curriculum Performance & Capacity Matrix (Full Width) */}
      <div className="liquid-glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Curriculum Performance & Capacity Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Detailed metrics for courses administered by {activeDept.name}
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {courseList.length} Active Courses
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Course Code & Title</th>
                <th className="py-2.5 px-3">Instructor</th>
                <th className="py-2.5 px-3 text-right">Capacity</th>
                <th className="py-2.5 px-3 text-right">Pass %</th>
                <th className="py-2.5 px-3 text-right">Avg Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {courseList.map((course: any) => {
                const fillRatio = Math.round((course.enrolled / course.capacity) * 100);
                return (
                  <tr key={course.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{course.code}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[280px]">{course.title}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{course.instructor}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums">
                      <span className="text-slate-200">{course.enrolled}</span>
                      <span className="text-slate-500"> / {course.capacity}</span>
                      <div className="text-[10px] text-cyan-400 font-sans">{fillRatio}% full</div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-400 tabular-nums">
                      {course.passRate}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-cyan-300 font-semibold tabular-nums">
                      {course.avgGrade}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Faculty Workload & Publication Ratings */}
      <div className="liquid-glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Departmental Faculty Workload & Instructional Ratings
            </h3>
            <p className="text-xs text-slate-400">
              Teaching load, student survey evaluations, and verified peer-reviewed publications
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {facultyList.map((fac: any, idx: number) => (
            <div key={idx} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-800 to-indigo-800 flex items-center justify-center font-bold text-white text-sm">
                  {fac.name.charAt(4) || fac.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-100">{fac.name}</div>
                  <div className="text-[11px] text-slate-400">{fac.courses} Courses Assigned · {fac.workloadHours}h/wk</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-amber-400 text-xs font-mono font-bold justify-end">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{fac.rating}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {fac.publications} Papers
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
