import SkeletonImage from '@/components/common/SkeletonImage';
import { Box } from '@mui/material';
import React from 'react';
import BANNER_BG from '@/assets/geardn-banner.png';

export default function Homepage() {
  return (
    <>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '500px' },
          mb: 1,
          borderRadius: 2,
          overflow: 'hidden',
          '& img': {
            objectFit: 'cover',
          },
        }}>
        <SkeletonImage
          src={
            'https://firebasestorage.googleapis.com/v0/b/dev-blog-7a694.appspot.com/o/geardn-banner.png?alt=media&token=c0015636-eed4-4d6d-915e-aad9fe310f9a'
          }
          alt='geardn'
          fill
        />
      </Box>
      Homepage
    </>
  );
}
