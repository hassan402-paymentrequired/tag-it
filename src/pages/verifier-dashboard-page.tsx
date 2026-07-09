import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getProducts } from '@/api/products';
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
import { useAuthStore } from '@/stores/auth-store';
import { queryKeys } from '@/lib/query-keys';
import { formatDate } from '@/lib/utils';
import type { Product } from '@/types';

export function VerifierDashboardPage() {
  const user = useAuthStore((state) => state.user);

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

  const recentApprovedQuery = useQuery({
    queryKey: queryKeys.products.list({
      currentPage: '1',
      pageSize: '5',
      status: 'approved',
    }),
    queryFn: () =>
      getProducts({ currentPage: '1', pageSize: '5', status: 'approved' }),
  });

  const recentRejectedQuery = useQuery({
    queryKey: queryKeys.products.list({
      currentPage: '1',
      pageSize: '5',
      status: 'rejected',
    }),
    queryFn: () =>
      getProducts({ currentPage: '1', pageSize: '5', status: 'rejected' }),
  });

  const pending = pendingQuery.data?.data.pagination.total ?? 0;
  const approved = approvedQuery.data?.data.pagination.total ?? 0;
  const rejected = rejectedQuery.data?.data.pagination.total ?? 0;
  const decisionsMade = approved + rejected;
  const recentPending = recentPendingQuery.data?.data.data ?? [];

  const approvalRate = useMemo(() => {
    if (!decisionsMade) return '—';
    return `${Math.round((approved / decisionsMade) * 100)}%`;
  }, [approved, decisionsMade]);

  const rejectionRate = useMemo(() => {
    if (!decisionsMade) return '—';
    return `${Math.round((rejected / decisionsMade) * 100)}%`;
  }, [rejected, decisionsMade]);

  const recentDecisions = useMemo(() => {
    const approvedItems = recentApprovedQuery.data?.data.data ?? [];
    const rejectedItems = recentRejectedQuery.data?.data.data ?? [];

    return [...approvedItems, ...rejectedItems]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, 5);
  }, [recentApprovedQuery.data, recentRejectedQuery.data]);

  const decisionsLoading =
    recentApprovedQuery.isLoading || recentRejectedQuery.isLoading;

  return (
    <AdminLayout breadcrumbs={[{ title: 'Your analytics' }]}>
      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
        <AdminPageHeader
          eyebrow="Personal"
          title={`Welcome back, ${user?.firstName ?? 'Verifier'}`}
          description="Your verification performance — queue, decisions, and outcomes assigned to you."
          action={
            pending > 0 ? (
              <Button variant="outline" asChild>
                <Link to="/products?status=pending">
                  Review your pending ({pending})
                </Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/products">View your queue</Link>
              </Button>
            )
          }
        />

        <div>
          <AdminSectionTitle>Your performance</AdminSectionTitle>
          <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard
              label="Awaiting your review"
              value={pending}
              href="/products?status=pending"
              hint={pending ? 'Products needing your decision' : 'Your queue is clear'}
            />
            <AdminStatCard
              label="Decisions you've made"
              value={decisionsMade}
              hint={`${approved} approved · ${rejected} rejected`}
            />
            <AdminStatCard
              label="Your approval rate"
              value={approvalRate}
              hint="Of products you've reviewed"
            />
            <AdminStatCard
              label="Your rejection rate"
              value={rejectionRate}
              hint="Of products you've reviewed"
            />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <StatusBreakdown
            title="Your queue by status"
            rows={[
              { value: 'pending', label: 'Awaiting you', count: pending },
              { value: 'approved', label: 'Approved by you', count: approved },
              { value: 'rejected', label: 'Rejected by you', count: rejected },
            ]}
          />

          <div className="rounded-xl border border-sidebar-border/70 bg-card">
            <div className="flex items-center justify-between gap-3 border-b border-sidebar-border/70 px-4 py-3">
              <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
                Your recent decisions
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/products">View queue</Link>
              </Button>
            </div>
            {decisionsLoading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full" />
                ))}
              </div>
            ) : recentDecisions.length === 0 ? (
              <p className="px-4 py-8 text-sm text-muted-foreground">
                You haven't reviewed any products yet. Pending items will appear
                here once you approve or reject them.
              </p>
            ) : (
              <ul className="divide-y divide-sidebar-border/70">
                {recentDecisions.map((product) => (
                  <DecisionRow key={product.id} product={product} />
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-sidebar-border/70 bg-card">
          <div className="flex items-center justify-between gap-3 border-b border-sidebar-border/70 px-4 py-3">
            <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
              Needs your action
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
              Nothing waiting on you right now. Great work.
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
                        From {product.user?.firstName} {product.user?.lastName}{' '}
                        · {formatDate(product.createdAt)}
                      </p>
                    </div>
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

function DecisionRow({ product }: { product: Product }) {
  return (
    <li>
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
            {product.brand} · {product.assetType}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            From {product.user?.firstName} {product.user?.lastName} · Updated{' '}
            {formatDate(product.updatedAt)}
          </p>
        </div>
      </Link>
    </li>
  );
}
