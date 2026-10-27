import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Student } from '../types';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  GraduationCap, 
  User,
  ShieldCheck
} from 'lucide-react';

interface PersonalPerformanceProps {
  students: Student[];
}

export const PersonalPerformance: React.FC<PersonalPerformanceProps> = ({ students }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('stu-1');
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.getStudentPerformance(selectedStudentId).then((res) => {
      if (isMounted) {
        setPerformanceData(res);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [selectedStudentId]);

  const activeStudent = performanceData?.student || students.find(s => s.id === selectedStudentId) || students[0] || {
    id: 'stu-1',
    studentId: 'UNI-2023-881',
    name: 'Alex Rivera',
    email: 'alex.rivera@student.edu',
    departmentId: 'dept-cs',
    session: '2026-2027',
    semester: 'Fall Semester',
    level: 'Undergraduate',
    gpa: 3.88,
    creditsCompleted: 98,
    status: 'Active',
    enrollmentDate: '2023-09-01',
    advisor: 'Dr. Eleanor Vance'
  };

  const gpaHistory = performanceData?.gpaHistory || [
    { term: 'Year 1 Fall', gpa: 3.72, cumulative: 3.72, credits: 16, attendance: 96 },
    { term: 'Year 1 Spring', gpa: 3.81, cumulative: 3.76, credits: 18, attendance: 94 },
    { term: 'Year 2 Fall', gpa: 3.90, cumulative: 3.81, credits: 16, attendance: 98 },
    { term: 'Year 2 Spring', gpa: 3.88, cumulative: 3.83, credits: 16, attendance: 92 },
    { term: 'Year 3 Fall', gpa: 3.94, cumulative: 3.86, credits: 16, attendance: 97 },
    { term: 'Year 3 Spring', gpa: 3.88, cumulative: 3.88, credits: 16, attendance: 95 }
  ];

  const competencyRadar = performanceData?.competencyRadar || [
    { subject: 'Theoretical Foundations', score: 92, benchmark: 80 },
    { subject: 'Algorithmics & Systems', score: 96, benchmark: 78 },
    { subject: 'Practical Lab & Projects', score: 88, benchmark: 75 },
    { subject: 'Research Methodology', score: 90, benchmark: 70 },
    { subject: 'Peer Collaboration', score: 94, benchmark: 82 },
    { subject: 'Technical Communication', score: 89, benchmark: 77 }
  ];

  const enrolledCourses = performanceData?.enrolledCourses || [
    { code: 'CS-402', title: 'Deep Learning & Neural Architectures', credits: 4, instructor: 'Dr. Eleanor Vance', midterm: 96, currentScore: 94.5, grade: 'A', attendance: 98 },
    { code: 'CS-301', title: 'Data Structures & Algorithmic Complexity', credits: 4, instructor: 'Dr. Alan Turing-Ward', midterm: 98, currentScore: 97.0, grade: 'A+', attendance: 100 },
    { code: 'CS-204', title: 'Database Systems & Relational Theory', credits: 3, instructor: 'Prof. David Codd', midterm: 91, currentScore: 92.0, grade: 'A', attendance: 94 },
    { code: 'HUM-180', title: 'Philosophy of Human-Machine Symbiosis', credits: 3, instructor: 'Dr. Leila Aris', midterm: 94, currentScore: 93.5, grade: 'A', attendance: 95 }
  ];

  // SVG Chart Calculation for GPA History
  const svgWidth = 560;
  const svgHeight = 220;
  const pad = { top: 25, right: 30, bottom: 35, left: 45 };
  const minGpa = 3.0;
  const maxGpa = 4.0;

  const getGpaX = (i: number) => {
    return pad.left + (i / (gpaHistory.length - 1)) * (svgWidth - pad.left - pad.right);
  };
  const getGpaY = (val: number) => {
    const ratio = (val - minGpa) / (maxGpa - minGpa);
    return svgHeight - pad.bottom - ratio * (svgHeight - pad.top - pad.bottom);
  };

  const termPath = gpaHistory.map((h: any, i: number) => `${i === 0 ? 'M' : 'L'} ${getGpaX(i)} ${getGpaY(h.gpa)}`).join(' ');
  const cumPath = gpaHistory.map((h: any, i: number) => `${i === 0 ? 'M' : 'L'} ${getGpaX(i)} ${getGpaY(h.cumulative)}`).join(' ');

  // SVG Radar Polygon Calculation (6 axes)
  const radarSize = 260;
  const radarCenter = radarSize / 2;
  const radarRadius = 90;
  const numAxes = competencyRadar.length;

  const getRadarPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 / numAxes) * index - Math.PI / 2;
    const r = (value / 100) * radarRadius;
    const x = radarCenter + r * Math.cos(angle);
    const y = radarCenter + r * Math.sin(angle);
    return { x, y };
  };

  const scorePolygon = competencyRadar.map((d: any, i: number) => {
    const pt = getRadarPoint(i, d.score);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  const benchmarkPolygon = competencyRadar.map((d: any, i: number) => {
    const pt = getRadarPoint(i, d.benchmark);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  return (
    <div className="space-y-6">
      
      {/* Student Selector Switcher */}
      <div className="liquid-glass rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
          <User className="w-4 h-4 text-cyan-400" />
          <span>Active Student Portfolio:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {students.slice(0, 5).map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStudentId(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedStudentId === s.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white'
              }`}
            >
              {s.name} ({s.studentId.slice(-3)})
            </button>
          ))}
        </div>
      </div>

      {/* Student Profile Card */}
      <div className="liquid-glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src="/src/assets/images/avatar_student_black_1793096183680.jpg"
                alt={activeStudent.name}
                referrerPolicy="no-referrer"
                className="w-18 h-18 rounded-2xl object-cover border-2 border-white/30 shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-700 flex items-center justify-center font-bold text-xl text-white border border-white/20 shadow-xl -z-10 absolute inset-0">
                {activeStudent.name.charAt(0)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400 font-semibold">{activeStudent.studentId}</span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Dean's Honors List
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
                {activeStudent.name}
              </h2>
              <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-2">
                <span>{activeStudent.level} Scholar</span>
                <span className="text-slate-500">·</span>
                <span>Session {activeStudent.session}</span>
                <span className="text-slate-500">·</span>
                <span>Advisor: {activeStudent.advisor}</span>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <div className="text-[11px] text-slate-400">Cumulative GPA</div>
              <div className="text-2xl font-bold font-mono text-cyan-300 tabular-nums">
                {activeStudent.gpa.toFixed(2)}
              </div>
              <div className="text-[10px] text-emerald-400">Summa Cum Laude Track</div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-right">
              <div className="text-[11px] text-slate-400">Credits Completed</div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {activeStudent.creditsCompleted}
              </div>
              <div className="text-[10px] text-slate-400">120 Required for BS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Row: GPA Progression & Competency Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* GPA Progression Curve (7 cols) */}
        <div className="lg:col-span-7 liquid-glass-card rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Multi-Semester GPA Trajectory
                </h3>
                <p className="text-xs text-slate-400">
                  Term GPA compared with Cumulative Academic Performance
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Term GPA
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" /> Cumulative
                </span>
              </div>
            </div>

            <div className="w-full overflow-x-auto pt-2">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[480px]">
                {/* Horizontal Ticks */}
                {[3.0, 3.5, 4.0].map((val) => {
                  const y = getGpaY(val);
                  return (
                    <g key={val}>
                      <line 
                        x1={pad.left} 
                        y1={y} 
                        x2={svgWidth - pad.right} 
                        y2={y} 
                        stroke="rgba(255, 255, 255, 0.08)" 
                        strokeDasharray="4 4" 
                      />
                      <text 
                        x={pad.left - 8} 
                        y={y + 4} 
                        fill="#94a3b8" 
                        fontSize="10" 
                        textAnchor="end"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {val.toFixed(1)}
                      </text>
                    </g>
                  );
                })}

                {/* Cumulative Line */}
                <path d={cumPath} fill="none" stroke="#818cf8" strokeWidth="2" strokeDasharray="3 3" />

                {/* Term Line */}
                <path d={termPath} fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />

                {/* Data Points */}
                {gpaHistory.map((h: any, i: number) => {
                  const x = getGpaX(i);
                  const y = getGpaY(h.gpa);
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="4" fill="#030712" stroke="#22d3ee" strokeWidth="2" />
                      <text
                        x={x}
                        y={svgHeight - 12}
                        fill="#94a3b8"
                        fontSize="10"
                        textAnchor="middle"
                        fontFamily="Plus Jakarta Sans, sans-serif"
                      >
                        {h.term.replace('Year ', 'Y')}
                      </text>
                      <text
                        x={x}
                        y={y - 10}
                        fill="#f8fafc"
                        fontSize="10"
                        fontWeight="600"
                        textAnchor="middle"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {h.gpa.toFixed(2)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
            <span>Overall Attendance Average: <strong className="text-emerald-400 font-mono">96.2%</strong></span>
            <span>Rank: <strong className="text-white font-mono">Top 3% of CS Department</strong></span>
          </div>
        </div>

        {/* Competency Radar Chart (5 cols) */}
        <div className="lg:col-span-5 liquid-glass-card rounded-2xl p-5 flex flex-col items-center justify-between">
          <div className="w-full text-left mb-2">
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Academic Competency Radar
            </h3>
            <p className="text-xs text-slate-400">
              Evaluated against departmental honors benchmark
            </p>
          </div>

          <div className="py-2">
            <svg width={radarSize} height={radarSize} className="overflow-visible">
              {/* Radar concentric rings */}
              {[0.33, 0.66, 1].map((scale, rIdx) => (
                <circle
                  key={rIdx}
                  cx={radarCenter}
                  cy={radarCenter}
                  r={radarRadius * scale}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="1"
                />
              ))}

              {/* Axes lines */}
              {competencyRadar.map((_: any, i: number) => {
                const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
                const endX = radarCenter + radarRadius * Math.cos(angle);
                const endY = radarCenter + radarRadius * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={radarCenter}
                    y1={radarCenter}
                    x2={endX}
                    y2={endY}
                    stroke="rgba(255, 255, 255, 0.1)"
                  />
                );
              })}

              {/* Benchmark Polygon */}
              <polygon
                points={benchmarkPolygon}
                fill="rgba(99, 102, 241, 0.12)"
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />

              {/* Student Score Polygon */}
              <polygon
                points={scorePolygon}
                fill="rgba(34, 211, 238, 0.25)"
                stroke="#22d3ee"
                strokeWidth="2.5"
              />

              {/* Axis Labels */}
              {competencyRadar.map((d: any, i: number) => {
                const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
                const labelRadius = radarRadius + 22;
                const lx = radarCenter + labelRadius * Math.cos(angle);
                const ly = radarCenter + labelRadius * Math.sin(angle);
                return (
                  <text
                    key={i}
                    x={lx}
                    y={ly + 3}
                    fill="#cbd5e1"
                    fontSize="9"
                    fontWeight="500"
                    textAnchor={lx > radarCenter + 5 ? 'start' : lx < radarCenter - 5 ? 'end' : 'middle'}
                  >
                    {d.subject.slice(0, 15)}
                  </text>
                );
              })}
            </svg>
          </div>

          <div className="w-full flex items-center justify-between text-xs pt-2 border-t border-white/[0.08]">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Student Score
            </span>
            <span className="flex items-center gap-1.5 text-indigo-300">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Honors Target
            </span>
          </div>
        </div>

      </div>

      {/* Active Enrolled Courses & Detailed Grades */}
      <div className="liquid-glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Active Term Enrolled Courses & Grade Progress
            </h3>
            <p className="text-xs text-slate-400">
              Continuous assessment, midterm exams, and live attendance metrics
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {enrolledCourses.length} Registered Courses · 14 Credits
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Course</th>
                <th className="py-2.5 px-3">Professor</th>
                <th className="py-2.5 px-3 text-center">Credits</th>
                <th className="py-2.5 px-3 text-right">Midterm</th>
                <th className="py-2.5 px-3 text-right">Current Score</th>
                <th className="py-2.5 px-3 text-right">Grade</th>
                <th className="py-2.5 px-3 text-right">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {enrolledCourses.map((c: any) => (
                <tr key={c.code} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-200">{c.code}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[220px]">{c.title}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{c.instructor}</td>
                  <td className="py-3 px-3 text-center font-mono text-slate-300">{c.credits}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-200 tabular-nums">{c.midterm}%</td>
                  <td className="py-3 px-3 text-right font-mono text-cyan-300 font-bold tabular-nums">{c.currentScore}%</td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/20">
                      {c.grade}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-300 tabular-nums">{c.attendance}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
