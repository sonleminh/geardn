'use client';

import Breadcrumbs from '@/components/common/Breadcrumbs';
import LayoutContainer from '@/components/common/sharing/layout-container';
import SkeletonImage from '@/components/common/SkeletonImage';
import { useGetCart } from '@/services/cart/api';
import { formatPrice } from '@/utils/format-price';
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Grid2,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import React, { useState } from 'react';

const Cart = () => {
  const breadcrumbsOptions = [
    { link: '/', label: 'Home' },
    { link: '/cart', label: 'Giỏ hàng' },
  ];
  const { cart } = useGetCart();
  const [selected, setSelected] = useState<string[]>([]);

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

  const handleItemClick = (event: React.MouseEvent<unknown>, id: string) => {
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

  console.log(cart);
  return (
    <>
      <LayoutContainer>
        <Box sx={{ mb: 2 }}>
          <Breadcrumbs options={breadcrumbsOptions} />
        </Box>
        <Box sx={{ bgcolor: '#fff', borderRadius: '4px' }}>
          <Grid2 container>
            <Grid2 size={8}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Checkbox
                          color='primary'
                          checked={
                            cart?.items?.length > 0 &&
                            selected?.length === cart?.items?.length
                          }
                          onChange={handleSelectAllClick}
                          inputProps={{
                            'aria-label': 'select all desserts',
                          }}
                        />
                      </TableCell>
                      <TableCell>Sản phẩm</TableCell>
                      <TableCell align='right'>Giá</TableCell>
                      <TableCell align='right'>Số lượng</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart?.items?.map((row) => {
                      const isItemSelected = selected.includes(row.model._id);

                      return (
                        <TableRow
                          key={row.model?._id}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                          onClick={(event) =>
                            handleItemClick(event, row.model._id)
                          }>
                          <TableCell component='th' scope='row'>
                            <Checkbox
                              color='primary'
                              checked={isItemSelected}
                            />
                          </TableCell>
                          <TableCell component='th' scope='row'>
                            <Box
                              sx={{
                                position: 'relative',
                                width: 100,
                                height: 100,
                              }}>
                              <SkeletonImage
                                src={row?.model?.image}
                                alt='Gear DN'
                                fill
                              />
                            </Box>
                          </TableCell>
                          <TableCell component='th' scope='row'>
                            {row.model?.product_name}
                          </TableCell>
                          <TableCell component='th' scope='row'>
                            {row.model?.price}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* <div className='w-full text-right'>
                    <Button
                    // onClick={() => {
                    //   cart?.updateCartData?.();
                    // }}
                    >
                      Cập nhật giỏ hàng
                    </Button>
                  </div> */}
            </Grid2>
            <Grid2 size={4}>
              <Box className='pay'>
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
              </Box>
            </Grid2>
          </Grid2>
        </Box>
      </LayoutContainer>
    </>
  );
};

export default Cart;
