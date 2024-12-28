'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Cookies from 'js-cookie';
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

import { useAuthStore } from '@/providers/auth-store-provider';
import { useGetCart } from '@/services/cart/api';
import { logoutAPI } from '@/services/auth/api';
import { ROUTES } from '@/constants/route';

import SkeletonImage from '../../SkeletonImage';
import LOGO from '@/assets/geardn-logo.png';
import { HeaderStyle } from './style';

const Header = ({ showHeader }: { showHeader: boolean }) => {
  const router = useRouter();
  const { cart, isLoading } = useGetCart();
  const { user, logout } = useAuthStore((state) => state);
  console.log('user:', user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const at = Cookies.get('at');
    if (user?._id && !at) {
      logout();
      router.push(ROUTES.LOGIN);
    }
  }, [user, logout, router]);

  const scrollToProductList = () => {
    const productList = document.getElementById('shop');
    if (productList) {
      productList.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      router.push('/#shop');
    }
  };

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const result = await logoutAPI();
    if (result?.statusCode === 200) {
      logout();
      router.push('/dang-nhap');
    }
  };

  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (user === null) {
      router.push('/dang-nhap');
    } else {
      setAnchorEl(event.currentTarget);
    }
  };
  return (
    <Box sx={HeaderStyle(showHeader)}>
      <Grid2 container height={80}>
        <Grid2 size={4} sx={{ display: 'flex', alignItems: 'center' }}>
          <Link href={'/'}>
            <Box className='header-logo'>
              <SkeletonImage src={LOGO} alt='geardn' fill unoptimized={true} />
            </Box>
          </Link>
        </Grid2>
        <Grid2 size={4} sx={{ display: 'flex', alignItems: 'center' }}>
          <List
            sx={{
              display: 'flex',
              width: '100%',
              '> li': {
                justifyContent: 'center',
                ':hover': {
                  ' p': {
                    ':before': {
                      transform: 'scaleX(1)',
                    },
                  },
                },
                ' p': {
                  position: 'relative',
                  cursor: 'pointer',
                  ':before': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-4px',
                    left: 0,
                    width: '100%',
                    height: '2px',
                    bgcolor: '#000',
                    transition: 'transform .2s',
                    transform: 'scaleX(0)',
                    transformOrigin: 'top left',
                  },
                },
              },
            }}>
            <ListItem>
              <Typography>Danh mục</Typography>
            </ListItem>
            <ListItem>
              <Typography onClick={scrollToProductList}>Shop</Typography>
            </ListItem>
            <ListItem>
              <Typography>Liên hệ</Typography>
            </ListItem>
          </List>
        </Grid2>
        <Grid2 size={4} sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
              width: '100%',
            }}>
            <SearchIcon />
            <Button
              sx={{ position: 'relative', minWidth: 40, height: 40, ml: 2 }}>
              <ShoppingCartOutlinedIcon
                onClick={() => {
                  router.push(ROUTES.CART);
                  // user !== null
                  //   ? router.push(ROUTES.CART)
                  //   : router.push(ROUTES.LOGIN);
                }}
              />
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
