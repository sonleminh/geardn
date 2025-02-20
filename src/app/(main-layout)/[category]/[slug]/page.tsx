'use client';

import AppLink from '@/components/common/AppLink';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import HtmlRenderBox from '@/components/common/HtmlRenderBox';
import SkeletonImage from '@/components/common/SkeletonImage';
import LayoutContainer from '@/components/common/sharing/layout-container';
import { attributeLabels } from '@/constants/attributeLabels';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { IModel } from '@/interfaces/IProduct';
import { useAuthStore } from '@/providers/auth-store-provider';
import { useGetCart } from '@/services/cart/api';
import { useGetProductBySlug } from '@/services/product/api';
import { formatPrice } from '@/utils/format-price';
import StarRateIcon from '@mui/icons-material/StarRate';
import {
  Box,
  Button,
  ButtonGroup,
  Grid2,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Swiper as SwiperClass } from 'swiper';
import { useSWRConfig } from 'swr';
import MainSwiper from './components/main-swiper';
import ThumbSwiper from './components/thumb-swiper';

const ProductDetail = () => {
  const params = useParams();
  const router = useRouter();
  const { cart, mutate, isLoading } = useGetCart();
  const { user, addProducts } = useAuthStore((state) => state);

  const { mutate: globalMutate } = useSWRConfig();
  const { showNotification } = useNotificationContext();
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [count, setCount] = useState<number | null>(1);

  const [optionImage, setOptionImage] = useState<string>('');
  const [matchedModel, setMatchedModel] = useState<IModel | null>(null);
  const [addCartError, setAddCartError] = useState<boolean>(false);
  const [addQuantityError, setAddQuantityError] = useState<boolean>(false);
  const [isOutOfStock, setIsOutOfStock] = useState<boolean>(false);

  const { product } = useGetProductBySlug(params?.slug as string);

  const breadcrumbsOptions = [
    { href: '/', label: 'Home' },
    { href: `/product/${product?.id}`, label: product?.name as string },
  ];

  const attributeOptions = useMemo(() => {
    const options: Record<string, string[]> = {};
    product?.skus?.forEach((sku) => {
      sku?.productSkuAttributes?.forEach(({ attribute }) => {
        if (!options[attribute.type]) {
          options[attribute.type] = [];
        }
        if (!options[attribute.type].includes(attribute.value)) {
          options[attribute.type].push(attribute.value);
        }
      });
    });
    return options;
  }, [product?.skus]);

  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  const availableCombinations = product?.skus?.map((sku) =>
    sku.productSkuAttributes.reduce((acc, attr) => {
      acc[attr.attribute.type] = attr.attribute.value;
      return acc;
    }, {} as Record<string, string>)
  );

  const handleDisableAttribute = useMemo(() => {
    return (type: string, value: string) => {
      if (Object.keys(selectedAttributes).length === 0) return false;
      // Tạo bản sao tránh mutate state gốc
      const simulatedSelection = { ...selectedAttributes };

      // Nếu đã chọn, loại bỏ thuộc tính khỏi danh sách chọn
      if (simulatedSelection[type] === value) {
        delete simulatedSelection[type]; // Xóa hẳn key
      } else {
        simulatedSelection[type] = value; // Chọn mới
      }

      const filteredSelection = Object.fromEntries(
        Object.entries(simulatedSelection).filter(([_, val]) => val)
      );

      // Nếu không còn gì trong selectedAttributes, không disable gì cả
      if (Object.keys(filteredSelection).length === 0) return false;

      // Kiểm tra nếu tổ hợp mới này có hợp lệ
      const isValid = availableCombinations.some((combo) =>
        Object.entries(filteredSelection).every(
          ([key, val]) => combo[key] === val
        )
      );

      return !isValid;
    };
  }, [selectedAttributes]);

  const handleCountChange = (value: number | null) => {
    if (value && value >= 0) {
      setCount(value);
    }
  };

  const selectedSku = useMemo(() => {
    const hasNullValue = Object.values(selectedAttributes).some(
      (value) => value === null
    );

    if (hasNullValue) return null;
    return Object.keys(selectedAttributes).length > 0
      ? product?.skus?.find((sku) =>
          Object.entries(selectedAttributes).every(([key, value]) =>
            sku.productSkuAttributes.some(
              (attr) =>
                attr.attribute.type === key && attr.attribute.value === value
            )
          )
        )
      : null;
  }, [selectedAttributes, product?.skus]);

  const getLowestPrice = () => {
    if (!product?.skus || product?.skus.length === 0) return null;

    return Math.min(...product?.skus.map((sku) => Number(sku.price)));
  };

  const handleAttributeChange = (type: string, value: string) => {
    setSelectedAttributes((prev) => {
      const newAttributes = { ...prev };

      if (newAttributes[type] === value) {
        delete newAttributes[type]; // Nếu đã chọn, thì bỏ chọn
      } else {
        newAttributes[type] = value; // Nếu chưa chọn, thì chọn
      }

      return newAttributes;
    });
  };

  return (
    <Box pt={2} pb={4} bgcolor={'#eee'}>
      <LayoutContainer>
        <Box sx={{ mb: 2 }}>
          <Breadcrumbs options={breadcrumbsOptions} />
        </Box>
        <Box sx={{ px: 3, mb: 2, bgcolor: '#fff', borderRadius: 1 }}>
          <Grid2 container columnSpacing={4}>
            <Grid2 size={5} sx={{ py: 3 }}>
              <Box sx={{ position: 'relative', height: '400px' }}>
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                  }}>
                  {optionImage ? (
                    <SkeletonImage
                      src={optionImage}
                      alt='Selected Option'
                      style={{
                        position: 'absolute',
                        top: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  ) : null}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      width: '100%',
                      height: '400px',
                      display: optionImage ? 'none' : 'block',
                    }}>
                    <MainSwiper
                      data={product?.images}
                      thumbsSwiper={thumbsSwiper}
                    />
                  </Box>
                </Box>
              </Box>
              <Box mb={1} />
              <Box onClick={() => setOptionImage('')}>
                <ThumbSwiper
                  images={product?.images}
                  setThumbsSwiper={setThumbsSwiper}
                />
              </Box>
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
                <Typography sx={{ mb: 2, fontSize: 24, fontWeight: 600 }}>
                  {product?.skus?.length && selectedSku !== null
                    ? formatPrice(selectedSku?.price ?? 0)
                    : formatPrice(getLowestPrice() ?? 0)}
                </Typography>
                {Object.entries(attributeOptions).map(([type, values]) => (
                  <Box
                    key={type}
                    sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                    <Typography
                      component={'h3'}
                      sx={{
                        width: 100,
                        flexShrink: 0,
                        fontSize: 14,
                        color: '#757575',
                      }}>
                      {attributeLabels[type]}
                    </Typography>
                    <ToggleButtonGroup
                      sx={{
                        flexWrap: 'wrap',
                        '& .MuiButtonBase-root': {
                          border: '1px solid rgba(0, 0, 0, 0.12)',
                        },
                      }}
                      value={selectedAttributes[type]}
                      exclusive
                      rel=''
                      onChange={(e, newValue) =>
                        handleAttributeChange(type, newValue)
                      }>
                      {values.map((value) => (
                        <ToggleButton
                          sx={{
                            px: 1.5,
                            mt: 1.5,
                            mr: 1.5,
                            color: 'rgba(0,0,0,.8)',
                            fontSize: '14px',
                            textTransform: 'capitalize',
                          }}
                          size='small'
                          key={value}
                          value={value}
                          disabled={handleDisableAttribute(type, value)}>
                          {value}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </Box>
                ))}

                <Grid2 container mt={4} mb={3}>
                  <Grid2 size={2}>Số lượng:</Grid2>
                  <Grid2 size={10} display={'flex'}>
                    <ButtonGroup
                      variant='outlined'
                      size='small'
                      disabled={isOutOfStock || matchedModel === null}
                      sx={{ mr: 2, height: 32 }}>
                      <Button
                        onClick={() => handleCountChange((count ?? 0) - 1)}>
                        -
                      </Button>
                      <TextField
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
                            },
                          },
                        }}
                        type='number'
                        disabled={isOutOfStock || matchedModel === null}
                        value={count ?? ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (matchedModel && +value > matchedModel?.stock) {
                            setCount(matchedModel?.stock);
                          } else {
                            setCount(value ? parseInt(value, 10) : null);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === '-') {
                            e.preventDefault();
                          }
                          if (
                            count === null &&
                            (e.key === '0' || e.key === 'Enter')
                          ) {
                            e.preventDefault();
                          }
                        }}
                        size='small'
                      />
                      <Button
                        onClick={() => handleCountChange((count ?? 0) + 1)}>
                        +
                      </Button>
                    </ButtonGroup>
                    <Typography sx={{ fontSize: 14, lineHeight: '32px' }}>
                      {/* {matchedModel ? matchedModel?.stock : getTotalStock()} sản
                      phẩm có sẵn */}
                    </Typography>
                  </Grid2>
                  {addCartError && (
                    <Typography sx={{ mt: 1, fontSize: 14, color: 'red' }}>
                      Vui lòng chọn phân loại hàng
                    </Typography>
                  )}
                  {addQuantityError && (
                    <Typography sx={{ mt: 1, fontSize: 14, color: 'red' }}>
                      Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này
                    </Typography>
                  )}
                </Grid2>
                <Box>
                  {/* <Button
                    sx={{ mr: 2, bgcolor: '#f0f0f0' }}
                    variant='outlined'
                    size='large'
                    disabled={
                      (product?.tier_variations?.length === 0 &&
                        product?.models?.[0]?.stock === 0) ||
                      matchedModel?.stock === 0 ||
                      isLoading === true
                    }
                    onClick={handleAddCart}>
                    <ShoppingCartOutlinedIcon />
                  </Button>
                  <Button
                    sx={{ width: 200 }}
                    variant='contained'
                    size='large'
                    disabled={isOutOfStock || matchedModel?.stock === 0}
                    onClick={handleBuyBtn}>
                    {isOutOfStock || matchedModel?.stock === 0
                      ? 'Hết hàng'
                      : 'Mua ngay'}
                  </Button> */}
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
