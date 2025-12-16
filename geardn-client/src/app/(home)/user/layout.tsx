import React, { Suspense } from 'react';

import { Box, Grid2 } from '@mui/material';

import { getUserOnServer } from '@/data/profile.server';

import { LoadingCircle } from '@/components/common/LoadingCircle';
import LayoutContainer from '@/components/layout-container';
import Sidebar from './components/sidebar';

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userData = await getUserOnServer();
  return (
    <Suspense fallback={<LoadingCircle />}>
      <Box pt={2} pb={4}>
        <LayoutContainer>
          <Grid2 container spacing={2}>
            <Grid2 size={2}>
              <Sidebar userData={userData?.data} />
            </Grid2>
            <Grid2 size={10}>{children}</Grid2>
          </Grid2>
        </LayoutContainer>
      </Box>
    </Suspense>
  );
}
