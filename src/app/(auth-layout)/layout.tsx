import Providers from '@/services/providers';
import { CssBaseline } from '@mui/material';

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <CssBaseline />
      <body>
        {children}
        {/* <Providers>{children}</Providers> */}
      </body>
    </html>
  );
}
