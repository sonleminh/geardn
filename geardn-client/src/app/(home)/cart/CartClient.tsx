'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  Box,
  Button,
  Checkbox,
  Grid2,
  Paper,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Theme,
  Typography,
} from '@mui/material';

import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import SkeletonImage from '@/components/common/SkeletonImage';
import LayoutContainer from '@/components/layout-container';
import CustomDialog from '@/components/common/CustomDialog';
import Breadcrumbs from '@/components/common/Breadcrumbs';

import { useNotificationStore } from '@/stores/notification-store';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';

import { truncateTextByLine } from '@/utils/css-helper.util';
import { formatPrice } from '@/utils/format-price';

import { ROUTES } from '@/constants/route';
import EMPTY_CART from '@/assets/empty-cart.png';

import { ICartResponse, ICartStoreItem } from '@/interfaces/ICart';
import { IProductSkuAttributes } from '@/interfaces/IProductSku';
import {
  useDeleteCartItem,
  useGetCart,
  useGetCartStock,
  useUpdateQuantity,
} from '@/queries/cart';
import { useSession } from '@/hooks/useSession';
import { BaseResponse } from '@/types/response.type';

const CartClient = ({
  initialCart,
}: {
  initialCart: BaseResponse<ICartResponse>;
}) => {
  const { setCheckoutCart } = useAuthStore((state) => state);
  const { cartItems, updateQuantity, removeItem, syncCart } = useCartStore();
  const router = useRouter();

  const breadcrumbsOptions = [
    { href: '/', label: 'Trang chủ' },
    { href: ROUTES.CART, label: 'Giỏ hàng' },
  ];

  const { data: cartStock } = useGetCartStock(
    cartItems?.map((item) => item.skuId)
  );
  const { data: userSession } = useSession();
  const { data: cartServer } = useGetCart(!!userSession?.data, initialCart);
  const { mutateAsync: onDeleteCartItem } = useDeleteCartItem();

  const { mutateAsync: onUpdateQuantity, isPending: isUpdateQuantityPending } =
    useUpdateQuantity();

  const { showNotification } = useNotificationStore();

  const [draftQty, setDraftQty] = useState<Record<number, number | ''>>({});
  const [editing, setEditing] = useState<Record<number, boolean>>({});
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [openRemoveItemDialog, setOpenRemoveItemDialog] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [subtractItem, setSubtractItem] = useState<{
    skuId: number;
    name: string;
  }>();

  const getDisplayQty = (row: ICartStoreItem) =>
    editing[row.skuId] ? draftQty[row.skuId] ?? row.quantity : row.quantity;

  const handleFocus = (skuId: number, current: number) => {
    setEditing((s) => ({ ...s, [skuId]: true }));
    setDraftQty((s) => ({ ...s, [skuId]: current }));
  };

  const handleChange = (skuId: number, raw: string) => {
    if (raw === '') return setDraftQty((s) => ({ ...s, [skuId]: '' }));
    const n = Number(raw.replace(/[^\d]/g, ''));
    if (Number.isNaN(n)) return;
    setDraftQty((s) => ({ ...s, [skuId]: n }));
  };

  const handleBlur = (row: ICartStoreItem) => {
    const { skuId, cartItemId, productName } = row;
    const raw = draftQty[skuId];
    let next = typeof raw === 'number' ? raw : row.quantity;

    const stock =
      cartStock?.data?.find((i) => i.id === skuId)?.quantity ?? Infinity;

    if (next <= 0) {
      setOpenRemoveItemDialog(true);
      setSubtractItem({ skuId, name: productName });
      setDraftQty((s) => ({ ...s, [skuId]: row.quantity }));
    } else {
      if (Number.isFinite(stock) && next > stock) next = stock;

      if (next !== row.quantity) {
        updateQuantity(skuId, next);
        if (userSession?.data && cartItemId) {
          debouncedUpdateQuantity({
            skuId,
            cartItemId,
            next,
            prev: row.quantity,
          });
        }
      }
    }
    setEditing((s) => ({ ...s, [skuId]: false }));
    setDraftQty((s) => {
      const next = { ...s };
      delete next[skuId];
      return next;
    });
  };

  useEffect(() => {
    if (userSession?.data && cartServer?.data?.items) {
      syncCart(
        cartServer?.data?.items?.map((item) => ({
          productId: item?.productId,
          skuId: item?.sku?.id,
          productName: item?.product?.name,
          imageUrl: item?.sku?.imageUrl
            ? item?.sku?.imageUrl
            : item?.product?.images?.[0],
          sellingPrice: item?.sku?.sellingPrice,
          quantity: item?.quantity,
          attributes: item?.sku?.productSkuAttributes?.map(
            (productSkuAttributes: IProductSkuAttributes) => ({
              attribute: productSkuAttributes?.attributeValue?.attribute?.name,
              attributeValue: productSkuAttributes?.attributeValue?.value,
            })
          ),
          cartItemId: item?.id,
        }))
      );
    }
  }, [cartServer, userSession?.data, syncCart]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = cartItems?.map((n) => n?.skuId);
      if (newSelected) {
        setSelected(newSelected);
      }
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

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

  const debouncedIncreaseQuantity = debounce(
    (payload: { skuId: number; cartItemId: number; quantity: number }) => {
      onUpdateQuantity(
        { id: payload.cartItemId, quantity: payload.quantity },
        {
          onError: () => {
            showNotification('Đã có lỗi xảy ra', 'error');
            updateQuantity(payload.skuId, payload.quantity - 1); // !!
          },
        }
      );
    },
    1000
  );

  const debouncedReduceQuantity = debounce(
    (payload: { skuId: number; cartItemId: number; quantity: number }) => {
      onUpdateQuantity(
        { id: payload.cartItemId, quantity: payload.quantity },
        {
          onError: () => {
            updateQuantity(payload.skuId, payload.quantity - 1); // !!
          },
        }
      );
    },
    1000
  );

  const handleAddItem = async (skuId: number, cartItemId?: number) => {
    const itemToUpdate = cartItems?.find((item) => item.skuId === skuId);
    if (!itemToUpdate) return;
    const newQuantity = itemToUpdate.quantity + 1;
    if (userSession?.data && cartItemId) {
      updateQuantity(skuId, newQuantity);
      debouncedIncreaseQuantity({
        skuId: skuId,
        cartItemId: cartItemId,
        quantity: newQuantity,
      });
    } else {
      updateQuantity(skuId, newQuantity);
    }
  };

  const handleSubtractItem = async (
    skuId: number,
    name: string,
    cartItemId?: number
  ) => {
    const itemToUpdate = cartItems?.find((item) => item.skuId === skuId);

    if (!itemToUpdate) return;

    const newQuantity = itemToUpdate.quantity - 1;
    if (newQuantity === 0 && !userSession?.data) {
      setOpenRemoveItemDialog(true);
      setSubtractItem({ skuId, name });
      return;
    }
    if (newQuantity === 0 && userSession?.data && cartItemId) {
      setOpenRemoveItemDialog(true);
      setSubtractItem({ skuId, name });
      debouncedReduceQuantity({
        skuId: skuId,
        cartItemId: cartItemId,
        quantity: newQuantity,
      });
      return;
    }
    if (userSession?.data && cartItemId) {
      updateQuantity(skuId, newQuantity);
      debouncedReduceQuantity({
        skuId: skuId,
        cartItemId: cartItemId,
        quantity: newQuantity,
      });
    } else {
      updateQuantity(skuId, newQuantity);
    }
  };

  const handleDeleteItem = async (skuId: number) => {
    removeItem(skuId);
    if (userSession?.data) {
      const backupCartItems = [...cartItems];
      const cartServerItem = cartServer?.data?.items?.find(
        (item) => item?.sku?.id === skuId
      );
      if (cartServerItem) {
        await onDeleteCartItem(cartServerItem?.id, {
          onError: () => {
            syncCart(backupCartItems);
          },
        });
      }
    }
  };

  const totalAmount = () => {
    const selectedItems = selected
      .map((skuId) => cartItems?.find((item) => item.skuId === skuId))
      .filter((item) => item !== undefined);

    return selectedItems?.reduce(
      (acc, item) => acc + (item?.sellingPrice ?? 0) * (item?.quantity ?? 0),
      0
    );
  };

  const handleOkRemoveItemDialog = () => {
    if (subtractItem) {
      removeItem(subtractItem.skuId);
    }
    handleCloseRemoveItemDialog();
  };

  const handleCloseRemoveItemDialog = () => {
    setOpenRemoveItemDialog(false);
  };

  const handlePayBtn = () => {
    if (selected.length === 0) {
      return showNotification('Vui lòng chọn sản phẩm', 'warning');
    }
    const selectedItems = selected
      .map((skuId) => cartItems?.find((item) => item.skuId === skuId))
      ?.filter((item): item is ICartStoreItem => item !== undefined);
    setCheckoutCart(selectedItems);
    router.push(ROUTES.CHECKOUT);
  };

  function debounce<This, A extends unknown[]>(
    callback: (this: This, ...args: A) => void,
    delay = 300
  ) {
    let timer: ReturnType<typeof setTimeout> | undefined;

    return function (this: This, ...args: A) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => callback.apply(this, args), delay);
    };
  }

  useEffect(() => {
    if (!cartItems?.length) return;
    setDraftQty((prev) => {
      const next: Record<number, number | ''> = { ...prev };
      for (const it of cartItems) {
        // chỉ cập nhật nếu chưa có draft hoặc draft rỗng
        if (next[it.skuId] === undefined || next[it.skuId] === '') {
          next[it.skuId] = it.quantity;
        }
      }
      return next;
    });
  }, [cartItems]);

  const debouncedUpdateQuantity = debounce(
    (p: { skuId: number; cartItemId: number; next: number; prev: number }) => {
      onUpdateQuantity(
        { id: p.cartItemId, quantity: p.next },
        {
          onError: () => {
            // rollback
            updateQuantity(p.skuId, p.prev);
            setDraftQty((s) => ({ ...s, [p.skuId]: p.prev }));
            showNotification('Cập nhật số lượng thất bại', 'error');
          },
        }
      );
    },
    800
  );

  return (
    <Box pt={2} pb={4} bgcolor={'#eee'}>
      <LayoutContainer>
        <Box sx={{ mb: 2 }}>
          <Breadcrumbs options={breadcrumbsOptions} />
        </Box>
        <Box>
          {cartItems?.length > 0 ? (
            <Grid2 container spacing={2}>
              <Grid2 size={8.5}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                    <TableHead>
                      <TableRow>
                        <TableCell width={'5%'}>
                          <Checkbox
                            color='primary'
                            checked={
                              cartItems?.length > 0 &&
                              selected?.length === cartItems?.length
                            }
                            onChange={handleSelectAllClick}
                            inputProps={{
                              'aria-label': 'select all desserts',
                            }}
                          />
                        </TableCell>
                        <TableCell width={'45%'}>Sản phẩm</TableCell>
                        <TableCell align='center'>Giá</TableCell>
                        <TableCell align='center'>Số lượng</TableCell>
                        <TableCell align='center' width={'13%'}>
                          Tuỳ chọn
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartItems?.map((row) => {
                        const isItemSelected = selected.includes(row.skuId);
                        return (
                          <TableRow
                            key={row.skuId}
                            sx={{
                              height: ' 96px',
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}>
                            <TableCell component='th' scope='row'>
                              <Checkbox
                                color='primary'
                                checked={isItemSelected}
                                onClick={(e) => handleClick(e, row.skuId)}
                              />
                            </TableCell>
                            <TableCell
                              sx={{
                                width: '20%',
                              }}
                              component='th'
                              scope='row'>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}>
                                <Box
                                  sx={{
                                    position: 'relative',
                                    width: 60,
                                    height: 60,
                                    mr: 2,
                                    flexShrink: 0,
                                    '.product-image': {
                                      objectFit: 'cover',
                                    },
                                  }}>
                                  <SkeletonImage
                                    src={row?.imageUrl}
                                    alt={row?.productName}
                                    fill
                                    className='product-image'
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
                                    {row?.productName}
                                  </Typography>
                                  {row?.attributes?.length ? (
                                    <Typography
                                      sx={{
                                        display: 'inline-block',
                                        px: '5px',
                                        py: '1.5px',
                                        bgcolor: '#f3f4f6',
                                        fontSize: 11,
                                        borderRadius: 0.5,
                                      }}>
                                      {row?.attributes
                                        ?.map((item) => item?.attributeValue)
                                        .join(', ')}
                                    </Typography>
                                  ) : (
                                    ''
                                  )}
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell
                              sx={{ fontSize: 14 }}
                              component='th'
                              scope='row'
                              align='center'>
                              {formatPrice(row?.sellingPrice)}
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
                                  mb: 0.5,
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
                                    handleSubtractItem(
                                      row.skuId,
                                      row.productName,
                                      row?.cartItemId
                                    )
                                  }>
                                  -
                                </Button>
                                <TextField
                                  sx={QtyInputStyle}
                                  variant='outlined'
                                  type='text'
                                  size='small'
                                  value={getDisplayQty(row)}
                                  onFocus={() =>
                                    handleFocus(row.skuId, row.quantity)
                                  }
                                  onChange={(e) =>
                                    handleChange(row.skuId, e.target.value)
                                  }
                                  onBlur={() => handleBlur(row)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter')
                                      e.currentTarget.blur();
                                  }}
                                  inputRef={(el) => {
                                    inputRefs.current[row.skuId] = el;
                                  }}
                                />
                                <Button
                                  sx={{
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                  }}
                                  onClick={() =>
                                    handleAddItem(row?.skuId, row?.cartItemId)
                                  }
                                  disabled={
                                    (cartStock?.data?.find(
                                      (item) => item.id === row?.skuId
                                    )?.quantity ?? 0) <= (row?.quantity ?? 0)
                                  }>
                                  +
                                </Button>
                              </Box>
                              {cartStock?.data &&
                                (cartStock?.data?.find(
                                  (item) => item.id === row?.skuId
                                )?.quantity ?? 0) < 10 && (
                                  <Typography
                                    sx={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                                    Còn{' '}
                                    {
                                      cartStock?.data?.find(
                                        (item) => item.id === row?.skuId
                                      )?.quantity
                                    }{' '}
                                    sản phẩm
                                  </Typography>
                                )}
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
                                onClick={() => handleDeleteItem(row?.skuId)}>
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
                  <Grid2
                    size={12}
                    mb={2}
                    className='total-price-label'
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
                      Tổng cộng:
                    </Typography>
                    <Typography sx={{ fontSize: 14 }}>
                      {selected?.length} sản phẩm
                    </Typography>
                  </Grid2>
                  <Grid2
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                    size={12}
                    className='total-price-cost'>
                    <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
                      Thành tiền:
                    </Typography>
                    <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
                      {formatPrice(totalAmount())}
                    </Typography>
                  </Grid2>
                  <Button
                    sx={{ mb: 1.5, fontWeight: 600 }}
                    variant='contained'
                    size='large'
                    fullWidth
                    onClick={handlePayBtn}>
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
      <CustomDialog
        title='Bạn chắc chắn muốn bỏ sản phẩm này?'
        content=''
        okContent='Có'
        cancelContent='Không'
        open={openRemoveItemDialog}
        handleOk={handleOkRemoveItemDialog}
        handleClose={handleCloseRemoveItemDialog}
      />
      {isUpdateQuantityPending && <FullScreenLoader />}
    </Box>
  );
};

export default CartClient;

const QtyInputStyle: SxProps<Theme> = {
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
      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
        display: 'none',
      },
    },
    '& .Mui-disabled': {
      color: '#000',
      WebkitTextFillColor: 'inherit',
    },
  },
};
