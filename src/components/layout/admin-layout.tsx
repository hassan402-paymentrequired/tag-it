import type { ReactNode } from 'react';
import { AdminSidebar } from './admin-sidebar';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import type { BreadcrumbItem } from '@/types/layout';

type Props = {
  breadcrumbs?: BreadcrumbItem[];
  children: ReactNode;
};

export function AdminLayout({ breadcrumbs = [], children }: Props) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center border-b border-sidebar-border/50 px-4 md:px-6">
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </header>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
