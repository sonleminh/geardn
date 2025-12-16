'use client';

import EditIcon from '@mui/icons-material/Edit';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import { Avatar, Box, Divider, Typography } from '@mui/material';

import AppLink from '@/components/common/AppLink';

import { ROUTES } from '@/constants/route';
import { IUser } from '@/interfaces/IUser';

const Sidebar = ({ userData }: { userData: IUser | undefined }) => {
  return (
    <>
      <Box
        sx={{
          p: '20px 0',
        }}>
        <Box sx={{ display: 'flex' }}>
          <Avatar
            alt='Remy Sharp'
            src='https://down-vn.img.susercontent.com/file/f1001ba33eca96416ee5e1e82e784151'
            sx={{ width: '24px', height: '24px', mr: 2 }}
          />
          <Box>
            <Typography sx={{ mb: '2px', fontSize: 14, fontWeight: 600 }}>
              {userData?.name}
            </Typography>
            <Box sx={{ display: 'flex', color: '#888' }}>
              <EditIcon sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: 14 }}>Sửa hồ sơ</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          pt: 1,
          a: {
            display: 'flex',
            alignItems: 'center',
            p: '6px 0',
            svg: { mr: 1 },
            '& p': {
              textAlign: 'start',
              fontSize: 14,
              fontWeight: 500,
            },
          },
        }}>
        <Box component={AppLink} href={ROUTES.PURCHASE}>
          <NotificationsNoneOutlinedIcon />
          <Typography>Thông báo</Typography>
        </Box>
        <Box component={AppLink} href={ROUTES.ACCOUNT}>
          <Person2OutlinedIcon />
          <Typography>Tài khoản của tôi</Typography>
        </Box>
        <Box component={AppLink} href={ROUTES.PURCHASE}>
          <ListAltOutlinedIcon />
          <Typography>Đơn mua</Typography>
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;
