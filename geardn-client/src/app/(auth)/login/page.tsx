"use client";

import { Box, Grid2 } from "@mui/material";

import SkeletonImage from "@/components/common/SkeletonImage";
import LoginForm from "./components/LoginForm";
import { Suspense } from "react";
import LoginFormSkeleton from "./components/LoginFormSkeleton";

const LoginPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100dvh",
        bgcolor: "#D7D6D9",
      }}
    >
      <Box
        sx={{
          width: { xs: "90%", md: "1000px" },
          mx: "auto",
          bgcolor: "#fff",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Grid2 container spacing={{ xs: 0, md: 4 }}>
          <Grid2 size={{ xs: 0, md: 6 }}>
            <Box
              sx={{
                position: "relative",
                display: { xs: "none", md: "block" },
                width: "100%",
                height: { xs: "300px", md: "500px" },
                overflow: "hidden",
                "& img": {
                  objectFit: "cover",
                },
              }}
            >
              <SkeletonImage
                src={"/setup-background.jpg"}
                alt="Hình ảnh background mô tả không gian setup GearDN"
              />
            </Box>
          </Grid2>
          <Grid2
            size={{ xs: 12, md: 6 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: { xs: "20px 40px 20px 40px", md: "20px 40px 20px 0" },
            }}
          >
            <Suspense fallback={<LoginFormSkeleton />}>
              <LoginForm />
            </Suspense>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default LoginPage;
