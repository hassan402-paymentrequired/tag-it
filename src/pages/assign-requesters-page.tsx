import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignRequesters, unassignRequesters } from '@/api/users';
import { getErrorMessage } from '@/api/client';
import { AdminLayout } from '@/components/layout/admin-layout';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminPanel } from '@/components/admin/admin-detail-section';
import { RequesterCheckboxList } from '@/components/admin/requester-checkbox-list';
import { FormField } from '@/components/admin/form-field';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRequesterDirectory } from '@/hooks/use-requester-directory';
import { queryKeys } from '@/lib/query-keys';

export function AssignRequestersPage() {
  const queryClient = useQueryClient();
  const [verifierId, setVerifierId] = useState('');
  const [selectedRequesterIds, setSelectedRequesterIds] = useState<string[]>(
    [],
  );
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { requesters, verifiers, isLoading, getAssignedVerifier } =
    useRequesterDirectory();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.users.verifiers });
    queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
  };

  const assignMutation = useMutation({
    mutationFn: assignRequesters,
    onSuccess: (response) => {
      setMessage(response.message);
      setError('');
      setSelectedRequesterIds([]);
      invalidate();
    },
    onError: (err) => {
      setError(getErrorMessage(err));
      setMessage('');
    },
  });

  const unassignMutation = useMutation({
    mutationFn: unassignRequesters,
    onSuccess: (response) => {
      setMessage(response.message);
      setError('');
      setSelectedRequesterIds([]);
      invalidate();
    },
    onError: (err) => {
      setError(getErrorMessage(err));
      setMessage('');
    },
  });

  const handleAssign = () => {
    if (!verifierId) {
      setError('Select a verifier first');
      return;
    }
    if (!selectedRequesterIds.length) {
      setError('Select at least one requester');
      return;
    }
    assignMutation.mutate({ verifierId, requesterIds: selectedRequesterIds });
  };

  const handleUnassign = () => {
    if (!selectedRequesterIds.length) {
      setError('Select at least one requester');
      return;
    }
    unassignMutation.mutate({
      verifierId: verifierId || selectedRequesterIds[0],
      requesterIds: selectedRequesterIds,
    });
  };

  return (
    <AdminLayout
      breadcrumbs={[
        { title: 'Dashboard', href: '/' },
        { title: 'Users', href: '/users' },
        { title: 'Assign requesters' },
      ]}
    >
      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
        <AdminPageHeader
          eyebrow="Management"
          title="Assign requesters"
          description="Choose a verifier, select requesters, then assign or unassign."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <AdminPanel title="Assignment">
            <div className="grid gap-5">
              <FormField label="Verifier" htmlFor="verifier">
                <Select value={verifierId} onValueChange={setVerifierId}>
                  <SelectTrigger id="verifier">
                    <SelectValue placeholder="Select verifier" />
                  </SelectTrigger>
                  <SelectContent>
                    {verifiers.map((verifier) => (
                      <SelectItem key={verifier.id} value={verifier.id}>
                        {verifier.firstName} {verifier.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Requesters" htmlFor="requesters">
                {isLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} className="h-14 w-full" />
                    ))}
                  </div>
                ) : (
                  <RequesterCheckboxList
                    requesters={requesters}
                    selectedIds={selectedRequesterIds}
                    onChange={setSelectedRequesterIds}
                    getAssignedVerifier={getAssignedVerifier}
                  />
                )}
              </FormField>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              {message ? <p className="text-sm text-success">{message}</p> : null}

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleAssign} disabled={assignMutation.isPending}>
                  {assignMutation.isPending ? 'Assigning…' : 'Assign selected'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleUnassign}
                  disabled={unassignMutation.isPending}
                >
                  {unassignMutation.isPending ? 'Unassigning…' : 'Unassign selected'}
                </Button>
              </div>
            </div>
          </AdminPanel>

          <AdminPanel title="Verifier overview">
            <div className="space-y-3">
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-20 w-full" />
                  ))}
                </div>
              ) : null}
              {verifiers.map((verifier) => (
                <div
                  key={verifier.id}
                  className="rounded-lg border border-sidebar-border/70 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">
                        {verifier.firstName} {verifier.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {verifier.email}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {verifier.requesters?.length ?? 0} requesters
                    </Badge>
                  </div>
                  {verifier.requesters?.length ? (
                    <ul className="mt-3 space-y-1 border-t border-sidebar-border/70 pt-3 text-xs text-muted-foreground">
                      {verifier.requesters.map((requester) => (
                        <li key={requester.id}>
                          {requester.firstName} {requester.lastName}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 border-t border-sidebar-border/70 pt-3 text-xs text-muted-foreground">
                      No requesters assigned yet
                    </p>
                  )}
                </div>
              ))}
              {!isLoading && !verifiers.length ? (
                <p className="text-sm text-muted-foreground">
                  No verifiers found. Create verifier accounts first.
                </p>
              ) : null}
            </div>
          </AdminPanel>
        </div>
      </div>
    </AdminLayout>
  );
}
