import React, { ReactNode } from 'react';
import { Box, Grid2 } from '@mui/material';
import Breadcrumbs, { IBreadcrumbOption } from '../../Breadcrumbs';
import LayoutContainer from '../layout-container';

const UserLayout = ({
  breadcrumbs,
  children,
}: {
  breadcrumbs: IBreadcrumbOption[];
  children?: ReactNode;
}) => {
  return (
    <Box sx={{ pt: 2, pb: 4, bgcolor: '#eee' }}>
      <LayoutContainer>
        <Box sx={{ mb: 2 }}>
          <Breadcrumbs options={breadcrumbs} />
        </Box>
        <Grid2 container>
          <Grid2 size={2.5}>SIDEBAR</Grid2>
          <Grid2 size={9.5}>{children}</Grid2>
        </Grid2>
      </LayoutContainer>
    </Box>
  );
};

export default UserLayout;
