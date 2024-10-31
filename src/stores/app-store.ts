import { createStore } from 'zustand/vanilla'
import { devtools, persist } from 'zustand/middleware';
import { ICartItem } from '@/interfaces/ICart';

export type AppState = {
  data?: ICartItem[] | null;
}

export type AppActions = {
  addCheckoutItems: (items: ICartItem[]) => void;
}

export type AppStore = AppState & AppActions

export const defaultInitState: AppState = {
  data: null
}

export const appStore = (
  initState: AppState = defaultInitState,
) => {
  return createStore<AppStore>()((devtools(persist((set) => ({
    ...initState,
    addCheckoutItems: (items) => set((state) => ({
      data: items // Assigning items to the 'data' field in the state
    }), false, "addCheckoutItems"),
  }), {name: 'store'}))))
}
