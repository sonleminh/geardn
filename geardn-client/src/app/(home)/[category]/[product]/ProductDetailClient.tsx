'use client';

import { useMemo, useRef, useState } from 'react';

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
import { SwiperClass } from 'swiper/react';

import AppLink from '@/components/common/AppLink';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import HtmlRenderBox from '@/components/common/HtmlRenderBox';

import MainSwiper from './components/main-swiper';
import ThumbSwiper from './components/thumb-swiper';

import { attributeLabels } from '@/constants/attributeLabels';
import { IProductSku, IProductSkuAttributes } from '@/interfaces/IProductSku';
import { formatPrice } from '@/utils/format-price';

import SkeletonImage from '@/components/common/SkeletonImage';
import { ATTRIBUTE_ORDER } from '@/constants/attributeOrder';
import { useSession } from '@/hooks/useSession';
import { IProduct } from '@/interfaces/IProduct';
import { AppError } from '@/lib/errors/app-error';
import { useAddCartItem } from '@/queries/cart';
import { useCartStore } from '@/stores/cart-store';
import { useNotificationStore } from '@/stores/notification-store';
import { useGetProduct } from '@/queries/product';
import { BaseResponse } from '@/types/response.type';

const ProductDetailClient = ({
  initialProduct,
}: {
  initialProduct: BaseResponse<IProduct>;
}) => {
  const { data: user } = useSession();
  const { cartItems, addToCart, syncCart } = useCartStore();
  const { mutateAsync: onAddToCart } = useAddCartItem();
  const { showNotification } = useNotificationStore();
  const { data } = useGetProduct(initialProduct);

  const product = data!.data;

  const [count, setCount] = useState<number | null>(1);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const mainSwiperRef = useRef<SwiperClass | null>(null);

  const productImageList = useMemo(() => {
    return [
      ...(product?.images || []),
      ...(product && product?.skus?.length > 1
        ? product?.skus.map((sku) => sku.imageUrl).filter(Boolean)
        : []),
    ];
  }, [product]);

  const attributeOptions = useMemo(() => {
    if (!product) return {};

    const options: Record<string, string[]> = {};
    product?.skus?.forEach((sku) => {
      sku?.productSkuAttributes?.forEach(
        (productSkuAttributes: IProductSkuAttributes) => {
          if (!options[productSkuAttributes?.attributeValue?.attribute?.name]) {
            options[productSkuAttributes?.attributeValue?.attribute?.name] = [];
          }
          if (
            !options[
              productSkuAttributes?.attributeValue?.attribute?.name
            ].includes(productSkuAttributes?.attributeValue?.value)
          ) {
            options[productSkuAttributes?.attributeValue?.attribute?.name].push(
              productSkuAttributes?.attributeValue?.value
            );
          }
        }
      );
    });

    const order =
      ATTRIBUTE_ORDER[product?.category?.name] ?? Object.keys(options);

    const sortedOptions: Record<string, string[]> = {};
    order.forEach((key) => {
      if (options[key]) {
        sortedOptions[key] = options[key];
      }
    });

    return sortedOptions;
  }, [product]);

  const selectedSku = useMemo<IProductSku | null>(() => {
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
            (productSkuAttributes: IProductSkuAttributes) =>
              productSkuAttributes.attributeValue.attribute.name === key &&
              productSkuAttributes.attributeValue.value === value
          )
        )
      ) ?? null
    );
  }, [selectedAttributes, attributeOptions, product?.skus]);

  const availableCombinations = product?.skus?.map((sku) =>
    sku.productSkuAttributes.reduce(
      (
        acc: Record<string, string>,
        productSkuAttributes: IProductSkuAttributes
      ) => {
        acc[productSkuAttributes.attributeValue.attribute.name] =
          productSkuAttributes.attributeValue.value;
        return acc;
      },
      {} as Record<string, string>
    )
  );

  const handleAttributeChange = (type: string, value: string) => {
    setSelectedAttributes((prev) => {
      const newAttributes = { ...prev };

      if (newAttributes[type] === value) {
        delete newAttributes[type]; // Nếu đã chọn, thì bỏ chọn
      } else {
        newAttributes[type] = value; // Nếu chưa chọn, thì chọn
      }
      setCount(1);
      return newAttributes;
    });
  };

  const handleAddCartItem = async () => {
    if (selectedSku === null) {
      return showNotification('Vui lòng chọn phân loại hàng', 'error');
    }
    const itemAdded = cartItems.find((item) => item.skuId === selectedSku?.id);
    const oldCartItems = [...cartItems];
    if (!user && product) {
      if (
        itemAdded &&
        itemAdded?.quantity + (count ?? 1) > (selectedSkuStock ?? 0)
      ) {
        return showNotification(
          `Bạn đã có ${itemAdded?.quantity} trong giỏ hàng. Không thể thêm số lượng đã chọn vào giỏ hàng vì sẽ vượt quá số lượng trong kho.`,
          'error'
        );
      }

      return addToCart({
        productId: selectedSku?.productId,
        skuId: selectedSku?.id,
        productName: product?.name,
        imageUrl: selectedSku?.imageUrl
          ? selectedSku?.imageUrl
          : product?.images?.[0],
        sellingPrice: selectedSku?.sellingPrice,
        quantity: count ?? 1,
        attributes: selectedSku?.productSkuAttributes.map(
          (productSkuAttributes: IProductSkuAttributes) => ({
            attribute: productSkuAttributes.attributeValue.attribute.name,
            attributeValue: productSkuAttributes.attributeValue.value,
          })
        ),
      });
    }

    if (user && product) {
      const newItem = {
        productId: selectedSku?.productId,
        skuId: selectedSku?.id,
        productName: product?.name,
        imageUrl: selectedSku?.imageUrl
          ? selectedSku?.imageUrl
          : product?.images?.[0],
        sellingPrice: selectedSku?.sellingPrice,
        quantity: count ?? 1,
        attributes: selectedSku?.productSkuAttributes.map(
          (productSkuAttributes: IProductSkuAttributes) => ({
            attribute: productSkuAttributes.attributeValue.attribute.name,
            attributeValue: productSkuAttributes.attributeValue.value,
          })
        ),
      };

      try {
        addToCart(newItem);
        await onAddToCart({
          productId: selectedSku?.productId,
          skuId: selectedSku?.id,
          quantity: count ?? 1,
        });
      } catch (error) {
        const e = AppError.fromUnknown(error);
        syncCart(oldCartItems);
        showNotification(e?.message, 'error');
      }
    }
  };

  const handleCountChange = (value: number | null) => {
    if (value && value >= 0) {
      setCount(value);
    }
  };

  const breadcrumbsOptions = [
    { href: '/', label: 'Trang chủ' },
    { href: '', label: product?.name as string },
  ];

  const totalStock = product?.skus?.reduce(
    (acc, sku) =>
      acc +
      (sku.stocks?.reduce(
        (acc: number, stock: { id: number; quantity: number }) =>
          acc + stock.quantity,
        0
      ) || 0),
    0
  );

  const handleDisableAttribute = useMemo(() => {
    return (type: string, value: string) => {
      if (totalStock === 0) return true;
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
        Object.entries(simulatedSelection).filter(([, val]) => val)
      );

      // Nếu không còn gì trong selectedAttributes, không disable gì cả
      if (Object.keys(filteredSelection).length === 0) return false;

      // Kiểm tra nếu tổ hợp mới này có hợp lệ
      const isValid = availableCombinations?.some((combo) =>
        Object.entries(filteredSelection).every(
          ([key, val]) => combo[key] === val
        )
      );

      return !isValid;
    };
  }, [availableCombinations, selectedAttributes, totalStock]);

  const selectedSkuStock = useMemo(() => {
    return selectedSku?.stocks?.reduce(
      (acc: number, stock: { id: number; quantity: number }) =>
        acc + stock.quantity,
      0
    );
  }, [selectedSku]);

  return (
    <Box pt={2} pb={4}>
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
                {selectedSku?.imageUrl ? (
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
                ) : null}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    height: '400px',
                    display: selectedSku?.imageUrl ? 'none' : 'block',
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
                  ? formatPrice(selectedSku?.sellingPrice ?? 0)
                  : formatPrice(product?.priceMin ?? 0)}
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
                    {attributeLabels[type]}:
                  </Typography>
                  <ToggleButtonGroup
                    sx={{
                      flexWrap: 'wrap',
                      '& .MuiButtonBase-root': {
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: '2px',
                      },
                      '& .MuiToggleButton-root.Mui-disabled': {
                        border: '1px solid rgba(0,0,0,.12)',
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
                          minWidth: 69,
                          px: 1.5,
                          mt: 1,
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
                    sx={{ mr: 2, height: 32 }}>
                    <Button
                      onClick={() => handleCountChange((count ?? 0) - 1)}
                      disabled={!selectedSku || count === 1}>
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
                      disabled={
                        selectedSku === null ||
                        selectedSkuStock === 0 ||
                        totalStock === 0
                      }
                      value={count ?? ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (
                          selectedSku &&
                          selectedSkuStock &&
                          +value > selectedSkuStock
                        ) {
                          setCount(selectedSkuStock);
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
                      disabled={!selectedSku || count === selectedSkuStock}>
                      +
                    </Button>
                  </ButtonGroup>
                  {totalStock > 0 && (
                    <Typography sx={{ fontSize: 14, lineHeight: '32px' }}>
                      {totalStock > 0 && selectedSku
                        ? selectedSku?.stocks?.reduce(
                            (
                              acc: number,
                              stock: { id: number; quantity: number }
                            ) => acc + stock.quantity,
                            0
                          )
                        : totalStock}{' '}
                      sản phẩm có sẵn
                    </Typography>
                  )}
                </Grid2>
                {/* {addCartError && (
                      <Typography sx={{ mt: 1, fontSize: 14, color: 'red' }}>
                        Vui lòng chọn phân loại hàng
                      </Typography>
                    )}
                    {addQuantityError && (
                      <Typography sx={{ mt: 1, fontSize: 14, color: 'red' }}>
                        Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này
                      </Typography>
                    )} */}
              </Grid2>
              <Box>
                <Button
                  sx={{ mr: 2, bgcolor: '#f0f0f0' }}
                  variant='outlined'
                  size='large'
                  disabled={!selectedSku}
                  onClick={handleAddCartItem}>
                  <ShoppingCartOutlinedIcon />
                </Button>
                <Button
                  sx={{ width: 200 }}
                  variant='contained'
                  size='large'
                  disabled={!selectedSku}
                  // onClick={handleBuyBtn}
                >
                  {totalStock > 0 ? 'Mua ngay' : 'Hết hàng'}
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
        <HtmlRenderBox html={product?.description ?? ''} />
      </Box>
    </Box>
  );
};

export default ProductDetailClient;
