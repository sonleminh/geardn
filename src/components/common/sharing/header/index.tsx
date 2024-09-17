'use client';

import { Box, Grid2, List, ListItem } from '@mui/material';
import LayoutContainer from '../layout-container';
import LOGO from '@/assets/geardn-logo.png';
import SearchIcon from '@mui/icons-material/Search';
import SkeletonImage from '../../SkeletonImage';

const Header = () => {
  return (
    <>
      <LayoutContainer>
        <Grid2 container>
          <Grid2 size={4}>
            <Box
              sx={{
                position: 'relative',
                width: '130px',
                height: { xs: '56px' },
                mb: 1,
                borderRadius: 2,
                overflow: 'hidden',
                '& img': {
                  objectFit: 'cover',
                },
              }}>
              <SkeletonImage src={LOGO} alt='geardn' fill />
            </Box>
          </Grid2>
          <Grid2 size={4}>
            <List sx={{ display: 'flex' }}>
              <ListItem>Shop</ListItem>
              <ListItem>Blog</ListItem>
              <ListItem>Contact</ListItem>
            </List>
          </Grid2>
          <Grid2 size={4}>
            <Box sx={{ display: 'flex', justifyContent: 'end' }}>
              <SearchIcon />
            </Box>
          </Grid2>
        </Grid2>
      </LayoutContainer>
    </>
  );
};

export default Header;
