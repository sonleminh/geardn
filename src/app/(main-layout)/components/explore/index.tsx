'use client';

import AppLink from '@/components/common/AppLink';
import SkeletonImage from '@/components/common/SkeletonImage';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import BANNER_BG from '@/assets/geardn.jpg';
import { truncateTextByLine } from '@/utils/css-helper.util';
import ProductCard from '@/components/common/ProductCart';

const Explore = () => {
  return (
    <Box>
      <Typography sx={{ mb: 2, fontSize: 30, fontWeight: 600 }}>
        Khám phá sản phẩm
      </Typography>
      <Swiper
        slidesPerView={3}
        // navigation={{
        //   prevEl: `.arrow-left-${title}`,
        //   nextEl: `.arrow-right-${title}`,
        // }}
        modules={[Navigation]}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          1200: {
            slidesPerView: 3.2,
            spaceBetween: 30,
          },
          1500: {
            slidesPerView: 3.6,
            spaceBetween: 30,
          },
        }}
        className='mySwiper'>
        {[1, 2, 3, 4, 5]?.map((item, index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{
                '.product-img': {
                  '& img': {
                    height: '300px !important',
                  },
                },
              }}>
              <ProductCard link={'c'} />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default Explore;
