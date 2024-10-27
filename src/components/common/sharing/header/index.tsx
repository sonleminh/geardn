'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import AppLink from '../../AppLink';
import SkeletonImage from '../../SkeletonImage';

import { useAuthStore } from '@/providers/auth-store-provider';
import { logoutAPI } from '@/services/auth/api';

import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
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

import LOGO from '@/assets/geardn-logo.png';
import { HeaderStyle } from './style';

const Header = ({ showHeader }: { showHeader: boolean }) => {
  const router = useRouter();
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
    <Box sx={HeaderStyle(showHeader)}>
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
            <Button sx={{ minWidth: 40, height: 40, ml: 2 }}>
              <ShoppingCartOutlinedIcon
                onClick={() => {
                  user !== null ? router.push('/cart') : router.push('/login');
                }}
              />
            </Button>
            {user !== null ? (
              user?.picture ? (
                <Button
                  sx={{
                    width: 40,
                    minWidth: 40,
                    height: 40,
                    ml: 1,
                    textAlign: 'center',
                  }}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    handleUserClick(e)
                  }>
                  <Box className='user-avatar'>
                    <SkeletonImage src={user?.picture} alt='geardn' fill />
                  </Box>
                </Button>
              ) : (
                <Button
                  sx={{ minWidth: 40, height: 40 }}
                  className='usernname-icon'
                  onClick={handleUserClick}>
                  <AccountCircleIcon sx={{ mr: 0.5, ml: 1.5, fontSize: 32 }} />
                  <Typography sx={{ fontSize: 14, textTransform: 'none' }}>
                    {user?.name}
                  </Typography>
                </Button>
              )
            ) : (
              <Button
                sx={{ width: 40, minWidth: 40, height: 40, ml: 1 }}
                className='user-icon'
                onClick={handleUserClick}>
                <AccountCircleIcon sx={{ fontSize: 30 }} />
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
