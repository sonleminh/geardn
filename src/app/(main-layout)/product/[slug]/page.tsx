'use client';

import AppLink from '@/components/common/AppLink';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import LayoutContainer from '@/components/common/sharing/layout-container';
import { useGetProductById, useGetSKUByPrdId } from '@/services/product/api';
import { formatPrice } from '@/utils/format-price';
import StarRateIcon from '@mui/icons-material/StarRate';
import {
  Box,
  Button,
  ButtonGroup,
  Grid2,
  List,
  ListItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Swiper as SwiperClass } from 'swiper';
import MainSwiper from './components/main-swiper';
import ThumbSwiper from './components/thumb-swiper';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

const ProductDetail = () => {
  const params = useParams();
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [count, setCount] = useState<number | null>(1);
  const [option, setOption] = useState<string | null>('');

  const { product } = useGetProductById(params?.slug as string);
  const { skuList } = useGetSKUByPrdId(params?.slug as string);
  console.log(skuList);
  const breadcrumbsOptions = [
    { link: '/', label: 'Home' },
    { link: `/product/${product?._id}`, label: product?.name as string },
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

  const handleOption = (
    event: React.MouseEvent<HTMLElement>,
    newOption: string | null
  ) => {
    setOption(newOption);
  };

  return (
    <Box>
      <LayoutContainer>
        <Box sx={{ mb: 2 }}>
          <Breadcrumbs options={breadcrumbsOptions} />
        </Box>
        <Box sx={{ px: 3, mb: 2, bgcolor: '#fff', borderRadius: 1 }}>
          <Grid2 container spacing={4}>
            <Grid2 size={5} sx={{ py: 3 }}>
              <MainSwiper data={product?.images} thumbsSwiper={thumbsSwiper} />
              <Box mb={1} />
              <ThumbSwiper
                images={product?.images}
                setThumbsSwiper={setThumbsSwiper}
              />
            </Grid2>
            <Grid2 size={7} sx={{ pl: 3, borderLeft: '1px solid #eee' }}>
              <Box sx={{ pt: 3 }}>
                <Typography sx={{ mb: 1, fontSize: 24, fontWeight: 600 }}>
                  {product?.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Typography
                    sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                    5.0 <StarRateIcon sx={{ color: '#F19B4C', fontSize: 20 }} />
                  </Typography>
                  <AppLink href={'/'} sx={{ fontSize: 14 }}>
                    Xem đánh giá
                  </AppLink>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ fontSize: 26, fontWeight: 600 }}>
                    {formatPrice(product?.price)}
                  </Typography>
                  {product?.discount?.discountPrice && (
                    <Typography component={'span'}>
                      {formatPrice(product?.discount?.discountPrice)}
                    </Typography>
                  )}
                </Box>
                <ToggleButtonGroup
                  value={option}
                  exclusive
                  size='small'
                  onChange={handleOption}
                  sx={{
                    '.MuiButtonBase-root': {
                      width: 80,
                      height: 36,
                      mr: 2,
                      mb: 4,
                      border: '1px solid rgba(0,0,0,0.09)',
                      borderRadius: 1,
                    },
                  }}>
                  <ToggleButton value='left' aria-label='left aligned'>
                    <StarRateIcon />
                  </ToggleButton>
                  <ToggleButton value='center' aria-label='centered'>
                    <StarRateIcon />
                  </ToggleButton>
                  <ToggleButton value='right' aria-label='right aligned'>
                    <StarRateIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
                <Box sx={{ display: 'flex', alightItems: 'center', mb: 3 }}>
                  <ButtonGroup
                    variant='outlined'
                    size='small'
                    sx={{ mr: 2, height: 32 }}>
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
                      size='small'
                      sx={{
                        width: '48px',
                        '.MuiInputBase-root': {
                          height: 32,
                          borderRadius: 0,
                          '.MuiInputBase-input': {
                            p: 0,
                            textAlign: 'center',
                            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button':
                              {
                                display: 'none',
                              },
                            '-moz-appearance': 'textfield',
                          },
                        },
                      }}
                    />

                    <Button onClick={() => handleCountChange((count ?? 0) + 1)}>
                      +
                    </Button>
                  </ButtonGroup>
                  <Typography sx={{ fontSize: 14, lineHeight: '32px' }}>
                    69 sản phẩm có sẵn
                  </Typography>
                </Box>
                <Box>
                  <Button
                    variant='outlined'
                    size='large'
                    sx={{ mr: 2, bgcolor: '#f0f0f0' }}>
                    <ShoppingCartOutlinedIcon />
                  </Button>
                  <Button variant='contained' size='large' sx={{ width: 200 }}>
                    Mua ngay
                  </Button>
                </Box>
              </Box>
            </Grid2>
          </Grid2>
        </Box>
        <Box sx={{ p: 2, bgcolor: '#fff' }}>
          <Typography sx={{ width: '100%', p: 2, bgcolor: '#eee' }}>
            Chi tiết sản phẩm
          </Typography>
          <List>
            <ListItem>
              <Typography>Danh mục</Typography>
              <Typography>Giá treo màn hình</Typography>
            </ListItem>
            <ListItem>
              <Typography>Thương hiệu</Typography>
              <Typography>NB</Typography>
            </ListItem>
            <ListItem>
              <Typography>Kho</Typography>
              <Typography>69</Typography>
            </ListItem>
          </List>
        </Box>
      </LayoutContainer>
    </Box>
  );
};

export default ProductDetail;
