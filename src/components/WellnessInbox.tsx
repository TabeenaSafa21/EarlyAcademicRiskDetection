import type { WellnessMessage } from '../types';

export default function WellnessInbox({ messages }: { messages: WellnessMessage[] }) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#21262d] bg-[#161b22]">
      <div className="flex items-start justify-between gap-4 border-b border-[#21262d] p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10 text-violet-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-4.35-7-11a4 4 0 017-2.65A4 4 0 0119 10c0 6.65-7 11-7 11z" />
            </svg>
          </span>
          <div>
            <h2 className="text-sm font-semibold text-white">Student wellness inbox</h2>
            <p className="mt-0.5 text-xs text-[#8b949e]">Private messages routed to the faculty member selected by each student</p>
          </div>
        </div>
        <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-xs font-semibold text-violet-400">
          {messages.length} new
        </span>
      </div>

      {messages.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-sm text-[#8b949e]">No student wellness messages have been submitted in this session.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#21262d]">
          {messages.map(message => (
            <article key={message.id} className="p-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-white">{message.studentName}</p>
                    <span className="rounded-full border border-[#30363d] px-2 py-0.5 text-[10px] text-[#8b949e]">{message.department}</span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-[#484f58]">{message.studentId} · {message.id}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-[#8b949e]">Routed to</p>
                  <p className="mt-0.5 text-xs font-medium text-violet-400">{message.facultyName}</p>
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-[#30363d] bg-[#0d1117]/60 p-3">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#c9d1d9]">{message.message}</p>
              </div>
              <p className="mt-2 text-[11px] text-[#484f58]">Received {message.sentAt} · Confidential student support message</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
