import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getProduct, updateProductStatus } from '@/api/products';
import { getErrorMessage } from '@/api/client';
import { AdminLayout } from '@/components/layout/admin-layout';
import {
  AdminDetailSection,
  AdminDetailSummaryCard,
  AdminPanel,
} from '@/components/admin/admin-detail-section';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ProductStatusBadge } from '@/components/products/product-status-badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { queryKeys } from '@/lib/query-keys';
import { formatDate } from '@/lib/utils';

export function ProductDetailPage() {
  const { id = '' } = useParams();
  const queryClient = useQueryClient();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionError, setActionError] = useState('');

  const productQuery = useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => getProduct(id),
    enabled: !!id,
  });

  const statusMutation = useMutation({
    mutationFn: (payload: {
      status: 'approved' | 'rejected' | 'pending';
      rejectionReason?: string;
    }) => updateProductStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      setRejectOpen(false);
      setRejectionReason('');
      setActionError('');
    },
    onError: (error) => setActionError(getErrorMessage(error)),
  });

  const product = productQuery.data?.data;

  return (
    <AdminLayout
      breadcrumbs={[
        { title: 'Dashboard', href: '/' },
        { title: 'Products', href: '/products' },
        { title: product?.tagId ?? 'Detail' },
      ]}
    >
      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
        <AdminPageHeader
          eyebrow="Verification"
          title={product?.tagId ?? 'Product detail'}
          description="Review asset details, image, and verification status."
          action={
            <Button asChild variant="outline" size="sm">
              <Link to="/products">
                <ArrowLeft className="size-4" />
                Back to products
              </Link>
            </Button>
          }
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            {productQuery.isLoading ? (
              <Skeleton className="h-72 w-full rounded-xl" />
            ) : product ? (
              <>
                <AdminDetailSection
                  title="Asset information"
                  action={<ProductStatusBadge status={product.status} />}
                >
                  <dl className="grid gap-4 p-4 sm:grid-cols-2 md:p-6">
                    {[
                      ['Tag ID', product.tagId],
                      ['Serial number', product.serialNumber],
                      ['Assigned to', product.assignedTo],
                      ['Location', product.location],
                      ['Cost center', product.costCenter],
                      ['Asset class', product.assetClass],
                      ['Asset type', product.assetType],
                      ['Brand', product.brand],
                      ['Condition', product.assetCondition],
                      ['Asset status', product.assetStatus],
                      ['Details', product.assetDetails],
                      [
                        'Requester',
                        `${product.user?.firstName} ${product.user?.lastName}`,
                      ],
                      [
                        'Verifier',
                        `${product.verifier?.firstName} ${product.verifier?.lastName}`,
                      ],
                      ['Created', formatDate(product.createdAt)],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                          {label}
                        </dt>
                        <dd className="mt-1 text-sm">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  {product.rejectionReason ? (
                    <div className="border-t border-sidebar-border/70 bg-muted/20 px-4 py-4 md:px-6">
                      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        Rejection reason
                      </p>
                      <p className="mt-1 text-sm">{product.rejectionReason}</p>
                    </div>
                  ) : null}
                </AdminDetailSection>

                <AdminPanel
                  title="Edit product"
                  description="Update asset details after submission."
                >
                  <Button variant="outline" disabled>
                    Edit asset details
                  </Button>
                </AdminPanel>
              </>
            ) : null}
          </div>

          <div className="space-y-6">
            <AdminDetailSection title="Product image">
              <div className="p-4 md:p-6">
                {productQuery.isLoading ? (
                  <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                ) : product?.image?.url ? (
                  <img
                    src={product.image.url}
                    alt={product.tagId}
                    className="w-full rounded-lg border border-sidebar-border/70 object-cover"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">No image</p>
                )}
              </div>
            </AdminDetailSection>

            <AdminDetailSummaryCard title="Verification actions">
              <div className="space-y-3">
                {actionError ? (
                  <p className="text-sm text-destructive">{actionError}</p>
                ) : null}
                <Button
                  className="w-full"
                  disabled={
                    statusMutation.isPending || product?.status === 'approved'
                  }
                  onClick={() => statusMutation.mutate({ status: 'approved' })}
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={statusMutation.isPending}
                  onClick={() => setRejectOpen(true)}
                >
                  Reject
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  disabled={
                    statusMutation.isPending || product?.status === 'pending'
                  }
                  onClick={() => statusMutation.mutate({ status: 'pending' })}
                >
                  Mark as pending
                </Button>
              </div>
            </AdminDetailSummaryCard>
          </div>
        </div>
      </div>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject product</DialogTitle>
            <DialogDescription>
              A rejection reason is required by the API.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              placeholder="Explain why this asset was rejected"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!rejectionReason.trim() || statusMutation.isPending}
              onClick={() =>
                statusMutation.mutate({
                  status: 'rejected',
                  rejectionReason: rejectionReason.trim(),
                })
              }
            >
              Confirm rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
