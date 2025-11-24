import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import CssBaseline from '@mui/material/CssBaseline';

import ColorModeProvider from '@/providers/color-mode-store-provider';
import { Providers } from '@/lib/utils/ProviderQuery';

const inter = Inter({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export const metadata = {
  icons: { icon: '/icon.png' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AppRouterCacheProvider>
          <Providers>
            <GoogleOAuthProvider
              clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
              {/* <ThemeProvider theme={theme}> */}
              <ColorModeProvider>
                <CssBaseline />
                {children}
              </ColorModeProvider>
              {/* </ThemeProvider> */}
            </GoogleOAuthProvider>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
