import { create } from 'zustand';
import type { User } from '@/types';

interface KnownUsersState {
  users: User[];
  addUser: (user: User) => void;
}

export const useKnownUsersStore = create<KnownUsersState>((set) => ({
  users: [],
  addUser: (user) =>
    set((state) => {
      if (state.users.some((entry) => entry.id === user.id)) {
        return state;
      }
      return { users: [...state.users, user] };
    }),
}));
