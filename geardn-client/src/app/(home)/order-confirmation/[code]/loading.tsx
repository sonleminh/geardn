"use client"; // Skeletons usually need to be client components for MUI animations

import ORDER_SUCCESS from "@/assets/order-success.png";
import SkeletonImage from "@/components/common/SkeletonImage";
import LayoutContainer from "@/components/layout-container"; // Adjust import path if needed
import {
  Box,
  Button,
  Divider,
  Grid2,
  Skeleton,
  Typography,
} from "@mui/material";
import Link from "next/link";

export default function OrderConfirmationLoading() {
  return (
    <Box pt={2} pb={4} bgcolor={"#eee"}>
      <LayoutContainer>
        <Box sx={{ position: "relative", mb: 2 }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: "250px" },
              overflow: "hidden",
              borderRadius: 1,
              "& img": {
                objectFit: "cover",
              },
              ":before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(to bottom, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.7) 100%)",
                filter: "blur(8px)",
                zIndex: 1,
              },
            }}
          >
            <SkeletonImage
              src={"/geardn.webp"}
              alt="Hình ảnh banner chính của trang web GearDN"
              fill
              quality={90}
              priority
            />
          </Box>
          <Box
            sx={{
              position: "absolute",
              right: "50%",
              top: "50%",
              transform: "translate(50%, -50%)",
              zIndex: 2,
              width: { xs: "80%", md: "60%" },
              p: { xs: "12px 12px", md: "20px 20px" },
              bgcolor: "#fff",
              borderRadius: 1,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{ mb: 0.5, fontSize: 18, fontWeight: 600, color: "#5F8F20" }}
            >
              Đặt hàng thành công!
            </Typography>
            <Typography sx={{ mb: 1, fontSize: { xs: 14, md: 16 } }}>
              Cửa hàng sẽ liên hệ với bạn trong vòng 5-10 phút để xác nhận đơn
              hàng.
            </Typography>
            <Box
              sx={{
                position: "relative",
                width: { xs: "48px", md: "60px" },
                height: { xs: "48px", md: "60px" },
                margin: "0 auto",
                overflow: "hidden",
                "& img": {
                  objectFit: "cover",
                },
              }}
            >
              <SkeletonImage
                src={ORDER_SUCCESS}
                alt="Hình ảnh mô tả đơn hàng đã đặt thành công"
                fill
                quality={90}
                priority
              />
            </Box>
          </Box>
        </Box>
        <Grid2 container spacing={2}>
          <Grid2 sx={{}} size={{ xs: 12, md: 8.5 }}>
            <Box sx={{ p: 2, mb: 1, bgcolor: "#fff", borderRadius: "4px" }}>
              <Skeleton
                variant="text"
                sx={{ width: { xs: 200, md: 300 }, height: 24 }}
              />

              {[1, 2].map((item, orderItemIndex) => (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    pt: 2,
                    borderTop:
                      orderItemIndex !== 0 ? "1px solid #f3f4f6" : "none",
                  }}
                  key={orderItemIndex}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      sx={{
                        width: { xs: 48, md: 60 },
                        height: { xs: 48, md: 60 },
                        mr: { xs: 1, md: 2 },
                      }}
                    />
                    <Box>
                      <Skeleton
                        variant="text"
                        sx={{ width: { xs: 240, md: 500 }, height: 24 }}
                      />
                      <Skeleton
                        variant="text"
                        sx={{ width: { xs: 100, md: 200 }, height: 24 }}
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box sx={{ p: 2, mb: 1, bgcolor: "#fff", borderRadius: "4px" }}>
              <Typography sx={{ mb: 1, fontWeight: 600 }}>
                Thông tin đặt hàng:
              </Typography>
              <Box
                sx={{
                  p: 1,
                  border: "1px solid #d1d5db",
                  borderRadius: 2,
                  "& p": {
                    fontSize: 15,
                  },
                }}
              >
                <Skeleton
                  variant="text"
                  sx={{ width: { xs: 240, md: 400 }, height: 24 }}
                />
                <Skeleton
                  variant="text"
                  sx={{ width: { xs: 240, md: 200 }, height: 24 }}
                />
              </Box>
            </Box>
            <Box sx={{ p: 2, mb: 2, bgcolor: "#fff", borderRadius: "4px" }}>
              <Typography sx={{ mb: 1, fontWeight: 600 }}>
                Hình thức nhận hàng:
              </Typography>
              <Box
                sx={{
                  p: 1,
                  mb: 1,
                  border: "1px solid #d1d5db",
                  borderRadius: 2,
                }}
              >
                <Skeleton variant="text" sx={{ width: 150, height: 24 }} />
                <Skeleton
                  variant="text"
                  sx={{ width: { xs: 240, md: 500 }, height: 24 }}
                />
              </Box>
              <Box
                sx={{
                  p: 1,
                  mb: 1,
                  border: "1px solid #d1d5db",
                  borderRadius: 2,
                }}
              >
                <Skeleton variant="text" sx={{ width: 150, height: 24 }} />
                <Skeleton
                  variant="text"
                  sx={{ width: { xs: 240, md: 300 }, height: 24 }}
                />
              </Box>
              <Box
                sx={{
                  p: 1,

                  border: "1px solid #d1d5db",
                  borderRadius: 2,
                }}
              >
                <Skeleton variant="text" sx={{ width: 150, height: 24 }} />
                <Skeleton
                  variant="text"
                  sx={{ width: { xs: 240, md: 400 }, height: 24 }}
                />
              </Box>
            </Box>
            <Box sx={{ p: 2, mb: 1, bgcolor: "#fff", borderRadius: "4px" }}>
              <Typography sx={{ mb: 1, fontWeight: 600 }}>
                Phương thức thanh toán:
              </Typography>
              <Skeleton
                variant="text"
                sx={{ width: { xs: 240, md: 400 }, height: 24 }}
              />
            </Box>
          </Grid2>
          <Grid2
            sx={{
              position: "sticky",
              top: 100,
              right: 0,
              height: "100%",
              bgcolor: "#fff",
              borderRadius: "4px",
            }}
            size={{ xs: 12, md: 3.5 }}
            p={2}
          >
            <Typography
              sx={{ mb: 2, fontSize: 18, fontWeight: 700 }}
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
                  mb: 1,
                }}
              >
                <Skeleton variant="text" sx={{ width: 100, height: 24 }} />
                <Skeleton variant="text" sx={{ width: 100, height: 24 }} />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                className="total-price-cost"
              >
                <Skeleton variant="text" sx={{ width: 100, height: 24 }} />
                <Skeleton variant="text" sx={{ width: 100, height: 24 }} />
              </Box>
              <Divider sx={{ mt: 2, mb: 1 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography sx={{ fontSize: 13 }}>Phí vận chuyển:</Typography>
                <Typography sx={{ fontSize: 13 }}>{"Miễn phí <3km"}</Typography>
              </Box>
              <Button
                aria-label="Về trang chủ"
                sx={{ fontWeight: 600 }}
                component={Link}
                href="/"
                variant="outlined"
                size="large"
                fullWidth
              >
                Về trang chủ
              </Button>
            </Box>
          </Grid2>
        </Grid2>
      </LayoutContainer>
    </Box>
  );
}
