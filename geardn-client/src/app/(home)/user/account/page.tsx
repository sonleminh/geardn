'use client';

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
} from '@mui/material';
import { useSession } from '@/hooks/useSession';

const Account = () => {
  const { data } = useSession();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        p: '20px 24px',
        bgcolor: '#fff',
      }}>
      <Box sx={{ width: '68%', pr: 2 }}>
        <Box>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 600,
              textTransform: 'capitalize',
            }}>
            Hồ sơ của tôi
          </Typography>
          <Typography
            sx={{
              mb: 2,
              fontSize: 14,
            }}>
            Quản lý thông tin hồ sơ để bảo mật tài khoản
          </Typography>
        </Box>
        <Divider />

        <TableContainer sx={{ overflow: 'unset' }}>
          <Table
            sx={{
              minWidth: 500,
              '.MuiTableCell-root': {
                borderBottom: 'none',
              },
            }}
            aria-labelledby='tableTitle'>
            <TableBody>
              <TableRow>
                <TableCell width={'30%'} align='right'>
                  Email
                </TableCell>
                <TableCell align='left'>{data?.data?.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align='right'>Tên</TableCell>
                <TableCell align='left'>{data?.data?.name}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box
        sx={{
          width: '25%',
          borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
        }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '180px',
            m: '0 auto',
          }}>
          <Avatar
            alt='Remy Sharp'
            src='https://down-vn.img.susercontent.com/file/f1001ba33eca96416ee5e1e82e784151'
            sx={{ width: '80px', height: '80px', mb: 2 }}
          />
          <Button
            variant='outlined'
            sx={{ mb: 1.5, fontSize: 14, textTransform: 'none' }}>
            Chọn ảnh
          </Button>
          <Typography sx={{ fontSize: 14 }}>
            Dụng lượng file tối đa 1 MB Định dạng:.JPEG, .PNG
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Account;
