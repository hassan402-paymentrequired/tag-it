import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Link2, Plus, Search, Users } from 'lucide-react';
import { toast } from 'sonner';
import { deleteUser, getUsers, updateUser } from '@/api/users';
import { downloadUsersExport } from '@/api/export';
import { getErrorMessage } from '@/api/client';
import { AdminLayout } from '@/components/layout/admin-layout';
import { AdminEmptyState } from '@/components/admin/admin-empty-state';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminPanel } from '@/components/admin/admin-detail-section';
import { ExportDownloadButtons } from '@/components/admin/export-download-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
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
import { queryKeys } from '@/lib/query-keys';
import { formatDate } from '@/lib/utils';
import type { User, UserRole } from '@/types';

function userStatus(user: User) {
  if (user.isDeleted) return 'Deleted';
  if (user.isSuspended) return 'Suspended';
  return 'Active';
}

export function UsersPage() {
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    role: 'REQUESTER' as UserRole,
  });

  const params = useMemo(
    () => ({
      ...(search ? { search } : {}),
      ...(roleFilter !== 'ALL' ? { role: roleFilter } : {}),
    }),
    [roleFilter, search],
  );

  const usersQuery = useQuery({
    queryKey: queryKeys.users.all(params),
    queryFn: () => getUsers(params),
  });

  const users = usersQuery.data?.data ?? [];

  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof updateUser>[1];
    }) => updateUser(id, payload),
    onSuccess: (response) => {
      toast.success(response.message || 'User updated');
      setEditingUser(null);
      invalidateUsers();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const suspendMutation = useMutation({
    mutationFn: ({ id, isSuspended }: { id: string; isSuspended: boolean }) =>
      updateUser(id, { isSuspended }),
    onSuccess: (response) => {
      toast.success(response.message || 'User status updated');
      invalidateUsers();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (response) => {
      toast.success(response.message || 'User deleted');
      setDeleteTarget(null);
      invalidateUsers();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const openEdit = (user: User) => {
    setEditingUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setSearch(searchInput.trim());
  };

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
            <div className="flex flex-wrap gap-2">
              <ExportDownloadButtons
                csvLabel="Download CSV"
                pdfLabel="Download PDF"
                onDownload={(format) =>
                  downloadUsersExport({
                    format,
                    ...(search ? { search } : {}),
                    ...(roleFilter !== 'ALL' ? { role: roleFilter } : {}),
                  })
                }
              />
              <Button variant="outline" asChild>
                <Link to="/users/assign">
                  <Link2 className="size-4" />
                  Assign requesters
                </Link>
              </Button>
              <Button asChild>
                <Link to="/users/create">
                  <Plus className="size-4" />
                  Create user
                </Link>
              </Button>
            </div>
          }
        />

        <AdminPanel title="All users">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <form onSubmit={handleSearch} className="flex min-w-0 flex-1 gap-2">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search by name or email"
                  className="pl-9"
                />
              </div>
              <Button type="submit" variant="outline">
                Search
              </Button>
            </form>
            <Select
              value={roleFilter}
              onValueChange={(value) => setRoleFilter(value as UserRole | 'ALL')}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All roles</SelectItem>
                <SelectItem value="REQUESTER">Requester</SelectItem>
                <SelectItem value="VERIFIER">Verifier</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {usersQuery.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full" />
              ))}
            </div>
          ) : !users.length ? (
            <AdminEmptyState
              icon={Users}
              title="No users found"
              description="Create accounts or adjust your search filters."
              action={
                <Button asChild>
                  <Link to="/users/create">Create user</Link>
                </Button>
              }
            />
          ) : (
            <div className="overflow-hidden rounded-lg border border-sidebar-border/70">
              <table className="w-full text-sm">
                <thead className="border-b border-sidebar-border/70 bg-muted/30 text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Verifier</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const status = userStatus(user);
                    const isBusy =
                      (suspendMutation.isPending &&
                        suspendMutation.variables?.id === user.id) ||
                      (deleteMutation.isPending &&
                        deleteMutation.variables === user.id);

                    return (
                      <tr
                        key={user.id}
                        className="border-b border-sidebar-border/50 last:border-0"
                      >
                        <td className="px-4 py-3 font-medium">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {user.email}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{user.role}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              status === 'Active' ? 'default' : 'secondary'
                            }
                          >
                            {status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {user.role === 'REQUESTER' && user.verifier
                            ? `${user.verifier.firstName} ${user.verifier.lastName}`
                            : '—'}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isBusy}
                              onClick={() => openEdit(user)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              disabled={isBusy}
                              onClick={() =>
                                suspendMutation.mutate({
                                  id: user.id,
                                  isSuspended: !user.isSuspended,
                                })
                              }
                            >
                              {user.isSuspended ? 'Unsuspend' : 'Suspend'}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={isBusy}
                              onClick={() => setDeleteTarget(user)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </AdminPanel>
      </div>

      <Dialog open={Boolean(editingUser)} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
            <DialogDescription>
              Update account details and role assignment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-first-name">First name</Label>
              <Input
                id="edit-first-name"
                value={editForm.firstName}
                onChange={(event) =>
                  setEditForm((current) => ({
                    ...current,
                    firstName: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-last-name">Last name</Label>
              <Input
                id="edit-last-name"
                value={editForm.lastName}
                onChange={(event) =>
                  setEditForm((current) => ({
                    ...current,
                    lastName: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={editForm.role}
                onValueChange={(value) =>
                  setEditForm((current) => ({
                    ...current,
                    role: value as UserRole,
                  }))
                }
              >
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
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button
              disabled={updateMutation.isPending || !editingUser}
              onClick={() => {
                if (!editingUser) return;
                updateMutation.mutate({
                  id: editingUser.id,
                  payload: editForm,
                });
              }}
            >
              {updateMutation.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete user</DialogTitle>
            <DialogDescription>
              This soft-deletes{' '}
              <span className="font-medium text-foreground">
                {deleteTarget?.firstName} {deleteTarget?.lastName}
              </span>
              . They will no longer be able to sign in.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending || !deleteTarget}
              onClick={() => {
                if (!deleteTarget) return;
                deleteMutation.mutate(deleteTarget.id);
              }}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete user'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
