import { useMemo, useState } from 'react';
import SupportCenter from '../components/SupportCenter';
import { resolveDemoStudent } from '../data/sampleData';
import type { StudentFeedback, WellnessMessage } from '../types';

const FACULTY_BY_DEPARTMENT: Record<string, { name: string; role: string; email: string }[]> = {
  'Computer Science': [
    { name: 'Dr. Meenakshi Iyer', role: 'Department Head', email: 'meenakshi.iyer@college.edu' },
    { name: 'Prof. Aditya Rao', role: 'Faculty Mentor', email: 'aditya.rao@college.edu' },
    { name: 'Dr. Nisha Menon', role: 'Student Wellness Liaison', email: 'nisha.menon@college.edu' },
  ],
  'Mechanical Eng.': [
    { name: 'Dr. Sanjay Kumar', role: 'Department Head', email: 'sanjay.kumar@college.edu' },
    { name: 'Prof. Lakshmi Shah', role: 'Faculty Mentor', email: 'lakshmi.shah@college.edu' },
  ],
  Electronics: [
    { name: 'Dr. Ritu Verma', role: 'Department Head', email: 'ritu.verma@college.edu' },
    { name: 'Prof. Kiran Joseph', role: 'Faculty Mentor', email: 'kiran.joseph@college.edu' },
  ],
  'Civil Eng.': [
    { name: 'Dr. Farah Ali', role: 'Department Head', email: 'farah.ali@college.edu' },
    { name: 'Prof. Vivek Sinha', role: 'Faculty Mentor', email: 'vivek.sinha@college.edu' },
  ],
  'Info. Technology': [
    { name: 'Dr. Anil Thomas', role: 'Department Head', email: 'anil.thomas@college.edu' },
    { name: 'Prof. Deepa Nair', role: 'Faculty Mentor', email: 'deepa.nair@college.edu' },
  ],
};

interface Props {
  studentId: string;
  onLogout: () => void;
  onWellnessMessage: (message: WellnessMessage) => void;
  onFeedback: (feedback: StudentFeedback) => void;
}

const FEEDBACK_CATEGORIES = [
  'Teaching & curriculum',
  'Campus facilities',
  'Student services',
  'Safety & inclusion',
  'Clubs & activities',
  'Digital systems',
  'Other',
];

function FeedbackDashboard({
  studentName,
  studentId,
  department,
  onFeedback,
}: {
  studentName: string;
  studentId: string;
  department: string;
  onFeedback: (feedback: StudentFeedback) => void;
}) {
  const [category, setCategory] = useState(FEEDBACK_CATEGORIES[0]);
  const [suggestion, setSuggestion] = useState('');
  const [expectedChange, setExpectedChange] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [reference, setReference] = useState('');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextReference = `VOICE-${Math.floor(10000 + Math.random() * 90000)}`;
    onFeedback({
      id: nextReference,
      studentName: anonymous ? 'Anonymous student' : studentName,
      studentId: anonymous ? 'Identity protected' : studentId,
      department,
      category,
      suggestion: suggestion.trim(),
      expectedChange: expectedChange.trim(),
      anonymous,
      sentAt: new Date().toLocaleString(),
    });
    setReference(nextReference);
  };

  if (reference) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-[#161b22] p-6 sm:p-8">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-white">Your suggestion has been submitted</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#8b949e]">
            The student affairs team can now review your feedback. Your voice helps shape a better institution for everyone.
          </p>
          <div className="mx-auto mt-5 max-w-sm rounded-xl border border-[#30363d] bg-[#0d1117] p-4 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-[#8b949e]">Reference</span>
              <span className="font-mono font-semibold text-emerald-400">{reference}</span>
            </div>
            <div className="mt-3 flex justify-between gap-4">
              <span className="text-[#8b949e]">Privacy</span>
              <span className="text-[#c9d1d9]">{anonymous ? 'Submitted anonymously' : 'Name shared'}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { setReference(''); setSuggestion(''); setExpectedChange(''); }}
            className="mt-6 rounded-lg border border-[#30363d] px-4 py-2 text-sm font-medium text-[#c9d1d9] transition-colors hover:border-[#484f58] hover:text-white"
          >
            Share another suggestion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border border-[#4f9cf9]/20 bg-gradient-to-br from-[#4f9cf9]/10 via-[#161b22] to-[#111827] p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#4f9cf9]/20 bg-[#4f9cf9]/10 text-[#4f9cf9]">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 01-9 9 9.7 9.7 0 01-4-.8L3 21l.8-4A9 9 0 1121 12z" />
            </svg>
          </span>
          <div>
            <h2 className="text-xl font-semibold text-white">Student voice</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#8b949e]">
              Tell the institution what should change. Suggest improvements to teaching, facilities, services, campus life, or any issue that affects students.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="rounded-xl border border-[#21262d] bg-[#161b22] p-5 sm:p-6">
        <div className="border-b border-[#21262d] pb-4">
          <h3 className="text-sm font-semibold text-white">Share an idea for change</h3>
          <p className="mt-1 text-xs text-[#8b949e]">Be specific and constructive so the student affairs team can understand the need.</p>
        </div>

        <label className="mt-5 block text-xs font-medium text-[#8b949e]">
          What area does this relate to?
          <select value={category} onChange={event => setCategory(event.target.value)} className="input mt-1.5">
            {FEEDBACK_CATEGORIES.map(item => <option key={item}>{item}</option>)}
          </select>
        </label>

        <label className="mt-4 block text-xs font-medium text-[#8b949e]">
          What needs to be changed?
          <textarea
            required
            rows={5}
            value={suggestion}
            onChange={event => setSuggestion(event.target.value)}
            className="input mt-1.5 resize-none"
            placeholder="Describe the current issue, who it affects, and why it matters to students."
          />
        </label>

        <label className="mt-4 block text-xs font-medium text-[#8b949e]">
          What improvement would you like to see?
          <textarea
            required
            rows={4}
            value={expectedChange}
            onChange={event => setExpectedChange(event.target.value)}
            className="input mt-1.5 resize-none"
            placeholder="Explain your suggested solution or what a better experience would look like."
          />
        </label>

        <label className="mt-4 flex items-start gap-3 rounded-lg border border-[#30363d] bg-[#0d1117]/50 p-3 text-xs leading-relaxed text-[#8b949e]">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={event => setAnonymous(event.target.checked)}
            className="mt-0.5 accent-[#4f9cf9]"
          />
          <span>
            <span className="block font-medium text-[#c9d1d9]">Submit anonymously</span>
            <span className="mt-1 block">Your name and student ID will be hidden from the faculty dashboard. Your department will still be included to help route the suggestion.</span>
          </span>
        </label>

        <div className="mt-5 flex flex-col-reverse justify-between gap-3 border-t border-[#21262d] pt-4 sm:flex-row sm:items-center">
          <p className="text-xs text-[#8b949e]">Constructive feedback will not affect academic evaluation.</p>
          <button type="submit" className="rounded-lg bg-[#238636] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2ea043]">
            Submit suggestion
          </button>
        </div>
      </form>
    </div>
  );
}

function MentalWellnessDashboard({
  studentId,
  initialName,
  initialDepartment,
  onWellnessMessage,
}: {
  studentId: string;
  initialName: string;
  initialDepartment: string;
  onWellnessMessage: (message: WellnessMessage) => void;
}) {
  const departments = Object.keys(FACULTY_BY_DEPARTMENT);
  const [name, setName] = useState(initialName);
  const [department, setDepartment] = useState(
    FACULTY_BY_DEPARTMENT[initialDepartment] ? initialDepartment : departments[0],
  );
  const faculty = useMemo(() => FACULTY_BY_DEPARTMENT[department] ?? [], [department]);
  const [facultyEmail, setFacultyEmail] = useState(faculty[0]?.email ?? '');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [sentReference, setSentReference] = useState('');

  const selectedFaculty = faculty.find(member => member.email === facultyEmail) ?? faculty[0];

  const changeDepartment = (nextDepartment: string) => {
    setDepartment(nextDepartment);
    setFacultyEmail(FACULTY_BY_DEPARTMENT[nextDepartment]?.[0]?.email ?? '');
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFaculty) return;
    const reference = `WEL-${Math.floor(10000 + Math.random() * 90000)}`;
    onWellnessMessage({
      id: reference,
      studentName: name.trim(),
      studentId,
      department,
      facultyName: selectedFaculty.name,
      facultyEmail: selectedFaculty.email,
      message: message.trim(),
      sentAt: new Date().toLocaleString(),
    });
    setSentReference(reference);
  };

  if (sentReference && selectedFaculty) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-[#161b22] p-6 sm:p-8">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-white">Your message has been sent securely</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#8b949e]">
            {selectedFaculty.name} has received your message and will follow up through your college contact details.
          </p>
          <div className="mx-auto mt-5 max-w-sm rounded-xl border border-[#30363d] bg-[#0d1117] p-4 text-left text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-[#8b949e]">Faculty member</span>
              <span className="text-right font-medium text-white">{selectedFaculty.name}</span>
            </div>
            <div className="mt-3 flex justify-between gap-4">
              <span className="text-[#8b949e]">Reference</span>
              <span className="font-mono font-semibold text-emerald-400">{sentReference}</span>
            </div>
            <div className="mt-3 flex justify-between gap-4">
              <span className="text-[#8b949e]">Expected response</span>
              <span className="text-[#c9d1d9]">Within 1 working day</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { setSentReference(''); setMessage(''); setConsent(false); }}
            className="mt-6 rounded-lg border border-[#30363d] px-4 py-2 text-sm font-medium text-[#c9d1d9] transition-colors hover:border-[#484f58] hover:text-white"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-[#161b22] to-[#111827] p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-4.35-7-11a4 4 0 017-2.65A4 4 0 0119 10c0 6.65-7 11-7 11z" />
            </svg>
          </span>
          <div>
            <h2 className="text-xl font-semibold text-white">Mental wellness check-in</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#8b949e]">
              Share an academic, emotional, social, or personal concern directly with a trusted faculty member in your department.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="rounded-xl border border-[#21262d] bg-[#161b22] p-5 sm:p-6">
        <div className="border-b border-[#21262d] pb-4">
          <h3 className="text-sm font-semibold text-white">Contact a faculty member</h3>
          <p className="mt-1 text-xs text-[#8b949e]">Your message goes only to the faculty member you select.</p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-medium text-[#8b949e]">
            Your name
            <input
              required
              value={name}
              onChange={event => setName(event.target.value)}
              className="input mt-1.5"
              placeholder="Enter your full name"
            />
          </label>
          <label className="text-xs font-medium text-[#8b949e]">
            Department
            <select value={department} onChange={event => changeDepartment(event.target.value)} className="input mt-1.5">
              {departments.map(item => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>

        <fieldset className="mt-5">
          <legend className="text-xs font-medium text-[#8b949e]">Choose a faculty member from {department}</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {faculty.map(member => (
              <label
                key={member.email}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                  facultyEmail === member.email
                    ? 'border-[#4f9cf9] bg-[#4f9cf9]/5'
                    : 'border-[#30363d] bg-[#0d1117]/50 hover:border-[#484f58]'
                }`}
              >
                <input
                  type="radio"
                  name="faculty"
                  value={member.email}
                  checked={facultyEmail === member.email}
                  onChange={event => setFacultyEmail(event.target.value)}
                  className="mt-0.5 accent-[#4f9cf9]"
                />
                <span>
                  <span className="block text-sm font-medium text-white">{member.name}</span>
                  <span className="mt-1 block text-xs text-[#8b949e]">{member.role}</span>
                  <span className="mt-1 block text-xs text-[#484f58]">{member.email}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="mt-5 block text-xs font-medium text-[#8b949e]">
          Tell us what is troubling you
          <textarea
            required
            rows={6}
            value={message}
            onChange={event => setMessage(event.target.value)}
            className="input mt-1.5 resize-none"
            placeholder="Describe what you are experiencing and what kind of support would help. Share only what you feel comfortable sharing."
          />
        </label>

        <label className="mt-4 flex items-start gap-3 text-xs leading-relaxed text-[#8b949e]">
          <input
            required
            type="checkbox"
            checked={consent}
            onChange={event => setConsent(event.target.checked)}
            className="mt-0.5 accent-[#4f9cf9]"
          />
          I understand this message will be shared with the selected faculty member. They may involve the student wellness or safeguarding team if additional support or immediate safety action is needed.
        </label>

        <div className="mt-5 flex flex-col-reverse justify-between gap-3 border-t border-[#21262d] pt-4 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2 text-xs text-[#8b949e]">
            <svg className="h-4 w-4 text-[#4f9cf9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm3-10V7a3 3 0 016 0v4" />
            </svg>
            Private message · Access is logged
          </p>
          <button type="submit" className="rounded-lg bg-[#238636] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2ea043]">
            Send to {selectedFaculty?.name ?? 'selected faculty'}
          </button>
        </div>
      </form>

      <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs leading-relaxed text-[#8b949e]">
        <span className="font-semibold text-red-400">Need immediate help?</span> This inbox is not monitored continuously. Contact local emergency services or campus security at <span className="font-mono text-[#c9d1d9]">+91 98400 10000</span>.
      </div>
    </div>
  );
}

export default function StudentDashboard({ studentId, onLogout, onWellnessMessage, onFeedback }: Props) {
  const student = resolveDemoStudent(studentId);
  const [activeTab, setActiveTab] = useState<'wellness' | 'support' | 'feedback'>('wellness');

  return (
    <div className="app-shell min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      <header className="glass-header border-b border-[#21262d] px-4 sm:px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#4f9cf9] to-[#6e5de4]">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.2-3.45V16L12 20l-6.2-4v-5.45L12 14z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight text-white">Student Portal</h1>
              <p className="text-xs text-[#8b949e]">{student.name} · {student.studentId}</p>
            </div>
          </div>
          <button onClick={onLogout} className="rounded-lg border border-[#30363d] px-3 py-1.5 text-sm text-[#8b949e] transition-colors hover:border-red-500/30 hover:text-red-400">
            Sign Out
          </button>
        </div>
      </header>

      <main className="portal-main mx-auto max-w-5xl space-y-6 px-4 sm:px-6 py-8">
        <div className="flex w-full gap-1 rounded-lg border border-[#21262d] bg-[#161b22] p-1 sm:w-fit">
          {([['wellness', 'Mental Wellness'], ['support', 'Support Center'], ['feedback', 'Feedback']] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab ? 'bg-[#30363d] text-white' : 'text-[#8b949e] hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'wellness' && (
          <MentalWellnessDashboard
            studentId={student.studentId}
            initialName={student.name}
            initialDepartment={student.department}
            onWellnessMessage={onWellnessMessage}
          />
        )}
        {activeTab === 'support' && <SupportCenter student={student} />}
        {activeTab === 'feedback' && (
          <FeedbackDashboard
            studentName={student.name}
            studentId={student.studentId}
            department={student.department}
            onFeedback={onFeedback}
          />
        )}
      </main>
    </div>
  );
}
