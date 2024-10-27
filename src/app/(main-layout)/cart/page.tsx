'use client';

import React, { ChangeEvent, useRef, useState } from 'react';
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

const Cart = () => {
  const breadcrumbsOptions = [
    { link: '/', label: 'Home' },
    { link: '/cart', label: 'Giỏ hàng' },
  ];
  const { cart, mutate } = useGetCart();
  const { mutate: mutateCart } = useUpsertCart();
  const { mutate: globalMutate } = useSWRConfig();
  const [selected, setSelected] = useState<string[]>([]);
  const [quantityInputs, setQuantityInputs] = useState<{
    [key: string]: string;
  }>({});

  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

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

  const handleAddItem = async (item_id: string) => {
    const itemToUpdate = cart?.items?.find(
      (item) => item.model._id === item_id
    );

    if (!itemToUpdate) return;

    const newQuantity = itemToUpdate.quantity + 1;
    const optimisticCart = {
      ...cart,
      items: cart?.items?.map((item) =>
        item.model._id === item_id ? { ...item, quantity: newQuantity } : item
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
    const itemToUpdate = cart?.items?.find(
      (item) => item.model._id === item_id
    );
    if (!itemToUpdate) return;

    const newQuantity = itemToUpdate.quantity - 1;
    const optimisticCart = {
      ...cart,
      items: cart?.items?.map((item) =>
        item.model._id === item_id ? { ...item, quantity: newQuantity } : item
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
        (item) => item.model._id === item_id
      )?.quantity;
      setQuantityInputs((prev) => ({
        ...prev,
        [item_id]: originalQuantity?.toString() ?? '1',
      }));
      return;
    }

    const itemToUpdate = cart?.items?.find(
      (item) => item.model._id === item_id
    );

    if (!itemToUpdate || newQuantity === itemToUpdate.quantity) return;

    const optimisticCart = {
      ...cart,
      items: cart?.items?.map((item) =>
        item.model._id === item_id ? { ...item, quantity: newQuantity } : item
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
      items: cart?.items.filter((item) => item.model._id !== item_id),
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
  return (
    <Box pt={2} pb={4} bgcolor={'#eee'}>
      <LayoutContainer>
        <Box sx={{ mb: 2 }}>
          <Breadcrumbs options={breadcrumbsOptions} />
        </Box>
        <Box sx={{ bgcolor: '#fff', borderRadius: '4px' }}>
          <Grid2 container>
            <Grid2 size={8.5}>
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
                      <TableCell align='center' width={'13%'}>
                        Tuỳ chọn
                      </TableCell>
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
                          }}>
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
                                width: 68,
                                height: 68,
                                mr: 2,
                              }}>
                              <SkeletonImage
                                src={row?.model?.image}
                                alt={row.model?.product_name}
                                fill
                              />
                            </Box>
                            {row.model?.product_name}
                          </TableCell>
                          <TableCell
                            sx={{}}
                            component='th'
                            scope='row'
                            align='center'>
                            {formatPrice(row.model?.price)}
                          </TableCell>
                          <TableCell component='th' scope='row' align='center'>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                '& .MuiButtonBase-root': {
                                  minWidth: 28,
                                  height: 28,
                                  border: '1px solid #eee',
                                },
                              }}>
                              <Button
                                sx={{
                                  borderTopRightRadius: 0,
                                  borderBottomRightRadius: 0,
                                }}
                                onClick={() =>
                                  handleSubtractItem(row?.model?._id)
                                }>
                                -
                              </Button>
                              <TextField
                                sx={{
                                  width: '36px',
                                  height: 28,
                                  borderTop: '1px solid rgba(0,0,0,.09)',
                                  borderBottom: '1px solid rgba(0,0,0,.09)',
                                  '& .MuiOutlinedInput-root': {
                                    height: 28,
                                    '& fieldset': {
                                      display: 'none',
                                    },
                                  },
                                  '.MuiInputBase-root': {
                                    height: 28,
                                    borderRadius: 0,
                                    fontSize: 14,
                                    '.MuiInputBase-input': {
                                      height: 24,
                                      p: 0,
                                      textAlign: 'center',
                                      ':focus': {
                                        border: '1px solid #000',
                                      },
                                      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button':
                                        {
                                          display: 'none',
                                        },
                                    },
                                  },
                                }}
                                variant='outlined'
                                type='number'
                                size='small'
                                value={
                                  quantityInputs[row.model._id] ?? row.quantity
                                }
                                onChange={(e) =>
                                  handleQuantityInputChange(e, row?.model?._id)
                                }
                                onBlur={() =>
                                  handleQuantityInputBlur(row?.model?._id)
                                }
                                onKeyDown={(e) =>
                                  handleKeyDown(e, row?.model?._id)
                                }
                                inputRef={(ref) =>
                                  (inputRefs.current[row.model._id] = ref)
                                }
                              />
                              <Button
                                sx={{
                                  borderTopLeftRadius: 0,
                                  borderBottomLeftRadius: 0,
                                }}
                                onClick={() => handleAddItem(row?.model?._id)}>
                                +
                              </Button>
                            </Box>
                          </TableCell>

                          <TableCell component='th' scope='row' align='center'>
                            <Typography
                              sx={{
                                ':hover': {
                                  color: 'red',
                                },
                              }}
                              onClick={() => handleDeleteItem(row?.model?._id)}>
                              Xoá
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid2>
            <Grid2 size={3.5} p={3}>
              <Grid2 className='total'>
                <Grid2 size={6} mb={2} className='total-price-label'>
                  Tổng thanh toán (100 sản phẩm):
                </Grid2>
                <Grid2
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                  size={6}
                  className='total-price-cost'>
                  <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
                    Thành tiền:
                  </Typography>
                  <Typography sx={{ fontSize: 20, fontWeight: 800 }}>
                    {formatPrice(10000000)}
                  </Typography>
                </Grid2>
                <Button
                  sx={{ fontWeight: 600 }}
                  variant='contained'
                  size='large'
                  fullWidth>
                  Thanh toán
                </Button>
              </Grid2>
            </Grid2>
          </Grid2>
        </Box>
      </LayoutContainer>
    </Box>
  );
};

export default Cart;
