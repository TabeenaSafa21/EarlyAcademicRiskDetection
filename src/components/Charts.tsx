export function Sparkline({ data, trajectory }: { data: number[]; trajectory: 'rising' | 'stable' | 'declining' }) {
  const W = 64; const H = 24; const pad = 2;
  const min = Math.max(0, Math.min(...data) - 5);
  const max = Math.min(100, Math.max(...data) + 5);
  const range = max - min || 1;
  const color = trajectory === 'rising' ? '#ef4444' : trajectory === 'declining' ? '#22c55e' : '#f59e0b';

  const pts = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (W - pad * 2),
    y: pad + (1 - (v - min) / range) * (H - pad * 2),
  }));
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="shrink-0">
      <defs>
        <linearGradient id={`sg-${trajectory}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#sg-${trajectory})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="2.5" fill={color} />
    </svg>
  );
}

export function TrajectoryBadge({ trajectory }: { trajectory: 'rising' | 'stable' | 'declining' }) {
  const cfg = {
    rising:    { label: 'Rising',    icon: '↑', cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
    stable:    { label: 'Stable',    icon: '→', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    declining: { label: 'Declining', icon: '↓', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  }[trajectory];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      <span>{cfg.icon}</span>{cfg.label}
    </span>
  );
}

export function WeeklyRiskChart({ data, trajectory }: { data: number[]; trajectory: 'rising' | 'stable' | 'declining' }) {
  const W = 300; const H = 120; const padX = 28; const padY = 12;
  const min = 0; const max = 100;
  const color = trajectory === 'rising' ? '#ef4444' : trajectory === 'declining' ? '#22c55e' : '#f59e0b';
  const weeks = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6'];

  const pts = data.map((v, i) => ({
    x: padX + (i / (data.length - 1)) * (W - padX - 8),
    y: padY + (1 - (v - min) / (max - min)) * (H - padY * 2),
    v,
  }));
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${pts[pts.length - 1].x} ${H - padY} L ${pts[0].x} ${H - padY} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H + 20}`} className="w-full" style={{ height: H + 20 }}>
      <defs>
        <linearGradient id="wrc-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 25, 50, 75, 100].map(v => {
        const y = padY + (1 - v / 100) * (H - padY * 2);
        return (
          <g key={v}>
            <line x1={padX} y1={y} x2={W - 4} y2={y} stroke="#21262d" strokeWidth="1" />
            <text x={padX - 4} y={y + 3} textAnchor="end" fill="#8b949e" fontSize="8" fontFamily="JetBrains Mono, monospace">{v}</text>
          </g>
        );
      })}
      <path d={areaD} fill="url(#wrc-grad)" />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill={color} />
          <text x={p.x} y={p.y - 7} textAnchor="middle" fill="#c9d1d9" fontSize="8" fontFamily="JetBrains Mono, monospace">{p.v}</text>
          <text x={p.x} y={H + 14} textAnchor="middle" fill="#8b949e" fontSize="8">{weeks[i]}</text>
        </g>
      ))}
    </svg>
  );
}

interface PieSlice { name: string; value: number; color: string }

export function DonutChart({ data }: { data: PieSlice[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <div className="flex items-center justify-center h-40 text-[#484f58] text-sm">No data</div>;

  let cumulative = 0;
  const r = 40;
  const cx = 60;
  const cy = 60;
  const stroke = 18;

  const slices = data.map(d => {
    const pct = d.value / total;
    const start = cumulative;
    cumulative += pct;
    return { ...d, start, pct };
  });

  function arc(startPct: number, endPct: number) {
    const startAngle = startPct * 2 * Math.PI - Math.PI / 2;
    const endAngle = endPct * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const large = endPct - startPct > 0.5 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 120" className="w-32 h-32">
        {slices.map((s, i) => (
          s.pct > 0 && (
            <path
              key={i}
              d={arc(s.start, s.start + s.pct)}
              fill="none"
              stroke={s.color}
              strokeWidth={stroke}
              strokeLinecap="butt"
            />
          )
        ))}
        <circle cx={cx} cy={cy} r={r - stroke / 2 - 2} fill="#0d1117" />
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#c9d1d9" fontSize="14" fontWeight="700" fontFamily="JetBrains Mono, monospace">{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#8b949e" fontSize="8">students</text>
      </svg>
      <div className="flex gap-4 flex-wrap justify-center mt-1">
        {data.map(d => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs text-[#8b949e]">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
            {d.name} <span className="font-mono text-white">({d.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface BarGroup { label: string; high: number; medium: number; low: number }

export function StackedBarChart({ data }: { data: BarGroup[] }) {
  const max = Math.max(...data.map(d => d.high + d.medium + d.low), 1);
  const chartH = 140;
  const chartW = 100;
  const barW = Math.min(28, (chartW / data.length) * 0.6);

  return (
    <svg viewBox={`0 0 ${Math.max(data.length * 40 + 20, 180)} ${chartH + 30}`} className="w-full" style={{ height: chartH + 30 }}>
      {[0, 0.25, 0.5, 0.75, 1].map(t => {
        const y = 8 + (1 - t) * chartH;
        return (
          <g key={t}>
            <line x1="30" y1={y} x2={data.length * 40 + 20} y2={y} stroke="#21262d" strokeWidth="1" />
            <text x="26" y={y + 4} textAnchor="end" fill="#8b949e" fontSize="8" fontFamily="JetBrains Mono, monospace">
              {Math.round(t * max)}
            </text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const x = 36 + i * 40;
        const totalH = ((d.high + d.medium + d.low) / max) * chartH;
        const highH = (d.high / max) * chartH;
        const midH = (d.medium / max) * chartH;
        const lowH = (d.low / max) * chartH;
        const base = 8 + chartH;
        return (
          <g key={d.label}>
            {lowH > 0 && <rect x={x - barW / 2} y={base - lowH} width={barW} height={lowH} fill="#22c55e" rx="1" />}
            {midH > 0 && <rect x={x - barW / 2} y={base - lowH - midH} width={barW} height={midH} fill="#f59e0b" rx="0" />}
            {highH > 0 && <rect x={x - barW / 2} y={base - totalH} width={barW} height={highH} fill="#ef4444" rx="0" />}
            <text x={x} y={base + 14} textAnchor="middle" fill="#8b949e" fontSize="8">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

interface LinePoint { label: string; score: number }

export function LineChart({ data }: { data: LinePoint[] }) {
  const W = 200; const H = 100; const pad = 16;
  const maxY = 100;
  const pts = data.map((d, i) => ({
    x: pad + (i / Math.max(data.length - 1, 1)) * (W - pad * 2),
    y: pad + (1 - d.score / maxY) * (H - pad * 2),
    ...d,
  }));
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H + 20}`} className="w-full" style={{ height: H + 20 }}>
      {[0, 25, 50, 75, 100].map(v => {
        const y = pad + (1 - v / maxY) * (H - pad * 2);
        return (
          <g key={v}>
            <line x1={pad} y1={y} x2={W - pad} y2={y} stroke="#21262d" strokeWidth="1" />
            <text x={pad - 4} y={y + 3} textAnchor="end" fill="#8b949e" fontSize="8" fontFamily="JetBrains Mono, monospace">{v}</text>
          </g>
        );
      })}
      <path d={pathD} fill="none" stroke="#4f9cf9" strokeWidth="2" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#4f9cf9" />
          <text x={p.x} y={H + 16} textAnchor="middle" fill="#8b949e" fontSize="8">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

interface FactorBar { name: string; points: number; maxPoints: number }

export function FactorBarChart({ data }: { data: FactorBar[] }) {
  const W = 200; const H = 100; const pad = 16;
  const barW = Math.floor((W - pad * 2 - (data.length - 1) * 6) / data.length);
  const maxY = Math.max(...data.map(d => d.maxPoints));

  return (
    <svg viewBox={`0 0 ${W} ${H + 30}`} className="w-full" style={{ height: H + 30 }}>
      {data.map((d, i) => {
        const x = pad + i * (barW + 6);
        const barH = (d.points / maxY) * (H - pad);
        const fill = d.points === 0 ? '#238636' : d.points / d.maxPoints > 0.6 ? '#ef4444' : '#f59e0b';
        return (
          <g key={d.name}>
            <rect x={x} y={pad + (H - pad) - barH} width={barW} height={barH} fill={fill} rx="2" />
            <text x={x + barW / 2} y={H + pad + 10} textAnchor="middle" fill="#8b949e" fontSize="7.5">{d.name.split(' ')[0]}</text>
            {d.points > 0 && (
              <text x={x + barW / 2} y={pad + (H - pad) - barH - 3} textAnchor="middle" fill="#c9d1d9" fontSize="8" fontFamily="JetBrains Mono, monospace">{d.points}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function RiskGauge({ score, color }: { score: number; color: string }) {
  const r = 38;
  const cx = 50;
  const cy = 50;
  const circumference = Math.PI * r;
  const dash = (score / 100) * circumference;

  return (
    <svg viewBox="0 0 100 60" className="w-36 h-24">
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#21262d" strokeWidth="10" strokeLinecap="round" />
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
      />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={color} fontSize="18" fontWeight="700" fontFamily="JetBrains Mono, monospace">{score}</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill="#8b949e" fontSize="8">out of 100</text>
    </svg>
  );
}
