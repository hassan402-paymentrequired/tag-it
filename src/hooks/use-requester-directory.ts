import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/api/products';
import { getVerifiers } from '@/api/users';
import { queryKeys } from '@/lib/query-keys';
import { useKnownUsersStore } from '@/stores/known-users-store';
import type { User } from '@/types';

function mergeUsers(...groups: Array<User[] | undefined>) {
  const map = new Map<string, User>();

  groups.forEach((group) => {
    group?.forEach((user) => {
      if (user?.id) map.set(user.id, user);
    });
  });

  return Array.from(map.values()).sort((a, b) =>
    `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
  );
}

export function useRequesterDirectory() {
  const knownUsers = useKnownUsersStore((state) => state.users);

  const productsQuery = useQuery({
    queryKey: queryKeys.products.list({ currentPage: '1', pageSize: '100' }),
    queryFn: () => getProducts({ currentPage: '1', pageSize: '100' }),
  });

  const verifiersQuery = useQuery({
    queryKey: queryKeys.users.verifiers,
    queryFn: getVerifiers,
  });

  const requesters = useMemo(() => {
    const fromProducts =
      productsQuery.data?.data.data
        .map((product) => product.user)
        .filter(Boolean) ?? [];

    const fromVerifiers =
      verifiersQuery.data?.data.flatMap(
        (verifier) => verifier.requesters ?? [],
      ) ?? [];

    const fromKnown = knownUsers.filter((user) => user.role === 'REQUESTER');

    return mergeUsers(fromProducts, fromVerifiers, fromKnown).filter(
      (user) => user.role === 'REQUESTER',
    );
  }, [knownUsers, productsQuery.data, verifiersQuery.data]);

  const verifiers = verifiersQuery.data?.data ?? [];

  const getAssignedVerifier = (requesterId: string) => {
    for (const verifier of verifiers) {
      if (verifier.requesters?.some((requester) => requester.id === requesterId)) {
        return verifier;
      }
    }
    return null;
  };

  return {
    requesters,
    verifiers,
    isLoading: productsQuery.isLoading || verifiersQuery.isLoading,
    getAssignedVerifier,
  };
}
