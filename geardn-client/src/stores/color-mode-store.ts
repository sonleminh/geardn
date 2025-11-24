import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
type ColorModeState = {
  mode: 'light' | 'dark';
  toggleColorMode: () => void;
}

export const useColorModeStore = create<ColorModeState>()(
  devtools(persist(
    (set) => ({
      mode: 'light',
      toggleColorMode: () =>
        set((state) => {
          return { mode: state.mode === 'light' ? 'dark' : 'light' };
        }),
    }),
    { name: 'color-mode-storage' }
  ))
);