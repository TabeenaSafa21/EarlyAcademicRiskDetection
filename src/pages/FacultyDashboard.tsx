import { useState, useRef, useMemo } from 'react';
import { DonutChart, StackedBarChart, Sparkline, TrajectoryBadge } from '../components/Charts';
import { MONTHS } from '../utils/riskEngine';
import { sampleStudents } from '../data/sampleData';
import { calculateRisk, parseCSV, exportCSV } from '../utils/riskEngine';
import StudentModal from '../components/StudentModal';
import StudentDetail from '../components/StudentDetail';
import InterventionPanel from '../components/InterventionPanel';
import WellnessInbox from '../components/WellnessInbox';
import FeedbackInbox from '../components/FeedbackInbox';
import type { Student, RiskFilter, StudentFeedback, WellnessMessage } from '../types';

const RISK_COLOR = { Low: '#22c55e', Medium: '#f59e0b', High: '#ef4444' } as const;
const RISK_BG = {
  Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  High: 'bg-red-500/10 text-red-400 border-red-500/20',
} as const;

let nextId = 100;

interface Props {
  onLogout: () => void;
  wellnessMessages: WellnessMessage[];
  studentFeedback: StudentFeedback[];
}

export default function FacultyDashboard({ onLogout, wellnessMessages, studentFeedback }: Props) {
  const [students, setStudents] = useState<Student[]>(sampleStudents);
  const [filter, setFilter] = useState<RiskFilter>('All');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof Student>('riskScore');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[MONTHS.length - 1]);
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Student | null>(null);
  const [detailTarget, setDetailTarget] = useState<Student | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    let list = students;
    if (filter !== 'All') list = list.filter(s => s.riskLevel === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      const av = a[sortKey] as number | string;
      const bv = b[sortKey] as number | string;
      return sortDir === 'desc' ? (av < bv ? 1 : -1) : (av > bv ? 1 : -1);
    });
  }, [students, filter, search, sortKey, sortDir]);

  const stats = useMemo(() => ({
    total: students.length,
    high: students.filter(s => s.riskLevel === 'High').length,
    medium: students.filter(s => s.riskLevel === 'Medium').length,
    low: students.filter(s => s.riskLevel === 'Low').length,
    avgRisk: students.length
      ? Math.round(students.reduce((s, x) => s + x.riskScore, 0) / students.length)
      : 0,
  }), [students]);

  const pieData = [
    { name: 'High', value: stats.high, color: RISK_COLOR.High },
    { name: 'Medium', value: stats.medium, color: RISK_COLOR.Medium },
    { name: 'Low', value: stats.low, color: RISK_COLOR.Low },
  ];

  const deptData = useMemo(() => {
    const map: Record<string, { high: number; medium: number; low: number; label: string }> = {};
    students.forEach(s => {
      const d = s.department;
      if (!map[d]) map[d] = { high: 0, medium: 0, low: 0, label: d.replace(' Eng.', '').replace('Info. Technology', 'IT') };
      map[d][s.riskLevel.toLowerCase() as 'high' | 'medium' | 'low']++;
    });
    return Object.values(map);
  }, [students]);

  const toggleSort = (key: keyof Student) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const handleSave = (data: Omit<Student, 'id' | 'riskScore' | 'riskLevel' | 'riskReasons' | 'weeklyRisk' | 'trajectory' | 'monthlyTrajectory'>) => {
    const computed = calculateRisk({ id: '', ...data });
    if (editTarget) {
      const updated = { ...editTarget, ...data, ...computed };
      setStudents(prev => prev.map(s => s.id === editTarget.id ? updated : s));
      if (detailTarget?.id === editTarget.id) setDetailTarget(updated);
    } else {
      const id = String(nextId++);
      setStudents(prev => [...prev, { id, ...data, ...computed }]);
    }
    setShowAdd(false);
    setEditTarget(null);
  };

  const handleDelete = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    if (detailTarget?.id === id) setDetailTarget(null);
  };

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const parsed = parseCSV(ev.target?.result as string);
      const withRisk: Student[] = parsed.map(s => ({ ...s, id: String(nextId++), ...calculateRisk(s) }));
      setStudents(prev => [...prev, ...withRisk]);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExport = () => {
    const csv = exportCSV(filtered);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'risk_report.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ k }: { k: keyof Student }) =>
    sortKey === k
      ? <span className="text-[#4f9cf9] ml-1">{sortDir === 'desc' ? '↓' : '↑'}</span>
      : <span className="text-[#484f58] ml-1">↕</span>;

  return (
    <div className="app-shell min-h-screen bg-[#0d1117] text-[#c9d1d9]" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header className="glass-header border-b border-[#21262d] px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4f9cf9] to-[#6e5de4] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-semibold text-base leading-tight">StudentCare Platform</h1>
            <p className="text-[#8b949e] text-xs">Faculty Portal · Dr. Admin</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCSVImport} />
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#30363d] text-[#8b949e] hover:text-white hover:border-[#484f58] transition-colors text-sm">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Import CSV
          </button>
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#30363d] text-[#8b949e] hover:text-white hover:border-[#484f58] transition-colors text-sm">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export CSV
          </button>
          <button onClick={() => { setEditTarget(null); setShowAdd(true); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white transition-colors text-sm font-medium">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Add Student
          </button>
          <button onClick={onLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#30363d] text-[#8b949e] hover:text-red-400 hover:border-red-500/30 transition-colors text-sm">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      </header>

      <main className="portal-main px-4 sm:px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
        <div className="elevated-panel relative overflow-hidden rounded-2xl border border-[#30363d] bg-gradient-to-r from-[#161b22] via-[#121a25] to-[#17152a] p-5 sm:p-6">
          <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#6e5de4]/10 blur-3xl" />
          <div className="absolute right-24 -bottom-24 h-44 w-44 rounded-full bg-[#4f9cf9]/10 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex rounded-full border border-[#4f9cf9]/20 bg-[#4f9cf9]/10 px-2.5 py-1 text-xs font-medium text-[#4f9cf9]">
                Academic wellbeing overview
              </span>
              <h2 className="mt-3 text-2xl font-bold text-white">Help every student stay on track</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#8b949e]">
                Review priority risks, respond to student voices, and coordinate timely interventions from one place.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="rounded-xl border border-[#30363d] bg-[#0d1117]/55 px-3 py-2 text-xs text-[#8b949e]">
                <strong className="mr-1 font-mono text-white">{stats.total}</strong> students
              </span>
              <span className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                <strong className="mr-1 font-mono">{stats.high}</strong> need attention
              </span>
            </div>
          </div>
        </div>
        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Students', value: stats.total, color: '#4f9cf9', sub: 'enrolled' },
            { label: 'High Risk', value: stats.high, color: '#ef4444', sub: `${stats.total ? Math.round(stats.high / stats.total * 100) : 0}% of total` },
            { label: 'Medium Risk', value: stats.medium, color: '#f59e0b', sub: `${stats.total ? Math.round(stats.medium / stats.total * 100) : 0}% of total` },
            { label: 'Low Risk', value: stats.low, color: '#22c55e', sub: `${stats.total ? Math.round(stats.low / stats.total * 100) : 0}% of total` },
            { label: 'Avg Risk Score', value: stats.avgRisk, color: stats.avgRisk >= 60 ? '#ef4444' : stats.avgRisk >= 30 ? '#f59e0b' : '#22c55e', sub: 'out of 100' },
          ].map(c => (
            <div key={c.label} className="bg-[#161b22] border border-[#21262d] rounded-xl p-4">
              <p className="text-[#8b949e] text-xs mb-1">{c.label}</p>
              <p className="text-3xl font-bold" style={{ color: c.color, fontFamily: "'JetBrains Mono', monospace" }}>{c.value}</p>
              <p className="text-[#484f58] text-xs mt-1">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-4">
            <h3 className="text-white text-sm font-semibold mb-1">Risk Distribution</h3>
            <p className="text-[#8b949e] text-xs mb-3">Breakdown by risk level</p>
            <DonutChart data={pieData} />
          </div>
          <div className="lg:col-span-2 bg-[#161b22] border border-[#21262d] rounded-xl p-4">
            <h3 className="text-white text-sm font-semibold mb-1">Risk by Department</h3>
            <p className="text-[#8b949e] text-xs mb-3">Student count per risk level</p>
            <StackedBarChart data={deptData} />
            <div className="flex gap-4 mt-2">
              {[['#ef4444', 'High'], ['#f59e0b', 'Medium'], ['#22c55e', 'Low']].map(([color, label]) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-[#8b949e]">
                  <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: color }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <WellnessInbox messages={wellnessMessages} />

        <FeedbackInbox feedback={studentFeedback} />

        <InterventionPanel students={students} onOpenStudent={setDetailTarget} />

        {/* Filters + search */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-1 bg-[#161b22] border border-[#21262d] rounded-lg p-1">
            {(['All', 'High', 'Medium', 'Low'] as RiskFilter[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === f && f === 'All' ? 'bg-[#30363d] text-white' : filter !== f ? 'text-[#8b949e] hover:text-white' : 'text-white'}`}
                style={filter === f && f !== 'All' ? { backgroundColor: RISK_COLOR[f] + '22', color: RISK_COLOR[f] } : {}}
              >
                {f}
                {f !== 'All' && (
                  <span className="ml-1.5 text-xs opacity-70">
                    {f === 'High' ? stats.high : f === 'Medium' ? stats.medium : stats.low}
                  </span>
                )}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search by name, ID, or department…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:w-72 px-3 py-1.5 rounded-lg bg-[#161b22] border border-[#21262d] text-sm text-[#c9d1d9] placeholder-[#484f58] focus:outline-none focus:border-[#4f9cf9] transition-colors"
          />
        </div>

        {/* Month selector for trajectory */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[#8b949e] text-xs font-medium shrink-0">Trajectory month:</span>
          <div className="flex gap-1 flex-wrap">
            {MONTHS.map(m => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors border ${
                  selectedMonth === m
                    ? 'bg-[#4f9cf9]/15 text-[#4f9cf9] border-[#4f9cf9]/30'
                    : 'bg-[#161b22] text-[#8b949e] border-[#21262d] hover:text-white hover:border-[#484f58]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#161b22] border border-[#21262d] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#21262d]">
                  {([
                    ['Student', 'name'],
                    ['Department', 'department'],
                    ['Attendance', 'attendancePercent'],
                    ['Test Score', 'currentTestScore'],
                    ['Assignments', 'assignmentCompletion'],
                    ['Prev. Score', 'previousTestScore'],
                    ['Risk Score', 'riskScore'],
                    ['Risk Level', 'riskLevel'],
                    ['6-Week Trend', 'trajectory'],
                  ] as [string, keyof Student][]).map(([label, key]) => (
                    <th key={key} className="text-left px-4 py-3 text-[#8b949e] font-medium text-xs uppercase tracking-wide cursor-pointer hover:text-white select-none whitespace-nowrap" onClick={() => toggleSort(key)}>
                      {label}<SortIcon k={key} />
                    </th>
                  ))}
                  <th className="px-4 py-3 text-[#8b949e] font-medium text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={10} className="text-center py-12 text-[#484f58]">No students match your filters.</td></tr>
                )}
                {filtered.map((s, i) => (
                  <tr key={s.id} className={`border-b border-[#21262d] hover:bg-[#1c2128] transition-colors cursor-pointer ${i % 2 === 1 ? 'bg-[#0d1117]/40' : ''}`} onClick={() => setDetailTarget(s)}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{s.name}</div>
                      <div className="text-[#8b949e] text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.studentId}</div>
                    </td>
                    <td className="px-4 py-3 text-[#8b949e] whitespace-nowrap">{s.department}</td>
                    <td className="px-4 py-3"><Metric value={s.attendancePercent} warn={75} /></td>
                    <td className="px-4 py-3"><Metric value={s.currentTestScore} warn={60} /></td>
                    <td className="px-4 py-3"><Metric value={s.assignmentCompletion} warn={60} /></td>
                    <td className="px-4 py-3"><Metric value={s.previousTestScore} warn={60} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#21262d] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${s.riskScore}%`, backgroundColor: RISK_COLOR[s.riskLevel] }} />
                        </div>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-white text-xs">{s.riskScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${RISK_BG[s.riskLevel]}`}>{s.riskLevel}</span>
                    </td>
                    <td className="px-4 py-3">
                      {(() => {
                        const m = s.monthlyTrajectory.find(x => x.month === selectedMonth) ?? s.monthlyTrajectory[s.monthlyTrajectory.length - 1];
                        return (
                          <div className="flex items-center gap-2">
                            <Sparkline data={m.weeklyRisk} trajectory={m.trajectory} />
                            <TrajectoryBadge trajectory={m.trajectory} />
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditTarget(s); setShowAdd(true); }} className="px-2 py-1 rounded text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors text-xs">Edit</button>
                        <button onClick={() => handleDelete(s.id)} className="px-2 py-1 rounded text-[#8b949e] hover:text-red-400 hover:bg-[#21262d] transition-colors text-xs">Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-[#21262d] text-xs text-[#484f58]">
            Showing {filtered.length} of {students.length} students
          </div>
        </div>
      </main>

      {showAdd && (
        <StudentModal student={editTarget ?? undefined} onSave={handleSave} onClose={() => { setShowAdd(false); setEditTarget(null); }} />
      )}
      {detailTarget && (
        <StudentDetail student={detailTarget} onClose={() => setDetailTarget(null)} onEdit={() => { setEditTarget(detailTarget); setShowAdd(true); }} />
      )}
    </div>
  );
}

function Metric({ value, warn }: { value: number; warn: number }) {
  const ok = value >= warn;
  return (
    <span className={`text-sm font-semibold ${ok ? 'text-[#3fb950]' : 'text-amber-400'}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {value}%
    </span>
  );
}
