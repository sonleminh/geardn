"use client";

import {
  Avatar,
  Box,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { useSession } from "@/hooks/useSession";

const Account = () => {
  const { data } = useSession();
  return (
    <Box sx={{ bgcolor: "#fff", borderRadius: "4px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          p: { xs: 2, md: 2 },
        }}
      >
        <Box sx={{ width: { xs: "65%", md: "68%" }, pr: 2, bgcolor: "#fff" }}>
          <Box>
            <Typography
              sx={{
                fontSize: { xs: 16, md: 18 },
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              Hồ sơ của tôi
            </Typography>
            <Typography
              sx={{
                mb: 2,
                fontSize: { xs: 12, md: 14 },
              }}
            >
              Quản lý thông tin hồ sơ để bảo mật tài khoản
            </Typography>
          </Box>
          <Divider />

          <TableContainer sx={{ overflow: "unset" }}>
            <Table
              sx={{
                minWidth: { xs: 200, md: 500 },
                ".MuiTableCell-root": {
                  borderBottom: "none",
                },
              }}
              aria-labelledby="tableTitle"
            >
              <TableBody>
                <TableRow>
                  <TableCell width={"30%"} align="right">
                    Email
                  </TableCell>
                  <TableCell align="left">{data?.data?.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Tên</TableCell>
                  <TableCell align="left">{data?.data?.name}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box
          sx={{
            width: { xs: "35%", md: "25%" },
            px: { xs: 2, md: 0 },
            borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
            bgcolor: "#fff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: { xs: "auto", md: "180px" },
              m: "0 auto",
            }}
          >
            <Avatar
              alt="Remy Sharp"
              src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
              sx={{
                width: { xs: "60px", md: "80px" },
                height: { xs: "60px", md: "80px" },
                mb: 2,
              }}
            />
            <Button
              variant="outlined"
              disabled
              sx={{
                mb: 1.5,
                fontSize: { xs: 12, md: 14 },
                textTransform: "none",
              }}
            >
              Chọn ảnh
            </Button>
            <Typography sx={{ fontSize: { xs: 12, md: 14 } }}>
              Dụng lượng file tối đa 1 MB Định dạng: .JPEG, .PNG
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Account;
