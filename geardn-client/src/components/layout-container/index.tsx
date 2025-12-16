import React, { ReactNode } from 'react';
import { Box } from '@mui/material';

const LayoutContainer = ({ children }: { children?: ReactNode }) => {
  return (
    <Box sx={{ maxWidth: { xs: '92%', lg: 1070, xl: 1200 }, margin: '0 auto' }}>
      <> {children}</>
    </Box>
  );
};

export default LayoutContainer;
