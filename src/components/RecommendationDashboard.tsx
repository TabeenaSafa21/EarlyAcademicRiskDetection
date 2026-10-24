import { useMemo, useState } from 'react';
import type { Student } from '../types';
import {
  getPersonalizedRecommendations,
  type PersonalizedRecommendation,
} from '../utils/recommendationEngine';

function RecommendationCard({ recommendation, index, role }: {
  recommendation: PersonalizedRecommendation;
  index: number;
  role: 'faculty' | 'parent';
}) {
  const priorityClass = recommendation.priority === 'Critical'
    ? 'border-red-500/20 bg-red-500/10 text-red-400'
    : recommendation.priority === 'High'
      ? 'border-amber-500/20 bg-amber-500/10 text-amber-400'
      : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400';

  return (
    <div className="rounded-xl border border-[#30363d] bg-[#0d1117]/45 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#4f9cf9]/10 font-mono text-xs font-bold text-[#4f9cf9]">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-white">{recommendation.title}</p>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${priorityClass}`}>{recommendation.priority}</span>
            <span className="rounded-full border border-[#30363d] px-2 py-0.5 text-[10px] text-[#8b949e]">{recommendation.area}</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[#8b949e]">{recommendation.reason}</p>
          <div className="mt-3 rounded-lg border border-[#21262d] bg-[#161b22] p-3">
            <p className="text-xs font-medium text-[#c9d1d9]">{role === 'faculty' ? 'Recommended intervention' : 'What to do next'}</p>
            <p className="mt-1 text-xs leading-relaxed text-[#8b949e]">{recommendation.action}</p>
          </div>
          <div className="mt-3 flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:gap-5">
            <span className="text-[#8b949e]"><span className="font-medium text-[#c9d1d9]">Target:</span> {recommendation.target}</span>
            <span className="shrink-0 text-[#8b949e]"><span className="font-medium text-[#c9d1d9]">Review:</span> {recommendation.reviewIn}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecommendationDashboard({ student, role }: { student: Student; role: 'faculty' | 'parent' }) {
  const recommendations = useMemo(() => getPersonalizedRecommendations(student), [student]);
  const [planStatus, setPlanStatus] = useState<'Ready' | 'Plan assigned'>('Ready');

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#30363d] bg-gradient-to-br from-[#161b22] to-[#111827] p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h3 className="text-lg font-semibold text-white">Personalized improvement plan</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#8b949e]">
              These actions are generated from {student.name}'s specific risk factors, current level, and recent trajectory—not from a general risk-level checklist.
            </p>
          </div>
          {role === 'faculty' && (
            <button
              type="button"
              onClick={() => setPlanStatus(status => status === 'Ready' ? 'Plan assigned' : 'Ready')}
              className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                planStatus === 'Plan assigned'
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                  : 'border-[#4f9cf9]/20 bg-[#4f9cf9]/10 text-[#4f9cf9] hover:bg-[#4f9cf9]/20'
              }`}
            >
              {planStatus === 'Plan assigned' ? 'Plan assigned' : 'Assign this plan'}
            </button>
          )}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Suggestions matched to areas of weakness</h3>
            <p className="mt-1 text-xs text-[#8b949e]">Ordered by urgency and expected impact.</p>
          </div>
          <span className="shrink-0 text-xs text-[#484f58]">{recommendations.length} actions</span>
        </div>
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <RecommendationCard key={recommendation.id} recommendation={recommendation} index={index} role={role} />
          ))}
        </div>
      </div>
    </div>
  );
}
