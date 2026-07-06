import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function AdminDetailSummaryCard({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-sidebar-border/70 bg-card p-4',
        className,
      )}
    >
      <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
        {title}
      </h2>
      <div className="mt-3 text-sm">{children}</div>
    </div>
  );
}

export function AdminDetailSection({
  title,
  children,
  className,
  action,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-xl border border-sidebar-border/70 bg-card',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-sidebar-border/70 bg-muted/30 px-4 py-3">
        <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function AdminPanel({
  title,
  description,
  children,
  className,
  dashed,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  dashed?: boolean;
  action?: ReactNode;
}) {
  return (
    <section
      className={cn(
        'rounded-xl border border-sidebar-border/70 bg-card',
        dashed && 'border-dashed',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-sidebar-border/70 px-4 py-4 md:px-6">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="p-4 md:p-6">{children}</div>
    </section>
  );
}
