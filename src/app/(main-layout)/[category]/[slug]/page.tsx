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
import { addCartItemAPI, useGetCart } from '@/services/cart/api';
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
import { useEffect, useMemo, useRef, useState } from 'react';
import { Swiper as SwiperClass } from 'swiper';
import { useSWRConfig } from 'swr';
import MainSwiper from './components/main-swiper';
import ThumbSwiper from './components/thumb-swiper';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useCartStore } from '@/stores/cart-store';
import { ISku } from '@/interfaces/ISku';

const ProductDetail = () => {
  const params = useParams();
  const router = useRouter();
  const { cart, mutate, isLoading } = useGetCart();
  const { user, addProducts } = useAuthStore((state) => state);
  const mainSwiperRef = useRef<SwiperClass | null>(null);

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
  // const userData = await addCartItemAPI(values);

  const addToCart = useCartStore((state) => state.addToCart);

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

  const selectedSku = useMemo<ISku | null>(() => {
    const hasNullValue = Object.values(selectedAttributes).some(
      (value) => value === null
    );

    if (
      hasNullValue ||
      Object.keys(selectedAttributes).length !==
        Object.keys(attributeOptions).length
    )
      return null;

    return (
      product?.skus?.find((sku) =>
        Object.entries(selectedAttributes).every(([key, value]) =>
          sku.productSkuAttributes.some(
            (attr) =>
              attr.attribute.type === key && attr.attribute.value === value
          )
        )
      ) ?? null
    );
  }, [selectedAttributes, product?.skus]);
  console.log('selectedSku', selectedSku);
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

  const productImageList = useMemo(() => {
    return [
      ...(product?.images || []),
      ...(product?.skus.map((sku) => sku.imageUrl) || []),
    ];
  }, [product?.images, product?.skus]);

  const handleAddCartItem = async () => {
    if (selectedSku === null) {
      return showNotification('Vui lý chọn sản phẩm', 'error');
    }

    await addCartItemAPI({
      productId: selectedSku?.productId,
      skuId: selectedSku?.id,
      quantity: count ?? 1,
    });

    // const existingCart = JSON.parse(localStorage.getItem('cart') ?? '[]');

    // const modelInCart = cart?.items?.find(
    //   (item) => item.modelid === matchedModel?.id
    // );

    // if (
    //   modelInCart &&
    //   (count ?? 1) + modelInCart?.quantity > matchedModel?.stock
    // ) {
    //   return setAddQuantityError(true);
    // }
    // try {
    //   await addCartAPI({
    //     userid: user?.id ? user?.id : null,
    //     model:
    //       product?.tier_variations?.length === 0
    //         ? product?.models[0]?.id ?? ''
    //         : matchedModel?.id ?? '',
    //     quantity: count ?? 1,
    //   });
    //   mutate('/cart');
    //   globalMutate(`/cart`, undefined, { revalidate: true });
    //   showNotification('Sản phẩm đã dược thêm vào giỏ hàng!', 'success');
    //   setAddQuantityError(false);
    // } catch (error: any) {
    //   showNotification(error?.message, 'error');
    // }
  };

  useEffect(() => {
    if (selectedSku && mainSwiperRef.current) {
      const imageIndex = productImageList.findIndex(
        (img) => img === selectedSku.imageUrl
      );

      if (imageIndex !== -1) {
        mainSwiperRef.current.slideTo(imageIndex);
      }
    }
  }, [selectedSku, productImageList]);

  const totalStock = product?.skus?.reduce(
    (acc, sku) => acc + (sku.quantity || 0),
    0
  );

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
                  {/* {selectedSku ? (
                    <SkeletonImage
                      src={selectedSku?.imageUrl}
                      alt='Selected Option'
                      style={{
                        position: 'absolute',
                        top: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  ) : null} */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      width: '100%',
                      height: '400px',
                      // display: selectedSku?.imageUrl ? 'none' : 'block',
                    }}>
                    <MainSwiper
                      data={productImageList}
                      thumbsSwiper={thumbsSwiper}
                      setMainSwiper={mainSwiperRef}
                    />
                  </Box>
                </Box>
              </Box>
              <Box mb={1} />
              <Box>
                <ThumbSwiper
                  images={productImageList}
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
                      disabled={isOutOfStock || selectedSku === null}
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
                        disabled={isOutOfStock || selectedSku === null}
                        value={count ?? ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (selectedSku && +value > selectedSku?.quantity) {
                            setCount(selectedSku?.quantity);
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
                        onClick={() => handleCountChange((count ?? 0) + 1)}
                        disabled={count === selectedSku?.quantity}
                        // disabled={isOutOfStock || selectedSku === null}
                      >
                        +
                      </Button>
                    </ButtonGroup>
                    <Typography sx={{ fontSize: 14, lineHeight: '32px' }}>
                      {selectedSku ? selectedSku?.quantity : totalStock} sản
                      phẩm có sẵn
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
                  <Button
                    sx={{ mr: 2, bgcolor: '#f0f0f0' }}
                    variant='outlined'
                    size='large'
                    // disabled={
                    //   (product?.tier_variations?.length === 0 &&
                    //     product?.models?.[0]?.stock === 0) ||
                    //   matchedModel?.stock === 0 ||
                    //   isLoading === true
                    // }
                    onClick={handleAddCartItem}>
                    <ShoppingCartOutlinedIcon />
                  </Button>
                  <Button
                    sx={{ width: 200 }}
                    variant='contained'
                    size='large'
                    disabled={isOutOfStock || matchedModel?.stock === 0}
                    // onClick={handleBuyBtn}
                  >
                    {isOutOfStock || matchedModel?.stock === 0
                      ? 'Hết hàng'
                      : 'Mua ngay'}
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
