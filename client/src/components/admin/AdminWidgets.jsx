import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';

export function StatCard({ icon: Icon, value, label, trend, trendUp = true, color = 'blue' }) {
  const colorMap = {
    blue: 'bg-light-blue-bg text-blue',
    green: 'bg-green-50 text-success',
    orange: 'bg-light-orange text-orange',
    red: 'bg-red-50 text-error',
  };
  return (
    <div className="card flex items-center gap-3.5 p-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${colorMap[color]}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-extrabold text-text-primary leading-tight">{value}</p>
        <p className="truncate text-xs text-text-secondary">{label}</p>
        {trend && (
          <p className={`mt-0.5 flex items-center gap-1 text-xs font-semibold ${trendUp ? 'text-success' : 'text-error'}`}>
            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {trend}
          </p>
        )}
      </div>
    </div>
  );
}

export function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  const nums = [];
  for (let i = 1; i <= pages; i += 1) nums.push(i);
  const visible = nums.length > 6 ? [1, 2, 3, '...', pages] : nums;

  return (
    <div className="mt-4 flex items-center justify-end gap-1.5">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary disabled:opacity-40">
        <ChevronLeft size={16} />
      </button>
      {visible.map((n, i) =>
        n === '...' ? (
          <span key={i} className="px-1 text-text-muted">…</span>
        ) : (
          <button
            key={i}
            onClick={() => onChange(n)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold ${n === page ? 'bg-navy text-white' : 'border border-border text-text-secondary hover:bg-off-white'}`}
          >
            {n}
          </button>
        )
      )}
      <button disabled={page >= pages} onClick={() => onChange(page + 1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary disabled:opacity-40">
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
