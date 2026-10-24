export interface Student {
  id: string;
  name: string;
  studentId: string;
  department: string;
  attendancePercent: number;
  currentTestScore: number;
  assignmentCompletion: number;
  previousTestScore: number;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  riskReasons: RiskReason[];
  weeklyRisk: number[];
  trajectory: 'rising' | 'stable' | 'declining';
  monthlyTrajectory: { month: string; weeklyRisk: number[]; trajectory: 'rising' | 'stable' | 'declining' }[];
}

export interface RiskReason {
  factor: string;
  points: number;
  maxPoints: number;
  description: string;
}

export type RiskFilter = 'All' | 'High' | 'Medium' | 'Low';

export interface WellnessMessage {
  id: string;
  studentName: string;
  studentId: string;
  department: string;
  facultyName: string;
  facultyEmail: string;
  message: string;
  sentAt: string;
}

export interface StudentFeedback {
  id: string;
  studentName: string;
  studentId: string;
  department: string;
  category: string;
  suggestion: string;
  expectedChange: string;
  anonymous: boolean;
  sentAt: string;
}
