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
  IDistrict,
  IProvince,
  IWard,
  createOrder,
  useGetDistrict,
  useGetPaymentMethods,
  useGetProvince,
  useGetProvinceList,
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
  Modal,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  SxProps,
  TextField,
  Theme,
  Typography,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useFormik } from 'formik';
import Link from 'next/link';
import { checkoutSchema } from './utils/schema/checkoutSchema';
import { BASE_API_URL } from '@/constants/env';
import moment from 'moment';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import useConfirmModal from '@/hooks/useModalConfirm';
import { useRouter } from 'next/navigation';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { postRequest } from '@/utils/fetch-client';

const Checkout = () => {
  const breadcrumbsOptions = [
    { href: '/', label: 'Home' },
    { href: ROUTES.CHECKOUT, label: 'Thanh toán' },
  ];
  const router = useRouter();
  const { confirmModal, showConfirmModal } = useConfirmModal();

  const { user } = useAuthStore((state) => state);

  const { province_list } = useGetProvinceList();
  const { paymentMethods } = useGetPaymentMethods();
  const { mutate: globalMutate } = useSWRConfig();
  const { showNotification } = useNotificationContext();
  const [customerData, setCustomerData] = useState<{
    name: string;
    phone: string;
    email: string;
  }>({ name: '', phone: '', email: '' });
  const [city, setCity] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [ward, setWard] = useState<string>('');
  const [detailAddress, setDetailAddress] = useState<string>('');
  const [shopAddress, setShopAddress] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [shipmentError, setShipmentError] = useState(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => {
    setModalOpen(false);
    if (!detailAddress) {
      setCity('');
      setDistrict('');
      setWard('');
      setDetailAddress('');
    }
  };

  const { province } = useGetProvince(
    province_list?.find?.((item) => item?.name === city)?.code
  );

  const { districtData } = useGetDistrict(
    province?.districts?.find?.((item) => item?.name === district)?.code
  );

  const { orderFormData, changeCustomer } = useAuthStore((state) => state);

  const formik = useFormik({
    initialValues: {
      customer: {
        name: '',
        phone: '',
        mail: '',
      },
      shipment: {
        method: 1,
        delivery_date: moment().toDate(),
      },
      payment: '673c8947d6a67118f380f4ab',
      flag: {
        is_online_order: true,
      },
      note: '',
    },
    validationSchema: checkoutSchema,
    validateOnChange: false,
    async onSubmit(values) {
      if (
        (values?.shipment?.method == 1 && !detailAddress) ||
        (values?.shipment?.method == 2 && !shopAddress)
      ) {
        return setShipmentError(true);
      } else {
        setShipmentError(false);
      }
      const payload = {
        ...values,
        items: orderFormData?.products ?? [],
        shipment: {
          ...values?.shipment,
          method: +values?.shipment?.method,
          address:
            values?.shipment?.method === 1
              ? `${detailAddress}, ${ward}, ${district}, ${city}`
              : shopAddress,
        },
        userid: user?.id ?? null,
      };
      try {
        const res = await createOrder(payload);
        showNotification('Đặt hàng thành công', 'success');
        globalMutate(`${BASE_API_URL}/cart`, undefined, { revalidate: true });
        // router.push(`/dat-hang/thanh-cong/${res.id}`);
      } catch (error: any) {
        showNotification(error?.message, 'error');
      }
    },
  });

  function getTotalAmount() {
    return orderFormData?.products?.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }

  useEffect(() => {
    changeCustomer(customerData);
  }, [customerData, changeCustomer]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    formik.setFieldValue(name, value);
  };

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    formik.setFieldValue(name, value);
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { value, name } = e.target;
    formik.setFieldValue(name, value);
  };

  const handleConfirmAddress = () => {
    setModalOpen(false);
  };

  return (
    <Box pt={2} pb={4} bgcolor={'#eee'}>
      <LayoutContainer>
        <Box sx={{}}>
          <Breadcrumbs options={breadcrumbsOptions} />
        </Box>
        <Button component={Link} href={ROUTES.CART}>
          <ChevronLeftOutlinedIcon />
          Quay lại giỏ hàng
        </Button>

        <Grid2 container spacing={2}>
          <Grid2 sx={{}} size={8.5}>
            <Box sx={{ p: 2, mb: 2, bgcolor: '#fff', borderRadius: '4px' }}>
              <Typography sx={{ fontWeight: 600 }}>
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
                  key={item.modelid}>
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
              <Typography sx={{ fontWeight: 600 }}>
                Thông tin đặt hàng
              </Typography>
              <TextField
                fullWidth
                margin='dense'
                placeholder='Họ và tên'
                name='customer.name'
                onChange={handleChange}
                value={formik?.values?.customer?.name}
                helperText={
                  <Box component={'span'} sx={helperTextStyle}>
                    {formik?.errors?.customer?.name}
                  </Box>
                }
              />
              <TextField
                margin='dense'
                fullWidth
                placeholder='Số điện thoại'
                name='customer.phone'
                onChange={handleChange}
                value={formik?.values?.customer?.phone}
                helperText={
                  <Box component={'span'} sx={helperTextStyle}>
                    {formik?.errors?.customer?.phone}
                  </Box>
                }
              />
              <TextField
                margin='dense'
                fullWidth
                placeholder='Email (Không bắt buộc)'
                type='email'
                name='customer.mail'
                onChange={handleChange}
                value={formik?.values?.customer?.mail}
                helperText={
                  <Box component={'span'} sx={helperTextStyle}>
                    {formik?.errors?.customer?.mail}
                  </Box>
                }
              />
            </Box>
            <Box sx={{ p: 2, mb: 2, bgcolor: '#fff', borderRadius: '4px' }}>
              <RadioGroup
                sx={{ mb: 1 }}
                row
                name='shipment.method'
                onChange={handleChange}
                value={formik?.values?.shipment?.method}>
                <FormControlLabel
                  value={1}
                  control={<Radio size='small' />}
                  label={
                    <Typography sx={{ fontSize: 14 }}>
                      Giao hàng tận nơi
                    </Typography>
                  }
                />
                <FormControlLabel
                  value={2}
                  control={<Radio size='small' />}
                  label={
                    <Typography sx={{ fontSize: 14 }}>
                      Nhận tại cửa hàng
                    </Typography>
                  }
                />
              </RadioGroup>
              <Grid2 mb={2} container rowSpacing={2} columnSpacing={4}>
                {formik?.values?.shipment?.method == 1 ? (
                  <Grid2 size={12}>
                    <>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: detailAddress ? 'start' : 'center',
                          width: '100%',
                          p: 1.5,
                          minHeight: 56,
                          border: '1px solid rgba(0, 0, 0, 0.23)',
                          borderRadius: 1,
                          cursor: 'pointer',
                        }}
                        // onClick={handleSelectAddress}
                        onClick={handleModalOpen}>
                        {detailAddress && !modalOpen ? (
                          <>
                            <Box>
                              <Typography
                                sx={{ color: '#6b7280', fontSize: 13 }}>
                                Giao tới
                              </Typography>
                              <Typography
                                sx={{ fontSize: 15, fontWeight: 600 }}>
                                {ward}, {district}, {city}
                              </Typography>
                              <Typography
                                sx={{ fontSize: 14, fontWeight: 500 }}>
                                {detailAddress}
                              </Typography>
                            </Box>
                            <Typography
                              sx={{
                                color: '#1250dc',
                                fontSize: 14,
                                fontWeight: 600,
                              }}>
                              Thay đổi
                            </Typography>
                          </>
                        ) : (
                          <>
                            <Typography sx={{ color: '#9ca3af' }}>
                              Tỉnh/Thành Phố, Quận/Huyện, Phường Xã
                            </Typography>
                            <ChevronRightIcon />
                          </>
                        )}
                      </Box>
                      {shipmentError && (
                        <FormHelperText sx={{ mx: '14px' }}>
                          <Box component={'span'} sx={helperTextStyle}>
                            Vui lòng nhập thông tin nhận hàng
                          </Box>
                        </FormHelperText>
                      )}
                    </>
                    <Modal
                      open={modalOpen}
                      onClose={handleModalClose}
                      aria-labelledby='modal-modal-title'
                      aria-describedby='modal-modal-description'>
                      <Box sx={modalStyle}>
                        <Typography sx={{ mb: 2, textAlign: 'center' }}>
                          Thêm địa chỉ nhận hàng
                        </Typography>
                        <FormControl
                          sx={selectStyle}
                          margin='dense'
                          variant='filled'
                          fullWidth>
                          <InputLabel>Tỉnh/Thành phố</InputLabel>
                          <Select
                            disableUnderline
                            size='small'
                            onChange={(e) => setCity(e?.target?.value)}
                            value={
                              province_list?.some((item) => item.name === city)
                                ? city
                                : ''
                            }>
                            {province_list?.map((item) => (
                              <MenuItem key={item?.code} value={item?.name}>
                                {item?.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {city && (
                          <FormControl
                            sx={selectStyle}
                            margin='dense'
                            variant='filled'
                            fullWidth>
                            <InputLabel>Quận/Huyện</InputLabel>
                            <Select
                              disableUnderline
                              size='small'
                              onChange={(e) => setDistrict(e?.target?.value)}
                              value={
                                // province_list?.districts?.some(
                                //   (item) => item.name === district
                                // )
                                //   ? district
                                //   : ''
                                district
                              }
                              // disabled={!city}
                            >
                              {province?.districts?.map((item: IDistrict) => (
                                <MenuItem key={item?.code} value={item?.name}>
                                  {item?.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                        {district && (
                          <FormControl
                            sx={selectStyle}
                            margin='dense'
                            variant='filled'
                            fullWidth>
                            <InputLabel>Phường/Xã</InputLabel>
                            <Select
                              disableUnderline
                              size='small'
                              onChange={(e) => setWard(e?.target?.value)}
                              value={
                                // districtData?.wards?.some(
                                //   (item) => item.name === ward
                                // )
                                //   ? ward
                                //   : ''
                                ward
                              }
                              disabled={!district}>
                              {districtData?.wards?.map((item: IWard) => (
                                <MenuItem key={item?.code} value={item?.name}>
                                  {item?.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                        <FormControl
                          sx={{
                            mb: 2.5,
                            textarea: {
                              fontFamily: 'Roboto, sans-serif',
                              '::placeholder': {
                                fontSize: 16,
                                color: '#9ca3af',
                              },
                            },
                          }}
                          margin='dense'
                          fullWidth>
                          <textarea
                            style={{
                              width: '100%',
                              padding: '12px 12px',
                              border: '1px solid rgba(0, 0, 0, 0.23)',
                              borderRadius: '4px',
                              fontSize: 16,
                            }}
                            rows={4}
                            placeholder='Địa chỉ cụ thể'
                            onChange={(e) => setDetailAddress(e?.target?.value)}
                            value={detailAddress}
                          />
                        </FormControl>
                        <Button
                          sx={{ width: '100%' }}
                          variant='contained'
                          disabled={
                            !city ||
                            !district ||
                            !ward ||
                            !Boolean(detailAddress?.length > 3)
                          }
                          onClick={handleConfirmAddress}>
                          Xác nhận
                        </Button>
                      </Box>
                    </Modal>
                    <FormControl
                      sx={{
                        '.MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0,0,0,0.23) !important',
                        },
                        '.date-picker': {
                          width: '300px',
                          height: 50,
                          pl: 5,
                          fontSize: 15,
                        },
                        '.react-datepicker__calendar-icon': {
                          position: 'absolute',
                          top: '50%',
                          transform: 'translateY(-50%)',
                        },
                      }}
                      fullWidth
                      margin='dense'>
                      <Typography sx={{ mb: 1 }}>
                        Thời gian nhận hàng:
                      </Typography>
                      <DatePicker
                        showTimeSelect
                        showIcon
                        icon={<CalendarTodayOutlinedIcon />}
                        selected={formik?.values?.shipment?.delivery_date}
                        onChange={(e) =>
                          formik.setFieldValue('shipment.delivery_date', e)
                        }
                        minTime={new Date(new Date().setHours(7, 0, 0, 0))}
                        maxTime={new Date(new Date().setHours(23, 30, 0, 0))}
                        minDate={new Date()}
                        dateFormat='dd/MM/yyyy HH:mm'
                        // timeFormat='HH:mm'
                        timeFormat='HH:mm'
                        className='date-picker'
                      />
                    </FormControl>
                  </Grid2>
                ) : (
                  <Grid2 size={12}>
                    <FormControl variant='filled' fullWidth sx={selectStyle}>
                      <InputLabel>Chọn shop có hàng gần nhất</InputLabel>
                      <Select
                        disableUnderline
                        size='small'
                        onChange={(e) => setShopAddress(e?.target?.value)}
                        value={shopAddress}>
                        <MenuItem
                          value={
                            '39/48 Cù Chính Lan, P.Hòa Khê, Q.Thanh Khê, TP.Đà Nẵng'
                          }>
                          39/48 Cù Chính Lan, P.Hòa Khê, Q.Thanh Khê, TP.Đà Nẵng
                        </MenuItem>
                        <MenuItem
                          value={
                            '02 Tô Hiến Thành, P.Phước Mỹ, Q.Sơn Trà, TP.Đà Nẵng'
                          }>
                          02 Tô Hiến Thành, P.Phước Mỹ, Q.Sơn Trà, TP.Đà Nẵng
                        </MenuItem>
                      </Select>
                    </FormControl>
                    {shipmentError && (
                      <FormHelperText sx={{ mx: '14px' }}>
                        <Box component={'span'} sx={helperTextStyle}>
                          Vui lòng nhập thông tin nhận hàng
                        </Box>
                      </FormHelperText>
                    )}
                    <FormControl
                      sx={{
                        '.MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0,0,0,0.23) !important',
                        },
                        '.date-picker': {
                          width: '300px',
                          height: 50,
                          pl: 5,
                          fontSize: 15,
                        },
                        '.react-datepicker__calendar-icon': {
                          position: 'absolute',
                          top: '50%',
                          transform: 'translateY(-50%)',
                        },
                      }}
                      margin='dense'>
                      <Typography sx={{ mb: 1 }}>
                        Thời gian nhận hàng:
                      </Typography>
                      <DatePicker
                        showTimeSelect
                        showIcon
                        icon={<CalendarTodayOutlinedIcon />}
                        selected={formik?.values?.shipment?.delivery_date}
                        onChange={(e) =>
                          formik.setFieldValue('shipment.delivery_date', e)
                        }
                        minTime={new Date(new Date().setHours(7, 0, 0, 0))}
                        maxTime={new Date(new Date().setHours(23, 30, 0, 0))}
                        minDate={new Date()}
                        dateFormat='dd/MM/yyyy HH:mm'
                        // timeFormat='HH:mm'
                        timeFormat='HH:mm'
                        className='date-picker'
                      />
                    </FormControl>
                  </Grid2>
                )}

                <Grid2 size={12}>
                  <FormControl
                    variant='filled'
                    fullWidth
                    sx={{
                      textarea: {
                        fontFamily: 'Roboto, sans-serif',
                        '::placeholder': {
                          fontSize: 16,
                          color: '#9ca3af',
                        },
                      },
                    }}>
                    <textarea
                      placeholder='Ghi chú (Ví dụ: Hãy gọi cho tôi khi chuẩn bị hàng xong)'
                      name='note'
                      rows={4}
                      onChange={(e) =>
                        formik.setFieldValue(e.target.name, e.target.value)
                      }
                      value={formik?.values?.note}
                      style={{
                        width: '100%',
                        padding: '12px 12px',
                        border: '1px solid rgba(0, 0, 0, 0.23)',
                        borderRadius: '4px',
                        fontSize: 16,
                      }}
                      onFocus={(e) =>
                        (e.target.style.outline = '1px solid #000')
                      }
                      onBlur={(e) => (e.target.style.outline = 'none')}
                    />
                    <FormHelperText sx={helperTextStyle}>
                      {formik?.errors?.note}
                    </FormHelperText>
                  </FormControl>
                </Grid2>
              </Grid2>
            </Box>
            <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: '4px' }}>
              <FormControl>
                <Typography sx={{ mb: 2, fontWeight: 600 }}>
                  Phương thức thanh toán
                </Typography>
                <RadioGroup
                  name='payment.method'
                  onChange={handleChange}
                  value={formik?.values?.payment}>
                  {paymentMethods?.data?.map((item) => (
                    <FormControlLabel
                      sx={{ my: 1 }}
                      key={item?.key}
                      value={item?.id}
                      control={<Radio size='small' />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              position: 'relative',
                              width: 32,
                              height: 32,
                              ml: 1,
                              mr: 1.5,
                              overflow: 'hidden',
                              img: { objectFit: 'cover' },
                            }}>
                            <SkeletonImage
                              src={item.image}
                              alt={''}
                              fill
                              className='cart-item'
                            />
                          </Box>
                          <Typography sx={{ fontSize: 14 }}>
                            {item?.name}
                          </Typography>
                        </Box>
                      }
                    />
                  ))}
                </RadioGroup>
                <FormHelperText sx={helperTextStyle}>
                  {formik?.errors?.payment}
                </FormHelperText>
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
                <Typography sx={{ fontSize: 13 }}>Phí vận chuyển:</Typography>
                <Typography sx={{ fontSize: 13 }}>Miễn phí (5km)</Typography>
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

const modalStyle: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height: 444,
  p: '24px 32px',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  outline: 'none',
};
