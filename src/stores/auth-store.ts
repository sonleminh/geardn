// src/stores/counter-store.ts
import { IUser } from '@/interfaces/IUser'
import { createStore } from 'zustand/vanilla'
import { PersistStorage, devtools, persist } from 'zustand/middleware';
import { ICartItem } from '@/interfaces/ICart';

export type AuthState = {
  user?: IUser | null;
  orderFormData?: 
    {
      customer: {
        email: string,
        name: string,
        phone: string,
      },
      products: ICartItem[]; 
    }
}

export type AuthActions = {
  login: (user: IUser) => void;
  logout: () => void;
  addProducts: (products: ICartItem[]) => void;
  changeCustomer: (customerData: { email: string, name: string, phone: string }) => void;
}

export type AuthStore = AuthState & AuthActions

export const defaultInitState: AuthState = {
  user: null,
  orderFormData: {
    customer: {
      email: '',
      name: '',
      phone: '',
    },
    products: [], 
  }
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
    addProducts: (products) => set((state) => ({
      orderFormData: {
        customer: state.orderFormData?.customer || { email: '', name: '', phone: '' },
        products: products, // Merges existing products with new list
      }
    }), false, "addProducts"),
    changeCustomer: (customerData) =>
      set(
        (state) => ({
          orderFormData: {
            customer: customerData,
            products: state.orderFormData?.products || [], // Ensure products field is included
          },
        }),
        false,
        'changeCustomer'
      ),
  }), {
    name: 'store',
    storage: sessionStorageAdapter,
    // storage: sessionStorage,  // Use sessionStorage to persist checkoutData
  }))))
}