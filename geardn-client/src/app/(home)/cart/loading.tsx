"use client"; // Skeletons usually need to be client components for MUI animations

import {
  Box,
  Button,
  Checkbox,
  Grid2,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import LayoutContainer from "@/components/layout-container"; // Adjust import path if needed
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { ROUTES } from "@/constants/route";
import Link from "next/link";

export default function CartLoading() {
  const breadcrumbsOptions = [
    { href: "/", label: "Trang chủ" },
    { href: ROUTES.CART, label: "Giỏ hàng" },
  ];
  return (
    <Box
      pt={2}
      pb={{ xs: 22, md: 4 }}
      bgcolor={"#F3F4F6"}
      minHeight={{ xs: "100vh", md: "" }}
    >
      <LayoutContainer>
        <Box sx={{ mb: 2 }}>
          <Breadcrumbs options={breadcrumbsOptions} />
        </Box>

        <Grid2 container spacing={3}>
          {/* Main Cart Area Skeleton (matches your md: 8.5) */}
          <Grid2 size={{ xs: 12, md: 8.5 }}>
            <Paper
              elevation={1}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "transparent",
              }}
            >
              {/* Header Row Skeleton */}
              <Grid2
                container
                spacing={2}
                alignItems="center"
                sx={{
                  p: { xs: 0, sm: 2 },
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Grid2 size={{ xs: 1.2, sm: 1 }} textAlign="center">
                  <Checkbox
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
                <Grid2 size={5} sx={{ display: { xs: "none", sm: "block" } }}>
                  <Typography variant="body2" fontWeight="medium">
                    Sản phẩm
                  </Typography>
                </Grid2>
                <Grid2
                  size={2}
                  textAlign="center"
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    Giá
                  </Typography>
                </Grid2>
                <Grid2
                  size={2}
                  textAlign="center"
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    Số lượng
                  </Typography>
                </Grid2>
                <Grid2
                  size={2}
                  textAlign="center"
                  sx={{ display: { xs: "none", sm: "block" } }}
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
                  bgcolor: "#fff",
                }}
              >
                {[1, 2, 3].map((item) => (
                  <Grid2
                    key={item}
                    container
                    alignItems="center"
                    sx={{ px: { xs: 0, md: 2 }, py: { xs: 2, md: 2 } }}
                  >
                    <Grid2 size={{ xs: 1.2, md: 1 }}>
                      <Skeleton
                        variant="rectangular"
                        sx={{
                          width: { xs: 16, md: 20 },
                          height: { xs: 16, md: 20 },
                          mx: { xs: "10px", md: "auto" },
                        }}
                      />
                    </Grid2>

                    <Grid2 size={5}>
                      <Box display="flex" gap={2}>
                        <Box sx={{ display: "flex" }}>
                          <Skeleton
                            variant="rectangular"
                            width={80}
                            height={80}
                            sx={{ mr: { xs: 1.2, md: 2 } }}
                          />
                          <Box>
                            <Skeleton
                              variant="text"
                              sx={{ width: { xs: 240, md: 400 }, height: 24 }}
                            />
                            <Skeleton
                              variant="text"
                              sx={{ width: { xs: 100, md: 400 }, height: 24 }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Grid2>
                  </Grid2>
                ))}
              </Box>
            </Paper>
          </Grid2>

          {/* Cart Summary Sidebar Skeleton (matches your md: 3.5) */}
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
                  <Typography sx={{ fontSize: 14 }}>0 sản phẩm</Typography>
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
                    0đ
                  </Typography>
                </Grid2>
                <Button
                  sx={{ mb: { xs: 1, md: 1.5 }, fontWeight: 600 }}
                  aria-label="Thanh toán"
                  variant="contained"
                  size="large"
                  fullWidth
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
          </Grid2>
        </Grid2>
      </LayoutContainer>
    </Box>
  );
}
