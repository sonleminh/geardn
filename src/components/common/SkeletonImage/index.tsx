'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { Skeleton } from '@mui/material';

const SkeletonImage: React.FC<ImageProps> = (props) => {
  const [isError, setIsError] = useState(false);
  let srcImg = props.src;
  return isError ? (
    <Skeleton
      variant='rectangular'
      animation='wave'
      sx={{
        height: '100%',
        width: '100%',
      }}
    />
  ) : (
    <Image
      {...props}
      src={srcImg}
      alt={props.alt}
      fill={props.fill ?? true}
      sizes={
        props.sizes ??
        '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      }
      onError={() => {
        setIsError(true);
      }}
      priority
    />
  );
};

export default SkeletonImage;
