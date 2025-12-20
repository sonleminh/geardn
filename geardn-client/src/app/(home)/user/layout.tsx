import React, { Suspense } from "react";

import { Box, Grid2 } from "@mui/material";

import { getUserOnServer } from "@/data/profile.server";

import { LoadingCircle } from "@/components/common/LoadingCircle";
import LayoutContainer from "@/components/layout-container";
import Sidebar from "./components/sidebar";
import { ROUTES } from "@/constants/route";
import Breadcrumbs from "@/components/common/Breadcrumbs";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userData = await getUserOnServer();

  const breadcrumbsOptions = [
    { href: "/", label: "Trang chủ" },
    { href: ROUTES.ACCOUNT, label: "Tài khoản" },
  ];

  return (
    <Suspense fallback={<LoadingCircle />}>
      <Box pt={{ xs: 0, md: 2 }} pb={4} bgcolor={"#F3F4F6"}>
        <LayoutContainer>
          <Box sx={{ mb: 2 }}>
            <Breadcrumbs options={breadcrumbsOptions} />
          </Box>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 2 }}>
              <Sidebar userData={userData?.data} />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 10 }}>{children}</Grid2>
          </Grid2>
        </LayoutContainer>
      </Box>
    </Suspense>
  );
}
