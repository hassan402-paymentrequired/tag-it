import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { BreadcrumbItem } from '@/types/layout';

export function Breadcrumbs({ breadcrumbs }: { breadcrumbs: BreadcrumbItem[] }) {
  if (!breadcrumbs.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <span key={`${item.title}-${index}`} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight className="size-3.5 text-muted-foreground" />
            )}
            {isLast || !item.href ? (
              <span className="font-medium text-foreground">{item.title}</span>
            ) : (
              <Link
                to={item.href}
                className="text-muted-foreground transition hover:text-foreground"
              >
                {item.title}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
