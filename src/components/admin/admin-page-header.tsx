import type { ReactNode } from 'react';

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function AdminPageHeader({
  eyebrow = 'Tag-It admin',
  title,
  description,
  action,
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-serif text-2xl font-medium tracking-wide">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function AdminSectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
      {children}
    </h2>
  );
}
