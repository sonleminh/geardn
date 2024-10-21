import Layout from '@/components/common/sharing/layout';
import { ColorModeProvider } from '@/contexts/ColorModeContext';
import { AuthStoreProvider } from '@/providers/auth-store-provider';
import { CssBaseline } from '@mui/material';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/thumbs';

const inter = Inter({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <ColorModeProvider>
        <CssBaseline />
        <body className={inter.className}>
          <AuthStoreProvider>
            <Layout>{children}</Layout>
          </AuthStoreProvider>
        </body>
      </ColorModeProvider>
    </html>
  );
}
