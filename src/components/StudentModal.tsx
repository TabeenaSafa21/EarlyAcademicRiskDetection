import { useState, useEffect } from 'react';
import type { Student } from '../types';

interface Props {
  student?: Student;
  onSave: (data: Omit<Student, 'id' | 'riskScore' | 'riskLevel' | 'riskReasons' | 'weeklyRisk' | 'trajectory' | 'monthlyTrajectory'>) => void;
  onClose: () => void;
}

const DEPARTMENTS = ['Computer Science', 'Mechanical Eng.', 'Electronics', 'Civil Eng.', 'Info. Technology', 'General'];

export default function StudentModal({ student, onSave, onClose }: Props) {
  const [form, setForm] = useState({
    name: '',
    studentId: '',
    department: 'Computer Science',
    attendancePercent: 75,
    currentTestScore: 60,
    assignmentCompletion: 80,
    previousTestScore: 60,
  });

  useEffect(() => {
    if (student) {
      setForm({
        name: student.name,
        studentId: student.studentId,
        department: student.department,
        attendancePercent: student.attendancePercent,
        currentTestScore: student.currentTestScore,
        assignmentCompletion: student.assignmentCompletion,
        previousTestScore: student.previousTestScore,
      });
    }
  }, [student]);

  const set = (key: string, value: string | number) =>
    setForm(f => ({ ...f, [key]: value }));

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#30363d]">
          <h2 className="text-white font-semibold text-lg">
            {student ? 'Edit Student' : 'Add Student'}
          </h2>
          <button onClick={onClose} className="text-[#8b949e] hover:text-white transition-colors text-xl leading-none">×</button>
        </div>
        <form onSubmit={handle} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name" colSpan>
              <input required className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Priya Sharma" />
            </Field>
            <Field label="Student ID" colSpan={false}>
              <input required className="input" value={form.studentId} onChange={e => set('studentId', e.target.value)} placeholder="e.g. CS2022001" />
            </Field>
          </div>
          <Field label="Department">
            <select className="input" value={form.department} onChange={e => set('department', e.target.value)}>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <SliderField label="Attendance %" value={form.attendancePercent} onChange={v => set('attendancePercent', v)} warn={75} />
            <SliderField label="Current Test %" value={form.currentTestScore} onChange={v => set('currentTestScore', v)} warn={60} />
            <SliderField label="Assignments %" value={form.assignmentCompletion} onChange={v => set('assignmentCompletion', v)} warn={60} />
            <SliderField label="Previous Test %" value={form.previousTestScore} onChange={v => set('previousTestScore', v)} warn={60} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-[#30363d] text-[#8b949e] hover:text-white hover:border-[#484f58] transition-colors text-sm font-medium">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-medium transition-colors">
              {student ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children, colSpan }: { label: string; children: React.ReactNode; colSpan?: boolean }) {
  return (
    <div className={colSpan ? 'col-span-2' : ''}>
      <label className="block text-[#8b949e] text-xs font-medium mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function SliderField({ label, value, onChange, warn }: { label: string; value: number; onChange: (v: number) => void; warn: number }) {
  const isWarn = value < warn;
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <label className="text-[#8b949e] text-xs font-medium">{label}</label>
        <span className={`text-xs font-mono font-semibold ${isWarn ? 'text-amber-400' : 'text-[#3fb950]'}`}>{value}%</span>
      </div>
      <input
        type="range" min={0} max={100} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-[#21262d] accent-[#4f9cf9]"
      />
    </div>
  );
}
