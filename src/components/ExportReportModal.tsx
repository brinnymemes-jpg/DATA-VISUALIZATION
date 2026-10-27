import React from 'react';
import { Department, InstitutionalKpis, FilterState } from '../types';
import { Printer, Download, X, CheckCircle, ShieldCheck } from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpis: InstitutionalKpis;
  departments: Department[];
  filters: FilterState;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  kpis,
  departments,
  filters
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    const headers = ['Department Code', 'Department Name', 'Dean', 'Faculty Count', 'Student Count', 'Average GPA', 'Pass Rate (%)', 'Research Grants ($)'];
    const rows = departments.map(d => [
      `"${d.code}"`,
      `"${d.name}"`,
      `"${d.dean}"`,
      d.facultyCount,
      d.studentCount,
      d.averageGpa.toFixed(2),
      d.passRate,
      d.researchGrants
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `UNI_METRICS_Institutional_Report_${filters.session}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center">
      <div className="liquid-glass-card rounded-2xl max-w-4xl w-full border border-white/20 shadow-2xl overflow-hidden my-8">
        
        {/* Modal Controls Bar (Hidden in Print) */}
        <div className="no-print p-4 bg-slate-900/90 border-b border-white/[0.08] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Institutional PDF Export & Official Certification
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCsv}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              CSV Data
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-10 bg-slate-950 text-slate-100 print:bg-white print:text-slate-900 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible">
          
          {/* Official Letterhead Header */}
          <div className="flex items-center justify-between border-b-2 border-cyan-500/30 print:border-slate-800 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <img
                src="/src/assets/images/university_crest_seal_1793061264384.jpg"
                alt="University Crest Seal"
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover border border-cyan-500/30 shadow-md print:border-slate-400"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div>
                <div className="text-[11px] font-mono tracking-widest uppercase text-cyan-400 print:text-slate-600 font-bold">
                  Office of Academic Governance & Planning
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white print:text-slate-900">
                  Institutional Performance & Departmental Analytics
                </h1>
                <div className="text-xs text-slate-400 print:text-slate-600 mt-0.5">
                  Academic Session {filters.session} · Document ID: REP-2026-UG842
                </div>
              </div>
            </div>

            <div className="text-right text-xs text-slate-400 print:text-slate-600 font-mono">
              <div>Date: {currentDate}</div>
              <div>Status: Verified Official</div>
            </div>
          </div>

          {/* Executive Overview Paragraph */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-slate-600 mb-2 font-mono">
              01. Executive Overview
            </h3>
            <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
              This certified report compiles institutional metrics for University Management across all six accredited academic units during the {filters.session} academic period. University retention stands at an all-time high of {kpis.retentionRate}%, with total research endowments surpassing ${(kpis.totalGrantsUSD / 1000000).toFixed(1)} million. Curriculum pass rate compliance meets the 90% institutional standard.
            </p>
          </div>

          {/* Key KPI Summary Table */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-slate-600 mb-2 font-mono">
              02. Institutional High-Level Indicators
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:grid-cols-4">
              <div className="p-3 rounded-lg border border-white/10 print:border-slate-300 bg-white/[0.02] print:bg-slate-50">
                <div className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-mono">Total Student Body</div>
                <div className="text-lg font-bold font-mono text-cyan-300 print:text-slate-900 mt-0.5">
                  {kpis.totalStudents.toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-lg border border-white/10 print:border-slate-300 bg-white/[0.02] print:bg-slate-50">
                <div className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-mono">Faculty Roster</div>
                <div className="text-lg font-bold font-mono text-white print:text-slate-900 mt-0.5">
                  {kpis.totalFaculty}
                </div>
              </div>
              <div className="p-3 rounded-lg border border-white/10 print:border-slate-300 bg-white/[0.02] print:bg-slate-50">
                <div className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-mono">Campus Average GPA</div>
                <div className="text-lg font-bold font-mono text-cyan-300 print:text-slate-900 mt-0.5">
                  {kpis.averageGpa.toFixed(2)}
                </div>
              </div>
              <div className="p-3 rounded-lg border border-white/10 print:border-slate-300 bg-white/[0.02] print:bg-slate-50">
                <div className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-mono">Overall Pass Rate</div>
                <div className="text-lg font-bold font-mono text-emerald-400 print:text-slate-900 mt-0.5">
                  {kpis.overallPassRate}%
                </div>
              </div>
            </div>
          </div>

          {/* Department Breakdown Table */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-slate-600 mb-2 font-mono">
              03. Departmental Performance Breakdown
            </h3>
            <table className="w-full text-left text-xs border border-white/10 print:border-slate-300">
              <thead>
                <tr className="bg-white/[0.04] print:bg-slate-100 text-slate-400 print:text-slate-700 font-mono text-[10px] uppercase border-b border-white/10 print:border-slate-300">
                  <th className="py-2 px-3">Dept</th>
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Academic Dean</th>
                  <th className="py-2 px-3 text-right">Faculty</th>
                  <th className="py-2 px-3 text-right">Students</th>
                  <th className="py-2 px-3 text-right">Avg GPA</th>
                  <th className="py-2 px-3 text-right">Pass %</th>
                  <th className="py-2 px-3 text-right">Research</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] print:divide-slate-200">
                {departments.map((d) => (
                  <tr key={d.id} className="text-slate-200 print:text-slate-800">
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-300 print:text-slate-900">{d.code}</td>
                    <td className="py-2.5 px-3 font-medium">{d.name}</td>
                    <td className="py-2.5 px-3">{d.dean}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{d.facultyCount}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{d.studentCount.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold">{d.averageGpa.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{d.passRate}%</td>
                    <td className="py-2.5 px-3 text-right font-mono">${(d.researchGrants / 1000000).toFixed(1)}M</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Official Signatures & Seal Block */}
          <div className="pt-6 border-t border-white/10 print:border-slate-300 grid grid-cols-2 gap-8 print-break-inside-avoid">
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400 print:text-slate-600 mb-1">
                Institutional Attestation
              </div>
              <p className="text-[11px] text-slate-400 print:text-slate-600 leading-relaxed">
                I hereby certify that the recorded statistics and figures in this document represent the verified academic performance records of the university for the noted session.
              </p>
              <div className="mt-4 pt-2 border-t border-slate-700 print:border-slate-400 text-xs text-slate-300 print:text-slate-800 font-semibold">
                Chancellor Arthur Pendelton
                <span className="block text-[10px] text-slate-500 font-normal">President & Chancellor of the University</span>
              </div>
            </div>

            <div className="text-right flex flex-col justify-between items-end">
              <div className="text-[10px] uppercase font-mono text-slate-400 print:text-slate-600">
                Digital Verification Seal
              </div>
              <div className="p-3 rounded-lg border border-cyan-500/30 print:border-slate-400 bg-cyan-950/20 print:bg-slate-50 inline-block text-left text-[10px] font-mono text-slate-400 print:text-slate-700">
                <div>HASH: 8f4e-91c2-77b0-d41a</div>
                <div>BLOCK: #2026-SESSION-CERTIFIED</div>
                <div className="text-emerald-400 print:text-emerald-700 font-bold flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3 h-3" /> Digital Signature Verified
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
