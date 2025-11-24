import { ICartStoreItem } from '@/interfaces/ICart';
import { IUser } from '@/interfaces/IUser';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface CheckoutInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export type AuthState = {
  user: IUser | null;
  checkoutInfo: CheckoutInfo,
  checkoutCart: ICartStoreItem[];
  login: (user: IUser) => void;
  logout: () => void;
  updateCheckoutInfo: (info: Partial<CheckoutInfo>) => void
  setCheckoutCart: (checkoutCart: ICartStoreItem[]) => void;
}

export type AuthStore = AuthState

export const useAuthStore = create<AuthState>()(
 devtools( persist(
    (set) => ({
      user: null,
      checkoutInfo: {
        name: '',
        email: '',
        phone: '',
        address: '',
      },
      checkoutCart: [],
      login: (user) => set({ user }, false),
      logout: () => set(() => ({ user: null })),
      updateCheckoutInfo: (info) =>
        set((state) => ({ checkoutInfo: { ...state.checkoutInfo, ...info } })),
      setCheckoutCart: (checkoutCart) => set({ checkoutCart: checkoutCart }),
    }),
    { name: 'auth-store' }
  ))
);