'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { Box, Skeleton } from '@mui/material';

const SkeletonImage: React.FC<ImageProps> = (props) => {
  const [isError, setIsError] = useState(false);
  const srcImg = props?.src;
  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      {isError ? (
        <Skeleton
          variant='rectangular'
          animation='wave'
          sx={{
            width: '100%',
            height: '100%',
          }}
        />
      ) : (
        <Image
          {...props}
          src={srcImg ?? null}
          alt={props?.alt}
          fill
          sizes={
            props?.sizes ??
            '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          }
          onError={() => {
            setIsError(true);
          }}
          priority={props?.priority || false}
          quality={props?.quality || 75}
        />
      )}
    </Box>
  );
};

export default SkeletonImage;
