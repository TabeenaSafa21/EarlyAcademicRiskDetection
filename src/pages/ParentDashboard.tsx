import { useState } from 'react';
import { resolveDemoStudent } from '../data/sampleData';
import { RiskGauge, LineChart, WeeklyRiskChart, TrajectoryBadge } from '../components/Charts';
import RecommendationDashboard from '../components/RecommendationDashboard';
import { getPersonalizedRecommendations } from '../utils/recommendationEngine';
import type { Student } from '../types';

const RISK_COLOR = { Low: '#22c55e', Medium: '#f59e0b', High: '#ef4444' } as const;
const RISK_BG = {
  Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  High: 'bg-red-500/10 text-red-400 border-red-500/20',
} as const;

const CONTACTS = [
  { name: 'Dr. Meenakshi Iyer', role: 'Department Head', dept: 'Computer Science', email: 'hod.cs@college.edu', phone: '+91 98400 12345' },
  { name: 'Prof. Rajiv Nair', role: 'Academic Advisor', dept: 'All Departments', email: 'advisor@college.edu', phone: '+91 98400 67890' },
  { name: 'Student Support Cell', role: 'Counseling & Support', dept: 'Administration', email: 'support@college.edu', phone: '+91 98400 11111' },
];

interface Props {
  studentId: string;
  onLogout: () => void;
}

export default function ParentDashboard({ studentId, onLogout }: Props) {
  const student = resolveDemoStudent(studentId);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'suggestions' | 'contact'>('overview');
  const [contactSent, setContactSent] = useState<string | null>(null);

  const riskColor = RISK_COLOR[student.riskLevel];
  const tips = getPersonalizedRecommendations(student);
  const trendData = [
    { label: 'Prev. Test', score: student.previousTestScore },
    { label: 'Current Test', score: student.currentTestScore },
  ];
  const trend = student.currentTestScore - student.previousTestScore;

  return (
    <div className="app-shell min-h-screen bg-[#0d1117] text-[#c9d1d9]" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header className="glass-header border-b border-[#21262d] px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4f9cf9] to-[#6e5de4] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-semibold text-base leading-tight">Parent Portal</h1>
              <p className="text-[#8b949e] text-xs">StudentCare Platform</p>
            </div>
          </div>
          <button onClick={onLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#30363d] text-[#8b949e] hover:text-red-400 hover:border-red-500/30 transition-colors text-sm">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </header>

      <main className="portal-main max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Student identity card */}
        <div className="elevated-panel relative overflow-hidden rounded-2xl border border-[#30363d]"
          style={{ background: 'linear-gradient(135deg, #161b22 0%, #0f1923 100%)' }}>
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 blur-3xl -translate-y-1/2 translate-x-1/2" style={{ background: riskColor }} />

          <div className="relative z-10 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shrink-0"
              style={{ background: `linear-gradient(135deg, ${riskColor}33, ${riskColor}11)`, border: `1px solid ${riskColor}33` }}>
              {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold text-white">{student.name}</h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${RISK_BG[student.riskLevel]}`}>
                  {student.riskLevel} Risk
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1 flex-wrap">
                <span className="text-[#8b949e] text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{student.studentId}</span>
                <span className="text-[#484f58] text-sm">·</span>
                <span className="text-[#8b949e] text-sm">{student.department}</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-[#8b949e] text-xs mb-1">Risk Score</p>
              <p className="text-4xl font-bold" style={{ color: riskColor, fontFamily: "'JetBrains Mono', monospace" }}>
                {student.riskScore}
              </p>
              <p className="text-[#484f58] text-xs">out of 100</p>
            </div>
          </div>

          {/* Alert banner for high risk */}
          {student.riskLevel === 'High' && (
            <div className="relative z-10 mx-6 mb-6 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <p className="text-red-400 text-sm">
                <span className="font-semibold">Immediate attention required.</span> Your child's academic performance indicates high risk. We strongly recommend contacting the faculty advisor this week.
              </p>
            </div>
          )}
          {student.riskLevel === 'Medium' && (
            <div className="relative z-10 mx-6 mb-6 flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <svg className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-amber-400 text-sm">
                <span className="font-semibold">Moderate concern detected.</span> Some academic factors need attention. Regular monitoring and support can prevent further decline.
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex w-full gap-1 overflow-x-auto rounded-lg border border-[#21262d] bg-[#161b22] p-1 sm:w-fit">
          {([['overview', 'Overview'], ['details', 'Detailed Report'], ['suggestions', 'Personalized Suggestions'], ['contact', 'Contact Faculty']] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === tab ? 'bg-[#30363d] text-white' : 'text-[#8b949e] hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Metrics grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Attendance', value: student.attendancePercent, threshold: 75, icon: 'M8 2v3m8-3v3M4 9h16M5 4h14a1 1 0 011 1v15H4V5a1 1 0 011-1z', desc: 'Classes attended' },
                { label: 'Current Test', value: student.currentTestScore, threshold: 60, icon: 'M9 5h6M9 9h6M9 13h4M6 2h12a2 2 0 012 2v16H4V4a2 2 0 012-2z', desc: 'Latest exam score' },
                { label: 'Assignments', value: student.assignmentCompletion, threshold: 60, icon: 'M9 5h6m-6 4h6m-6 4h4M6 2h12a2 2 0 012 2v16H4V4a2 2 0 012-2z', desc: 'Work submitted' },
                { label: 'Previous Test', value: student.previousTestScore, threshold: 60, icon: 'M4 19V9m5 10V5m5 14v-7m5 7V3', desc: 'Prior exam score' },
              ].map(m => {
                const ok = m.value >= m.threshold;
                return (
                  <div key={m.label} className="bg-[#161b22] border border-[#21262d] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#30363d] bg-[#0d1117] text-[#4f9cf9]">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d={m.icon} />
                        </svg>
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ok ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {ok ? 'OK' : 'Low'}
                      </span>
                    </div>
                    <p className="text-[#8b949e] text-xs mb-1">{m.label}</p>
                    <p className="text-2xl font-bold" style={{ color: ok ? '#3fb950' : '#f59e0b', fontFamily: "'JetBrains Mono', monospace" }}>
                      {m.value}<span className="text-sm">%</span>
                    </p>
                    <div className="mt-2 h-1 bg-[#21262d] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${m.value}%`, backgroundColor: ok ? '#238636' : '#d97706' }} />
                    </div>
                    <p className="text-[#484f58] text-xs mt-1">{m.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Gauge + trend row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-5 flex flex-col items-center">
                <p className="text-white text-sm font-semibold mb-4">Overall Risk Gauge</p>
                <RiskGauge score={student.riskScore} color={riskColor} />
                <div className="mt-4 text-center">
                  <p className="text-xs text-[#8b949e]">
                    {student.riskLevel === 'Low' && 'Your child is on track academically.'}
                    {student.riskLevel === 'Medium' && 'Some areas need attention and support.'}
                    {student.riskLevel === 'High' && 'Urgent academic intervention recommended.'}
                  </p>
                </div>
              </div>

              <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-white text-sm font-semibold">Test Score Trend</p>
                  <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                    trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : trend < 0 ? 'bg-red-500/10 text-red-400' : 'bg-[#21262d] text-[#8b949e]'
                  }`}>
                    {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)} pts
                  </span>
                </div>
                <LineChart data={trendData} />
                <p className="text-[#8b949e] text-xs mt-2 text-center">
                  {trend > 0
                    ? `Improved by ${trend} points since last test — great progress!`
                    : trend < 0
                    ? `Dropped by ${Math.abs(trend)} points since last test — needs attention.`
                    : 'Score unchanged since last test.'}
                </p>
              </div>
            </div>

            {/* Weekly trajectory */}
            <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-white text-sm font-semibold">6-Week Risk Trajectory</p>
                <TrajectoryBadge trajectory={student.trajectory} />
              </div>
              <WeeklyRiskChart data={student.weeklyRisk} trajectory={student.trajectory} />
              <p className="text-[#8b949e] text-xs mt-2">
                {student.trajectory === 'rising' && 'Your child\'s risk has been increasing over the past 6 weeks. Early intervention is strongly recommended.'}
                {student.trajectory === 'declining' && 'Your child\'s risk has been declining over the past 6 weeks — they are showing improvement!'}
                {student.trajectory === 'stable' && 'Your child\'s risk score has remained relatively stable over the past 6 weeks.'}
              </p>
            </div>

            {/* Tips */}
            <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6m-5 3h4m4-11a6 6 0 10-12 0c0 2.2 1.2 3.8 2.5 5 .5.5.8 1.1.8 1.8h5.4c0-.7.3-1.3.8-1.8 1.3-1.2 2.5-2.8 2.5-5z" />
                  </svg>
                </span>
                <h3 className="text-white text-sm font-semibold">Recommendations for You</h3>
              </div>
              <div className="space-y-3">
                {tips.map((tip, i) => (
                  <div key={tip.id} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: riskColor + '20' }}>
                      <span className="text-xs font-bold" style={{ color: riskColor }}>{i + 1}</span>
                    </div>
                    <div>
                      <p className="text-[#c9d1d9] text-sm font-medium">{tip.title}</p>
                      <p className="mt-1 text-[#8b949e] text-sm leading-relaxed">{tip.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Detailed Report tab */}
        {activeTab === 'details' && (
          <div className="space-y-5">
            <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-5">
              <h3 className="text-white text-sm font-semibold mb-4">How the Risk Score is Calculated</h3>
              <p className="text-[#8b949e] text-sm mb-5 leading-relaxed">
                The risk score (0–100) is calculated from four academic factors. A higher score means higher risk. Each factor contributes a maximum number of points when below its threshold.
              </p>
              <div className="space-y-4">
                {student.riskReasons.map(r => {
                  const pct = r.maxPoints > 0 ? (r.points / r.maxPoints) * 100 : 0;
                  const barColor = r.points === 0 ? '#238636' : pct > 60 ? '#ef4444' : '#f59e0b';
                  return (
                    <div key={r.factor} className="p-4 rounded-xl border border-[#30363d] bg-[#0d1117]/50">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-white text-sm font-medium">{r.factor}</p>
                          <p className="text-[#8b949e] text-xs mt-0.5">{r.description}</p>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <p className="text-xs text-[#8b949e]">Contribution</p>
                          <p className="font-bold" style={{ color: barColor, fontFamily: "'JetBrains Mono', monospace" }}>
                            {r.points} <span className="text-[#484f58] font-normal">/ {r.maxPoints} pts</span>
                          </p>
                        </div>
                      </div>
                      <div className="h-2 bg-[#21262d] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                      </div>
                      {r.points === 0 && (
                        <p className="text-emerald-400 text-xs mt-1.5">✓ No contribution to risk — performing well in this area</p>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 pt-4 border-t border-[#21262d] flex items-center justify-between">
                <p className="text-[#8b949e] text-sm">Total Risk Score</p>
                <p className="text-2xl font-bold" style={{ color: riskColor, fontFamily: "'JetBrains Mono', monospace" }}>
                  {student.riskScore} / 100
                </p>
              </div>
            </div>

            <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-5">
              <h3 className="text-white text-sm font-semibold mb-3">Risk Level Reference</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { level: 'Low', range: '0 – 29', desc: 'Student is performing well across all areas.', color: '#22c55e' },
                  { level: 'Medium', range: '30 – 59', desc: 'Some factors need monitoring and support.', color: '#f59e0b' },
                  { level: 'High', range: '60 – 100', desc: 'Immediate intervention is recommended.', color: '#ef4444' },
                ].map(l => (
                  <div key={l.level} className={`p-3 rounded-xl border ${student.riskLevel === l.level ? 'border-opacity-60' : 'border-[#21262d] opacity-50'}`}
                    style={{ borderColor: student.riskLevel === l.level ? l.color + '60' : undefined, backgroundColor: student.riskLevel === l.level ? l.color + '08' : undefined }}>
                    <p className="text-sm font-semibold" style={{ color: l.color }}>{l.level}</p>
                    <p className="text-xs font-mono text-[#8b949e] mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{l.range}</p>
                    <p className="text-xs text-[#8b949e] mt-1 leading-relaxed">{l.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Personalized recommendations */}
        {activeTab === 'suggestions' && <RecommendationDashboard student={student} role="parent" />}

        {/* Contact Faculty tab */}
        {activeTab === 'contact' && (
          <div className="space-y-5">
            <p className="text-[#8b949e] text-sm">
              Reach out to the faculty team for support, clarification, or to discuss an academic improvement plan for <span className="text-white">{student.name}</span>.
            </p>
            <div className="space-y-3">
              {CONTACTS.map(c => (
                <div key={c.name} className="bg-[#161b22] border border-[#21262d] rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4f9cf9]/20 to-[#6e5de4]/20 border border-[#30363d] flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-[#4f9cf9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{c.name}</p>
                        <p className="text-[#8b949e] text-xs mt-0.5">{c.role} · {c.dept}</p>
                        <div className="flex flex-col sm:flex-row gap-2 mt-2">
                          <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-xs text-[#4f9cf9] hover:underline">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            {c.email}
                          </a>
                          <span className="text-[#484f58] hidden sm:block">·</span>
                          <span className="flex items-center gap-1.5 text-xs text-[#8b949e]">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            {c.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setContactSent(c.name)}
                      className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${contactSent === c.name ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#4f9cf9]/10 text-[#4f9cf9] border border-[#4f9cf9]/20 hover:bg-[#4f9cf9]/20'}`}
                    >
                      {contactSent === c.name ? '✓ Request Sent' : 'Request Meeting'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-5">
              <h3 className="text-white text-sm font-semibold mb-3">Send a Message</h3>
              <MessageForm studentName={student.name} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function MessageForm({ studentName }: { studentName: string }) {
  const [form, setForm] = useState({ subject: '', message: '' });
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>
        <p className="text-white font-medium text-sm">Message sent successfully</p>
        <p className="text-[#8b949e] text-xs mt-1">The faculty team will respond within 24 hours.</p>
        <button onClick={() => { setSent(false); setForm({ subject: '', message: '' }); }} className="mt-4 text-[#4f9cf9] text-xs hover:underline">Send another message</button>
      </div>
    );
  }

  return (
    <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-3">
      <div>
        <label className="block text-[#8b949e] text-xs font-medium mb-1.5">Subject</label>
        <input
          type="text"
          required
          value={form.subject}
          onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
          placeholder={`Regarding ${studentName}'s academic performance`}
          className="w-full px-3 py-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] text-sm placeholder-[#484f58] focus:outline-none focus:border-[#4f9cf9] transition-colors"
        />
      </div>
      <div>
        <label className="block text-[#8b949e] text-xs font-medium mb-1.5">Message</label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          placeholder="Describe your concern or question here…"
          className="w-full px-3 py-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] text-sm placeholder-[#484f58] focus:outline-none focus:border-[#4f9cf9] transition-colors resize-none"
        />
      </div>
      <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all" style={{ background: 'linear-gradient(135deg, #4f9cf9, #6e5de4)' }}>
        Send Message
      </button>
    </form>
  );
}
