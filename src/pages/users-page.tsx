import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminPanel } from '@/components/admin/admin-detail-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const mockUsers = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Jane Requester',
    email: 'jane@example.com',
    role: 'REQUESTER',
    status: 'Active',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'John Verifier',
    email: 'john@example.com',
    role: 'VERIFIER',
    status: 'Suspended',
  },
];

export function UsersPage() {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <AdminLayout
      breadcrumbs={[
        { title: 'Dashboard', href: '/' },
        { title: 'Users' },
      ]}
    >
      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
        <AdminPageHeader
          eyebrow="Management"
          title="Users"
          description="View accounts, update profiles, and manage access."
          action={
            <Button asChild>
              <Link to="/users/create">
                <Plus className="size-4" />
                Create user
              </Link>
            </Button>
          }
        />

        <AdminPanel title="All users">
          <div className="overflow-hidden rounded-lg border border-sidebar-border/70">
            <table className="w-full text-sm">
              <thead className="border-b border-sidebar-border/70 bg-muted/30 text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-sidebar-border/50 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{user.role}</Badge>
                    </td>
                    <td className="px-4 py-3">{user.status}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditOpen(true)}
                        >
                          Edit
                        </Button>
                        <Button size="sm" variant="secondary" disabled>
                          Suspend
                        </Button>
                        <Button size="sm" variant="destructive" disabled>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminPanel>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
            <DialogDescription>
              Update account details and role assignment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>First name</Label>
              <Input defaultValue="Jane" disabled />
            </div>
            <div className="space-y-2">
              <Label>Last name</Label>
              <Input defaultValue="Requester" disabled />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select defaultValue="REQUESTER" disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REQUESTER">Requester</SelectItem>
                  <SelectItem value="VERIFIER">Verifier</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button disabled>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
