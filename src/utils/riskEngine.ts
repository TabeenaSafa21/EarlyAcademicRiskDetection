import type { Student, RiskReason } from '../types';

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const MONTHS = ['April 2026', 'May 2026', 'June 2026', 'July 2026', 'August 2026', 'September 2026'];

function generateWeeklyRisk(
  baseRisk: number, studentId: string, monthOffset: number
): { weeklyRisk: number[]; trajectory: Student['trajectory'] } {
  const seed = String(studentId).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) + monthOffset * 997;
  const rand = seededRandom(seed);

  const startOffset = (rand() - 0.5) * 30;
  const startRisk = Math.min(100, Math.max(0, baseRisk + startOffset));
  const endRisk = monthOffset === 5 ? baseRisk : Math.min(100, Math.max(0, baseRisk + (rand() - 0.5) * 25));

  const weeks: number[] = [];
  for (let i = 0; i < 6; i++) {
    const t = i / 5;
    const base = startRisk + (endRisk - startRisk) * t;
    const noise = (rand() - 0.5) * 7;
    weeks.push(Math.round(Math.min(100, Math.max(0, base + noise))));
  }
  if (monthOffset === 5) weeks[5] = baseRisk;

  const firstHalf = (weeks[0] + weeks[1] + weeks[2]) / 3;
  const secondHalf = (weeks[3] + weeks[4] + weeks[5]) / 3;
  const delta = secondHalf - firstHalf;
  const trajectory: Student['trajectory'] = delta > 5 ? 'rising' : delta < -5 ? 'declining' : 'stable';

  return { weeklyRisk: weeks, trajectory };
}

function generateAllMonths(baseRisk: number, studentId: string) {
  return MONTHS.map((month, i) => ({
    month,
    ...generateWeeklyRisk(baseRisk, studentId, i),
  }));
}

export { MONTHS };

export function calculateRisk(input: Omit<Student, 'riskScore' | 'riskLevel' | 'riskReasons' | 'weeklyRisk' | 'trajectory' | 'monthlyTrajectory'>): Pick<Student, 'riskScore' | 'riskLevel' | 'riskReasons' | 'weeklyRisk' | 'trajectory' | 'monthlyTrajectory'> {
  const reasons: RiskReason[] = [];
  let total = 0;

  const attendancePoints = input.attendancePercent < 75
    ? Math.round(((75 - input.attendancePercent) / 75) * 30)
    : 0;
  total += attendancePoints;
  reasons.push({
    factor: 'Attendance',
    points: attendancePoints,
    maxPoints: 30,
    description: input.attendancePercent < 75
      ? `Attendance at ${input.attendancePercent}% (below 75% threshold)`
      : `Attendance at ${input.attendancePercent}% (satisfactory)`,
  });

  const testPoints = input.currentTestScore < 60
    ? Math.round(((60 - input.currentTestScore) / 60) * 35)
    : 0;
  total += testPoints;
  reasons.push({
    factor: 'Test Score',
    points: testPoints,
    maxPoints: 35,
    description: input.currentTestScore < 60
      ? `Current score ${input.currentTestScore}% (below 60% threshold)`
      : `Current score ${input.currentTestScore}% (satisfactory)`,
  });

  const assignPoints = Math.round(((100 - input.assignmentCompletion) / 100) * 25);
  total += assignPoints;
  reasons.push({
    factor: 'Assignments',
    points: assignPoints,
    maxPoints: 25,
    description: input.assignmentCompletion < 80
      ? `Only ${input.assignmentCompletion}% of assignments completed`
      : `${input.assignmentCompletion}% assignments completed (satisfactory)`,
  });

  const trendPoints = input.currentTestScore < input.previousTestScore
    ? Math.round(((input.previousTestScore - input.currentTestScore) / Math.max(input.previousTestScore, 1)) * 10)
    : 0;
  total += trendPoints;
  reasons.push({
    factor: 'Performance Trend',
    points: trendPoints,
    maxPoints: 10,
    description: input.currentTestScore < input.previousTestScore
      ? `Score dropped from ${input.previousTestScore}% to ${input.currentTestScore}%`
      : `Score stable or improved (${input.previousTestScore}% → ${input.currentTestScore}%)`,
  });

  const riskScore = Math.min(100, total);
  const riskLevel = riskScore >= 60 ? 'High' : riskScore >= 30 ? 'Medium' : 'Low';
  const sid = String(input.id || input.studentId || Math.random());
  const monthlyTrajectory = generateAllMonths(riskScore, sid);
  const current = monthlyTrajectory[monthlyTrajectory.length - 1];

  return { riskScore, riskLevel, riskReasons: reasons, weeklyRisk: current.weeklyRisk, trajectory: current.trajectory, monthlyTrajectory };
}

export function parseCSV(text: string): Omit<Student, 'riskScore' | 'riskLevel' | 'riskReasons' | 'weeklyRisk' | 'trajectory' | 'monthlyTrajectory'>[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
  return lines.slice(1).map((line, i) => {
    const vals = line.split(',').map(v => v.trim());
    const get = (key: string) => {
      const idx = header.indexOf(key);
      return idx >= 0 ? vals[idx] : '';
    };
    return {
      id: `csv-${i}`,
      name: get('name') || `Student ${i + 1}`,
      studentId: get('student_id') || `S${String(i + 1).padStart(3, '0')}`,
      department: get('department') || 'General',
      attendancePercent: parseFloat(get('attendance_percent') || get('attendance')) || 0,
      currentTestScore: parseFloat(get('current_test_score') || get('test_score')) || 0,
      assignmentCompletion: parseFloat(get('assignment_completion') || get('assignments')) || 0,
      previousTestScore: parseFloat(get('previous_test_score') || get('prev_score')) || 0,
    };
  });
}

export function exportCSV(students: Student[]): string {
  const header = 'Name,Student ID,Department,Attendance %,Current Test Score,Assignment Completion %,Previous Test Score,Risk Score,Risk Level';
  const rows = students.map(s =>
    [s.name, s.studentId, s.department, s.attendancePercent, s.currentTestScore,
     s.assignmentCompletion, s.previousTestScore, s.riskScore, s.riskLevel].join(',')
  );
  return [header, ...rows].join('\n');
}
