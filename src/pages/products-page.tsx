import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { ImageIcon, Package } from 'lucide-react';
import { getProducts } from '@/api/products';
import { AdminLayout } from '@/components/layout/admin-layout';
import { AdminEmptyState } from '@/components/admin/admin-empty-state';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminPagination } from '@/components/admin/admin-pagination';
import { ProductStatusBadge } from '@/components/products/product-status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { queryKeys } from '@/lib/query-keys';
import { formatDate } from '@/lib/utils';
import type { ProductStatus } from '@/types';

const PAGE_SIZE = 10;

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get('search') ?? '',
  );

  const currentPage = Number(searchParams.get('page') ?? '1');
  const status = (searchParams.get('status') as ProductStatus | null) ?? undefined;
  const search = searchParams.get('search') ?? undefined;

  const params = useMemo(
    () => ({
      currentPage: String(currentPage),
      pageSize: String(PAGE_SIZE),
      ...(status ? { status } : {}),
      ...(search ? { search } : {}),
    }),
    [currentPage, status, search],
  );

  const productsQuery = useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => getProducts(params),
  });

  const pagination = productsQuery.data?.data.pagination;
  const products = productsQuery.data?.data.data ?? [];
  const pageCount = pagination?.pageCount ?? 1;
  const total = pagination?.total ?? 0;
  const from = products.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const to = products.length ? from + products.length - 1 : 0;

  const updateParams = (updates: Record<string, string | undefined>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) next.delete(key);
      else next.set(key, value);
    });
    setSearchParams(next);
  };

  return (
    <AdminLayout
      breadcrumbs={[
        { title: 'Dashboard', href: '/' },
        { title: 'Products' },
      ]}
    >
      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
        <AdminPageHeader
          eyebrow="Verification"
          title="Products"
          description="Scan the full catalog — requester, verifier, status, and asset details at a glance."
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              updateParams({ search: searchInput || undefined, page: '1' });
            }}
            className="flex flex-1 gap-2"
          >
            <Input
              placeholder="Search tag ID, location, brand…"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
            <Button type="submit" variant="secondary">
              Search
            </Button>
          </form>
          <Select
            value={status ?? 'all'}
            onValueChange={(value) =>
              updateParams({
                status: value === 'all' ? undefined : value,
                page: '1',
              })
            }
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {productsQuery.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <AdminEmptyState
            className="flex-1 py-16"
            icon={Package}
            title="No products yet"
            description="Tagged assets will appear here once requesters submit them for verification."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-sidebar-border/70">
            <table className="w-full text-sm">
              <thead className="border-b border-sidebar-border/70 bg-muted/30 text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Requester</th>
                  <th className="px-4 py-3 font-medium">Verifier</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-sidebar-border/50 last:border-0"
                  >
                    <td className="px-4 py-3">
                      <Link
                        to={`/products/${product.id}`}
                        className="flex items-center gap-3 transition hover:opacity-80"
                      >
                        <div className="size-10 shrink-0 overflow-hidden rounded-md border border-sidebar-border/70 bg-muted/30">
                          {product.image?.url ? (
                            <img
                              src={product.image.url}
                              alt={product.tagId}
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-muted-foreground">
                              <ImageIcon className="size-4 opacity-50" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium">{product.tagId}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {product.brand} · {product.assetType}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {product.user?.firstName} {product.user?.lastName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {product.verifier?.firstName} {product.verifier?.lastName}
                    </td>
                    <td className="px-4 py-3">
                      <ProductStatusBadge status={product.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/products/${product.id}`}>View</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 pb-4">
              <AdminPagination
                page={currentPage}
                pageCount={pageCount}
                total={total}
                from={from}
                to={to}
                onPageChange={(page) =>
                  updateParams({ page: String(page) })
                }
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
