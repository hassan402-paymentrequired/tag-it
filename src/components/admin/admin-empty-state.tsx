import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

export function AdminEmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-8 text-center',
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full border border-sidebar-border/70 bg-muted/40">
        <Icon className="size-6 text-muted-foreground" />
      </div>
      <div>
        <h2 className="font-serif text-2xl font-medium tracking-wide">
          {title}
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
