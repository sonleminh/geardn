'use client';

import {
  Box,
  Button,
  Grid2,
  List,
  ListItem,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import LayoutContainer from '../layout-container';
import LOGO from '@/assets/geardn-logo.png';
import SearchIcon from '@mui/icons-material/Search';
import SkeletonImage from '../../SkeletonImage';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useAuthStore } from '@/providers/auth-store-provider';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AppLink from '../../AppLink';
import { HeaderStyle } from './style';
import { logoutAPI } from '@/services/auth/api';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore((state) => state);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const result = await logoutAPI();
    if (result?.statusCode === 200) {
      logout();
      router.push('/login');
    }
  };

  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (user === null) {
      router.push('/login');
    } else {
      setAnchorEl(event.currentTarget);
    }
  };
  return (
    <Box sx={HeaderStyle(pathname)}>
      <Grid2 container height={80}>
        <Grid2 size={4.5} sx={{ display: 'flex', alignItems: 'center' }}>
          <Box component={AppLink} href={'/'} className='header-logo'>
            <SkeletonImage src={LOGO} alt='geardn' fill unoptimized={true} />
          </Box>
        </Grid2>
        <Grid2 size={3} sx={{ display: 'flex', alignItems: 'center' }}>
          <List
            sx={{
              display: 'flex',
              width: '100%',
              '> li': {
                justifyContent: 'center',
              },
            }}>
            <ListItem>Shop</ListItem>
            <ListItem>Blog</ListItem>
            <ListItem>Contact</ListItem>
          </List>
        </Grid2>
        <Grid2 size={4.5} sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
              width: '100%',
            }}>
            <SearchIcon />
            <ShoppingCartOutlinedIcon sx={{ ml: 2.5 }} />
            {user !== null ? (
              user?.picture ? (
                <Button
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    handleUserClick(e)
                  }
                  className='user-avatar'
                  sx={{}}>
                  <SkeletonImage src={user?.picture} alt='geardn' fill />
                </Button>
              ) : (
                <Button onClick={handleUserClick} className='usernname-icon'>
                  <AccountCircleIcon sx={{ fontSize: 36 }} /> {user?.name}
                </Button>
              )
            ) : (
              <Button onClick={handleUserClick} className='user-icon'>
                <AccountCircleIcon sx={{ fontSize: 36 }} />
              </Button>
            )}
            <Menu
              id='basic-menu'
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              disableScrollLock={true}>
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
            </Menu>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Header;
