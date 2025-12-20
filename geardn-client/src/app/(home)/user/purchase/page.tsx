"use client";

import React, { useState } from "react";
import { Box, CircularProgress, Tab, Tabs } from "@mui/material";
import PurchaseList from "./components/PurchaseList";
import { useUserPurchases } from "@/queries/order";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const Purchase = () => {
  const [type, setType] = useState(0);
  const { data: userPurchases, isLoading } = useUserPurchases({ type });
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setType(newValue);
  };

  return (
    <Box sx={{ bgcolor: "" }}>
      <Box sx={{ width: "100%" }}>
        <Box>
          <Tabs
            value={type}
            onChange={handleChange}
            sx={{
              mb: 1,
              bgcolor: "#fff",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              ".MuiTabs-scroller": {
                overflowX: "auto !important",
              },
              button: {
                width: { xs: "auto", md: "16.6666667%" },
                fontSize: { xs: 13, md: 16 },
              },
            }}
          >
            <Tab label="Tất cả" {...a11yProps(0)} />
            <Tab label="Chờ xác nhận" {...a11yProps(1)} />
            <Tab label="Đang xử lý" {...a11yProps(2)} />
            <Tab label="Đang giao" {...a11yProps(3)} />
            <Tab label="Hoàn thành" {...a11yProps(4)} />
            <Tab label="Đã huỷ" {...a11yProps(5)} />
          </Tabs>
        </Box>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <CustomTabPanel key={index} value={type} index={index}>
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: 400,
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <PurchaseList orders={userPurchases?.data || []} />
            )}
          </CustomTabPanel>
        ))}
      </Box>
    </Box>
  );
};

export default Purchase;
