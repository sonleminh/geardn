'use client';

import AppLink from '@/components/common/AppLink';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import LayoutContainer from '@/components/common/sharing/layout-container';
import { useGetProductById } from '@/services/product/api';
import formatPrice from '@/utils/format-price';
import StarRateIcon from '@mui/icons-material/StarRate';
import {
  Box,
  Button,
  ButtonGroup,
  Grid2,
  TextField,
  Typography,
} from '@mui/material';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Swiper as SwiperClass } from 'swiper';
import MainSwiper from './components/main-swiper';
import ThumbSwiper from './components/thumb-swiper';

const ProductDetail = () => {
  const params = useParams();
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [count, setCount] = useState<number | null>(1);

  const { product } = useGetProductById(params?.slug as string);
  const breadcrumbsOptions = [
    { link: '/', label: 'Home' },
    // { link: `/blog/${data._id}`, label: data.title },
  ];

  console.log('count:', count);
  // const handleInputChange = (e) => {
  //   // Convert input value to number and set count
  //   const newValue = parseInt(e.target.value, 10);
  //   if (!isNaN(newValue)) {
  //     setCount(newValue);
  //   }
  // };
  const handleCountChange = (value: number | null) => {
    // Ensure count is non-negative
    if (value && value >= 0) {
      setCount(value);
    }
  };

  return (
    <Box>
      <LayoutContainer>
        <Box sx={{ px: 3, bgcolor: '#fff', borderRadius: 1 }}>
          <Box sx={{ mb: 3 }}>
            <Breadcrumbs options={breadcrumbsOptions} />
          </Box>
          <Grid2 container spacing={4}>
            <Grid2 size={5}>
              <MainSwiper data={product?.images} thumbsSwiper={thumbsSwiper} />
              <Box mb={1} />
              <ThumbSwiper
                images={product?.images}
                setThumbsSwiper={setThumbsSwiper}
              />
            </Grid2>
            <Grid2 size={7} sx={{ pl: 3, borderLeft: '1px solid #eee' }}>
              <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
                {product?.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography
                  sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                  5.0 <StarRateIcon sx={{ color: '#F19B4C', fontSize: 20 }} />
                </Typography>
                <AppLink href={'/'} sx={{ fontSize: 14 }}>
                  Xem đánh giá
                </AppLink>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: 24, fontWeight: 600 }}>
                  {formatPrice(product?.price)}
                </Typography>
                {product?.discount?.discountPrice && (
                  <Typography component={'span'}>
                    {formatPrice(product?.discount?.discountPrice)}
                  </Typography>
                )}
              </Box>
              <ButtonGroup variant='outlined' size='small' sx={{ mb: 2 }}>
                <Button onClick={() => handleCountChange((count ?? 0) - 1)}>
                  -
                </Button>
                <TextField
                  type='number'
                  value={count ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCount(value ? parseInt(value, 10) : null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === '-') {
                      e.preventDefault();
                    }
                    if (
                      count === null &&
                      (e.key === '0' || e.key === 'Enter')
                    ) {
                      console.log('prv');
                      e.preventDefault();
                    }
                  }}
                />

                <Button onClick={() => handleCountChange((count ?? 0) + 1)}>
                  +
                </Button>
              </ButtonGroup>
              <Box>
                <Button variant='outlined'>Thêm vào giỏ hàng</Button>
                <Button variant='contained'>Mua ngay</Button>
              </Box>
            </Grid2>
          </Grid2>
        </Box>
      </LayoutContainer>
    </Box>
  );
};

export default ProductDetail;
