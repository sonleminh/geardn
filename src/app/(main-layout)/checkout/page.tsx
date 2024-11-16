'use client';

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useSWRConfig } from 'swr';

import Breadcrumbs from '@/components/common/Breadcrumbs';
import SkeletonImage from '@/components/common/SkeletonImage';
import LayoutContainer from '@/components/common/sharing/layout-container';
import { addCartAPI, useGetCart } from '@/services/cart/api';
import { useUpsertCart } from '@/services/cart/mutations';
import { formatPrice } from '@/utils/format-price';

import EMPTY_CART from '@/assets/empty-cart.png';
import { ROUTES } from '@/constants/route';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { useAuthStore } from '@/providers/auth-store-provider';
import {
  createOrder,
  useGetDistrict,
  useGetProvinces,
} from '@/services/order/api';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid2,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  SxProps,
  TextField,
  Theme,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import Link from 'next/link';
import { checkoutSchema } from './utils/schema/checkoutSchema';

const Checkout = () => {
  const breadcrumbsOptions = [
    { href: '/', label: 'Home' },
    { href: ROUTES.CHECKOUT, label: 'Thanh toán' },
  ];
  const { cart, mutate } = useGetCart();
  const { provinces } = useGetProvinces();

  const { mutate: mutateCart } = useUpsertCart();
  const { mutate: globalMutate } = useSWRConfig();
  const { showNotification } = useNotificationContext();
  const [selected, setSelected] = useState<string[]>([]);
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
        city: '',
        district: '',
        ward: '',
        specific_address: '',
      },
      receive_option: 'DELIVERY',
      note: '',
      payment_method: 'COD',
    },
    validationSchema: checkoutSchema,
    validateOnChange: false,
    async onSubmit(values) {
      const payload = {
        ...values,
        items: orderFormData?.products ?? [],
        totalAmount: 0,
      };
      try {
        const userData = await createOrder(payload);
      } catch (error: any) {
        showNotification(error?.message, 'error');
      }
    },
  });

  const { district } = useGetDistrict(formik.values.address.district);

  function getTotalAmount() {
    return orderFormData?.products?.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }

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

  useEffect(() => {
    changeCustomer(customerData);
  }, [customerData, changeCustomer]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value, name } = e.target;
    formik.setFieldValue(name, value);
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { value, name } = e.target;
    formik.setFieldValue(name, value);
  };

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
                            '.cart-item': { objectFit: 'cover' },
                          }}>
                          <SkeletonImage
                            src={item.image}
                            alt={''}
                            fill
                            className='cart-item'
                          />
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
                      <Box sx={{ display: 'flex' }}>
                        <Typography sx={{ width: 88, mr: 4, fontSize: 14 }}>
                          Số lượng: {item.quantity}
                        </Typography>
                        <Typography
                          sx={{
                            width: 120,
                            fontWeight: 600,
                            textAlign: 'end',
                          }}>
                          {formatPrice(item.price)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ p: 2, mb: 2, bgcolor: '#fff', borderRadius: '4px' }}>
                  <Typography mb={1}>Thông tin đặt hàng</Typography>
                  <TextField
                    fullWidth
                    margin='dense'
                    placeholder='Họ và tên'
                    name='name'
                    onChange={handleChange}
                    value={formik?.values?.name}
                    helperText={
                      <Box component={'span'} sx={helperTextStyle}>
                        {formik.errors.name}
                      </Box>
                    }
                  />
                  <TextField
                    margin='dense'
                    fullWidth
                    placeholder='Số điện thoại'
                    name='phone'
                    onChange={handleChange}
                    value={formik?.values?.phone}
                    helperText={
                      <Box component={'span'} sx={helperTextStyle}>
                        {formik.errors.phone}
                      </Box>
                    }
                  />
                  <TextField
                    margin='dense'
                    fullWidth
                    placeholder='Email (Không bắt buộc)'
                    type='email'
                    name='email'
                    onChange={handleChange}
                    value={formik?.values?.email}
                    helperText={
                      <Box component={'span'} sx={helperTextStyle}>
                        {formik.errors.email}
                      </Box>
                    }
                  />
                </Box>
                <Box sx={{ p: 2, mb: 2, bgcolor: '#fff', borderRadius: '4px' }}>
                  <FormControl sx={{ mb: 1 }}>
                    <FormLabel id='receiveOption'>
                      Hình thức nhận hàng
                    </FormLabel>
                    <RadioGroup
                      row
                      name='receive_option'
                      onChange={handleChange}
                      value={formik?.values?.receive_option}>
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
                  {provinces &&
                    formik?.values?.receive_option === 'DELIVERY' && (
                      <>
                        <FormControl
                          sx={selectStyle}
                          margin='dense'
                          variant='filled'
                          fullWidth>
                          <InputLabel>Tỉnh/Thành phố</InputLabel>
                          <Select
                            disableUnderline
                            size='small'
                            name='address.city'
                            onChange={handleSelectChange}
                            value={formik?.values?.address?.city ?? ''}>
                            {provinces &&
                              provinces?.map((item) => (
                                <MenuItem key={item?.code} value={item?.name}>
                                  {item?.name}
                                </MenuItem>
                              ))}
                          </Select>
                          <FormHelperText sx={helperTextStyle}>
                            {formik?.errors?.address?.city}
                          </FormHelperText>
                        </FormControl>
                        {formik?.values?.address?.city && (
                          <FormControl
                            sx={selectStyle}
                            margin='dense'
                            variant='filled'
                            fullWidth>
                            <InputLabel>Quận/Huyện</InputLabel>
                            <Select
                              disableUnderline
                              size='small'
                              name='address.district'
                              onChange={handleSelectChange}
                              value={formik?.values?.address?.district ?? ''}>
                              {provinces
                                ?.find(
                                  (item) =>
                                    item?.name === formik?.values?.address?.city
                                )
                                ?.districts?.map((item) => (
                                  <MenuItem key={item?.code} value={item?.code}>
                                    {item?.name}
                                  </MenuItem>
                                ))}
                            </Select>

                            <FormHelperText sx={helperTextStyle}>
                              {formik?.errors?.address?.district}
                            </FormHelperText>
                          </FormControl>
                        )}
                        {district && formik?.values?.address?.district && (
                          <FormControl
                            sx={selectStyle}
                            margin='dense'
                            variant='filled'
                            fullWidth>
                            <InputLabel>Phường/Xã</InputLabel>
                            <Select
                              disableUnderline
                              size='small'
                              name='address.ward'
                              onChange={handleSelectChange}
                              value={formik?.values?.address?.ward ?? ''}>
                              {district?.wards?.map((item) => (
                                <MenuItem key={item?.code} value={item?.name}>
                                  {item?.name}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText sx={helperTextStyle}>
                              {formik?.errors?.address?.ward}
                            </FormHelperText>
                          </FormControl>
                        )}
                        {formik?.values?.address?.ward && (
                          <FormControl fullWidth variant='standard'>
                            <TextField
                              variant='outlined'
                              size='small'
                              fullWidth
                              name='address.specific_address'
                              placeholder='Địa chỉ cụ thể'
                              autoFocus
                              helperText={
                                <Typography
                                  component={'span'}
                                  sx={{ fontSize: 13, color: 'red' }}>
                                  {formik?.errors?.address?.specific_address}
                                </Typography>
                              }
                              onChange={handleChange}
                            />
                          </FormControl>
                        )}
                      </>
                    )}
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
                      {formatPrice(getTotalAmount() ?? 0)}
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
                    component={Link}
                    href='/'
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

const helperTextStyle: SxProps<Theme> = {
  color: 'red',
  fontSize: 13,
};

const selectStyle: SxProps<Theme> = {
  '& .MuiFilledInput-root': {
    overflow: 'hidden',
    borderRadius: 1,
    backgroundColor: '#fff !important',
    border: '1px solid',
    borderColor: 'rgba(0,0,0,0.23)',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '&.Mui-focused': {
      backgroundColor: 'transparent',
      border: '2px solid',
    },
  },
  '& .MuiInputLabel-asterisk': {
    color: 'red',
  },
};
