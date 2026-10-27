import React, { useState } from 'react';
import { InstitutionalKpis, Department } from '../types';
import { 
  Users, 
  GraduationCap, 
  Award, 
  DollarSign, 
  TrendingUp, 
  BookOpen, 
  ArrowUpRight,
  ShieldAlert,
  Percent
} from 'lucide-react';

interface InstitutionDashboardProps {
  kpis: InstitutionalKpis;
  enrollmentTrends: any[];
  gradeDistribution: any[];
  departmentBudgetComparison: any[];
  departmentalRatios: any[];
  departments: Department[];
  onSelectDepartment: (deptId: string) => void;
}

export const InstitutionDashboard: React.FC<InstitutionDashboardProps> = ({
  kpis,
  enrollmentTrends,
  gradeDistribution,
  departmentBudgetComparison,
  departmentalRatios,
  departments,
  onSelectDepartment
}) => {
  const [hoveredTrendYear, setHoveredTrendYear] = useState<number | null>(null);

  // SVG Chart Dimensions for Enrollment
  const chartWidth = 640;
  const chartHeight = 220;
  const padding = { top: 20, right: 30, bottom: 35, left: 55 };

  // Max enrollment for scaling
  const maxEnrollment = Math.max(...enrollmentTrends.map(t => t.total || 11000), 11000);
  const minEnrollment = 6000;

  const getX = (index: number) => {
    const usableWidth = chartWidth - padding.left - padding.right;
    return padding.left + (index / (enrollmentTrends.length - 1)) * usableWidth;
  };

  const getY = (val: number) => {
    const usableHeight = chartHeight - padding.top - padding.bottom;
    const ratio = (val - minEnrollment) / (maxEnrollment - minEnrollment);
    return chartHeight - padding.bottom - ratio * usableHeight;
  };

  // Build SVG path strings
  const totalPath = enrollmentTrends.map((t, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(t.total)}`).join(' ');
  const undergradPath = enrollmentTrends.map((t, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(t.undergrad)}`).join(' ');
  const areaTotalPath = `${totalPath} L ${getX(enrollmentTrends.length - 1)} ${chartHeight - padding.bottom} L ${getX(0)} ${chartHeight - padding.bottom} Z`;

  return (
    <div className="space-y-6">
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total Students */}
        <div className="liquid-glass-card rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Students</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
              {kpis.totalStudents.toLocaleString()}
            </div>
            <div className="text-[11px] text-cyan-300 flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>+6.2% vs last term</span>
            </div>
          </div>
        </div>

        {/* Total Faculty */}
        <div className="liquid-glass-card rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Faculty Staff</span>
            <GraduationCap className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
              {kpis.totalFaculty.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              <span>Ratio: <strong className="text-slate-200">{kpis.facultyStudentRatio}</strong></span>
            </div>
          </div>
        </div>

        {/* Institutional GPA */}
        <div className="liquid-glass-card rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Campus Avg GPA</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
              {kpis.averageGpa.toFixed(2)}
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">
              <span>Honors Cohort: 41.2%</span>
            </div>
          </div>
        </div>

        {/* Pass Rate */}
        <div className="liquid-glass-card rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Course Pass Rate</span>
            <Percent className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
              {kpis.overallPassRate}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              <span>Retention: <strong className="text-slate-200">{kpis.retentionRate}%</strong></span>
            </div>
          </div>
        </div>

        {/* Research Grants */}
        <div className="liquid-glass-card rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Research Grants</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
              ${(kpis.totalGrantsUSD / 1000000).toFixed(1)}M
            </div>
            <div className="text-[11px] text-cyan-300 mt-0.5">
              <span>18 Active Endowments</span>
            </div>
          </div>
        </div>

        {/* Operational Budget */}
        <div className="liquid-glass-card rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Budget Utilized</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
              {Math.round((kpis.totalSpentUSD / kpis.totalBudgetUSD) * 100)}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              <span>${(kpis.totalSpentUSD / 1000000).toFixed(1)}M of ${(kpis.totalBudgetUSD / 1000000).toFixed(1)}M</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Multi-Year Enrollment Historical Progression (7 cols) */}
        <div className="lg:col-span-7 liquid-glass-card rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Academic Session Enrollment Trends & Projections
              </h3>
              <p className="text-xs text-slate-400">
                Total student intake across Undergraduate, Postgraduate, and Doctoral cohorts
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Total
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Undergrad
              </span>
            </div>
          </div>

          {/* Responsive SVG Chart */}
          <div className="w-full overflow-x-auto pt-2">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-auto min-w-[500px] overflow-visible"
            >
              <defs>
                <linearGradient id="enrollmentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[6000, 8000, 10000].map((tick) => {
                const y = getY(tick);
                return (
                  <g key={tick}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={chartWidth - padding.right}
                      y2={y}
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding.left - 10}
                      y={y + 4}
                      fill="#94a3b8"
                      fontSize="10"
                      textAnchor="end"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {tick.toLocaleString()}
                    </text>
                  </g>
                );
              })}

              {/* Shaded Area for Total */}
              <path d={areaTotalPath} fill="url(#enrollmentGrad)" />

              {/* Undergrad line */}
              <path
                d={undergradPath}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
                strokeDasharray="3 3"
              />

              {/* Total line */}
              <path
                d={totalPath}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points & X Labels */}
              {enrollmentTrends.map((t, idx) => {
                const x = getX(idx);
                const yTotal = getY(t.total);
                const isHovered = hoveredTrendYear === idx;

                return (
                  <g key={t.session} className="cursor-pointer" onMouseEnter={() => setHoveredTrendYear(idx)} onMouseLeave={() => setHoveredTrendYear(null)}>
                    {/* Vertical guideline on hover */}
                    {isHovered && (
                      <line
                        x1={x}
                        y1={padding.top}
                        x2={x}
                        y2={chartHeight - padding.bottom}
                        stroke="#38bdf8"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                      />
                    )}

                    {/* Point Circle */}
                    <circle
                      cx={x}
                      cy={yTotal}
                      r={isHovered ? 6 : 4}
                      fill="#030712"
                      stroke="#22d3ee"
                      strokeWidth={isHovered ? 3 : 2}
                      className="transition-all duration-150"
                    />

                    {/* X-axis Label */}
                    <text
                      x={x}
                      y={chartHeight - 12}
                      fill={isHovered ? '#38bdf8' : '#94a3b8'}
                      fontSize="11"
                      textAnchor="middle"
                      fontFamily="Plus Jakarta Sans, sans-serif"
                      fontWeight={isHovered ? '600' : '400'}
                    >
                      {t.session}
                    </text>

                    {/* Value Badge on hover or current */}
                    {(isHovered || idx === enrollmentTrends.length - 1) && (
                      <g>
                        <rect
                          x={x - 38}
                          y={yTotal - 28}
                          width="76"
                          height="20"
                          rx="4"
                          fill="#0f172a"
                          stroke="rgba(34, 211, 238, 0.4)"
                          strokeWidth="1"
                        />
                        <text
                          x={x}
                          y={yTotal - 14}
                          fill="#f8fafc"
                          fontSize="10"
                          fontWeight="600"
                          textAnchor="middle"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          {t.total.toLocaleString()} stu
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-3 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
            <span>Projected Annual Growth Rate: <strong className="text-cyan-300 font-mono">+6.8%</strong></span>
            <span>Current Cohort Capacity: <strong className="text-white font-mono">92.4% Full</strong></span>
          </div>
        </div>

        {/* Grade Distribution Bell Curve (5 cols) */}
        <div className="lg:col-span-5 liquid-glass-card rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Institutional Grade Distribution
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Bell curve normalization across all accredited academic programs
            </p>

            <div className="space-y-3">
              {gradeDistribution.map((item) => (
                <div key={item.grade} className="group">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-300">{item.grade}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-400">{item.count.toLocaleString()} students</span>
                      <span className="text-cyan-300 font-semibold">{item.percentage}%</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/[0.05]">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500 group-hover:brightness-125"
                      style={{ width: `${item.percentage * 2.8}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
            <span className="text-slate-400">Mean GPA: <strong className="text-slate-100 font-mono">{kpis.averageGpa.toFixed(2)}</strong></span>
            <span className="text-amber-400/90 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Probation Policy: &lt; 2.0 GPA
            </span>
          </div>
        </div>

      </div>

      {/* Secondary Row: Budget Comparison & Department Ratios */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Department Budget Allocation vs Actual Spent (7 cols) */}
        <div className="lg:col-span-7 liquid-glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Departmental Budget Allocation vs Expenditure ($M)
              </h3>
              <p className="text-xs text-slate-400">
                Institutional fund disbursement compared with audited capital spend
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded bg-cyan-500" /> Allocated
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded bg-indigo-500" /> Spent
              </span>
            </div>
          </div>

          <div className="space-y-3.5">
            {departmentBudgetComparison.map((dept) => (
              <div key={dept.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="w-48 shrink-0">
                  <div className="font-semibold text-slate-200">{dept.fullName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">Code: {dept.name} · {dept.utilizationPercent}% utilized</div>
                </div>

                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-3.5 bg-slate-900 rounded-md overflow-hidden relative border border-white/[0.06]">
                    {/* Allocated Bar */}
                    <div 
                      className="h-full bg-cyan-500/40 rounded-md absolute left-0 top-0"
                      style={{ width: `${(dept.allocated / 10) * 100}%` }}
                    />
                    {/* Spent Bar */}
                    <div 
                      className="h-full bg-indigo-500/80 rounded-md absolute left-0 top-0"
                      style={{ width: `${(dept.spent / 10) * 100}%` }}
                    />
                  </div>
                  <div className="w-28 text-right font-mono text-[11px] text-slate-300">
                    <span>${dept.spent.toFixed(1)}M / ${dept.allocated.toFixed(1)}M</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Faculty-to-Student Ratios & Quick Department Navigation (5 cols) */}
        <div className="lg:col-span-5 liquid-glass-card rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Faculty-to-Student Mentorship Density
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Direct student count per full-time tenured and adjunct instructor
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {departmentalRatios.map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    const matched = departments.find(d => d.code === item.code);
                    if (matched) onSelectDepartment(matched.id);
                  }}
                  className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-cyan-400/40 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white font-mono group-hover:text-cyan-300 transition-colors">
                      {item.code}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <div className="mt-1 text-lg font-bold font-mono text-cyan-400">
                    1:{item.ratio}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {item.students} stu / {item.faculty} fac
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.08] text-xs text-slate-400 flex items-center justify-between">
            <span>Accreditation Target: <strong>&le; 1:35</strong></span>
            <span className="text-cyan-300 font-medium">Compliance: 100% Satisfied</span>
          </div>
        </div>

      </div>

      {/* Departments Summary Table with Fast Drilldown */}
      <div className="liquid-glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Departmental Intelligence Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Aggregated institutional performance, faculty count, student intake, and Dean leadership
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {departments.length} Accredited Academic Units
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Academic Dean</th>
                <th className="py-2.5 px-3 text-right">Faculty</th>
                <th className="py-2.5 px-3 text-right">Students</th>
                <th className="py-2.5 px-3 text-right">Avg GPA</th>
                <th className="py-2.5 px-3 text-right">Pass Rate</th>
                <th className="py-2.5 px-3 text-right">Grants ($M)</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3 px-3 font-medium text-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-cyan-900/40 text-cyan-300 flex items-center justify-center font-mono font-bold text-[10px]">
                        {dept.code}
                      </span>
                      <span>{dept.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{dept.dean}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-300 tabular-nums">{dept.facultyCount}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-300 tabular-nums">{dept.studentCount.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right font-mono text-cyan-300 font-semibold tabular-nums">{dept.averageGpa.toFixed(2)}</td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-400 tabular-nums">{dept.passRate}%</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-300 tabular-nums">${(dept.researchGrants / 1000000).toFixed(1)}M</td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => onSelectDepartment(dept.id)}
                      className="px-2.5 py-1 text-[11px] font-medium text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-md transition-colors cursor-pointer"
                    >
                      View Hub
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
