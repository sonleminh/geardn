import Breadcrumbs from '@/components/common/Breadcrumbs';
import LayoutContainer from '@/components/common/sharing/layout-container';
import { formatPrice } from '@/utils/format-price';
import { Box, Button, ButtonGroup, Grid2, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';

const Cart = () => {
  const breadcrumbsOptions = [
    { link: '/', label: 'Home' },
    { link: '/cart', label: 'Giỏ hàng' },
  ];
  return (
    <LayoutContainer>
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs options={breadcrumbsOptions} />
      </Box>
      <Box sx={{ bgcolor: '#fff', borderRadius: '4px' }}>
        <Grid2 container>
          <Grid2 size={8}>
            {/* <Table
        // loading={isFetching}
        columns={columns}
        dataSource={cart?.cart?.item ?? []}
        rowKey={'_id'}
        pagination={false}
      /> */}
            <div className='w-full text-right'>
              <Button
              // onClick={() => {
              //   cart?.updateCartData?.();
              // }}
              >
                Cập nhật giỏ hàng
              </Button>
            </div>
          </Grid2>
          <Grid2 size={4}>
            <div className='pay'>
              <Typography className='total-title'>CỘNG GIỎ HÀNG</Typography>
              <Grid2 className='total'>
                <Grid2 size={6} className='total-price-label'>
                  Tổng thanh toán:
                </Grid2>
                <Grid2 size={6} className='total-price-cost'>
                  {/* {formatPrice(cart?.totalPrice)} */}
                </Grid2>
                <Button className='pay-btn'>
                  <Link href={'/'}>Tiến hành thanh toán</Link>
                </Button>
                <ButtonGroup className='total-btns'>
                  <Button
                  // onClick={
                  // () =>
                  // showConfirmModal({
                  //   title: 'Bạn có muốn xoá hết sản phẩm trong giỏ hàng?',
                  //   onOk: () => {
                  //     cart?.removeAllProductInCart?.();
                  //   },
                  // })
                  // }
                  >
                    Xóa tất cả
                  </Button>
                  <Button>
                    <Link href='/'>Về trang chủ</Link>
                  </Button>
                </ButtonGroup>
              </Grid2>
            </div>
          </Grid2>
        </Grid2>
      </Box>
    </LayoutContainer>
  );
};

export default Cart;
