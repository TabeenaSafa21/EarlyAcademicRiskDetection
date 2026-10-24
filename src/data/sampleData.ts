import { calculateRisk } from '../utils/riskEngine';
import type { Student } from '../types';

const raw: Omit<Student, 'riskScore' | 'riskLevel' | 'riskReasons' | 'weeklyRisk' | 'trajectory' | 'monthlyTrajectory'>[] = [
  { id: '1', name: 'Priya Sharma', studentId: 'CS2021001', department: 'Computer Science', attendancePercent: 58, currentTestScore: 42, assignmentCompletion: 55, previousTestScore: 65 },
  { id: '2', name: 'Arjun Mehta', studentId: 'ME2021034', department: 'Mechanical Eng.', attendancePercent: 91, currentTestScore: 82, assignmentCompletion: 94, previousTestScore: 78 },
  { id: '3', name: 'Neha Patel', studentId: 'EC2022012', department: 'Electronics', attendancePercent: 67, currentTestScore: 55, assignmentCompletion: 72, previousTestScore: 60 },
  { id: '4', name: 'Rohan Das', studentId: 'CS2022045', department: 'Computer Science', attendancePercent: 45, currentTestScore: 38, assignmentCompletion: 40, previousTestScore: 52 },
  { id: '5', name: 'Kavitha Reddy', studentId: 'CE2021088', department: 'Civil Eng.', attendancePercent: 85, currentTestScore: 74, assignmentCompletion: 90, previousTestScore: 70 },
  { id: '6', name: 'Siddharth Jain', studentId: 'IT2022003', department: 'Info. Technology', attendancePercent: 72, currentTestScore: 50, assignmentCompletion: 65, previousTestScore: 58 },
  { id: '7', name: 'Ananya Singh', studentId: 'CS2021067', department: 'Computer Science', attendancePercent: 95, currentTestScore: 91, assignmentCompletion: 98, previousTestScore: 88 },
  { id: '8', name: 'Vikram Nair', studentId: 'ME2022019', department: 'Mechanical Eng.', attendancePercent: 60, currentTestScore: 48, assignmentCompletion: 50, previousTestScore: 65 },
  { id: '9', name: 'Divya Krishnan', studentId: 'EC2021054', department: 'Electronics', attendancePercent: 78, currentTestScore: 63, assignmentCompletion: 82, previousTestScore: 61 },
  { id: '10', name: 'Rahul Gupta', studentId: 'CE2022031', department: 'Civil Eng.', attendancePercent: 40, currentTestScore: 30, assignmentCompletion: 35, previousTestScore: 44 },
  { id: '11', name: 'Sneha Banerjee', studentId: 'IT2021022', department: 'Info. Technology', attendancePercent: 82, currentTestScore: 77, assignmentCompletion: 88, previousTestScore: 79 },
  { id: '12', name: 'Karthik Iyer', studentId: 'CS2022078', department: 'Computer Science', attendancePercent: 55, currentTestScore: 44, assignmentCompletion: 60, previousTestScore: 40 },
];

export const sampleStudents: Student[] = raw.map(s => ({ ...s, ...calculateRisk(s) }));

export function resolveDemoStudent(studentId: string): Student {
  const normalizedId = studentId.trim().toUpperCase();
  const existing = sampleStudents.find(student => student.studentId.toUpperCase() === normalizedId);
  if (existing) return existing;

  const seed = normalizedId.split('').reduce((total, character) => total + character.charCodeAt(0), 0);
  const fallback = sampleStudents[seed % sampleStudents.length];
  return { ...fallback, studentId: normalizedId || fallback.studentId };
}
