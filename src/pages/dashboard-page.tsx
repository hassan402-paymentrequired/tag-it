import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getProducts } from '@/api/products';
import { getVerifiers } from '@/api/users';
import { AdminLayout } from '@/components/layout/admin-layout';
import {
  AdminPageHeader,
  AdminSectionTitle,
} from '@/components/admin/admin-page-header';
import { AdminStatCard } from '@/components/admin/admin-stat-card';
import { StatusBreakdown } from '@/components/admin/status-breakdown';
import { ProductStatusBadge } from '@/components/products/product-status-badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { queryKeys } from '@/lib/query-keys';
import { formatDate } from '@/lib/utils';

export function DashboardPage() {
  const allQuery = useQuery({
    queryKey: queryKeys.products.list({ currentPage: '1', pageSize: '1' }),
    queryFn: () => getProducts({ currentPage: '1', pageSize: '1' }),
  });

  const pendingQuery = useQuery({
    queryKey: queryKeys.products.list({
      currentPage: '1',
      pageSize: '1',
      status: 'pending',
    }),
    queryFn: () =>
      getProducts({ currentPage: '1', pageSize: '1', status: 'pending' }),
  });

  const approvedQuery = useQuery({
    queryKey: queryKeys.products.list({
      currentPage: '1',
      pageSize: '1',
      status: 'approved',
    }),
    queryFn: () =>
      getProducts({ currentPage: '1', pageSize: '1', status: 'approved' }),
  });

  const rejectedQuery = useQuery({
    queryKey: queryKeys.products.list({
      currentPage: '1',
      pageSize: '1',
      status: 'rejected',
    }),
    queryFn: () =>
      getProducts({ currentPage: '1', pageSize: '1', status: 'rejected' }),
  });

  const recentPendingQuery = useQuery({
    queryKey: queryKeys.products.list({
      currentPage: '1',
      pageSize: '5',
      status: 'pending',
    }),
    queryFn: () =>
      getProducts({ currentPage: '1', pageSize: '5', status: 'pending' }),
  });

  const verifiersQuery = useQuery({
    queryKey: queryKeys.users.verifiers,
    queryFn: getVerifiers,
  });

  const total = allQuery.data?.data.pagination.total ?? 0;
  const pending = pendingQuery.data?.data.pagination.total ?? 0;
  const approved = approvedQuery.data?.data.pagination.total ?? 0;
  const rejected = rejectedQuery.data?.data.pagination.total ?? 0;
  const verifiers = verifiersQuery.data?.data ?? [];
  const recentPending = recentPendingQuery.data?.data.data ?? [];

  const approvalRate = useMemo(() => {
    const reviewed = approved + rejected;
    if (!reviewed) return '—';
    return `${Math.round((approved / reviewed) * 100)}%`;
  }, [approved, rejected]);

  const assignedRequesters = verifiers.reduce(
    (sum, verifier) => sum + (verifier.requesters?.length ?? 0),
    0,
  );

  return (
    <AdminLayout breadcrumbs={[{ title: 'Dashboard' }]}>
      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
        <AdminPageHeader
          title="Dashboard"
          description="Product verification activity and team overview at a glance."
          action={
            pending > 0 ? (
              <Button variant="outline" asChild>
                <Link to="/products?status=pending">Review pending ({pending})</Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/products">View products</Link>
              </Button>
            )
          }
        />

        <div>
          <AdminSectionTitle>Overview</AdminSectionTitle>
          <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard
              label="Total products"
              value={total}
              href="/products"
            />
            <AdminStatCard
              label="Pending review"
              value={pending}
              href="/products?status=pending"
              hint={pending ? 'Needs admin or verifier action' : 'Queue is clear'}
            />
            <AdminStatCard
              label="Approval rate"
              value={approvalRate}
              hint="Approved vs reviewed (approved + rejected)"
            />
            <AdminStatCard
              label="Active verifiers"
              value={verifiers.length}
              href="/users/assign"
              hint={`${assignedRequesters} requesters assigned`}
            />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <StatusBreakdown
            title="Products by status"
            rows={[
              { value: 'pending', label: 'Pending', count: pending },
              { value: 'approved', label: 'Approved', count: approved },
              { value: 'rejected', label: 'Rejected', count: rejected },
            ]}
          />

          <div className="rounded-xl border border-sidebar-border/70 bg-card">
            <div className="flex items-center justify-between gap-3 border-b border-sidebar-border/70 px-4 py-3">
              <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
                Verifier workload
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/users/assign">Manage</Link>
              </Button>
            </div>
            {verifiersQuery.isLoading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full" />
                ))}
              </div>
            ) : verifiers.length === 0 ? (
              <p className="px-4 py-8 text-sm text-muted-foreground">
                No verifiers yet. Create verifier accounts to start assigning
                requesters.
              </p>
            ) : (
              <ul className="divide-y divide-sidebar-border/70">
                {verifiers.map((verifier) => (
                  <li
                    key={verifier.id}
                    className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">
                        {verifier.firstName} {verifier.lastName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {verifier.email}
                      </p>
                    </div>
                    <p className="shrink-0 tabular-nums text-muted-foreground">
                      {verifier.requesters?.length ?? 0} requesters
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-sidebar-border/70 bg-card">
          <div className="flex items-center justify-between gap-3 border-b border-sidebar-border/70 px-4 py-3">
            <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
              Pending review
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/products?status=pending">View all</Link>
            </Button>
          </div>
          {recentPendingQuery.isLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : recentPending.length === 0 ? (
            <p className="px-4 py-8 text-sm text-muted-foreground">
              No products waiting for review right now.
            </p>
          ) : (
            <ul className="divide-y divide-sidebar-border/70">
              {recentPending.map((product) => (
                <li key={product.id}>
                  <Link
                    to={`/products/${product.id}`}
                    className="flex flex-col gap-2 px-4 py-3 transition hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{product.tagId}</span>
                        <ProductStatusBadge status={product.status} />
                      </div>
                      <p className="mt-0.5 truncate text-sm text-muted-foreground">
                        {product.brand} · {product.assetType} ·{' '}
                        {product.location}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Submitted by {product.user?.firstName}{' '}
                        {product.user?.lastName} ·{' '}
                        {formatDate(product.createdAt)}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      Verifier: {product.verifier?.firstName}{' '}
                      {product.verifier?.lastName}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
