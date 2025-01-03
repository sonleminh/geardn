'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Box, SxProps, Theme } from '@mui/material';
import SkeletonImage from '@/components/common/SkeletonImage';

const MainSwiper = (props: any) => {
  return (
    <Box sx={SwiperStyle}>
      <Swiper
        spaceBetween={10}
        thumbs={{
          swiper:
            props?.thumbsSwiper && !props?.thumbsSwiper?.destroyed
              ? props?.thumbsSwiper
              : null,
        }}
        modules={[FreeMode, Navigation, Thumbs]}
        navigation={true}
        className='mainSwiper'>
        {props?.data?.map((item: any) => (
          <SwiperSlide key={item}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: '400px' },
                overflow: 'hidden',
                '& img': {
                  objectFit: 'contain !important',
                },
              }}>
              <SkeletonImage src={item} alt='geardn' />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default MainSwiper;

const SwiperStyle: SxProps<Theme> = {
  '.swiper': {
    width: '100%',
    height: '100%',
  },
  '.swiper-button-prev, .swiper-button-next': {
    width: 36,
    height: 36,
    border: '1px solid #696969',
    borderRadius: '50%',
    bgcolor: 'rgba(24, 24, 24, 0.7)',
    color: '#fff',
    ':after': {
      fontSize: 12,
    },
    ':hover': {
      bgcolor: 'rgba(24, 24, 24, 0.3)',
    },
  },
};
