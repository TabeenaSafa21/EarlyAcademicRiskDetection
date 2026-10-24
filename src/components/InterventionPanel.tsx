import { useMemo, useState } from 'react';
import type { Student } from '../types';

type ActionStatus = 'New' | 'Contacted' | 'Plan active';

function recommendedAction(student: Student) {
  const factors = [
    { value: student.attendancePercent, label: 'Attendance outreach', detail: 'Connect with student and attendance advisor' },
    { value: student.currentTestScore, label: 'Academic coaching', detail: 'Create a targeted subject support plan' },
    { value: student.assignmentCompletion, label: 'Assignment support', detail: 'Review workload and missing submissions' },
    { value: student.previousTestScore, label: 'Faculty check-in', detail: 'Discuss sustained assessment performance' },
  ];
  return factors.sort((a, b) => a.value - b.value)[0];
}

export default function InterventionPanel({ students, onOpenStudent }: { students: Student[]; onOpenStudent: (student: Student) => void }) {
  const queue = useMemo(
    () => [...students].filter(student => student.riskLevel !== 'Low').sort((a, b) => b.riskScore - a.riskScore).slice(0, 5),
    [students],
  );
  const [statuses, setStatuses] = useState<Record<string, ActionStatus>>({});

  const setNextStatus = (studentId: string) => {
    setStatuses(current => {
      const status = current[studentId] ?? 'New';
      const next: ActionStatus = status === 'New' ? 'Contacted' : status === 'Contacted' ? 'Plan active' : 'New';
      return { ...current, [studentId]: next };
    });
  };

  const activePlans = Object.values(statuses).filter(status => status === 'Plan active').length;

  return (
    <section className="overflow-hidden rounded-xl border border-[#21262d] bg-[#161b22]">
      <div className="flex flex-col justify-between gap-4 border-b border-[#21262d] p-5 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10 text-violet-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </span>
            <div>
              <h2 className="text-sm font-semibold text-white">Early intervention queue</h2>
              <p className="mt-0.5 text-xs text-[#8b949e]">Prioritized actions based on current risk signals</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400">
            {queue.filter(student => student.riskLevel === 'High').length} urgent
          </span>
          <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
            {activePlans} plans active
          </span>
        </div>
      </div>

      <div className="divide-y divide-[#21262d]">
        {queue.map(student => {
          const action = recommendedAction(student);
          const status = statuses[student.id] ?? 'New';
          const statusClass = status === 'Plan active'
            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
            : status === 'Contacted'
              ? 'border-[#4f9cf9]/20 bg-[#4f9cf9]/10 text-[#4f9cf9]'
              : 'border-amber-500/20 bg-amber-500/10 text-amber-400';
          return (
            <div key={student.id} className="grid gap-4 p-4 transition-colors hover:bg-[#1c2128] lg:grid-cols-[minmax(200px,1.2fr)_minmax(220px,1fr)_auto] lg:items-center">
              <button type="button" onClick={() => onOpenStudent(student)} className="min-w-0 text-left">
                <span className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                    student.riskLevel === 'High' ? 'border-red-500/20 bg-red-500/10 text-red-400' : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                  }`}>
                    {student.riskScore}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-white">{student.name}</span>
                    <span className="mt-0.5 block truncate text-xs text-[#8b949e]">{student.studentId} · {student.department}</span>
                  </span>
                </span>
              </button>

              <div className="min-w-0 border-l border-[#30363d] pl-4">
                <p className="text-xs font-medium text-[#c9d1d9]">{action.label}</p>
                <p className="mt-1 truncate text-xs text-[#8b949e]">{action.detail}</p>
              </div>

              <button
                type="button"
                onClick={() => setNextStatus(student.id)}
                title="Advance intervention status"
                className={`min-w-24 rounded-lg border px-3 py-2 text-xs font-semibold transition-opacity hover:opacity-80 ${statusClass}`}
              >
                {status}
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-2 border-t border-[#21262d] bg-[#0d1117]/40 px-5 py-3 text-xs leading-relaxed text-[#8b949e]">
        <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4f9cf9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm3-10V7a3 3 0 016 0v4" />
        </svg>
        Sensitive support details are visible only to assigned staff. Use risk indicators to start a conversation, not as a disciplinary decision.
      </div>
    </section>
  );
}
