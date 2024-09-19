// src/stores/counter-store.ts
import { IUser } from '@/interfaces/IUser'
import { createStore } from 'zustand/vanilla'

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

export const useAuthStore = (
  initState: AuthState = defaultInitState,
) => {
  return createStore<AuthStore>()((set) => ({
    ...initState,
    login: (user) => set(({ user })),
    logout: () => set(() => ({ user: null })),
  }))
}
