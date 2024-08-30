import { Box, Grid2, Typography } from '@mui/material';
import React from 'react';

export default function Login() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
        bgcolor: '#D7D6D9',
      }}>
      <Box sx={{ width: 1000, mx: 'auto', bgcolor: '#fff' }}>
        <Grid2 container>
          <Grid2 size={6}>cc</Grid2>
          <Grid2 size={6}>
            <Typography>Welcome back!</Typography>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
}
