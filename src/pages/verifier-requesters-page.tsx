import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Users } from 'lucide-react';
import { getMyRequesters } from '@/api/users';
import { AdminLayout } from '@/components/layout/admin-layout';
import { AdminEmptyState } from '@/components/admin/admin-empty-state';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { queryKeys } from '@/lib/query-keys';
import { formatDate } from '@/lib/utils';

export function VerifierRequestersPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const requestersQuery = useQuery({
    queryKey: queryKeys.users.myRequesters,
    queryFn: getMyRequesters,
  });

  const requesters = requestersQuery.data?.data ?? [];

  const filteredRequesters = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return requesters;

    return requesters.filter((requester) => {
      const haystack =
        `${requester.firstName} ${requester.lastName} ${requester.email}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [requesters, search]);

  const totals = useMemo(
    () =>
      requesters.reduce(
        (acc, requester) => ({
          submissions: acc.submissions + requester.stats.total,
          pending: acc.pending + requester.stats.pending,
        }),
        { submissions: 0, pending: 0 },
      ),
    [requesters],
  );

  return (
    <AdminLayout
      breadcrumbs={[
        { title: 'Your analytics', href: '/' },
        { title: 'Assigned requesters' },
      ]}
    >
      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
        <AdminPageHeader
          eyebrow="Your team"
          title="Assigned requesters"
          description="Requesters linked to your account and the submissions they've sent for your review."
        />

        <div className="grid min-w-0 gap-3 sm:grid-cols-3">
          <SummaryCard label="Requesters assigned to you" value={requesters.length} />
          <SummaryCard label="Their submissions in your queue" value={totals.submissions} />
          <SummaryCard label="Pending your review" value={totals.pending} />
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSearch(searchInput);
          }}
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or email…"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>

        {requestersQuery.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : filteredRequesters.length === 0 ? (
          <AdminEmptyState
            className="flex-1 py-16"
            icon={Users}
            title={search ? 'No requesters match your search' : 'No requesters assigned yet'}
            description={
              search
                ? 'Try a different name or email.'
                : 'An admin needs to assign requesters to your account before they appear here.'
            }
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-sidebar-border/70">
            <table className="w-full text-sm">
              <thead className="border-b border-sidebar-border/70 bg-muted/30 text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Requester</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Submissions</th>
                  <th className="px-4 py-3 font-medium">Pending</th>
                  <th className="px-4 py-3 font-medium">Approved</th>
                  <th className="px-4 py-3 font-medium">Rejected</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequesters.map((requester) => (
                  <tr
                    key={requester.id}
                    className="border-b border-sidebar-border/50 last:border-0"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">
                        {requester.firstName} {requester.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {requester.email}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">Active</Badge>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">
                      {requester.stats.total}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">
                      {requester.stats.pending}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">
                      {requester.stats.approved}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">
                      {requester.stats.rejected}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(requester.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-sidebar-border/70 bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-serif text-2xl font-medium tabular-nums">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
