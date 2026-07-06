import { cn } from '@/lib/utils';
import type { User } from '@/types';

type Props = {
  requesters: User[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  getAssignedVerifier?: (requesterId: string) => User | null;
  emptyMessage?: string;
};

export function RequesterCheckboxList({
  requesters,
  selectedIds,
  onChange,
  getAssignedVerifier,
  emptyMessage = 'No requesters found. Create requester accounts first.',
}: Props) {
  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((entry) => entry !== id));
      return;
    }
    onChange([...selectedIds, id]);
  };

  if (!requesters.length) {
    return (
      <p className="rounded-lg border border-dashed border-sidebar-border/70 px-4 py-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-sidebar-border/70">
      <div className="flex items-center justify-between gap-3 border-b border-sidebar-border/70 bg-muted/30 px-4 py-2">
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
          {selectedIds.length} selected
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="text-xs text-muted-foreground transition hover:text-foreground"
            onClick={() => onChange(requesters.map((user) => user.id))}
          >
            Select all
          </button>
          <button
            type="button"
            className="text-xs text-muted-foreground transition hover:text-foreground"
            onClick={() => onChange([])}
          >
            Clear
          </button>
        </div>
      </div>
      <ul className="max-h-72 divide-y divide-sidebar-border/70 overflow-y-auto">
        {requesters.map((requester) => {
          const assignedVerifier = getAssignedVerifier?.(requester.id);
          const checked = selectedIds.includes(requester.id);

          return (
            <li key={requester.id}>
              <label
                className={cn(
                  'flex cursor-pointer items-start gap-3 px-4 py-3 transition hover:bg-muted/30',
                  checked && 'bg-muted/20',
                )}
              >
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={checked}
                  onChange={() => toggle(requester.id)}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">
                    {requester.firstName} {requester.lastName}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {requester.email}
                  </span>
                  {assignedVerifier ? (
                    <span className="mt-1 block text-xs text-muted-foreground">
                      Assigned to {assignedVerifier.firstName}{' '}
                      {assignedVerifier.lastName}
                    </span>
                  ) : (
                    <span className="mt-1 block text-xs text-muted-foreground">
                      Unassigned
                    </span>
                  )}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
