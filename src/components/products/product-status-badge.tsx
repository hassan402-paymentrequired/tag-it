import type { ProductStatus } from '@/types';
import { Badge } from '@/components/ui/badge';

const statusVariant: Record<
  ProductStatus,
  'pending' | 'approved' | 'rejected'
> = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
};

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return (
    <Badge variant={statusVariant[status]} className="capitalize">
      {status}
    </Badge>
  );
}
