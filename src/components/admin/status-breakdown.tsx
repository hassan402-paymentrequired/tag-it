type StatusRow = {
  value: string;
  label: string;
  count: number;
};

type Props = {
  title: string;
  rows: StatusRow[];
};

export function StatusBreakdown({ title, rows }: Props) {
  const max = Math.max(...rows.map((row) => row.count), 1);

  return (
    <div className="rounded-xl border border-sidebar-border/70 bg-card p-5">
      <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
        {title}
      </h2>
      <ul className="mt-4 space-y-3">
        {rows.map((row) => (
          <li key={row.value}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span>{row.label}</span>
              <span className="tabular-nums text-muted-foreground">
                {row.count}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full border border-sidebar-border/70 bg-muted">
              <div
                className="h-full rounded-full bg-foreground/70 transition-all"
                style={{ width: `${(row.count / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
