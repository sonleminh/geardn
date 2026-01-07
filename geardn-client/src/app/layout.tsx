import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { GoogleAnalytics } from "@next/third-parties/google";
import CssBaseline from "@mui/material/CssBaseline";
import NextTopLoader from "nextjs-toploader";

import ColorModeProvider from "@/providers/color-mode-store-provider";
import { Providers } from "@/lib/utils/ProviderQuery";

const inter = Inter({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata = {
  icons: { icon: "/icon.png" },
  metadataBase: new URL("https://geardn.id.vn"), // Thay bằng domain thật khi deploy
  title: "GearDN",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <GoogleAnalytics gaId="G-Z9ZSEQE027" />
        <AppRouterCacheProvider>
          <Providers>
            <GoogleOAuthProvider
              clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
            >
              {/* <ThemeProvider theme={theme}> */}
              <ColorModeProvider>
                <CssBaseline />
                <NextTopLoader
                  color="#000"
                  initialPosition={0.08}
                  crawlSpeed={200}
                  height={2}
                  crawl={true}
                  showSpinner={false}
                  easing="ease"
                  speed={200}
                  shadow="0 0 10px #000,0 0 5px #000"
                />
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
