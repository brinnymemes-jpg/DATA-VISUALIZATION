import React from 'react';
import { FilterState, Department, Course } from '../types';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  departments: Department[];
  courses: Course[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  departments,
  courses
}) => {
  const handleUpdate = (key: keyof FilterState, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const handleReset = () => {
    onFilterChange({
      session: '2026-2027',
      departmentId: 'all',
      courseId: 'all',
      level: 'all',
      semester: 'all'
    });
  };

  const isFiltered = 
    filters.session !== '2026-2027' || 
    filters.departmentId !== 'all' || 
    filters.courseId !== 'all' || 
    filters.level !== 'all' || 
    filters.semester !== 'all';

  const availableCourses = filters.departmentId === 'all'
    ? courses
    : courses.filter(c => c.departmentId === filters.departmentId);

  return (
    <div className="w-full mb-6">
      <div className="rounded-2xl p-4 transition-all duration-200 bg-gradient-to-r from-blue-950/90 via-blue-900/85 to-indigo-950/90 border border-blue-400/30 shadow-[0_10px_35px_rgba(29,78,216,0.25)] backdrop-blur-xl text-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Label zone */}
          <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-cyan-300" />
            <span className="tracking-wide">Institutional Data Filter</span>
          </div>

          {/* Controls Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5 w-full lg:w-auto flex-1 max-w-4xl">
            
            {/* Academic Session */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-blue-200">Academic Session</label>
              <select
                value={filters.session}
                onChange={(e) => handleUpdate('session', e.target.value)}
                className="bg-blue-950/90 border border-blue-400/40 text-xs text-white rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-cyan-400 focus:outline-none cursor-pointer"
              >
                <option value="2026-2027" className="bg-slate-900 text-white">2026-2027 (Active)</option>
                <option value="2025-2026" className="bg-slate-900 text-white">2025-2026 (Archive)</option>
                <option value="2024-2025" className="bg-slate-900 text-white">2024-2025 (Archive)</option>
                <option value="2023-2024" className="bg-slate-900 text-white">2023-2024 (Baseline)</option>
              </select>
            </div>

            {/* Department */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-blue-200">Department</label>
              <select
                value={filters.departmentId}
                onChange={(e) => handleUpdate('departmentId', e.target.value)}
                className="bg-blue-950/90 border border-blue-400/40 text-xs text-white rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-cyan-400 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-white">All Departments (6)</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id} className="bg-slate-900 text-white">{d.name} ({d.code})</option>
                ))}
              </select>
            </div>

            {/* Course */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-blue-200">Course Scope</label>
              <select
                value={filters.courseId}
                onChange={(e) => handleUpdate('courseId', e.target.value)}
                className="bg-blue-950/90 border border-blue-400/40 text-xs text-white rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-cyan-400 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-white">All Courses ({availableCourses.length})</option>
                {availableCourses.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">{c.code}: {c.title.slice(0, 24)}...</option>
                ))}
              </select>
            </div>

            {/* Academic Level */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-blue-200">Degree Level</label>
              <select
                value={filters.level}
                onChange={(e) => handleUpdate('level', e.target.value)}
                className="bg-blue-950/90 border border-blue-400/40 text-xs text-white rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-cyan-400 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-white">All Levels</option>
                <option value="Undergraduate" className="bg-slate-900 text-white">Undergraduate</option>
                <option value="Postgraduate" className="bg-slate-900 text-white">Postgraduate (MS)</option>
                <option value="Doctoral" className="bg-slate-900 text-white">Doctoral (PhD)</option>
              </select>
            </div>

            {/* Semester */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-blue-200">Semester Term</label>
              <select
                value={filters.semester}
                onChange={(e) => handleUpdate('semester', e.target.value)}
                className="bg-blue-950/90 border border-blue-400/40 text-xs text-white rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-cyan-400 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-white">All Semesters</option>
                <option value="First Semester" className="bg-slate-900 text-white">First Semester</option>
                <option value="Second Semester" className="bg-slate-900 text-white">Second Semester</option>
              </select>
            </div>

          </div>

          {/* Reset Action */}
          <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
            {isFiltered && (
              <span className="text-[11px] text-cyan-300 font-semibold">
                Active filter applied
              </span>
            )}
            <button
              onClick={handleReset}
              disabled={!isFiltered}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                isFiltered 
                  ? 'bg-white/[0.15] hover:bg-white/[0.25] text-white border border-white/30 shadow-sm' 
                  : 'text-blue-300/40 border border-transparent cursor-not-allowed opacity-50'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
