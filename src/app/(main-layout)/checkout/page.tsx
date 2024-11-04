'use client';

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
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
import { useAuthStore } from '@/providers/auth-store-provider';
import { useFormik } from 'formik';
import { createOrder } from '@/services/order/api';
import { ROUTES } from '@/constants/route';

const Checkout = () => {
  const breadcrumbsOptions = [
    { href: '/', label: 'Home' },
    { href: ROUTES.CHECKOUT, label: 'Thanh toán' },
  ];
  const { cart, mutate } = useGetCart();
  const { mutate: mutateCart } = useUpsertCart();
  const { mutate: globalMutate } = useSWRConfig();
  const [selected, setSelected] = useState<string[]>([]);
  const [quantityInputs, setQuantityInputs] = useState<{
    [key: string]: string;
  }>({});
  const [customerData, setCustomerData] = useState<{
    name: string;
    phone: string;
    email: string;
  }>({ name: '', phone: '', email: '' });

  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const { orderFormData, changeCustomer } = useAuthStore((state) => state);

  console.log(orderFormData);

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
      },
      receiveOption: 'DELIVERY',
      note: '',
      payment_method: 'COD',
    },
    // validationSchema: schema,
    validateOnChange: false,
    async onSubmit(values) {
      console.log(2, values);
      const payload = {
        ...values,
        items: orderFormData?.products ?? [],
        totalAmount: 0,
      };
      const userData = await createOrder(payload);
      console.log(userData);
    },
  });

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = cart?.items?.map((n) => n?.model_id);
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
    const itemToUpdate = cart?.items?.find((item) => item.model_id === item_id);

    if (!itemToUpdate) return;

    const newQuantity = itemToUpdate.quantity + 1;
    const optimisticCart = {
      ...cart,
      items: cart?.items?.map((item) =>
        item.model_id === item_id ? { ...item, quantity: newQuantity } : item
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
    const itemToUpdate = cart?.items?.find((item) => item.model_id === item_id);
    if (!itemToUpdate) return;

    const newQuantity = itemToUpdate.quantity - 1;

    const optimisticCart = {
      ...cart,
      items:
        newQuantity > 0
          ? cart?.items?.map((item) =>
              item.model_id === item_id
                ? { ...item, quantity: newQuantity }
                : item
            )
          : cart?.items?.filter(
              (item) => item?.model_id !== itemToUpdate?.model_id
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
        (item) => item.model_id === item_id
      )?.quantity;
      setQuantityInputs((prev) => ({
        ...prev,
        [item_id]: originalQuantity?.toString() ?? '1',
      }));
      return;
    }

    const itemToUpdate = cart?.items?.find((item) => item.model_id === item_id);

    if (!itemToUpdate || newQuantity === itemToUpdate.quantity) return;

    const optimisticCart = {
      ...cart,
      items: cart?.items?.map((item) =>
        item.model_id === item_id ? { ...item, quantity: newQuantity } : item
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
      items: cart?.items.filter((item) => item.model_id !== item_id),
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
      .map((item_id) => cart?.items?.find((item) => item.model_id === item_id))
      .filter((item) => item !== undefined);

    return selectedItems?.reduce(
      (acc, item) => acc + (item?.price ?? 0) * (item?.quantity ?? 0),
      0
    );
  };

  const handleCustomerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    changeCustomer(customerData);
  }, [customerData, changeCustomer]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value, name } = e.target;
    formik.setFieldValue(name, value);
  };

  console.log('customerData:', customerData);
  return (
    <Box pt={2} pb={4} bgcolor={'#eee'}>
      <LayoutContainer>
        <Box sx={{}}>
          <Breadcrumbs options={breadcrumbsOptions} />
        </Box>
        <Button component={Link} href='/cart'>
          <ChevronLeftOutlinedIcon />
          Quay lại giỏ hàng
        </Button>

        <Box sx={{}}>
          {cart?.items?.length > 0 ? (
            <Grid2 container spacing={2}>
              <Grid2 sx={{}} size={8.5}>
                <Box sx={{ p: 2, mb: 2, bgcolor: '#fff', borderRadius: '4px' }}>
                  <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
                    Sản phẩm trong đơn
                  </Typography>

                  {orderFormData?.products?.map((item, index) => (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        pt: 2,
                        pb: 3,
                        borderTop: index !== 0 ? '1px solid #f3f4f6' : 'none',
                      }}
                      key={item.model_id}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            position: 'relative',
                            width: 60,
                            height: 60,
                            mr: 2,
                            borderRadius: '4px',
                            border: '1px solid #d1d5db',
                            overflow: 'hidden',
                          }}>
                          <SkeletonImage src={item.image} alt={''} fill />
                        </Box>
                        <Box>
                          <Typography>{item.product_name}</Typography>
                          {item?.name && (
                            <Typography
                              sx={{
                                display: 'inline-block',
                                px: '6px',
                                py: '2px',
                                bgcolor: '#f3f4f6',
                                fontSize: 11,
                                borderRadius: 0.5,
                              }}>
                              {item?.name}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Typography>{formatPrice(item.price)}</Typography>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ p: 2, mb: 2, bgcolor: '#fff', borderRadius: '4px' }}>
                  <Typography mb={2}>Thông tin đặt hàng</Typography>
                  <TextField
                    sx={{ mb: 1 }}
                    fullWidth
                    placeholder='Họ và tên'
                    size='small'
                    name='name'
                    onChange={handleChange}
                    value={formik?.values?.name}
                    // value={customerData?.name ?? ''}
                  />
                  <TextField
                    sx={{ mb: 1 }}
                    fullWidth
                    placeholder='Số điện thoại'
                    size='small'
                    name='phone'
                    onChange={handleChange}
                    value={formik?.values?.phone}

                    // onChange={handleCustomerChange}
                    // value={customerData?.phone ?? ''}
                  />
                  <TextField
                    sx={{ mb: 1 }}
                    fullWidth
                    placeholder='Email (Không bắt buộc)'
                    size='small'
                    name='email'
                    onChange={handleChange}
                    value={formik?.values?.email}

                    // onChange={handleCustomerChange}
                    // value={customerData?.email ?? ''}
                  />
                </Box>
                <Box sx={{ p: 2, mb: 2, bgcolor: '#fff', borderRadius: '4px' }}>
                  <FormControl>
                    <FormLabel id='receiveOption'>
                      Hình thức nhận hàng
                    </FormLabel>
                    <RadioGroup
                      row
                      name='receiveOption'
                      onChange={handleChange}
                      value={formik?.values?.receiveOption}>
                      <FormControlLabel
                        value='DELIVERY'
                        control={<Radio size='small' />}
                        label='Giao hàng tận nơi'
                      />
                      <FormControlLabel
                        value='STORE'
                        control={<Radio size='small' />}
                        label='Nhận tại cửa hàng'
                      />
                    </RadioGroup>
                  </FormControl>
                  <Typography mb={1}>Ghi chú yêu cầu</Typography>
                  <textarea
                    placeholder='Nội dung'
                    name='note'
                    rows={3}
                    onChange={handleChange}
                    value={formik?.values?.note}
                    style={{
                      width: '100%',
                      padding: '8.5px 14px',
                      border: '1px solid rgba(0, 0, 0, 0.23)',
                      borderRadius: '4px',
                      fontSize: 16,
                    }}
                    onFocus={(e) => (e.target.style.outline = '1px solid #000')}
                    onBlur={(e) => (e.target.style.outline = 'none')}
                  />
                </Box>
                <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: '4px' }}>
                  <FormControl>
                    <FormLabel id='payment_method'>
                      Phương thức thanh toán
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby='payment_method'
                      name='payment_method'
                      onChange={handleChange}
                      value={formik?.values?.payment_method}>
                      <FormControlLabel
                        value='COD'
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
                  top: 100,
                  right: 0,
                  height: '100%',
                  bgcolor: '#fff',
                  borderRadius: '4px',
                }}
                size={3.5}
                p={2}>
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
                    fullWidth
                    onClick={() => formik.handleSubmit()}>
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
