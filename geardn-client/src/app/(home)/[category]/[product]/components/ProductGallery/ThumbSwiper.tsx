'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Box, SxProps, Theme } from '@mui/material';
import SkeletonImage from '@/components/common/SkeletonImage';
import { Swiper as SwiperClass } from 'swiper';

interface IProps {
  images: string[];
  setThumbsSwiper: React.Dispatch<React.SetStateAction<SwiperClass | null>>;
}

const ThumbSwiper = ({ images, setThumbsSwiper }: IProps) => {
  return (
    <Box sx={SwiperStyle}>
      <Swiper
        onSwiper={setThumbsSwiper}
        direction={'horizontal'}
        spaceBetween={20}
        slidesPerView={images?.length ?? 3}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        navigation={true}
        className='thumbSwiper'>
        {images?.map((item: string) => (
          <SwiperSlide key={item}>
            <Box
              sx={{
                position: 'relative',
                width: '60px',
                height: { xs: '60px' },
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

export default ThumbSwiper;

const SwiperStyle: SxProps<Theme> = {
  '.swiper': {
    width: '100%',
    height: '100%',
  },
  '.swiper-wrapper': {
    justifyContent: 'center',
  },
  '.swiper-slide': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '60px !important',
    height: 'auto !important',

    border: '1px solid #eee',
    borderRadius: '5px',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  '.swiper-slide-thumb-active': {
    borderColor: '#696969',
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
