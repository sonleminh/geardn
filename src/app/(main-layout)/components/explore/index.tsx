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
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LayoutContainer from '@/components/common/sharing/layout-container';
import { useCounterStore } from '@/providers/couter-store-provider';

const Explore = () => {
  const { count, incrementCount, decrementCount } = useCounterStore(
    (state) => state
  );
  return (
    <Box sx={{ mb: 10 }}>
      <div>
        Count: {count}
        <hr />
        <button type='button' onClick={() => void incrementCount()}>
          Increment Count
        </button>
        <button type='button' onClick={() => void decrementCount()}>
          Decrement Count
        </button>
      </div>
      <LayoutContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ mb: 4, fontSize: 36, fontWeight: 700 }}>
            Khám phá sản phẩm
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              '> div > svg': {
                fontSize: 30,
                ':hover': {
                  bgcolor: '#222',
                  color: '#fff',
                  borderRadius: 2,
                  cursor: 'pointer',
                },
              },
            }}>
            <Box className={`arrow-left`} sx={{ mr: 1 }}>
              <KeyboardArrowLeftIcon />
            </Box>
            <Box className={`arrow-right`}>
              <KeyboardArrowRightIcon />
            </Box>
          </Box>
        </Box>
        <Swiper
          slidesPerView={3}
          navigation={{
            prevEl: `.arrow-left`,
            nextEl: `.arrow-right`,
          }}
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
              slidesPerView: 3.5,
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
      </LayoutContainer>
    </Box>
  );
};

export default Explore;
