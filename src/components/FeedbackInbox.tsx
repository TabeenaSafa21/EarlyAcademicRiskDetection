import type { StudentFeedback } from '../types';

export default function FeedbackInbox({ feedback }: { feedback: StudentFeedback[] }) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#21262d] bg-[#161b22]">
      <div className="flex items-start justify-between gap-4 border-b border-[#21262d] p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#4f9cf9]/20 bg-[#4f9cf9]/10 text-[#4f9cf9]">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 01-9 9 9.7 9.7 0 01-4-.8L3 21l.8-4A9 9 0 1121 12z" />
            </svg>
          </span>
          <div>
            <h2 className="text-sm font-semibold text-white">Student voice inbox</h2>
            <p className="mt-0.5 text-xs text-[#8b949e]">Institutional suggestions submitted through the Student Portal</p>
          </div>
        </div>
        <span className="rounded-full border border-[#4f9cf9]/20 bg-[#4f9cf9]/10 px-2.5 py-1 text-xs font-semibold text-[#4f9cf9]">
          {feedback.length} suggestions
        </span>
      </div>

      {feedback.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-sm text-[#8b949e]">No student suggestions have been submitted in this session.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#21262d]">
          {feedback.map(item => (
            <article key={item.id} className="p-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-white">{item.studentName}</p>
                    <span className="rounded-full border border-[#30363d] px-2 py-0.5 text-[10px] text-[#8b949e]">{item.category}</span>
                    {item.anonymous && <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-400">Anonymous</span>}
                  </div>
                  <p className="mt-1 text-xs text-[#484f58]">{item.department} · {item.id}</p>
                </div>
                <p className="text-xs text-[#484f58]">{item.sentAt}</p>
              </div>
              <div className="mt-4 rounded-lg border border-[#30363d] bg-[#0d1117]/60 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8b949e]">Student suggestion</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#c9d1d9]">{item.suggestion}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-[#8b949e]">Change they hope to see</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#c9d1d9]">{item.expectedChange}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
