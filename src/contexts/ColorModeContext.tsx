'use client';

import React, { ReactNode, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('THEME_MODE', newMode);
          return newMode;
        });
      },
    }),
    []
  );

  useEffect(() => {
    const savedMode = localStorage.getItem('THEME_MODE') as 'light' | 'dark';
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

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

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export { ColorModeContext, ColorModeProvider };
