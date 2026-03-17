"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import CartItem from "./CartItem";
import { BaseResponse } from "@/types/response.type";
import { ICartResponse } from "@/interfaces/ICart";
import { useSession } from "@/hooks/useSession";
import { useGetCart, useGetCartStock } from "@/queries/cart";
import { IProductSkuAttributes } from "@/interfaces/IProductSku";
import { useCartStore } from "@/stores/cart-store";
import { Box, Checkbox, Grid2, Paper, Typography } from "@mui/material";
import { removeCartItemDB, updateCartItemDB } from "@/actions/cart.action";
import { useNotificationStore } from "@/stores/notification-store";
import CustomDialog from "@/components/common/CustomDialog";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import LayoutContainer from "@/components/layout-container";
import { ROUTES } from "@/constants/route";
import CartSummary from "./CartSummary";

export default function CartContainer({
  initialCart,
}: {
  initialCart: BaseResponse<ICartResponse>;
}) {
  const {
    cartItems,
    updateQuantity,
    removeItem,
    syncCart,
    lastBuyNowItemId,
    setLastBuyNowItemId,
  } = useCartStore();
  const { showNotification } = useNotificationStore();

  const { data: userSession } = useSession();
  const { data: cartServer } = useGetCart(!!userSession?.data, initialCart);
  const { data: cartStock } = useGetCartStock(
    cartItems?.map((item) => item.skuId)
  );
  const breadcrumbsOptions = [
    { href: "/", label: "Trang chủ" },
    { href: ROUTES.CART, label: "Giỏ hàng" },
  ];

  const [selected, setSelected] = useState<number[]>([]);
  const [openRemoveItemDialog, setOpenRemoveItemDialog] = useState(false);
  const [subtractItem, setSubtractItem] = useState<{
    cartItemId: number;
    skuId: number;
    name: string;
    oldQty: number;
  } | null>(null);

  const debounceTimersRef = useRef<Record<number, NodeJS.Timeout>>({});
  const originalQtyRef = useRef<Record<number, number>>({});
  const isAllSelected =
    cartItems.length > 0 && selected.length === cartItems.length;

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

  useEffect(() => {
    if (lastBuyNowItemId) {
      setSelected([lastBuyNowItemId]);
      setLastBuyNowItemId(null);
    }
  }, [lastBuyNowItemId, setLastBuyNowItemId]);

  useEffect(() => {
    return () => {
      Object.values(debounceTimersRef.current).forEach((timer) =>
        clearTimeout(timer)
      );
    };
  }, []);

  const handleTriggerRemove = useCallback(
    (cartItemId: number, skuId: number, name: string, oldQty: number) => {
      setSubtractItem({ cartItemId, skuId, name, oldQty });
      setOpenRemoveItemDialog(true);
    },
    []
  );

  const handleUpdateQty = useCallback(
    async (
      skuId: number,
      name: string,
      newQty: number,
      oldQty: number,
      cartItemId?: number
    ) => {
      if (newQty === 0 && cartItemId) {
        handleTriggerRemove(cartItemId, skuId, name, oldQty);
        return;
      }

      if (originalQtyRef.current[skuId] === undefined) {
        originalQtyRef.current[skuId] = oldQty;
      }

      updateQuantity(skuId, newQty);

      if (debounceTimersRef.current[skuId]) {
        clearTimeout(debounceTimersRef.current[skuId]);
      }

      debounceTimersRef.current[skuId] = setTimeout(async () => {
        if (userSession?.data && cartItemId) {
          const response = await updateCartItemDB({
            id: cartItemId,
            quantity: newQty,
          });

          if (!response.success) {
            const fallbackQty = originalQtyRef.current[skuId];
            updateQuantity(skuId, fallbackQty);
            showNotification(
              response?.message || "Lỗi khi cập nhật giỏ hàng",
              "error"
            );
          }
          delete originalQtyRef.current[skuId];
          delete debounceTimersRef.current[skuId];
        }
      }, 500);
    },
    [updateQuantity, userSession?.data, showNotification, handleTriggerRemove]
  );

  const handleRemoveItem = useCallback(
    async (skuId: number, cartItemId?: number) => {
      removeItem(skuId);
      if (userSession?.data) {
        const backupCartItems = [...cartItems];

        if (cartItemId) {
          const response = await removeCartItemDB(cartItemId);

          if (!response.success) {
            syncCart(backupCartItems);
            showNotification(
              response?.message || "Lỗi khi cập nhật giỏ hàng",
              "error"
            );
          }
        }
      }
    },
    []
  );

  const handleSelectClick = useCallback(
    (event: React.MouseEvent<unknown>, id: number) => {
      event.stopPropagation();
      console.log("Clicked ID:", id);
      setSelected((prevSelected) => {
        const isSelected = prevSelected.includes(id);

        if (isSelected) {
          return prevSelected.filter((selectedId) => selectedId !== id);
        } else {
          return [...prevSelected, id];
        }
      });
    },
    []
  );

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

  const handleOkRemoveItemDialog = async () => {
    if (subtractItem) {
      // 1. Optimistic UI update: Remove it from Zustand instantly
      removeItem(subtractItem.skuId);

      // 2. Close the dialog right away
      setOpenRemoveItemDialog(false);

      // 3. Now, tell the database
      if (userSession?.data && subtractItem.cartItemId) {
        // (Assuming setting quantity to 0 is how your backend deletes items,
        // based on your previous code)
        const response = await updateCartItemDB({
          id: subtractItem.cartItemId,
          quantity: 0,
        });

        if (!response.success) {
          // If the DB fails, roll back by adding the item back to the UI
          updateQuantity(subtractItem.skuId, subtractItem.oldQty);
          showNotification(
            response?.message || "Lỗi khi xoá sản phẩm",
            "error"
          );
        }
      }
    }
  };

  const handleCloseRemoveItemDialog = () => {
    setOpenRemoveItemDialog(false);
    setSubtractItem(null); // Clear the memory
  };

  const totalAmount = useMemo(() => {
    return selected.reduce((total, skuId) => {
      const item = cartItems.find((i) => i.skuId === skuId);

      // If the item exists, add its total (price * qty) to the running total
      if (item) {
        return total + (item.sellingPrice ?? 0) * (item.quantity ?? 0);
      }

      return total;
    }, 0);
  }, [selected, cartItems]);

  return (
    <Box pt={2} pb={{ xs: 22, md: 4 }} minHeight={{ xs: "100vh", md: "" }}>
      <LayoutContainer>
        <Box sx={{ mb: 2 }}>
          <Breadcrumbs options={breadcrumbsOptions} />
        </Box>
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12, md: 8.5 }}>
            <Paper
              elevation={1}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "transparent",
              }}
            >
              <Grid2
                container
                alignItems="center"
                sx={{
                  py: { xs: 0, sm: 2 },
                  borderBottom: 1,
                  borderColor: "divider",
                  bgcolor: { xs: "transparent", md: "#fff" },
                }}
              >
                <Grid2 size={{ xs: 1.2, md: 1 }} textAlign={"center"}>
                  <Checkbox
                    checked={isAllSelected}
                    onChange={handleSelectAllClick}
                    size="small"
                    sx={{
                      color: "text.primary",
                      "&.Mui-checked": { color: "text.primary" },
                    }}
                  />
                </Grid2>
                <Grid2 size={2} sx={{ display: { xs: "grid", md: "none" } }}>
                  <Typography variant="body2" fontWeight="medium">
                    Tất cả
                  </Typography>
                </Grid2>
                <Grid2
                  size={{ xs: 7, md: 5 }}
                  sx={{ display: { xs: "none", md: "grid" } }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    Sản phẩm
                  </Typography>
                </Grid2>
                <Grid2
                  size={2}
                  textAlign="center"
                  sx={{ display: { xs: "none", md: "grid" } }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    Giá
                  </Typography>
                </Grid2>
                <Grid2
                  size={2}
                  textAlign="center"
                  sx={{ display: { xs: "none", md: "grid" } }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    Số lượng
                  </Typography>
                </Grid2>
                <Grid2
                  size={2}
                  textAlign="center"
                  sx={{ display: { xs: "none", md: "grid" } }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    Tuỳ chọn
                  </Typography>
                </Grid2>
              </Grid2>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  "& > *:not(:last-child)": {
                    borderBottom: 1,
                    borderColor: "divider",
                  },
                  bgcolor: "#fff",
                }}
              >
                {cartItems.length > 0 ? (
                  cartItems.map((item) => {
                    const isItemSelected = selected.includes(item.skuId);
                    const itemStockData = cartStock?.data?.find(
                      (stockItem) => stockItem.id === item.skuId
                    );

                    const currentStock = itemStockData?.quantity ?? 0;
                    return (
                      <CartItem
                        key={item.skuId}
                        checked={isItemSelected}
                        stock={currentStock}
                        item={item}
                        onUpdateQty={handleUpdateQty}
                        onRemove={handleRemoveItem}
                        onSelect={handleSelectClick}
                      />
                    );
                  })
                ) : (
                  <Box sx={{ p: 4, textAlign: "center" }}>
                    <Typography>Giỏ hàng của bạn đang trống</Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid2>

          <Grid2
            size={{ xs: 12, md: 3.5 }}
            sx={{
              position: { xs: "fixed", md: "unset" },
              bottom: { xs: 0, md: "auto" },
              top: { xs: "auto", md: 20 },
              left: { xs: 0, md: "auto" },
              right: { xs: 0, md: "auto" },
              height: "fit-content",
            }}
          >
            <CartSummary selected={selected} totalAmount={totalAmount} />
          </Grid2>
          <CustomDialog
            title="Bạn chắc chắn muốn bỏ sản phẩm này?"
            content={subtractItem?.name ? `Sản phẩm: ${subtractItem.name}` : ""}
            okContent="Có"
            cancelContent="Không"
            open={openRemoveItemDialog}
            handleOk={handleOkRemoveItemDialog}
            handleClose={handleCloseRemoveItemDialog}
          />
        </Grid2>
      </LayoutContainer>
    </Box>
  );
}
