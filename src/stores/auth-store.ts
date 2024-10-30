// src/stores/counter-store.ts
import { IUser } from '@/interfaces/IUser'
import { createStore } from 'zustand/vanilla'
import { PersistStorage, devtools, persist } from 'zustand/middleware';
import { ICartItem } from '@/interfaces/ICart';

export type AuthState = {
  user?: IUser | null;
  checkoutData?: ICartItem[] | [];  
}

export type AuthActions = {
  login: (user: IUser) => void;
  logout: () => void;
  setCheckoutData: (data: ICartItem[]) => void;  
}

export type AuthStore = AuthState & AuthActions

export const defaultInitState: AuthState = {
  user: null,
  checkoutData: []
}

const sessionStorageAdapter: PersistStorage<AuthStore> = {
  getItem: (name) => {
    const item = sessionStorage.getItem(name)
    return item ? JSON.parse(item) : [];
  },
  setItem: (name, value) => {
    sessionStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    sessionStorage.removeItem(name);
  },
}

export const authStore = (
  initState: AuthState = defaultInitState,
) => {
  // return createStore<AuthStore>()((devtools(persist((set) => ({
  //   ...initState,
  //   login: (user) => set(({ user }), false, "login"),
  //   logout: () => set(() => ({ user: null })),
  // }), {name: 'store'}))))
  return createStore<AuthStore>()((devtools(persist((set) => ({
    ...initState,
    login: (user) => set({ user }, false, "login"),
    logout: () => set(() => ({ user: null })),
    setCheckoutData: (data) => set({ checkoutData: data }, false, "setCheckoutData"),
  }), {
    name: 'store',
    storage: sessionStorageAdapter,
    // storage: sessionStorage,  // Use sessionStorage to persist checkoutData
  }))))
}