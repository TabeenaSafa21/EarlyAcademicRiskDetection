import type { Student } from '../types';

export type WeaknessArea = 'Attendance' | 'Test performance' | 'Assignments' | 'Performance trend' | 'Enrichment';

export interface PersonalizedRecommendation {
  id: string;
  area: WeaknessArea;
  priority: 'Critical' | 'High' | 'Build';
  title: string;
  reason: string;
  action: string;
  target: string;
  reviewIn: string;
}

function intensity(student: Student) {
  if (student.riskLevel === 'High') return { sessions: 'three', review: '2 weeks', priority: 'Critical' as const };
  if (student.riskLevel === 'Medium') return { sessions: 'two', review: '3 weeks', priority: 'High' as const };
  return { sessions: 'one', review: '4 weeks', priority: 'Build' as const };
}

export function getPersonalizedRecommendations(student: Student): PersonalizedRecommendation[] {
  const level = intensity(student);
  const recommendations: PersonalizedRecommendation[] = [];

  if (student.attendancePercent < 75) {
    const gap = 75 - student.attendancePercent;
    recommendations.push({
      id: 'attendance',
      area: 'Attendance',
      priority: level.priority,
      title: student.attendancePercent < 60 ? 'Start a faculty-led attendance recovery plan' : 'Remove barriers to consistent attendance',
      reason: `${student.name}'s attendance is ${student.attendancePercent}%, ${gap} points below the 75% threshold.`,
      action: student.attendancePercent < 60
        ? 'Meet the attendance advisor, identify the two most common causes of absence, and set up same-day missed-class alerts.'
        : 'Use a weekly timetable check-in and arrange notes or recordings within 24 hours of any unavoidable absence.',
      target: `Reach at least ${Math.min(80, student.attendancePercent + Math.max(8, gap))}% attendance`,
      reviewIn: level.review,
    });
  }

  if (student.currentTestScore < 60) {
    const subjectPlan = student.currentTestScore < 45 ? 'diagnostic tutoring' : 'targeted revision';
    recommendations.push({
      id: 'tests',
      area: 'Test performance',
      priority: level.priority,
      title: `Use ${subjectPlan} instead of general study time`,
      reason: `${student.name}'s latest test score is ${student.currentTestScore}%, below the 60% academic benchmark.`,
      action: `Complete a topic-level error review, then schedule ${level.sessions} focused practice sessions each week with a tutor or faculty mentor.`,
      target: `Improve the next assessment to ${Math.min(75, Math.max(60, student.currentTestScore + 12))}% or higher`,
      reviewIn: level.review,
    });
  }

  if (student.assignmentCompletion < 80) {
    const missing = 100 - student.assignmentCompletion;
    recommendations.push({
      id: 'assignments',
      area: 'Assignments',
      priority: student.assignmentCompletion < 55 ? 'Critical' : level.priority,
      title: student.assignmentCompletion < 60 ? 'Create a supervised assignment recovery sprint' : 'Use a weekly submission tracker',
      reason: `${student.name} has completed ${student.assignmentCompletion}% of assignments, leaving ${missing}% incomplete.`,
      action: student.assignmentCompletion < 60
        ? 'List all recoverable work with faculty, complete the highest-credit task first, and use a supervised study block until the backlog is cleared.'
        : 'Break each task into start, draft, and submit checkpoints and review the tracker at the same time each week.',
      target: `Raise completion to at least ${Math.min(95, student.assignmentCompletion + Math.max(10, Math.round(missing / 2)))}%`,
      reviewIn: level.review,
    });
  }

  if (student.currentTestScore < student.previousTestScore) {
    const drop = student.previousTestScore - student.currentTestScore;
    recommendations.push({
      id: 'trend',
      area: 'Performance trend',
      priority: drop >= 15 ? 'Critical' : level.priority,
      title: 'Run a short academic and wellbeing check-in',
      reason: `${student.name}'s score fell ${drop} points, from ${student.previousTestScore}% to ${student.currentTestScore}%.`,
      action: 'Discuss when the decline began, check workload and wellbeing, and agree on one academic and one personal support action.',
      target: `Recover at least ${Math.min(10, drop)} points on the next assessment`,
      reviewIn: student.riskLevel === 'High' ? '1 week' : level.review,
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      id: 'enrichment',
      area: 'Enrichment',
      priority: 'Build',
      title: 'Protect current habits and add one stretch goal',
      reason: `${student.name} is meeting the current attendance, assessment, and assignment benchmarks.`,
      action: 'Keep the existing weekly routine and choose one peer-mentoring, project, or advanced-learning opportunity.',
      target: 'Maintain all indicators above their benchmarks for the next month',
      reviewIn: '4 weeks',
    });
  }

  return recommendations
    .sort((a, b) => {
      const order = { Critical: 0, High: 1, Build: 2 };
      return order[a.priority] - order[b.priority];
    })
    .slice(0, 3);
}
