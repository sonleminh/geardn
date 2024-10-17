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
import { useEffect, useState } from 'react';
import { Swiper as SwiperClass } from 'swiper';
import MainSwiper from './components/main-swiper';
import ThumbSwiper from './components/thumb-swiper';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import HtmlRenderBox from '@/components/common/HtmlRenderBox';

const ProductDetail = () => {
  const params = useParams();
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [count, setCount] = useState<number | null>(1);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string | null>
  >({});
  const [matchedPrice, setMatchedPrice] = useState<number | null>(null);

  const { product } = useGetProductById(params?.slug as string);
  const { skuList } = useGetSKUByPrdId(params?.slug as string);

  const breadcrumbsOptions = [
    { link: '/', label: 'Home' },
    { link: `/product/${product?._id}`, label: product?.name as string },
  ];

  console.log(matchedPrice);

  useEffect(() => {
    const price = findMatchingPrice();
    setMatchedPrice(price);
  }, [selectedAttributes]);

  const findMatchingPrice = () => {
    const matchedSKU = skuList?.find((sku) =>
      sku.attributes?.every(
        (attr) => selectedAttributes[attr.name] === attr.value
      )
    );
    return matchedSKU?.price ?? null;
  };

  // Step 2: Handle ToggleButtonGroup change
  const handleToggleChange = (
    attributeName: string,
    newValue: string | null
  ) => {
    console.log(newValue);
    setSelectedAttributes((prevState) => ({
      ...prevState,
      [attributeName]: newValue, // Update specific attribute value
    }));
  };

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

  function removeDuplicates(arr: (string | undefined)[]) {
    return arr?.filter((item, index) => arr.indexOf(item) === index);
  }

  return (
    <Box pb={4}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography
                    sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                    5.0 <StarRateIcon sx={{ color: '#F19B4C', fontSize: 20 }} />
                  </Typography>
                  <AppLink href={'/'} sx={{ fontSize: 14 }}>
                    Xem đánh giá
                  </AppLink>
                </Box>
                {/* <Box sx={{ mb: 3 }}>
                  <Typography sx={{ fontSize: 26, fontWeight: 600 }}>
                    {formatPrice(product?.price)}
                  </Typography>
                  {product?.discount?.discountPrice && (
                    <Typography component={'span'}>
                      {formatPrice(product?.discount?.discountPrice)}
                    </Typography>
                  )}
                </Box> */}
                <Typography sx={{ mb: 2, fontSize: 24, fontWeight: 600 }}>
                  {formatPrice(matchedPrice || product?.original_price) ??
                    formatPrice(product?.original_price)}
                </Typography>
                {product?.attributes?.map((att, index) => (
                  <Grid2 container display={'flex'} key={att} my={2.5}>
                    <Grid2
                      size={2}
                      sx={{ display: 'flex', alignItems: 'center' }}>
                      {att}:
                    </Grid2>
                    <Grid2
                      size={10}
                      sx={{ display: 'flex', alignItems: 'center' }}>
                      <ToggleButtonGroup
                        value={selectedAttributes[att] || ''} // Step 3: Use state for value
                        exclusive
                        size='small'
                        onChange={(event, newValue) =>
                          handleToggleChange(att, newValue)
                        }
                        sx={{
                          '.MuiButtonBase-root': {
                            width: 120,
                            height: 36,
                            mr: 2,
                            border: '1px solid rgba(0,0,0,0.09)',
                            color: '#000',
                            borderRadius: 1,
                            textTransform: 'initial',
                          },
                        }}>
                        {removeDuplicates(
                          Array.isArray(skuList)
                            ? skuList
                                ?.map((sku) =>
                                  sku?.attributes?.find(
                                    (item) => item?.name === att
                                  )
                                )
                                ?.map((item) => item?.value)
                            : []
                        )?.map((item) => (
                          <ToggleButton
                            key={`${att}-${item}`}
                            value={item ?? ''}
                            aria-label='left aligned'>
                            {item}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </Grid2>
                  </Grid2>
                ))}
                <Grid2 container mt={3} mb={3}>
                  <Grid2 size={2}>Số lượng:</Grid2>
                  <Grid2 size={10} display={'flex'}>
                    <ButtonGroup
                      variant='outlined'
                      size='small'
                      sx={{ mr: 2, height: 32 }}>
                      <Button
                        onClick={() => handleCountChange((count ?? 0) - 1)}>
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
                      <Button
                        onClick={() => handleCountChange((count ?? 0) + 1)}>
                        +
                      </Button>
                    </ButtonGroup>
                    <Typography sx={{ fontSize: 14, lineHeight: '32px' }}>
                      69 sản phẩm có sẵn
                    </Typography>
                  </Grid2>
                </Grid2>
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
        <Box sx={{ p: 2, mb: 2, bgcolor: '#fff' }}>
          <Typography
            sx={{ width: '100%', p: 2, mb: 3, bgcolor: 'rgba(0,0,0,0.02)' }}>
            Chi tiết sản phẩm
          </Typography>
          <Grid2 container spacing={1.5} ml={2} mb={3}>
            <Grid2 size={2}>Danh mục</Grid2>
            <Grid2 size={10}>{product?.category?.name}</Grid2>
            <Grid2 size={2}>Thương hiệu</Grid2>
            <Grid2 size={10}>{product?.brand}</Grid2>
            <Grid2 size={2}>Bảo hành</Grid2>
            <Grid2 size={10}>{product?.details?.guarantee}</Grid2>
            <Grid2 size={2}>Chất liệu</Grid2>
            <Grid2 size={10}>{product?.details?.material}</Grid2>
          </Grid2>
          <Typography
            sx={{ width: '100%', p: 2, mb: 3, bgcolor: 'rgba(0,0,0,0.02)' }}>
            Mô tả sản phẩm
          </Typography>
          <HtmlRenderBox html={product?.description} />
        </Box>
      </LayoutContainer>
    </Box>
  );
};

export default ProductDetail;
