import Link from "next/link";

import { Box, Button, Divider, Grid2, Typography } from "@mui/material";

import { formatPrice } from "@/utils/format-price";

import "react-datepicker/dist/react-datepicker.css";

interface Props {
  isCreateOrderLoading: boolean;
  totalAmount: number;
  onSubmitOrder: () => void;
}

const CheckoutSummary = ({
  isCreateOrderLoading,
  totalAmount,
  onSubmitOrder,
}: Props) => {
  return (
    <Grid2
      size={{ xs: 12, md: 3.5 }}
      sx={{
        position: { xs: "fixed", md: "sticky" },
        bottom: { xs: 0, md: "auto" },
        left: { xs: 0, md: "auto" },
        right: { xs: 0, md: "auto" },
        zIndex: 1100,
        top: { xs: "auto", md: 100 },
        height: "fit-content",

        bgcolor: "#fff",
        borderRadius: { xs: "0", md: "4px" },
        boxShadow: { xs: 10, md: "none" },
        p: { xs: 1.5, md: 2 },
      }}
    >
      <Typography
        sx={{ mb: { xs: 1, md: 2 }, fontSize: 18, fontWeight: 700 }}
        className="total-price-label"
      >
        Thông tin đơn hàng
      </Typography>

      <Box className="total">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="total-price-cost"
        >
          <Typography sx={{ fontSize: 13 }}>Tổng tiền:</Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
            {formatPrice(totalAmount)}
          </Typography>
        </Box>
        <Divider sx={{ mt: { xs: 1, md: 2 }, mb: 1 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: { xs: 1.5, md: 2 },
          }}
        >
          <Typography sx={{ fontSize: 13 }}>Phí vận chuyển:</Typography>
          <Typography sx={{ fontSize: 13 }}>{"Miễn phí <3km"}</Typography>
        </Box>
        <Button
          sx={{ mb: 1.5, fontWeight: 600 }}
          aria-label="Thanh toán"
          variant="contained"
          size="large"
          fullWidth
          disabled={isCreateOrderLoading}
          onClick={onSubmitOrder}
        >
          {isCreateOrderLoading ? "Đang xử lý..." : "Thanh toán"}
        </Button>
        <Button
          aria-label="Tiếp tục mua hàng"
          sx={{ fontWeight: 600 }}
          component={Link}
          href="/"
          variant="outlined"
          size="large"
          fullWidth
        >
          Tiếp tục mua hàng
        </Button>
      </Box>
    </Grid2>
  );
};

export default CheckoutSummary;
