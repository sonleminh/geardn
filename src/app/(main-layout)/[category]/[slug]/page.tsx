'use client';

import AppLink from '@/components/common/AppLink';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import HtmlRenderBox from '@/components/common/HtmlRenderBox';
import LayoutContainer from '@/components/common/sharing/layout-container';
import SkeletonImage from '@/components/common/SkeletonImage';
import { BASE_API_URL } from '@/constants/env';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { IModel, IVariant } from '@/interfaces/IProduct';
import { useAuthStore } from '@/providers/auth-store-provider';
import { addCartAPI, useGetCart } from '@/services/cart/api';
import { useGetProductById, useGetProductBySlug } from '@/services/product/api';
import { formatPrice } from '@/utils/format-price';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
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
import { useEffect, useMemo, useState } from 'react';
import { Swiper as SwiperClass } from 'swiper';
import { useSWRConfig } from 'swr';
import MainSwiper from './components/main-swiper';
import ThumbSwiper from './components/thumb-swiper';
import { ICartItem } from '@/interfaces/ICart';
import { ROUTES } from '@/constants/route';

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
  console.log('prduct', product);

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

  console.log('attributeOptions', attributeOptions);

  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >(
    Object.fromEntries(
      Object.keys(attributeOptions).map((key) => [
        key,
        attributeOptions[key][0],
      ])
    )
  );

  useEffect(() => {
    setSelectedAttributes((prev) => {
      const newAttributes = Object.fromEntries(
        Object.keys(attributeOptions).map((key) => [
          key,
          attributeOptions[key][0],
        ])
      );
      return { ...prev, ...newAttributes };
    });
  }, [attributeOptions]);

  console.log('attributeOptions', attributeOptions);

  // useEffect(() => {
  //   if (product?.tier_variations?.length) {
  //     const matchedModel = product?.models?.find(
  //       (model) =>
  //         JSON.stringify(model?.extinfo?.tier_index) ===
  //         JSON.stringify(selectedModel)
  //     );
  //     setMatchedModel(matchedModel ?? null);
  //   } else {
  //     setMatchedModel(product?.models?.[0]);
  //   }
  // }, [cart, selectedModel, product]);

  // useEffect(() => {
  //   if (
  //     (product?.tier_variations?.length === 0 &&
  //       product?.models?.[0]?.stock === 0) ||
  //     getTotalStock() === 0
  //   ) {
  //     setIsOutOfStock(true);
  //   }
  // }, [selectedModel, product]);

  // useEffect(() => {
  //   const variant = product?.tier_variations?.find(
  //     (variant) => variant?.images
  //   );
  //   if (variant?.images?.length && selectedModel !== undefined) {
  //     setOptionImage(variant?.images[selectedModel[0] as number]);
  //   } else {
  //     setOptionImage(product?.images?.[0]);
  //   }
  // }, [selectedModel, product]);

  // const handleToggleChange = (newValue: string, vIndex: number) => {
  //   const optionIndex = product?.tier_variations[vIndex]?.options?.indexOf(
  //     newValue ?? ''
  //   );
  //   const updatedSelectedModel = [...selectedModel];
  //   if (optionIndex !== -1) {
  //     updatedSelectedModel[vIndex] = optionIndex;
  //   } else {
  //     updatedSelectedModel[vIndex] = undefined;
  //   }
  //   setSelectedModel(updatedSelectedModel);
  //   setAddCartError(false);
  //   setAddQuantityError(false);
  // };

  // const handleDisableOption = (variantIndex: number, optionIndex: number) => {
  //   const updatedSelectedModel = [...selectedModel];
  //   updatedSelectedModel[variantIndex] = optionIndex;

  //   const validCombination = product?.models?.some((model) =>
  //     model.extinfo.tier_index.every(
  //       (tierIndex: number, idx: number) =>
  //         updatedSelectedModel[idx] === undefined ||
  //         updatedSelectedModel[idx] === tierIndex
  //     )
  //   );
  //   return !validCombination;
  // };

  const generateCombinations = (
    options: Record<string, string[]>
  ): Record<string, string>[] => {
    const keys = Object.keys(options);
    if (keys.length === 0) return [];

    const combinations: Record<string, string>[] = [];

    const backtrack = (index: number, current: Record<string, string>) => {
      if (index === keys.length) {
        combinations.push({ ...current });
        return;
      }

      const key = keys[index];
      for (const value of options[key]) {
        current[key] = value;
        backtrack(index + 1, current);
        delete current[key]; // Quay lui để thử giá trị khác
      }
    };

    backtrack(0, {});
    return combinations;
  };

  console.log('obj:', generateCombinations(attributeOptions));

  const handleDisableAttribute = useMemo(() => {
    // Tạo tất cả tổ hợp từ attributeOptions
    const combinations = generateCombinations(attributeOptions);

    // Tạo tập hợp các tổ hợp hợp lệ từ SKU
    const validCombinations = new Set(
      product?.skus.map((sku) =>
        JSON.stringify(
          Object.fromEntries(
            sku.productSkuAttributes.map(({ attribute }) => [
              attribute.type,
              attribute.value,
            ])
          )
        )
      )
    );

    // Trả về một hàm nhận type và value của toggle button hiện tại
    return (type: string, value: string) => {
      // Duyệt qua tất cả các tổ hợp được tạo ra
      for (const combination of combinations) {
        // Nếu tổ hợp có thuộc tính type bằng value
        // và tổ hợp đó nằm trong tập hợp các tổ hợp hợp lệ
        if (
          combination[type] === value &&
          validCombinations.has(JSON.stringify(combination))
        ) {
          return false; // Không disable (cho phép chọn)
        }
      }
      return true; // Disable nếu không tìm thấy tổ hợp hợp lệ nào
    };
  }, [attributeOptions, product?.skus]);

  const handleCountChange = (value: number | null) => {
    if (value && value >= 0) {
      setCount(value);
    }
  };

  const selectedSku = useMemo(() => {
    return product?.skus?.find((sku) =>
      Object.entries(selectedAttributes).every(([key, value]) =>
        sku.productSkuAttributes.some(
          (attr) =>
            attr.attribute.type === key && attr.attribute.value === value
        )
      )
    );
  }, [selectedAttributes, product?.skus]);
  console.log(
    'cc:',
    Object.entries({ COLOR: 'Xanh trắng', SWITCH: 'Leopog Reaper' })
  );
  console.log('selectedAttributes', selectedAttributes);
  const handleAttributeChange = (type: string, value: string) => {
    setSelectedAttributes((prev) => ({ ...prev, [type]: value }));
  };

  return (
    <Box pt={2} pb={4} bgcolor={'#eee'}>
      <LayoutContainer>
        <Box sx={{ mb: 2 }}>
          <Breadcrumbs options={breadcrumbsOptions} />
        </Box>
        <Box sx={{ px: 3, mb: 2, bgcolor: '#fff', borderRadius: 1 }}>
          <Grid2 container spacing={4}>
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
                {Object.entries(attributeOptions).map(([type, values]) => (
                  <div key={type}>
                    <h4>Choose {type}:</h4>
                    <ToggleButtonGroup
                      value={selectedAttributes[type]}
                      exclusive
                      onChange={(e, newValue) =>
                        newValue && handleAttributeChange(type, newValue)
                      }>
                      {values.map((value) => (
                        <ToggleButton
                          key={value}
                          value={value}
                          disabled={handleDisableAttribute(type, value)}>
                          {value}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </div>
                ))}
                <Typography sx={{ mb: 2, fontSize: 24, fontWeight: 600 }}>
                  {selectedSku ? formatPrice(selectedSku?.price) : 0}
                </Typography>
                {/* 
                {product?.tier_variations?.map((variant: IVariant, vIndex) => (
                  <Grid2
                    container
                    display={'flex'}
                    key={variant?.name}
                    my={2.5}>
                    <Grid2
                      size={2}
                      sx={{ display: 'flex', alignItems: 'center' }}>
                      {variant?.name}:
                    </Grid2>
                    <Grid2
                      size={10}
                      sx={{ display: 'flex', alignItems: 'center' }}>
                      <ToggleButtonGroup
                        sx={{
                          '.MuiButtonBase-root': {
                            minWidth: 100,
                            height: 40,
                            mr: 2,
                            border: '1px solid rgba(0,0,0,0.09)',
                            color: '#000',
                            borderRadius: '2px',
                            textTransform: 'initial',
                            ':hover': {
                              border: '1px solid #000',
                            },
                          },
                          '.Mui-selected': {
                            border: '1px solid #000',
                          },
                          '.Mui-disabled': {
                            bgcolor: '#fafafa',
                            color: 'rgba(0,0,0,.26)',
                            border: '1px solid rgba(0,0,0,0.09) !important',
                            cursor: 'not-allowed',
                          },
                        }}
                        value={
                          selectedModel[vIndex] !== undefined
                            ? product?.tier_variations[vIndex]?.options[
                                selectedModel[vIndex] as number
                              ]
                            : ''
                        }
                        exclusive
                        size='small'
                        onChange={(event, newValue) =>
                          handleToggleChange(newValue, vIndex)
                        }>
                        {variant?.options?.map((item, index) => (
                          <ToggleButton
                            sx={{
                              '.Mui-disabled': {
                                bgcolor: 'red',
                              },
                            }}
                            key={item}
                            value={item ?? ''}
                            aria-label='left aligned'
                            disabled={handleDisableOption(vIndex, index)}>
                            {variant?.images && (
                              <Box
                                sx={{
                                  position: 'relative',
                                  width: 24,
                                  height: 24,
                                  mr: 1,
                                  overflow: 'hidden',
                                }}>
                                <SkeletonImage
                                  src={variant?.images[index]}
                                  alt='geardn'
                                />
                              </Box>
                            )}
                            {item}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </Grid2>
                  </Grid2>
                ))} */}
                <Grid2 container mt={3} mb={3}>
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
