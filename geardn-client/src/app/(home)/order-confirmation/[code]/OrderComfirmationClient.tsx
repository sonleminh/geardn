'use client';
import Link from 'next/link';

import { Box, Button, Divider, Grid2, Typography } from '@mui/material';
import moment from 'moment';
import 'moment/locale/vi';

import SkeletonImage from '@/components/common/SkeletonImage';
import LayoutContainer from '@/components/layout-container';
import { formatPrice } from '@/utils/format-price';

import ORDER_SUCCESS from '@/assets/order-success.png';
import BANNER_BG from '@/assets/geardn.jpg';
import { IOrder } from '@/interfaces/IOrder';

const OrderConfirmationClient = ({ data }: { data: IOrder }) => {
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
                Sản phẩm trong đơn ({data?.orderItems?.length})
              </Typography>

              {data?.orderItems?.map((item, orderItemIndex) => (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pt: 2,
                    pb: 3,
                    borderTop:
                      orderItemIndex !== 0 ? '1px solid #f3f4f6' : 'none',
                  }}
                  key={orderItemIndex}>
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
                        src={item?.imageUrl}
                        alt={''}
                        fill
                        className='cart-item'
                      />
                    </Box>
                    <Box>
                      <Typography>{item?.productName}</Typography>
                      {item?.skuAttributes?.length ? (
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: '5px',
                            py: '1.5px',
                            bgcolor: '#f3f4f6',
                            fontSize: 11,
                            borderRadius: 0.5,
                          }}>
                          {item?.skuAttributes
                            ?.map((attItem) => attItem?.value)
                            .join(', ')}
                        </Box>
                      ) : (
                        ''
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
                      {formatPrice(item?.sellingPrice)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box sx={{ p: 2, mb: 1, bgcolor: '#fff', borderRadius: '4px' }}>
              <Typography sx={{ mb: 1, fontWeight: 600 }}>
                Thông tin đặt hàng:
              </Typography>
              <Box
                sx={{
                  p: 1,
                  border: '1px solid #d1d5db',
                  borderRadius: 2,
                  '& p': {
                    fontSize: 15,
                  },
                }}>
                <Typography sx={{ mb: 0.5, fontWeight: 600 }}>
                  {data?.fullName}
                </Typography>
                <Typography sx={{ mb: 0.5 }}>{data?.phoneNumber}</Typography>
                {data?.email && <Typography>{data?.email}</Typography>}
              </Box>
            </Box>
            <Box sx={{ p: 2, mb: 2, bgcolor: '#fff', borderRadius: '4px' }}>
              <Typography sx={{ mb: 1, fontWeight: 600 }}>
                Hình thức nhận hàng:
              </Typography>
              <Box
                sx={{
                  p: 1,
                  mb: 1,
                  border: '1px solid #d1d5db',
                  borderRadius: 2,
                }}>
                <Typography
                  sx={{
                    mb: 0.5,
                    color: '#6b7280',
                    fontSize: 13,
                    fontWeight: 600,
                  }}>
                  {data?.shipment?.method === 1
                    ? 'Giao tới:'
                    : 'Nhận hàng tại:'}
                </Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {data?.shipment?.address}
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 1,
                  mb: 1,
                  border: '1px solid #d1d5db',
                  borderRadius: 2,
                }}>
                <Typography
                  sx={{
                    mb: 0.5,
                    color: '#6b7280',
                    fontSize: 13,
                    fontWeight: 600,
                  }}>
                  {data?.shipment?.method === 1
                    ? 'Thời gian giao:'
                    : 'Thời gian nhận hàng:'}
                </Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {moment(data?.shipment?.deliveryDate).format('LLL')}
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 1,

                  border: '1px solid #d1d5db',
                  borderRadius: 2,
                }}>
                <Typography
                  sx={{
                    mb: 0.5,
                    color: '#6b7280',
                    fontSize: 13,
                    fontWeight: 600,
                  }}>
                  Ghi chú:
                </Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {data?.note !== '' ? data?.note : 'Không có'}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ p: 2, mb: 1, bgcolor: '#fff', borderRadius: '4px' }}>
              <Typography sx={{ mb: 1, fontWeight: 600 }}>
                Phương thức thanh toán:
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: '16px 16px',
                  borderRadius: 2,
                  bgcolor: '#F3F4F6',
                }}>
                {data?.paymentMethod?.image && (
                  <Box
                    sx={{
                      position: 'relative',
                      width: '40px',
                      height: { xs: '40px' },
                      mr: 1.5,
                      overflow: 'hidden',
                    }}>
                    <SkeletonImage
                      src={data?.paymentMethod?.image}
                      alt='COD - GearDN'
                      fill
                    />
                  </Box>
                )}
                <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                  {data?.paymentMethod?.key} - {data?.paymentMethod?.name}
                </Typography>
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
                  mb: 1,
                }}>
                <Typography sx={{ fontSize: 13 }}>Mã đơn hàng:</Typography>
                <Typography sx={{ fontSize: 14 }}>{data?.orderCode}</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                className='total-price-cost'>
                <Typography sx={{ fontSize: 13 }}>Tổng tiền:</Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                  {formatPrice(data?.totalPrice ?? 0)}
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

export default OrderConfirmationClient;
