import React from 'react';
import moment from 'moment';
import { Box, Button, SxProps, Theme, Typography } from '@mui/material';

import { IOrder } from '@/interfaces/IOrder';
import { formatPrice } from '@/utils/format-price';
import { OrderStatus, OrderStatusLabelMap } from '@/constants/orderStatus';

import AppLink from '@/components/common/AppLink';
import SkeletonImage from '@/components/common/SkeletonImage';
const PurchaseList = ({ orders }: { orders: IOrder[] }) => {
  if (!orders || orders.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: 400,
          bgcolor: '#fff',
        }}>
        No orders found.
      </Box>
    );
  }

  return (
    <Box>
      {orders.map((order) => (
        <Box
          key={order.id}
          sx={{
            marginBottom: 1.5,
            bgcolor: '#fff',
          }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              borderBottom: '1px solid #e5e7eb',
              p: '12px 16px',
            }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                {moment(order?.createdAt).format('DD/MM/YYYY')}{' '}
              </Typography>
              <Box sx={DotStyle} />
              <Typography sx={{ fontSize: 14 }}>
                {order?.shipment?.method !== 1
                  ? 'Nhận tại cửa hàng'
                  : 'Giao hàng tận nơi'}{' '}
              </Typography>
              <Box sx={DotStyle} />
              <Typography sx={{ fontSize: 14 }}>
                {order?.orderItems?.length} sản phẩm
              </Typography>
            </Box>
            <Typography
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: '#059669',
                fontSize: 14,
                fontWeight: 600,
              }}>
              <Typography
                component={'span'}
                sx={{
                  display: 'inline-block',
                  width: '8px !important',
                  height: '8px !important',
                  mr: 1,
                  bgcolor: '#059669',
                  borderRadius: '50%',
                }}
              />
              {OrderStatusLabelMap[order?.status as OrderStatus]}
            </Typography>
          </Box>
          {order?.orderItems?.map((item, index) => (
            <Box
              component={AppLink}
              href={`/${item?.product?.category?.slug}/${item.productSlug}`}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: '16px',
                borderBottom: '1px solid #e5e7eb',
              }}
              key={index}>
              <Box
                key={index}
                sx={{
                  display: 'flex',
                }}>
                <Box
                  sx={{
                    position: 'relative',
                    width: '80px',
                    height: { xs: '80px' },
                    overflow: 'hidden',
                    '& img': {
                      objectFit: 'cover',
                    },
                  }}>
                  <SkeletonImage src={item?.imageUrl} alt='geardn' />
                </Box>
                <Box sx={{ ml: 2 }}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                    {item.productName}
                  </Typography>
                  {item.skuAttributes.length > 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mt: 0.5,
                        color: 'rgba(0,0,0,.54)',
                      }}>
                      <Typography sx={{ mr: 0.5, fontSize: 14 }}>
                        Phân loại hàng:
                      </Typography>
                      {item.skuAttributes.map((skuAttribute, idx) => (
                        <Typography
                          key={idx}
                          sx={{
                            fontSize: 14,
                          }}>
                          {`${skuAttribute.value}`}
                          {item.skuAttributes.length - 1 === idx + 1 && ','}
                        </Typography>
                      ))}
                    </Box>
                  )}
                  <Typography sx={{ fontSize: 14 }}>
                    {' '}
                    x{item.quantity}
                  </Typography>
                </Box>
              </Box>
              <Typography sx={{ fontSize: 14 }}>
                {formatPrice(item?.sellingPrice)}
              </Typography>
            </Box>
          ))}
          <Box sx={{ p: '24px 16px 24px 16px' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center',
                mb: 2,
              }}>
              Thành tiền:{' '}
              <Typography sx={{ ml: 1.5, fontSize: 20 }}>
                {formatPrice(order.totalPrice)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ color: '#6b7280', fontSize: 13 }}>
                Bạn cần hỗ trợ? Liên hệ ngay với chúng tôi.
              </Typography>
              {(order.status === 'PENDING' ||
                order.status === 'PROCESSING') && (
                <Button
                  variant='outlined'
                  sx={{
                    width: 150,
                    border: '1px solid #eee',
                    textTransform: 'none',
                    fontSize: 14,
                    fontWeight: 400,
                    color: '#555',
                  }}>
                  Hủy đơn hàng
                </Button>
              )}
              {(order.status === 'DELIVERED' ||
                order.uiStatus === 'CANCELED') && (
                <Button
                  variant='contained'
                  sx={{
                    width: 150,
                    textTransform: 'none',
                  }}>
                  Mua lại
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default PurchaseList;

const DotStyle: SxProps<Theme> = {
  display: 'inline-block',
  width: '4px',
  height: '4px',
  mx: 1,
  bgcolor: '#e5e7eb',
  borderRadius: '50%',
};
