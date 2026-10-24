import { useState } from 'react';
import { LineChart, FactorBarChart, RiskGauge, WeeklyRiskChart, TrajectoryBadge } from './Charts';
import { MONTHS } from '../utils/riskEngine';
import type { Student } from '../types';
import RecommendationDashboard from './RecommendationDashboard';

interface Props {
  student: Student;
  onClose: () => void;
  onEdit: () => void;
}

const RISK_COLOR = { Low: '#22c55e', Medium: '#f59e0b', High: '#ef4444' } as const;

export default function StudentDetail({ student, onClose, onEdit }: Props) {
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[MONTHS.length - 1]);
  const riskColor = RISK_COLOR[student.riskLevel];
  const activeMonthData = student.monthlyTrajectory.find(m => m.month === selectedMonth) ?? student.monthlyTrajectory[student.monthlyTrajectory.length - 1];

  const trendData = [
    { label: 'Previous Test', score: student.previousTestScore },
    { label: 'Current Test', score: student.currentTestScore },
  ];

  const factorData = student.riskReasons.map(r => ({
    name: r.factor,
    points: r.points,
    maxPoints: r.maxPoints,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl scrollbar-hide">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#30363d] sticky top-0 bg-[#0d1117] z-10">
          <div>
            <h2 className="text-white font-semibold text-lg">{student.name}</h2>
            <p className="text-[#8b949e] text-sm mt-0.5">{student.studentId} · {student.department}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onEdit} className="px-3 py-1.5 rounded-lg border border-[#30363d] text-[#8b949e] hover:text-white hover:border-[#484f58] transition-colors text-sm">
              Edit
            </button>
            <button onClick={onClose} className="text-[#8b949e] hover:text-white transition-colors text-xl leading-none">×</button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Risk gauge + metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 flex flex-col items-center justify-center bg-[#161b22] border border-[#30363d] rounded-xl p-4">
              <RiskGauge score={student.riskScore} color={riskColor} />
              <span className="mt-2 text-xs font-semibold uppercase tracking-wider" style={{ color: riskColor }}>
                {student.riskLevel} Risk
              </span>
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-3">
              {[
                { label: 'Attendance', value: student.attendancePercent, threshold: 75 },
                { label: 'Current Test', value: student.currentTestScore, threshold: 60 },
                { label: 'Assignments', value: student.assignmentCompletion, threshold: 60 },
                { label: 'Previous Test', value: student.previousTestScore, threshold: 60 },
              ].map(m => {
                const ok = m.value >= m.threshold;
                return (
                  <div key={m.label} className="bg-[#161b22] border border-[#30363d] rounded-xl p-3">
                    <p className="text-[#8b949e] text-xs mb-1">{m.label}</p>
                    <p className={`text-xl font-bold font-mono ${ok ? 'text-[#3fb950]' : 'text-amber-400'}`}>{m.value}%</p>
                    <div className="mt-1.5 h-1 bg-[#21262d] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${m.value}%`, backgroundColor: ok ? '#238636' : '#d97706' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Risk factor breakdown */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
            <h3 className="text-white text-sm font-semibold mb-3">Risk Factor Breakdown</h3>
            <div className="space-y-2.5">
              {student.riskReasons.map(r => (
                <div key={r.factor}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#8b949e]">{r.description}</span>
                    <span className="font-mono text-white">{r.points}/{r.maxPoints}</span>
                  </div>
                  <div className="h-1.5 bg-[#21262d] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(r.points / r.maxPoints) * 100}%`,
                        backgroundColor: r.points === 0 ? '#238636' : r.points / r.maxPoints > 0.6 ? '#ef4444' : '#f59e0b',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly risk trajectory */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h3 className="text-white text-sm font-semibold">Weekly Risk Trajectory</h3>
              <TrajectoryBadge trajectory={activeMonthData.trajectory} />
            </div>
            {/* Month pills */}
            <div className="flex gap-1 flex-wrap mb-3">
              {MONTHS.map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
                    selectedMonth === m
                      ? 'bg-[#4f9cf9]/15 text-[#4f9cf9] border-[#4f9cf9]/30'
                      : 'bg-[#0d1117] text-[#8b949e] border-[#30363d] hover:text-white'
                  }`}
                >
                  {m.split(' ')[0]}
                </button>
              ))}
            </div>
            <WeeklyRiskChart data={activeMonthData.weeklyRisk} trajectory={activeMonthData.trajectory} />
            <p className="text-[#8b949e] text-xs mt-2">
              {activeMonthData.trajectory === 'rising' && `Risk was increasing during ${selectedMonth} — intervention was recommended.`}
              {activeMonthData.trajectory === 'declining' && `Risk was declining during ${selectedMonth} — student was improving.`}
              {activeMonthData.trajectory === 'stable' && `Risk remained relatively stable during ${selectedMonth}.`}
            </p>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
              <h3 className="text-white text-sm font-semibold mb-3">Score Trend</h3>
              <LineChart data={trendData} />
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
              <h3 className="text-white text-sm font-semibold mb-3">Risk Points by Factor</h3>
              <FactorBarChart data={factorData} />
            </div>
          </div>

          <RecommendationDashboard student={student} role="faculty" />
        </div>
      </div>
    </div>
  );
}
