'use client';

import React, { ChangeEvent, useRef, useState } from 'react';
import { useSWRConfig } from 'swr';

import LayoutContainer from '@/components/common/sharing/layout-container';
import SkeletonImage from '@/components/common/SkeletonImage';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import {
  addCartAPI,
  deleteCartItem,
  subtractCartAPI,
  updateCartQuantityAPI,
  useGetCart,
} from '@/services/cart/api';
import { useUpsertCart } from '@/services/cart/mutations';
import { formatPrice } from '@/utils/format-price';

import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid2,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TextareaAutosize,
  Typography,
  styled,
} from '@mui/material';
import EMPTY_CART from '@/assets/empty-cart.png';
import Link from 'next/link';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import { Label } from '@mui/icons-material';
import MinHeightTextarea from '@/components/common/Textarea';
import Textarea from '@/components/common/Textarea';

const Checkout = () => {
  const breadcrumbsOptions = [
    { link: '/', label: 'Home' },
    { link: '/cart', label: 'Thanh toán' },
  ];
  const { cart, mutate } = useGetCart();
  const { mutate: mutateCart } = useUpsertCart();
  const { mutate: globalMutate } = useSWRConfig();
  const [selected, setSelected] = useState<string[]>([]);
  const [quantityInputs, setQuantityInputs] = useState<{
    [key: string]: string;
  }>({});

  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = cart?.items?.map((n) => n?.model?._id);
      if (newSelected) {
        setSelected(newSelected);
      }
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleAddItem = async (item_id: string) => {
    const itemToUpdate = cart?.items?.find(
      (item) => item.model._id === item_id
    );

    if (!itemToUpdate) return;

    const newQuantity = itemToUpdate.quantity + 1;
    const optimisticCart = {
      ...cart,
      items: cart?.items?.map((item) =>
        item.model._id === item_id ? { ...item, quantity: newQuantity } : item
      ),
    };

    mutate(optimisticCart, false);

    try {
      const updatedCartData = await addCartAPI({
        model: item_id,
        quantity: 1,
      });

      mutateCart(updatedCartData, false);

      globalMutate('/api/cart');
    } catch (error) {
      mutate(cart, false);
      console.error('Failed to update cart:', error);
    }
  };

  const handleSubtractItem = async (item_id: string) => {
    const itemToUpdate = cart?.items?.find(
      (item) => item.model._id === item_id
    );
    if (!itemToUpdate) return;

    const newQuantity = itemToUpdate.quantity - 1;

    const optimisticCart = {
      ...cart,
      items:
        newQuantity > 0
          ? cart?.items?.map((item) =>
              item.model._id === item_id
                ? { ...item, quantity: newQuantity }
                : item
            )
          : cart?.items?.filter(
              (item) => item?.model?._id !== itemToUpdate?.model?._id
            ),
    };
    mutate(optimisticCart, false);

    try {
      const updatedCartData = await subtractCartAPI({
        model: item_id,
        quantity: 1,
      });

      mutateCart(updatedCartData, false);
      globalMutate('/api/cart');
    } catch (error) {
      mutate(cart, false);
      console.error('Failed to update cart:', error);
    }
  };

  const handleQuantityInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    item_id: string
  ) => {
    const newQuantity = e.target.value;

    setQuantityInputs((prev) => ({
      ...prev,
      [item_id]: newQuantity,
    }));
  };

  const handleQuantityInputBlur = async (item_id: string) => {
    const inputQuantity = quantityInputs[item_id];
    const newQuantity = parseInt(inputQuantity, 10);

    // If the input is not a valid number or is empty, reset it to the current cart quantity
    if (isNaN(newQuantity) || newQuantity < 1) {
      const originalQuantity = cart?.items?.find(
        (item) => item.model._id === item_id
      )?.quantity;
      setQuantityInputs((prev) => ({
        ...prev,
        [item_id]: originalQuantity?.toString() ?? '1',
      }));
      return;
    }

    const itemToUpdate = cart?.items?.find(
      (item) => item.model._id === item_id
    );

    if (!itemToUpdate || newQuantity === itemToUpdate.quantity) return;

    const optimisticCart = {
      ...cart,
      items: cart?.items?.map((item) =>
        item.model._id === item_id ? { ...item, quantity: newQuantity } : item
      ),
    };

    mutate(optimisticCart, false);

    try {
      const updatedCartData = await updateCartQuantityAPI({
        model: item_id,
        quantity: newQuantity,
      });
      mutateCart(updatedCartData, false);

      globalMutate('/api/cart');
    } catch (error) {
      console.error('Failed to update cart:', error);
      mutate(cart, false);
    }
    setQuantityInputs({});
  };

  const handleKeyDown = (e: React.KeyboardEvent, itemId: string) => {
    const target = e.currentTarget as HTMLInputElement;

    if (e.key === '0' && target.value === '') {
      e.preventDefault();
    }
    if (e.key === 'Enter') {
      handleQuantityInputBlur(itemId);
      if (inputRefs.current[itemId]) {
        inputRefs.current[itemId]?.blur();
      }
    }
  };

  const handleDeleteItem = async (item_id: string) => {
    const optimisticCart = {
      ...cart,
      items: cart?.items.filter((item) => item.model._id !== item_id),
    };
    mutate(optimisticCart, false);
    try {
      const updatedCartData = await deleteCartItem(item_id);

      mutateCart(updatedCartData, false);
      globalMutate('/api/cart');
    } catch (error) {
      mutate(cart, false);
      console.error('Failed to update cart:', error);
    }
  };

  const totalAmount = () => {
    const selectedItems = selected
      .map((item_id) => cart?.items?.find((item) => item.model._id === item_id))
      .filter((item) => item !== undefined);

    return selectedItems?.reduce(
      (acc, item) => acc + (item?.model?.price ?? 0) * (item?.quantity ?? 0),
      0
    );
  };

  return (
    <Box pt={2} pb={4} bgcolor={'#eee'}>
      <LayoutContainer>
        <Box sx={{}}>
          <Breadcrumbs options={breadcrumbsOptions} />
        </Box>
        <Button>
          <ChevronLeftOutlinedIcon />
          Quay lại giỏ hàng
        </Button>

        <Box sx={{}}>
          {cart?.items?.length > 0 ? (
            <Grid2 container spacing={2}>
              <Grid2 sx={{}} size={8.5}>
                <Box sx={{ p: 3, mb: 2, bgcolor: '#fff', borderRadius: '4px' }}>
                  <Typography sx={{ mb: 2, fontSize: 18, fontWeight: 700 }}>
                    Sản phẩm trong đơn
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          position: 'relative',
                          width: 68,
                          height: 68,
                          mr: 2,
                        }}>
                        <SkeletonImage
                          src={
                            'https://storage.googleapis.com/geardn-a6c28.appspot.com/1729417250050-Aula-F75-Glacier-Blue.webp'
                          }
                          alt={''}
                          fill
                        />
                      </Box>
                      <Typography>iPhone 16 512GB Hồng MYEQ3VN/A</Typography>
                    </Box>
                    <Typography>29.900.000 đ</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          position: 'relative',
                          width: 68,
                          height: 68,
                          mr: 2,
                        }}>
                        <SkeletonImage
                          src={
                            'https://storage.googleapis.com/geardn-a6c28.appspot.com/1729417250050-Aula-F75-Glacier-Blue.webp'
                          }
                          alt={''}
                          fill
                        />
                      </Box>
                      <Typography>iPhone 16 512GB Hồng MYEQ3VN/A</Typography>
                    </Box>
                    <Typography>29.900.000 đ</Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 3, mb: 2, bgcolor: '#fff', borderRadius: '4px' }}>
                  <Typography mb={2}>Thông tin đặt hàng</Typography>
                  <TextField
                    sx={{ mb: 1 }}
                    fullWidth
                    placeholder='Họ và tên'
                    size='small'
                  />
                  <TextField
                    sx={{ mb: 1 }}
                    fullWidth
                    placeholder='Số điện thoại'
                    size='small'
                  />
                  <TextField
                    sx={{ mb: 1 }}
                    fullWidth
                    placeholder='Email (Không bắt buộc)'
                    size='small'
                  />
                </Box>
                <Box sx={{ p: 3, mb: 2, bgcolor: '#fff', borderRadius: '4px' }}>
                  <FormControl>
                    <FormLabel id='demo-row-radio-buttons-group-label'>
                      Hình thức nhận hàng
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby='demo-row-radio-buttons-group-label'
                      name='row-radio-buttons-group'>
                      <FormControlLabel
                        value='female'
                        control={<Radio size='small' />}
                        label='Giao hàng tận nơi'
                      />
                      <FormControlLabel
                        value='male'
                        control={<Radio size='small' />}
                        label='Nhận tại cửa hàng'
                      />
                    </RadioGroup>
                  </FormControl>
                  <Typography mb={1}>Ghi chú yêu cầu</Typography>
                  <Textarea placeholder='Số điện thoại' minRows={3} />
                </Box>
                <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: '4px' }}>
                  <FormControl>
                    <FormLabel id='demo-row-radio-buttons-group-label'>
                      Phương thức thanh toán
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby='demo-row-radio-buttons-group-label'
                      name='row-radio-buttons-group'>
                      <FormControlLabel
                        value='female'
                        control={<Radio size='small' />}
                        label='COD'
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
              </Grid2>
              <Grid2
                sx={{
                  position: 'sticky',
                  top: 0,
                  right: 0,
                  height: '100%',
                  bgcolor: '#fff',
                  borderRadius: '4px',
                }}
                size={3.5}
                p={3}>
                <Typography
                  sx={{ mb: 2, fontSize: 18, fontWeight: 700 }}
                  className='total-price-label'>
                  Thông tin đơn hàng
                </Typography>
                <Box className='total'>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    className='total-price-cost'>
                    <Typography sx={{ fontSize: 13 }}>Tổng tiền:</Typography>
                    <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                      {/* {formatPrice(totalAmount())} */}
                      2.000.000 đ
                    </Typography>
                  </Box>
                  <Divider sx={{ mt: 2, mb: 1 }} />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}>
                    <Typography sx={{ fontSize: 13 }}>
                      Phí vận chuyển:
                    </Typography>
                    <Typography sx={{ fontSize: 13 }}>
                      Miễn phí (5km)
                    </Typography>
                  </Box>
                  <Button
                    sx={{ mb: 1.5, fontWeight: 600 }}
                    variant='contained'
                    size='large'
                    fullWidth>
                    Thanh toán
                  </Button>
                  <Button
                    sx={{ fontWeight: 600 }}
                    variant='outlined'
                    size='large'
                    fullWidth>
                    Tiếp tục mua hàng
                  </Button>
                </Box>
              </Grid2>
            </Grid2>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                pb: 5,
              }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '300px',
                  height: { xs: '180px' },
                  overflow: 'hidden',
                  '& img': {
                    objectFit: 'contain',
                  },
                }}>
                <SkeletonImage
                  src={EMPTY_CART}
                  alt='geardn'
                  fill
                  quality={90}
                  priority
                />
              </Box>
              <Typography sx={{ mb: 2, fontSize: 20 }}>
                Giỏ hàng trống
              </Typography>
              <Button
                sx={{ width: 220, fontWeight: 600 }}
                component={Link}
                href='/'
                variant='contained'
                size='large'
                fullWidth>
                Tiếp tục mua hàng
              </Button>
            </Box>
          )}
        </Box>
      </LayoutContainer>
    </Box>
  );
};

export default Checkout;
