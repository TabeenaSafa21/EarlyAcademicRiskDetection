import { useMemo, useState } from 'react';
import type { Student } from '../types';

type SupportType = 'Academic coaching' | 'Attendance support' | 'Counselling' | 'Peer mentoring' | 'Wellbeing check-in' | 'Safety concern';

const SERVICES: {
  title: SupportType;
  description: string;
  response: string;
  tone: string;
  icon: React.ReactNode;
}[] = [
  {
    title: 'Academic coaching',
    description: 'One-to-one study planning, tutoring, and assignment support.',
    response: 'Within 1 working day',
    tone: 'text-[#4f9cf9] bg-[#4f9cf9]/10 border-[#4f9cf9]/20',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z" />,
  },
  {
    title: 'Counselling',
    description: 'Private support for stress, anxiety, motivation, or personal challenges.',
    response: 'Within 1 working day',
    tone: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 01-9 9 9.7 9.7 0 01-4-.8L3 21l.8-4A9 9 0 1121 12z" />,
  },
  {
    title: 'Peer mentoring',
    description: 'Connect with a trained student mentor for practical, relatable guidance.',
    response: 'Within 2 working days',
    tone: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H2v-2a4 4 0 014-4h3m6-7a4 4 0 11-8 0 4 4 0 018 0z" />,
  },
  {
    title: 'Safety concern',
    description: 'Privately report bullying, harassment, discrimination, or a safety issue.',
    response: 'Reviewed as a priority',
    tone: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.6-2.9 8.4-7 10-4.1-1.6-7-5.4-7-10V6l7-3zm0 5v4m0 4h.01" />,
  },
];

function getRecommendation(student: Student): SupportType {
  if (student.attendancePercent < 60) return 'Attendance support';
  if (student.assignmentCompletion < 60 || student.currentTestScore < 60) return 'Academic coaching';
  if (student.riskLevel !== 'Low') return 'Wellbeing check-in';
  return 'Peer mentoring';
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      {children}
    </svg>
  );
}

export default function SupportCenter({ student }: { student: Student }) {
  const recommended = useMemo(() => getRecommendation(student), [student]);
  const [selected, setSelected] = useState<SupportType>(recommended);
  const [urgency, setUrgency] = useState('This week');
  const [contact, setContact] = useState('Email');
  const [details, setDetails] = useState('');
  const [confidential, setConfidential] = useState(true);
  const [consent, setConsent] = useState(false);
  const [requestId, setRequestId] = useState('');

  const submitRequest = (event: React.FormEvent) => {
    event.preventDefault();
    setRequestId(`SUP-${student.studentId.slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  if (requestId) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-[#161b22] p-6 sm:p-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></Icon>
          </div>
          <p className="mt-4 text-lg font-semibold text-white">Support request received</p>
          <p className="mt-2 text-sm leading-relaxed text-[#8b949e]">
            The {selected === 'Safety concern' ? 'student safeguarding' : 'student support'} team will review your request and contact you by {contact.toLowerCase()}.
          </p>
          <div className="mx-auto mt-5 max-w-sm rounded-xl border border-[#30363d] bg-[#0d1117] p-4 text-left">
            <div className="flex justify-between gap-4 text-xs">
              <span className="text-[#8b949e]">Reference</span>
              <span className="font-mono font-semibold text-white">{requestId}</span>
            </div>
            <div className="mt-3 flex justify-between gap-4 text-xs">
              <span className="text-[#8b949e]">Request</span>
              <span className="text-right text-[#c9d1d9]">{selected}</span>
            </div>
            <div className="mt-3 flex justify-between gap-4 text-xs">
              <span className="text-[#8b949e]">Expected response</span>
              <span className="text-right text-emerald-400">{selected === 'Safety concern' ? 'Priority review' : 'Within 1–2 working days'}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { setRequestId(''); setDetails(''); setConsent(false); }}
            className="mt-6 rounded-lg border border-[#30363d] px-4 py-2 text-sm font-medium text-[#c9d1d9] transition-colors hover:border-[#484f58] hover:text-white"
          >
            Make another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border border-[#30363d] bg-gradient-to-br from-[#161b22] to-[#111827] p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#4f9cf9]/20 bg-[#4f9cf9]/10 px-2.5 py-1 text-xs font-medium text-[#4f9cf9]">
              <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.6-2.9 8.4-7 10-4.1-1.6-7-5.4-7-10V6l7-3z" /></Icon>
              Private by default
            </div>
            <h3 className="text-xl font-semibold text-white">Get the right support, early</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#8b949e]">
              Request academic, social, or wellbeing support for {student.name}. Only the team needed to respond can access the information you share.
            </p>
          </div>
          <div className="shrink-0 rounded-xl border border-[#30363d] bg-[#0d1117]/70 p-3 sm:w-56">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8b949e]">Suggested next step</p>
            <p className="mt-1 text-sm font-semibold text-white">{recommended}</p>
            <p className="mt-1 text-xs text-[#8b949e]">Based on the latest academic indicators</p>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Choose a support pathway</h3>
            <p className="mt-1 text-xs text-[#8b949e]">Selecting a service will prepare the request form below.</p>
          </div>
          <span className="hidden text-xs text-[#484f58] sm:block">No academic penalty for asking for help</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {SERVICES.map(service => {
            const active = selected === service.title;
            return (
              <button
                key={service.title}
                type="button"
                onClick={() => setSelected(service.title)}
                className={`group rounded-xl border p-4 text-left transition-all ${
                  active ? 'border-[#4f9cf9] bg-[#4f9cf9]/5 ring-1 ring-[#4f9cf9]/20' : 'border-[#21262d] bg-[#161b22] hover:border-[#484f58]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${service.tone}`}>
                    <Icon>{service.icon}</Icon>
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-sm font-semibold text-white">
                      {service.title}
                      {service.title === recommended && <span className="rounded-full bg-[#4f9cf9]/10 px-2 py-0.5 text-[10px] text-[#4f9cf9]">Recommended</span>}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-[#8b949e]">{service.description}</span>
                    <span className="mt-2 block text-[11px] font-medium text-[#484f58]">{service.response}</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={submitRequest} className="rounded-xl border border-[#21262d] bg-[#161b22] p-5">
        <div className="flex flex-col justify-between gap-2 border-b border-[#21262d] pb-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-sm font-semibold text-white">Request {selected.toLowerCase()}</h3>
            <p className="mt-1 text-xs text-[#8b949e]">A support coordinator will review and route this securely.</p>
          </div>
          {selected === 'Safety concern' && (
            <span className="w-fit rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">Priority channel</span>
          )}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-medium text-[#8b949e]">
            Support type
            <select value={selected} onChange={event => setSelected(event.target.value as SupportType)} className="input mt-1.5">
              {['Academic coaching', 'Attendance support', 'Counselling', 'Peer mentoring', 'Wellbeing check-in', 'Safety concern'].map(option => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="text-xs font-medium text-[#8b949e]">
            When is support needed?
            <select value={urgency} onChange={event => setUrgency(event.target.value)} className="input mt-1.5">
              <option>As soon as possible</option>
              <option>This week</option>
              <option>Within two weeks</option>
              <option>Just exploring options</option>
            </select>
          </label>
          <label className="text-xs font-medium text-[#8b949e]">
            Preferred follow-up
            <select value={contact} onChange={event => setContact(event.target.value)} className="input mt-1.5">
              <option>Email</option>
              <option>Phone</option>
              <option>Parent portal</option>
            </select>
          </label>
          <label className="flex items-center gap-3 self-end rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2.5 text-xs text-[#c9d1d9]">
            <input type="checkbox" checked={confidential} onChange={event => setConfidential(event.target.checked)} className="accent-[#4f9cf9]" />
            Limit details to the assigned support team
          </label>
        </div>

        <label className="mt-4 block text-xs font-medium text-[#8b949e]">
          What would you like the support team to know?
          <textarea
            required
            rows={4}
            value={details}
            onChange={event => setDetails(event.target.value)}
            placeholder={selected === 'Safety concern' ? 'Share what happened, when it occurred, and whether anyone is in immediate danger…' : 'Describe the challenge, what has already been tried, and the best way we can help…'}
            className="input mt-1.5 resize-none"
          />
        </label>

        <label className="mt-4 flex items-start gap-3 text-xs leading-relaxed text-[#8b949e]">
          <input required type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} className="mt-0.5 accent-[#4f9cf9]" />
          I understand this information will be shared only with relevant college support staff. If there is an immediate safety risk, the team may contact emergency or safeguarding services.
        </label>

        <div className="mt-5 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-[#21262d] pt-4 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2 text-xs text-[#8b949e]">
            <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm3-10V7a3 3 0 016 0v4" /></Icon>
            Encrypted in transit · Access is logged
          </p>
          <button type="submit" className="rounded-lg bg-[#238636] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2ea043]">
            Submit support request
          </button>
        </div>
      </form>

      <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
        <p className="text-xs leading-relaxed text-[#8b949e]">
          <span className="font-semibold text-red-400">Immediate danger?</span> This form is not monitored continuously. Contact local emergency services or the campus security desk at <span className="font-mono text-[#c9d1d9]">+91 98400 10000</span>.
        </p>
      </div>
    </div>
  );
}
