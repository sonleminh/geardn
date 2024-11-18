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
  IProvince,
  createOrder,
  useGetDistrict,
  useGetOrderById,
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
import { BASE_API_URL } from '@/constants/env';
import BANNER_BG from '@/assets/geardn.jpg';
import ORDER_SUCCESS from '@/assets/order-success.png';
import { useParams } from 'next/navigation';

const CheckoutSuccess = () => {
  const params = useParams();

  const { order } = useGetOrderById(params?.slug as string);
  console.log(order);

  return (
    <Box pt={2} pb={4} bgcolor={'#eee'}>
      <LayoutContainer>
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: '250px' },
              overflow: 'hidden',
              borderRadius: 1,
              '& img': {
                objectFit: 'cover',
              },
              ':before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(to bottom, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.7) 100%)',
                filter: 'blur(8px)',
                zIndex: 1,
              },
            }}>
            <SkeletonImage
              src={BANNER_BG}
              alt='geardn'
              fill
              quality={90}
              priority
            />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              right: '50%',
              top: '50%',
              transform: 'translate(50%, -50%)',
              zIndex: 2,
              width: '60%',
              p: '20px 20px',
              bgcolor: '#fff',
              borderRadius: 1,
              textAlign: 'center',
            }}>
            <Typography
              sx={{ mb: 0.5, fontSize: 18, fontWeight: 600, color: '#5F8F20' }}>
              Đặt hàng thành công!
            </Typography>
            <Typography sx={{ mb: 1 }}>
              Cửa hàng sẽ liên hệ với bạn trong vòng 5-10 phút để xác nhận đơn
              hàng.
            </Typography>
            <Box
              sx={{
                position: 'relative',
                width: '60px',
                height: { xs: '60px' },
                margin: '0 auto',
                overflow: 'hidden',
                '& img': {
                  objectFit: 'cover',
                },
              }}>
              <SkeletonImage
                src={ORDER_SUCCESS}
                alt='geardn'
                fill
                quality={90}
                priority
              />
            </Box>
          </Box>
        </Box>
        <Grid2 container spacing={2}>
          <Grid2 sx={{}} size={8.5}>
            <Box sx={{ p: 2, mb: 1, bgcolor: '#fff', borderRadius: '4px' }}>
              <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                Sản phẩm trong đơn ({order?.items?.length})
              </Typography>

              {order?.items?.map((item, index) => (
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
            <Box sx={{ p: 2, mb: 1, bgcolor: '#fff', borderRadius: '4px' }}>
              <Typography sx={{ mb: 1, fontWeight: 600 }}>
                Thông tin đặt hàng:
              </Typography>
              <Box sx={{ p: 1, border: '1px solid #d1d5db', borderRadius: 2 }}>
                <Typography>{order?.name}</Typography>
                <Typography>{order?.phone}</Typography>
                {order?.email && <Typography>{order?.email}</Typography>}
              </Box>
            </Box>
            <Box sx={{ p: 2, mb: 2, bgcolor: '#fff', borderRadius: '4px' }}>
              <Typography sx={{ mb: 1, fontWeight: 600 }}>
                Hình thức nhận hàng:
              </Typography>
              <Box sx={{ p: 1, border: '1px solid #d1d5db', borderRadius: 2 }}>
                <Typography>{order?.name}</Typography>
                <Typography>{order?.phone}</Typography>
                {order?.email && <Typography>{order?.email}</Typography>}
              </Box>
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
                  {order?.total_amount ?? 0}
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
                sx={{ fontWeight: 600 }}
                component={Link}
                href='/'
                variant='outlined'
                size='large'
                fullWidth>
                Về trang chủ
              </Button>
            </Box>
          </Grid2>
        </Grid2>
      </LayoutContainer>
    </Box>
  );
};

export default CheckoutSuccess;

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
