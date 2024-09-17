import SkeletonImage from '@/components/common/SkeletonImage';
import { Box } from '@mui/material';
import React from 'react';
import BANNER_BG from '@/assets/geardn.jpg';

export default function Homepage() {
  return (
    <>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '800px' },
          mb: 1,
          overflow: 'hidden',
          '& img': {
            objectFit: 'cover',
          },
          ':before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            filter: 'blur(8px)',
            zIndex: 1,
          },
        }}>
        <SkeletonImage src={BANNER_BG} alt='geardn' fill unoptimized={true} />
      </Box>
      Homepage
    </>
  );
}
