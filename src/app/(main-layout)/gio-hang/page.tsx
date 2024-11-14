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
import EMPTY_CART from '@/assets/empty-cart.png';
import Link from 'next/link';
import { useAuthStore } from '@/providers/auth-store-provider';
import { ICartItem } from '@/interfaces/ICart';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/route';
import { useNotificationContext } from '@/contexts/NotificationContext';

const Cart = () => {
  const breadcrumbsOptions = [
    { href: '/', label: 'Home' },
    { href: ROUTES.CART, label: 'Giỏ hàng' },
  ];
  const { cart, mutate } = useGetCart();
  const router = useRouter();
  const { showNotification } = useNotificationContext();
  const { mutate: mutateCart } = useUpsertCart();
  const { mutate: globalMutate } = useSWRConfig();
  const [selected, setSelected] = useState<string[]>([]);
  const [quantityInputs, setQuantityInputs] = useState<{
    [key: string]: string;
  }>({});
  const { addProducts } = useAuthStore((state) => state);

  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

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

  const handleAddItem = async (item_id: string) => {
    const itemToUpdate = cart?.items?.find((item) => item.model_id === item_id);

    if (!itemToUpdate) return;

    const newQuantity = itemToUpdate.quantity + 1;
    const optimisticCart = {
      ...cart,
      items: cart?.items?.map((item) =>
        item.model_id === item_id ? { ...item, quantity: newQuantity } : item
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
    } catch (error: any) {
      mutate(cart, false);
      showNotification(error?.message, 'error');
    }
  };

  const handleSubtractItem = async (item_id: string) => {
    const itemToUpdate = cart?.items?.find((item) => item.model_id === item_id);
    if (!itemToUpdate) return;

    const newQuantity = itemToUpdate.quantity - 1;

    const optimisticCart = {
      ...cart,
      items:
        newQuantity > 0
          ? cart?.items?.map((item) =>
              item.model_id === item_id
                ? { ...item, quantity: newQuantity }
                : item
            )
          : cart?.items?.filter(
              (item) => item?.model_id !== itemToUpdate?.model_id
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
    } catch (error: any) {
      mutate(cart, false);
      showNotification(error?.message, 'error');
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
        (item) => item.model_id === item_id
      )?.quantity;
      setQuantityInputs((prev) => ({
        ...prev,
        [item_id]: originalQuantity?.toString() ?? '1',
      }));
      return;
    }

    const itemToUpdate = cart?.items?.find((item) => item.model_id === item_id);

    if (!itemToUpdate || newQuantity === itemToUpdate.quantity) return;

    const optimisticCart = {
      ...cart,
      items: cart?.items?.map((item) =>
        item.model_id === item_id ? { ...item, quantity: newQuantity } : item
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
    } catch (error: any) {
      showNotification(error?.message, 'error');
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
      items: cart?.items.filter((item) => item.model_id !== item_id),
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

  const totalAmount = () => {
    const selectedItems = selected
      .map((item_id) => cart?.items?.find((item) => item.model_id === item_id))
      .filter((item) => item !== undefined);

    return selectedItems?.reduce(
      (acc, item) => acc + (item?.price ?? 0) * (item?.quantity ?? 0),
      0
    );
  };

  const checkoutItems = () => {
    const selectedItems = selected
      .map((item_id) => cart?.items?.find((item) => item.model_id === item_id))
      .filter((item): item is ICartItem => item !== undefined);

    addProducts(selectedItems);
    router.push('/checkout');
  };

  return (
    <Box pt={2} pb={4} bgcolor={'#eee'}>
      <LayoutContainer>
        <Box sx={{ mb: 2 }}>
          <Breadcrumbs options={breadcrumbsOptions} />
        </Box>
        <Box>
          {cart?.items?.length > 0 ? (
            <Grid2 container spacing={2}>
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
                        const isItemSelected = selected.includes(row.model_id);

                        return (
                          <TableRow
                            key={row.model_id}
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}>
                            <TableCell component='th' scope='row'>
                              <Checkbox
                                color='primary'
                                checked={isItemSelected}
                                onClick={(e) => handleClick(e, row.model_id)}
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
                                  '.product-image': {
                                    objectFit: 'cover',
                                  },
                                }}>
                                <SkeletonImage
                                  src={row?.image}
                                  alt={row?.product_name}
                                  fill
                                  className='product-image'
                                />
                              </Box>
                              <Box>
                                <Typography fontSize={15}>
                                  {row?.product_name}
                                </Typography>
                                {row?.name && (
                                  <Typography
                                    sx={{
                                      display: 'inline-block',
                                      px: '6px',
                                      py: '2px',
                                      bgcolor: '#f3f4f6',
                                      fontSize: 11,
                                      borderRadius: 0.5,
                                    }}>
                                    {row?.name}
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell
                              sx={{}}
                              component='th'
                              scope='row'
                              align='center'>
                              {formatPrice(row?.price)}
                            </TableCell>
                            <TableCell
                              component='th'
                              scope='row'
                              align='center'>
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
                                    handleSubtractItem(row?.model_id)
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
                                    quantityInputs[row.model_id] ?? row.quantity
                                  }
                                  onChange={(e) =>
                                    handleQuantityInputChange(e, row?.model_id)
                                  }
                                  onBlur={() =>
                                    handleQuantityInputBlur(row?.model_id)
                                  }
                                  onKeyDown={(e) =>
                                    handleKeyDown(e, row?.model_id)
                                  }
                                  inputRef={(ref) =>
                                    (inputRefs.current[row.model_id] = ref)
                                  }
                                />
                                <Button
                                  sx={{
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                  }}
                                  onClick={() => handleAddItem(row?.model_id)}>
                                  +
                                </Button>
                              </Box>
                            </TableCell>

                            <TableCell
                              component='th'
                              scope='row'
                              align='center'>
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  ':hover': {
                                    color: 'red',
                                    cursor: 'pointer',
                                  },
                                }}
                                onClick={() => handleDeleteItem(row?.model_id)}>
                                Xóa
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid2>
              <Grid2 sx={{ bgcolor: '#fff', borderRadius: 1 }} size={3.5} p={3}>
                <Grid2 className='total'>
                  <Grid2 size={6} mb={2} className='total-price-label'>
                    Tổng thanh toán ({selected?.length} sản phẩm):
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
                      {formatPrice(totalAmount())}
                    </Typography>
                  </Grid2>
                  <Button
                    sx={{ mb: 1.5, fontWeight: 600 }}
                    variant='contained'
                    size='large'
                    fullWidth
                    onClick={() => {
                      checkoutItems();
                      console.log(2);
                    }}>
                    Thanh toán
                  </Button>
                  <Button
                    sx={{ fontWeight: 600 }}
                    variant='outlined'
                    size='large'
                    fullWidth>
                    Tiếp tục mua hàng
                  </Button>
                </Grid2>
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

export default Cart;
