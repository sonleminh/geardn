// src/stores/counter-store.ts
import { IUser } from '@/interfaces/IUser'
import { createStore } from 'zustand/vanilla'
import { devtools, persist } from 'zustand/middleware';

export type AuthState = {
  user?: IUser | null;
}

export type AuthActions = {
  login: (user: IUser) => void;
  logout: () => void;
}

export type AuthStore = AuthState & AuthActions

export const defaultInitState: AuthState = {
  user: null
}

export const authStore = (
  initState: AuthState = defaultInitState,
) => {
  return createStore<AuthStore>()((devtools(persist((set) => ({
    ...initState,
    login: (user) => set(({ user }), false, "login"),
    logout: () => set(() => ({ user: null })),
  }), {name: 'store'}))))
}
