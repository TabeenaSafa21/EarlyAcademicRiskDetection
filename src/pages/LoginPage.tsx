import { useState } from 'react';

type Role = 'faculty' | 'parent' | 'student';

interface Props {
  onFacultyLogin: () => void;
  onParentLogin: (studentId: string) => void;
  onStudentLogin: (studentId: string) => void;
}

const FACULTY_EMAIL = 'dr.admin@college.edu';
const FACULTY_PASSWORD = 'Faculty@123';

export default function LoginPage({ onFacultyLogin, onParentLogin, onStudentLogin }: Props) {
  const [role, setRole] = useState<Role>('faculty');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'faculty') {
      onFacultyLogin();
    } else {
      const normalizedId = studentId.trim().toUpperCase();
      if (role === 'student') onStudentLogin(normalizedId);
      else onParentLogin(normalizedId);
    }
  };

  const switchRole = (r: Role) => {
    setRole(r);
    setEmail('');
    setPassword('');
    setStudentId('');
  };

  return (
    <div className="app-shell min-h-screen bg-[#0d1117] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden flex-col justify-between p-12 xl:p-16"
        style={{ background: 'linear-gradient(135deg, #0f1923 0%, #0d1117 40%, #111827 100%)' }}>
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

        {/* Glow blobs */}
        <div className="absolute top-20 left-16 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: '#4f9cf9' }} />
        <div className="absolute bottom-32 right-8 w-48 h-48 rounded-full opacity-8 blur-3xl" style={{ background: '#6e5de4' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4f9cf9] to-[#6e5de4] flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm tracking-wide">StudentCare Platform</span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            StudentCare<br />Platform
          </h1>
          <p className="text-[#8b949e] text-base leading-relaxed max-w-sm">
            One connected space for academic progress, student wellbeing, early support, and a stronger campus community.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {[
            { icon: 'M13 2L3 14h8l-1 8 10-12h-8l1-8z', title: 'Early Risk Detection', desc: 'Timely signals across attendance, assessments, and assignments' },
            { icon: 'M4 19V9m5 10V5m5 14v-7m5 7V3', title: 'Clear Visual Insights', desc: 'Department analytics, trajectories, and focused action plans' },
            { icon: 'M17 20h5v-2a4 4 0 00-4-4h-1M9 20H2v-2a4 4 0 014-4h3m6-7a4 4 0 11-8 0 4 4 0 018 0z', title: 'Connected Community', desc: 'Dedicated experiences for students, families, and faculty' },
            { icon: 'M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 01-9 9 9.7 9.7 0 01-4-.8L3 21l.8-4A9 9 0 1121 12z', title: 'Student Voice & Care', desc: 'Private wellbeing support and constructive campus feedback' },
          ].map(f => (
            <div key={f.title} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#4f9cf9]/15 bg-[#4f9cf9]/10 text-[#4f9cf9]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                </svg>
              </span>
              <div>
                <p className="text-white text-sm font-medium">{f.title}</p>
                <p className="text-[#8b949e] text-xs mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="portal-main elevated-panel w-full max-w-md rounded-3xl border border-[#21262d] bg-[#10151d]/85 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4f9cf9] to-[#6e5de4] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm">StudentCare Platform</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-[#8b949e] text-sm mb-8">Sign in to your portal to continue</p>

          {/* Role toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <RoleCard
              active={role === 'faculty'}
              onClick={() => switchRole('faculty')}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              label="Faculty"
              desc="Staff & admin portal"
            />
            <RoleCard
              active={role === 'student'}
              onClick={() => switchRole('student')}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.2-3.45V16L12 20l-6.2-4v-5.45L12 14z" />
                </svg>
              }
              label="Student"
              desc="Wellness & support"
            />
            <RoleCard
              active={role === 'parent'}
              onClick={() => switchRole('parent')}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              label="Parent"
              desc="Track your child"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {role === 'faculty' ? (
              <>
                <div>
                  <label className="block text-[#8b949e] text-xs font-medium mb-1.5">Email address</label>
                  <input
                      type="text"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="dr.admin@college.edu"
                    className="w-full px-4 py-3 rounded-xl bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-sm placeholder-[#484f58] focus:outline-none focus:border-[#4f9cf9] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[#8b949e] text-xs font-medium mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-sm placeholder-[#484f58] focus:outline-none focus:border-[#4f9cf9] transition-colors"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-[#8b949e] text-xs font-medium mb-1.5">Student ID</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={studentId}
                      onChange={e => setStudentId(e.target.value)}
                      placeholder="e.g. CS2021001"
                      className="w-full px-4 py-3 rounded-xl bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-sm placeholder-[#484f58] focus:outline-none focus:border-[#4f9cf9] transition-colors"
                    />
                  </div>
                </div>
                {role === 'student' && (
                  <div>
                    <label className="block text-[#8b949e] text-xs font-medium mb-1.5">Password</label>
                    <input
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 rounded-xl bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-sm placeholder-[#484f58] focus:outline-none focus:border-[#4f9cf9] transition-colors"
                    />
                    <p className="text-[#484f58] text-xs mt-1.5">Any non-empty password is accepted in this demo.</p>
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #4f9cf9, #6e5de4)' }}
            >
              {role === 'faculty' ? 'Sign in to Faculty Portal' : role === 'student' ? 'Access Student Portal' : 'Access Parent Portal'}
            </button>
          </form>

          <p className="text-center text-[#484f58] text-xs mt-8">
            StudentCare Platform · v2.0
          </p>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ active, onClick, icon, label, desc }: {
  active: boolean; onClick: () => void;
  icon: React.ReactNode; label: string; desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all ${
        active
          ? 'border-[#4f9cf9] bg-[#4f9cf9]/10'
          : 'border-[#30363d] bg-[#161b22] hover:border-[#484f58]'
      }`}
    >
      <span className={active ? 'text-[#4f9cf9]' : 'text-[#8b949e]'}>{icon}</span>
      <div>
        <p className={`text-sm font-semibold ${active ? 'text-white' : 'text-[#8b949e]'}`}>{label}</p>
        <p className="text-[#484f58] text-xs mt-0.5">{desc}</p>
      </div>
    </button>
  );
}
