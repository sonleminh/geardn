'use client';

import {
  Box,
  Button,
  Grid2,
  List,
  ListItem,
  Menu,
  MenuItem,
} from '@mui/material';
import LayoutContainer from '../layout-container';
import LOGO from '@/assets/geardn-logo.png';
import SearchIcon from '@mui/icons-material/Search';
import SkeletonImage from '../../SkeletonImage';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useAuthStore } from '@/providers/auth-store-provider';
import { useState } from 'react';
import { logoutAPI } from '@/services/auth';
import { useRouter } from 'next/navigation';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AppLink from '../../AppLink';

const Header = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore((state) => state);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
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

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 69,
        width: { lg: 1070, xl: 1200 },
        px: 3,
        bgcolor: 'white',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px',
      }}>
      {/* <LayoutContainer> */}
      <Grid2 container height={80}>
        <Grid2 size={4.5} sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component={AppLink}
            href={'/'}
            sx={{
              position: 'relative',
              width: '145px',
              height: { xs: '60.5px' },
              borderRadius: 2,
              overflow: 'hidden',
              '& img': {
                objectFit: 'cover',
              },
            }}>
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
            {user?.picture ? (
              <Button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  handleUserClick(e)
                }
                sx={{
                  position: 'relative',
                  minWidth: '34px',
                  height: { xs: '34px' },
                  ml: 2.5,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  '& img': {
                    objectFit: 'cover',
                  },
                  ':hover': {
                    ':before': {
                      display: 'block',
                    },
                  },
                  ':before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    display: 'none',
                    width: '100%',
                    height: '100%',
                    bgcolor: 'rgba(255,255,255, 0.4)',
                    zIndex: 69,
                  },
                }}>
                <SkeletonImage src={user?.picture} alt='geardn' fill />
              </Button>
            ) : (
              <AccountCircleIcon />
            )}

            <Menu
              id='basic-menu'
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}>
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
            </Menu>
          </Box>
        </Grid2>
      </Grid2>
      {/* </LayoutContainer> */}
    </Box>
  );
};

export default Header;
