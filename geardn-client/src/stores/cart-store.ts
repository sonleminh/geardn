import { ICartStoreItem } from '@/interfaces/ICart';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartState = {
  cartItems: ICartStoreItem[];
  addToCart: (item: ICartStoreItem) => void;
  updateQuantity: (skuId: number, quantity: number) => void;
  removeItem: (skuId: number) => void;
  clearCart: () => void;
  syncCart: (cartItems: ICartStoreItem[]) => void;
  lastBuyNowItemId: number | null;
  setLastBuyNowItemId: (id: number | null) => void;
}

export type CartStore = CartState

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartItems: [],
      addToCart: (item) => {
        set((state) => {
          const existingItem = state.cartItems.find((i) => i.skuId === item.skuId);
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((i) =>
                i.skuId === item.skuId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { cartItems: [...state.cartItems, item] };
        })
      },
      updateQuantity: async (skuId, quantity) =>
      {
        set((state) => ({
          cartItems: state.cartItems.map((i) =>
            i.skuId === skuId ? { ...i, quantity } : i
          ),
        }))
      }
        ,
        removeItem: (skuId) =>
          set((state) => ({
            cartItems: state.cartItems.filter((i) => i.skuId !== skuId),
          })),
        clearCart: () => set({ cartItems: [] }),
        syncCart: (cartItems) => set({ cartItems: cartItems }),
        lastBuyNowItemId: null,
        setLastBuyNowItemId: (id) => set({ lastBuyNowItemId: id }),
    }),
    { name: 'cart-storage' } // 🛒 Persists cart for guest users
  )
);
