'use client';

import { useFormik } from 'formik';
import Link from 'next/link';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';

import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid2,
  InputLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  SxProps,
  TextField,
  Theme,
  Typography,
} from '@mui/material';

import Breadcrumbs from '@/components/common/Breadcrumbs';
import SkeletonImage from '@/components/common/SkeletonImage';

import { formatPrice } from '@/utils/format-price';

import { ROUTES } from '@/constants/route';

// import { checkoutSchema } from './utils/schema/checkoutSchema';

import LayoutContainer from '@/components/layout-container';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { useNotificationStore } from '@/stores/notification-store';
import { truncateTextByLine } from '@/utils/css-helper.util';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// Simplified location option matching our BFF responses
import { ILocationOption } from '@/interfaces/ILocation';
import { useCreateOrder } from '@/queries/order';
import { usePaymentMethods } from '@/queries/payment';
import { useProvince, useProvinces } from '@/queries/location';
import { useSession } from '@/hooks/useSession';
import { checkoutSchema } from '@/features/orders/schemas/checkout.schema';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useQueryClient } from '@tanstack/react-query';

const Checkout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { checkoutCart } = useAuthStore();
  const { showNotification } = useNotificationStore();
  const { data: userSession } = useSession();
  const { removeItem } = useCartStore();

  const breadcrumbsOptions = [
    { href: '/', label: 'Trang chủ' },
    { href: ROUTES.CHECKOUT, label: 'Thanh toán' },
  ];

  const [province, setProvince] = useState<ILocationOption | null>(null);
  const [ward, setWard] = useState<ILocationOption | null>(null);
  const [detailAddress, setDetailAddress] = useState<string>('');
  const [shopAddress, setShopAddress] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [shipmentError, setShipmentError] = useState(false);

  const { data: provinces } = useProvinces();
  const { data: provinceData } = useProvince(province?.code);
  const { data: paymentMethods } = usePaymentMethods();
  const { mutate: onCreateOrder } = useCreateOrder();

  const provinceOptions = Object.values(provinces ?? {})
    .filter((p) => p && typeof p === 'object' && p.code != null && p.name)
    .filter((p, idx, arr) => arr.findIndex((x) => x.code === p.code) === idx);
  useEffect(() => {
    setWard(null);
  }, [province?.code]);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => {
    setModalOpen(false);
    if (!detailAddress) {
      setProvince(null);
      setWard(null);
      setDetailAddress('');
    }
  };

  const formik = useFormik({
    initialValues: {
      totalPrice: 0,
      fullName: '',
      phoneNumber: '',
      email: '',
      note: '',
      flag: {
        isOnlineOrder: true,
      },
      shipment: {
        method: 1,
        address: '',
        deliveryDate: moment().toDate(),
      },
      paymentMethodId: 1,
    },
    validationSchema: toFormikValidationSchema(checkoutSchema),
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
        orderItems: checkoutCart?.map((item) => ({
          skuId: item.skuId,
          quantity: item.quantity,
        })),
        shipment: {
          ...values?.shipment,
          method: +values?.shipment?.method,
          address:
            values?.shipment?.method === 1
              ? `${detailAddress}, ${ward?.name}, ${province?.name}`
              : shopAddress,
        },
        userId: userSession?.data?.id ?? null,
      };
      onCreateOrder(payload, {
        onSuccess: (data) => {
          checkoutCart?.forEach((item) => {
            removeItem(item?.skuId);
          });
          router.push(`${ROUTES.ORDER_CONFIRMATION}/${data?.data?.orderCode}`);
          queryClient.invalidateQueries({
            queryKey: ['user-purchases'],
          });
        },
        onError: () => {
          showNotification('Đã có lỗi xảy ra', 'error');
        },
      });
    },
  });

  const totalAmount = useMemo(() => {
    return checkoutCart?.reduce(
      (acc, item) => acc + item.sellingPrice * item.quantity,
      0
    );
  }, [checkoutCart]);

  console.log('formik', formik);

  //   useEffect(() => {
  //     changeCustomer(customerData);
  //   }, [customerData, changeCustomer]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
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
              <Box sx={{ display: 'flex' }}>
                <Typography sx={{ flex: 7 }}>Sản phẩm</Typography>
                <Typography sx={{ flex: 2, textAlign: 'center', fontSize: 14 }}>
                  Đơn giá
                </Typography>
                <Typography sx={{ flex: 2, textAlign: 'center', fontSize: 14 }}>
                  Số lượng
                </Typography>
                <Typography sx={{ flex: 2, textAlign: 'center', fontSize: 14 }}>
                  Thành tiền
                </Typography>
              </Box>
              {checkoutCart?.map((item, index) => (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pt: 2,
                    pb: 3,
                    borderTop: index !== 0 ? '1px solid #f3f4f6' : 'none',
                  }}
                  key={item.skuId}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 7 }}>
                    <Box
                      sx={{
                        position: 'relative',
                        width: 60,
                        height: 60,
                        mr: 2,
                        borderRadius: '4px',
                        border: '1px solid #d1d5db',
                        overflow: 'hidden',
                        flexShrink: 0,
                        '.cart-item': { objectFit: 'cover' },
                      }}>
                      <SkeletonImage
                        src={item?.imageUrl}
                        alt={item?.productName}
                        fill
                        className='cart-item'
                      />
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          maxHeight: '32px',
                          mb: 0.5,
                          fontSize: 14,
                          lineHeight: '16px',
                          ...truncateTextByLine(2),
                        }}>
                        {item.productName}
                      </Typography>
                      {item?.attributes?.length > 0 && (
                        <Typography
                          sx={{
                            display: 'inline-block',
                            px: '6px',
                            py: '2px',
                            bgcolor: '#f3f4f6',
                            fontSize: 11,
                            borderRadius: 0.5,
                          }}>
                          {item?.attributes
                            ?.map((item) => item?.attributeValue)
                            .join(', ')}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Typography
                    sx={{
                      flex: 2,
                      width: 120,
                      textAlign: 'center',
                      fontSize: 14,
                    }}>
                    {formatPrice(item?.sellingPrice)}
                  </Typography>
                  <Typography
                    sx={{
                      flex: 2,
                      width: 88,
                      fontSize: 14,
                      textAlign: 'center',
                    }}>
                    {item?.quantity}
                  </Typography>
                  <Typography
                    sx={{
                      flex: 2,
                      width: 120,
                      textAlign: 'center',
                      fontSize: 14,
                    }}>
                    {formatPrice(item?.sellingPrice) ?? 1 * item.quantity}
                  </Typography>
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
                name='fullName'
                onChange={handleChange}
                value={formik?.values?.fullName}
                helperText={
                  <Box component={'span'} sx={helperTextStyle}>
                    {formik?.errors?.fullName}
                  </Box>
                }
              />
              <TextField
                margin='dense'
                fullWidth
                placeholder='Số điện thoại'
                name='phoneNumber'
                onChange={handleChange}
                value={formik?.values?.phoneNumber}
                helperText={
                  <Box component={'span'} sx={helperTextStyle}>
                    {formik?.errors?.phoneNumber}
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
                    {formik?.errors?.email}
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
                                {ward?.name}, {province?.name}
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
                        <FormControl fullWidth margin='dense'>
                          <Autocomplete
                            disablePortal
                            options={provinceOptions}
                            renderInput={(params) => (
                              <TextField {...params} label='Tỉnh/Thành phố' />
                            )}
                            onChange={(e, value) => setProvince(value)}
                            value={province}
                            isOptionEqualToValue={(option, value) =>
                              option?.code === value?.code
                            }
                            getOptionLabel={(option) => option?.name ?? ''}
                          />
                        </FormControl>

                        <FormControl fullWidth margin='dense'>
                          <Autocomplete
                            disablePortal
                            options={provinceData?.data.wards ?? []}
                            renderInput={(params) => (
                              <TextField {...params} label='Phường/Xã' />
                            )}
                            onChange={(e, value) => setWard(value)}
                            value={ward}
                            isOptionEqualToValue={(option, value) =>
                              option?.code === value?.code
                            }
                            getOptionLabel={(option) => option?.name ?? ''}
                            disabled={!province}
                          />
                        </FormControl>
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
                            !province ||
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
                        selected={formik?.values?.shipment?.deliveryDate}
                        onChange={(e) =>
                          formik.setFieldValue('shipment.deliveryDate', e)
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
                        selected={formik?.values?.shipment?.deliveryDate}
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
                  name='paymentMethodId'
                  onChange={handleChange}
                  value={formik?.values?.paymentMethodId}>
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
                  {formik?.errors?.paymentMethodId}
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
                  {formatPrice(totalAmount)}
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
      {/* {isCreateOrderPending && <FullScreenLoader />} */}
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
