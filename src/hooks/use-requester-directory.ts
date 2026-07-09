import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers, getVerifiers } from '@/api/users';
import { queryKeys } from '@/lib/query-keys';
import type { User } from '@/types';

function sortUsers(users: User[]) {
  return [...users].sort((a, b) =>
    `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
  );
}

export function useRequesterDirectory() {
  const requestersQuery = useQuery({
    queryKey: queryKeys.users.all({ role: 'REQUESTER' }),
    queryFn: () => getUsers({ role: 'REQUESTER' }),
  });

  const verifiersQuery = useQuery({
    queryKey: queryKeys.users.verifiers,
    queryFn: getVerifiers,
  });

  const requesters = useMemo(
    () => sortUsers(requestersQuery.data?.data ?? []),
    [requestersQuery.data],
  );

  const verifiers = verifiersQuery.data?.data ?? [];

  const getAssignedVerifier = (requesterId: string) => {
    for (const verifier of verifiers) {
      if (verifier.requesters?.some((requester) => requester.id === requesterId)) {
        return verifier;
      }
    }

    const requester = requesters.find((entry) => entry.id === requesterId);
    return requester?.verifier ?? null;
  };

  return {
    requesters,
    verifiers,
    isLoading: requestersQuery.isLoading || verifiersQuery.isLoading,
    getAssignedVerifier,
  };
}
