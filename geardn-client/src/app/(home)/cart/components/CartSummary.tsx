import { ROUTES } from "@/constants/route";
import { ICartStoreItem } from "@/interfaces/ICart";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { useNotificationStore } from "@/stores/notification-store";
import { formatPrice } from "@/utils/format-price";
import { Button, Grid2, Paper, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  selected: number[];
  totalAmount: number;
}

const CartSummary = ({ selected, totalAmount }: Props) => {
  const router = useRouter();
  const { showNotification } = useNotificationStore();
  const { setCheckoutCart } = useAuthStore((state) => state);
  const { cartItems } = useCartStore();
  const handlePayBtn = () => {
    if (selected.length === 0) {
      return showNotification("Vui lòng chọn sản phẩm", "warning");
    }
    const selectedItems = selected
      .map((skuId) => cartItems?.find((item) => item.skuId === skuId))
      ?.filter((item): item is ICartStoreItem => item !== undefined);
    setCheckoutCart(selectedItems);
    router.push(ROUTES.CHECKOUT);
  };
  return (
    <Paper
      sx={{
        p: { xs: 1.5, md: 3 },
        borderRadius: { xs: 0, md: 1 },
        boxShadow: { xs: 10, md: 1 },
      }}
    >
      <Grid2 className="total">
        <Grid2
          size={12}
          mb={{ xs: 0.5, md: 2 }}
          className="total-price-label"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
            Tổng cộng:
          </Typography>
          <Typography sx={{ fontSize: 14 }}>
            {selected?.length} sản phẩm
          </Typography>
        </Grid2>
        <Grid2
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: { xs: 1, md: 2 },
          }}
          size={12}
          className="total-price-cost"
        >
          <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
            Thành tiền:
          </Typography>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
              color: "primary.main",
            }}
          >
            {formatPrice(totalAmount)}
          </Typography>
        </Grid2>
        <Button
          sx={{ mb: { xs: 1, md: 1.5 }, fontWeight: 600 }}
          aria-label="Thanh toán"
          variant="contained"
          size="large"
          fullWidth
          onClick={handlePayBtn}
        >
          Thanh toán
        </Button>
        <Button
          sx={{ fontWeight: 600 }}
          aria-label="Tiếp tục mua hàng"
          variant="outlined"
          size="large"
          fullWidth
          component={Link}
          href="/"
        >
          Tiếp tục mua hàng
        </Button>
      </Grid2>
    </Paper>
  );
};

export default CartSummary;
