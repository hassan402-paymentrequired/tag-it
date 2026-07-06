import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  label: string;
  value: string | number;
  href?: string;
  hint?: string;
};

export function AdminStatCard({ label, value, href, hint }: Props) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="line-clamp-2 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          {label}
        </p>
        {href ? (
          <ArrowRight className="size-3.5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
        ) : null}
      </div>
      <p className="mt-2 font-serif text-2xl font-medium tabular-nums leading-tight">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {hint ? (
        <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </>
  );

  const className = cn(
    'group min-w-0 rounded-xl border border-sidebar-border/70 bg-card p-4 transition hover:border-foreground/30',
  );

  if (href) {
    return (
      <Link to={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
