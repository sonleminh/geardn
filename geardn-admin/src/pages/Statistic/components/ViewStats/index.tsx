import { format, subDays } from "date-fns";
import { vi } from "date-fns/locale";
import React, { useCallback, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import { RangeKeyDict } from "react-date-range";
import { useNavigate } from "react-router-dom";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import DevicesIcon from "@mui/icons-material/Devices";
import LanguageIcon from "@mui/icons-material/Language";
import LinkIcon from "@mui/icons-material/Link";
import PagesIcon from "@mui/icons-material/Pages";

import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import DateRangeMenu from "@/components/DateRangeMenu";
import { ROUTES } from "@/constants/route";
import { IDailyViewStat } from "@/interfaces/IStats";
import {
  useGetDailyViewStats,
  useGetViewSummaryStats,
} from "@/services/statistic";

interface SummaryTableProps {
  title: string;
  icon: React.ReactNode;
  data: any[];
  type: "page" | "common";
  metricLabel: string;
}

const SummaryTable: React.FC<SummaryTableProps> = ({
  title,
  icon,
  data = [],
  type,
  metricLabel,
}) => {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              mr: 1.5,
              display: "flex",
              p: 1,
              bgcolor: "primary.light",
              color: "primary.main",
              borderRadius: 1,
              opacity: 0.8,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 300 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", width: 50 }}>#</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Tên</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {metricLabel}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Chưa có dữ liệu
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {type === "page" ? (
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: 200,
                            }}
                            title={row.title}
                          >
                            {row.title || "(Không có tiêu đề)"}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", fontSize: 11 }}
                          >
                            {row.path}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {row.name || "(Không xác định)"}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={type === "page" ? row.views : row.value}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

const ViewStats: React.FC = () => {
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState<
    [{ startDate: Date; endDate: Date; key: string }]
  >([
    {
      startDate: subDays(new Date(), 7),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { data: dailyViewStatsData } = useGetDailyViewStats({
    fromDate: dateRange[0].startDate,
    toDate: dateRange[0].endDate,
  });

  const { data: viewSummaryStats } = useGetViewSummaryStats({
    fromDate: dateRange[0].startDate,
    toDate: dateRange[0].endDate,
  });

  const chartData = useMemo(() => {
    if (!dailyViewStatsData) {
      return {
        labels: [],
        datasets: [],
      };
    }
    const labels = dailyViewStatsData?.data?.viewStats?.map(
      (item: IDailyViewStat) =>
        format(new Date(item?.date), "dd/MM", { locale: vi })
    );

    return {
      labels,
      datasets: [
        {
          label: "Lượt truy cập",
          data: dailyViewStatsData?.data?.viewStats.map(
            (item: IDailyViewStat) => item?.views
          ),
          fill: true,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "#000)",
          tension: 0.4,
        },
      ],
    };
  }, [dailyViewStatsData]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: false },
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true },
      },
    }),
    []
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget),
    []
  );
  const handleClose = useCallback(() => setAnchorEl(null), []);
  const handleDateSelect = useCallback(
    (daysAgo: number) => {
      const endDate = new Date();
      const startDate = subDays(new Date(), daysAgo);
      setDateRange([{ startDate, endDate, key: "selection" }]);
      handleClose();
    },
    [handleClose]
  );
  const handleDateRangeChange = useCallback((rangesByKey: RangeKeyDict) => {
    const selection = rangesByKey.selection;
    if (selection.startDate && selection.endDate) {
      setDateRange([
        {
          startDate: selection.startDate,
          endDate: selection.endDate,
          key: "selection",
        },
      ]);
    }
  }, []);

  const getDateDisplayText = useCallback(() => {
    const { startDate, endDate } = dateRange[0];
    if (!startDate || !endDate) return "Chọn ngày";
    return `${format(startDate, "dd/MM/yyyy", { locale: vi })} - ${format(
      endDate,
      "dd/MM/yyyy",
      { locale: vi }
    )}`;
  }, [dateRange]);

  return (
    <>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate(ROUTES.DASHBOARD)}
          sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <HomeOutlinedIcon sx={{ fontSize: 24 }} />
        </Link>
        <Typography color="text.primary">Thống kê</Typography>
        <Typography color="text.primary">Lượt truy cập</Typography>
      </Breadcrumbs>

      <Card>
        <CardContent>
          {/* --- HEADER & FILTER --- */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
                Tổng quan truy cập
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dữ liệu thống kê từ Google Analytics
              </Typography>
            </Box>

            <Button
              variant="outlined"
              onClick={handleClick}
              endIcon={<KeyboardArrowDownIcon />}
              sx={{ minWidth: 200, textTransform: "none" }}
            >
              {getDateDisplayText()}
            </Button>
          </Box>

          {/* --- KPI SUMMARY (Total Views) --- */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "primary.50",
                  borderStyle: "dashed",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  TỔNG LƯỢT XEM TRANG
                </Typography>
                <Typography
                  variant="h3"
                  color="primary"
                  sx={{ fontWeight: 700 }}
                >
                  {dailyViewStatsData?.data?.totals?.views?.toLocaleString() ||
                    0}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <DateRangeMenu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onSelect={handleDateSelect}
            dateRange={dateRange}
            onRangeChange={handleDateRangeChange}
          />

          {/* --- BIỂU ĐỒ --- */}
          <Box sx={{ width: "100%", height: 350, mb: 4 }}>
            <Line data={chartData} options={chartOptions} />
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* --- PHẦN MỚI: GRID SUMMARY --- */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Chi tiết phân tích
            </Typography>
            <Grid container spacing={3}>
              {/* 1. Top Pages */}
              <Grid item xs={12} md={6}>
                <SummaryTable
                  title="Top Trang xem nhiều"
                  icon={<PagesIcon fontSize="small" />}
                  data={viewSummaryStats?.data?.topPages || []}
                  type="page"
                  metricLabel="Lượt xem"
                />
              </Grid>

              {/* 2. Top Sources */}
              <Grid item xs={12} md={6}>
                <SummaryTable
                  title="Nguồn truy cập"
                  icon={<LinkIcon fontSize="small" />}
                  data={viewSummaryStats?.data?.topSources || []}
                  type="common"
                  metricLabel="Phiên"
                />
              </Grid>

              {/* 3. Top Devices */}
              <Grid item xs={12} md={6}>
                <SummaryTable
                  title="Thiết bị sử dụng"
                  icon={<DevicesIcon fontSize="small" />}
                  data={viewSummaryStats?.data?.topDevices || []}
                  type="common"
                  metricLabel="Người dùng"
                />
              </Grid>

              {/* 4. Top Locations */}
              <Grid item xs={12} md={6}>
                <SummaryTable
                  title="Khu vực (Tỉnh/TP)"
                  icon={<LanguageIcon fontSize="small" />}
                  data={viewSummaryStats?.data?.topLocations || []}
                  type="common"
                  metricLabel="Người dùng"
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default ViewStats;
