'use client';

import Breadcrumbs from '@/components/common/Breadcrumbs';
import LayoutContainer from '@/components/common/sharing/layout-container';
import SkeletonImage from '@/components/common/SkeletonImage';
import {
  addCartAPI,
  subtractCartAPI,
  updateCartQuantityAPI,
  useGetCart,
} from '@/services/cart/api';
import { useUpsertCart } from '@/services/cart/mutations';
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
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import React, { ChangeEvent, useState } from 'react';
import { useSWRConfig } from 'swr';

const Cart = () => {
  const breadcrumbsOptions = [
    { link: '/', label: 'Home' },
    { link: '/cart', label: 'Giỏ hàng' },
  ];
  const { cart, mutate } = useGetCart();
  const { mutate: mutateCart } = useUpsertCart();
  const { mutate: globalMutate } = useSWRConfig();
  console.log('cart:', cart);
  const [selected, setSelected] = useState<string[]>([]);
  const [quantityInputs, setQuantityInputs] = useState<{
    [key: string]: string;
  }>({});

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

  // const handleAddItem = async (item_id: string) => {
  //   const cartData = await addCartAPI({
  //     model: item_id,
  //     quantity: 1,
  //     // quantity: count ?? 1,
  //   });
  //   mutateCart(cartData, false);

  //   mutate('/api/cart');
  // };

  const handleAddItem = async (item_id: string) => {
    // Find the item in the cart
    const itemToUpdate = cart?.items?.find(
      (item) => item.model._id === item_id
    );

    console.log('itemToUpdate:', itemToUpdate);

    if (!itemToUpdate) return;

    // Create an optimistic cart update
    const newQuantity = itemToUpdate.quantity + 1; // Increment quantity
    const optimisticCart = {
      ...cart,
      items: cart?.items?.map((item) =>
        item.model._id === item_id ? { ...item, quantity: newQuantity } : item
      ),
    };
    console.log('optimisticCart:', optimisticCart);

    // Optimistically update the UI
    mutate(optimisticCart, false);

    try {
      // Perform the API call to update the cart on the server
      console.log('newQuantity:', newQuantity);
      console.log('itemToUpdate2:', itemToUpdate);
      const updatedCartData = await addCartAPI({
        model: item_id,
        quantity: 1,
      });

      // Mutate the cart with the new data from the server
      mutateCart(updatedCartData, false);

      // Revalidate the cart data (ensure consistency)
      globalMutate('/api/cart');
    } catch (error) {
      // If the API call fails, revert the cart to its previous state
      mutate(cart, false);
      console.error('Failed to update cart:', error);
    }
  };

  const handleSubtractItem = async (item_id: string) => {
    // Find the item in the cart
    const itemToUpdate = cart?.items?.find(
      (item) => item.model._id === item_id
    );

    console.log('itemToUpdate:', itemToUpdate);

    if (!itemToUpdate) return;

    // Create an optimistic cart update
    const newQuantity = itemToUpdate.quantity - 1; // Increment quantity
    const optimisticCart = {
      ...cart,
      items: cart?.items?.map((item) =>
        item.model._id === item_id ? { ...item, quantity: newQuantity } : item
      ),
    };
    console.log('optimisticCart:', optimisticCart);

    // Optimistically update the UI
    mutate(optimisticCart, false);

    try {
      // Perform the API call to update the cart on the server
      console.log('newQuantity:', newQuantity);
      console.log('itemToUpdate2:', itemToUpdate);
      const updatedCartData = await subtractCartAPI({
        model: item_id,
        quantity: 1,
      });

      // Mutate the cart with the new data from the server
      mutateCart(updatedCartData, false);

      // Revalidate the cart data (ensure consistency)
      globalMutate('/api/cart');
    } catch (error) {
      // If the API call fails, revert the cart to its previous state
      mutate(cart, false);
      console.error('Failed to update cart:', error);
    }
  };

  const handleQuantityInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    item_id: string
  ) => {
    const newQuantity = e.target.value;
    // if (isNaN(newQuantity) || newQuantity < 1) return;

    // Update the local input state
    setQuantityInputs((prev) => ({
      ...prev,
      [item_id]: newQuantity,
    }));
  };

  console.log('quantityInputs:', quantityInputs);

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

    // Find the item in the cart
    const itemToUpdate = cart?.items?.find(
      (item) => item.model._id === item_id
    );

    if (!itemToUpdate || newQuantity === itemToUpdate.quantity) return;

    // Optimistically update the UI
    const optimisticCart = {
      ...cart,
      items: cart?.items?.map((item) =>
        item.model._id === item_id ? { ...item, quantity: newQuantity } : item
      ),
    };

    console.log('optimisticCart:', optimisticCart);

    mutate(optimisticCart, false); // Optimistic UI update

    try {
      // Update the quantity on the server
      console.log('newQuantity:', newQuantity);
      const updatedCartData = await updateCartQuantityAPI({
        model: item_id,
        quantity: newQuantity,
      });
      mutateCart(updatedCartData, false);

      // Revalidate the cart data
      globalMutate('/api/cart');
    } catch (error) {
      console.error('Failed to update cart:', error);
      mutate(cart, false); // Revert on failure
    }
  };

  // console.log(cart);
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
                      <TableCell align='center'>Giá</TableCell>
                      <TableCell align='center'>Số lượng</TableCell>
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
                          // onClick={(event) =>
                          //   handleItemClick(event, row.model._id)
                          // }
                        >
                          <TableCell component='th' scope='row'>
                            <Checkbox
                              color='primary'
                              checked={isItemSelected}
                            />
                          </TableCell>
                          <TableCell
                            sx={{ display: 'flex', alignItems: 'center' }}
                            component='th'
                            scope='row'>
                            <Box
                              sx={{
                                position: 'relative',
                                width: 100,
                                height: 100,
                                mr: 2,
                              }}>
                              <SkeletonImage
                                src={row?.model?.image}
                                alt='Gear DN'
                                fill
                              />
                            </Box>
                            {row.model?.product_name}
                          </TableCell>
                          <TableCell component='th' scope='row' align='center'>
                            {formatPrice(row.model?.price)}
                          </TableCell>
                          <TableCell component='th' scope='row' align='center'>
                            <ButtonGroup
                              variant='outlined'
                              size='small'
                              sx={{ mr: 2, height: 32 }}>
                              <Button
                                onClick={() =>
                                  handleSubtractItem(row?.model?._id)
                                }>
                                -
                              </Button>
                              <TextField
                                type='number'
                                value={
                                  quantityInputs[row.model._id] ?? row.quantity
                                }
                                onChange={(e) =>
                                  handleQuantityInputChange(e, row?.model?._id)
                                }
                                onBlur={() =>
                                  handleQuantityInputBlur(row?.model?._id)
                                }
                                // onKeyDown={(e) => {
                                //   if (e.key === '-') {
                                //     e.preventDefault();
                                //   }
                                //   if (
                                //     count === null &&
                                //     (e.key === '0' || e.key === 'Enter')
                                //   ) {
                                //     e.preventDefault();
                                //   }
                                // }}
                                size='small'
                                sx={{
                                  width: '48px',
                                  '.MuiInputBase-root': {
                                    height: 32,
                                    borderRadius: 0,
                                    '.MuiInputBase-input': {
                                      p: 0,
                                      textAlign: 'center',
                                      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button':
                                        {
                                          display: 'none',
                                        },
                                    },
                                  },
                                }}
                              />
                              <Button
                                onClick={() => handleAddItem(row?.model?._id)}>
                                +
                              </Button>
                            </ButtonGroup>
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
