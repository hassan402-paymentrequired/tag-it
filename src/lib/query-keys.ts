export const queryKeys = {
  products: {
    all: ['products'] as const,
    list: (params: Record<string, string | undefined>) =>
      ['products', 'list', params] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
  },
  users: {
    verifiers: ['users', 'verifiers'] as const,
  },
};
