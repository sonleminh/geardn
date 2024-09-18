'use client';

import { Box, Grid2, List, ListItem } from '@mui/material';
import LayoutContainer from '../layout-container';
import LOGO from '@/assets/geardn-logo.png';
import SearchIcon from '@mui/icons-material/Search';
import SkeletonImage from '../../SkeletonImage';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

const Header = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
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
      <LayoutContainer>
        <Grid2 container height={80}>
          <Grid2 size={4.5} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
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
              <Box
                sx={{
                  position: 'relative',
                  width: '30px',
                  height: { xs: '30px' },
                  ml: 2.5,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  '& img': {
                    objectFit: 'cover',
                  },
                }}>
                <SkeletonImage
                  src={
                    'https://firebasestorage.googleapis.com/v0/b/dev-blog-7a694.appspot.com/o/1720965881541-reactjs.jpg?alt=media&token=cc021c5f-1a12-48db-9cc1-7a0606702551'
                  }
                  alt='geardn'
                  fill
                />
              </Box>
            </Box>
          </Grid2>
        </Grid2>
      </LayoutContainer>
    </Box>
  );
};

export default Header;
