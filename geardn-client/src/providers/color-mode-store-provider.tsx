'use client';

import { useColorModeStore } from '@/stores/color-mode-store';
import { ThemeProvider, createTheme } from '@mui/material';
import { ReactNode } from 'react';

export default function ColorModeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { mode } = useColorModeStore();
  const darkTheme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#000',
        light: '#3d55ef',
      },
    },
    typography: {
      fontFamily: 'unset',
    },
  });
  return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>;
}
