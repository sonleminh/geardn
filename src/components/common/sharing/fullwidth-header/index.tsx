'use client';

import LOGO from '@/assets/geardn-logo.png';
import { useAuthStore } from '@/providers/auth-store-provider';
import { logoutAPI } from '@/services/auth/api';
import { useGetCart } from '@/services/cart/api';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
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
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import AppLink from '../../AppLink';
import SkeletonImage from '../../SkeletonImage';
import LayoutContainer from '../layout-container';
import { FullWidthHeaderStyle } from './style';
import { ROUTES } from '@/constants/route';
import Link from 'next/link';

const FullWidthHeader = ({
  showFullWidthHeader,
}: {
  showFullWidthHeader: boolean;
}) => {
  const router = useRouter();
  const { cart, isLoading } = useGetCart();
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
      router.push(ROUTES.LOGIN);
    }
  };

  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (user === null) {
      router.push(ROUTES.LOGIN);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };
  return (
    <Box sx={FullWidthHeaderStyle(pathname, showFullWidthHeader)}>
      <LayoutContainer>
        <Grid2 container height={80} px={3}>
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
              <Button
                sx={{ position: 'relative', minWidth: 40, height: 40, ml: 2 }}
                onClick={() => {
                  user !== null
                    ? router.push(ROUTES.CART)
                    : router.push('/login');
                }}>
                <ShoppingCartOutlinedIcon />
                <Typography
                  sx={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '20px',
                    height: '20px',
                    borderRadius: 10,
                    fontSize: 11,
                    fontWeight: 600,
                    bgcolor: isLoading ? 'rgba(0, 0 ,0, 0.3)' : '#000',
                    color: '#fff',
                  }}>
                  {cart?.items ? cart.items.length : isLoading ? '' : 0}
                </Typography>
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
                    <AccountCircleIcon
                      sx={{ mr: 0.5, ml: 1.5, fontSize: 32 }}
                    />
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
                <MenuItem onClick={handleClose}>Tài khoản</MenuItem>
                <MenuItem component={Link} href={ROUTES.PURCHASE}>
                  Đơn mua
                </MenuItem>
                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
              </Menu>
            </Box>
          </Grid2>
        </Grid2>
      </LayoutContainer>
    </Box>
  );
};

export default FullWidthHeader;
