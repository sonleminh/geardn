'use client';

import ProductCard from '@/components/common/ProductCard';
import LayoutContainer from '@/components/common/sharing/layout-container';
import { IProduct } from '@/interfaces/IProduct';
import { useGetProducts } from '@/services/product/api';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Typography } from '@mui/material';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const Explore = () => {
  const { products } = useGetProducts();
  console.log('products', products);
  return (
    <Box sx={{ mb: 10 }}>
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
          {products?.products?.map((item, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  '.product-img': {
                    '& img': {
                      height: '300px !important',
                    },
                  },
                }}>
                <ProductCard data={item} />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </LayoutContainer>
    </Box>
  );
};

export default Explore;
