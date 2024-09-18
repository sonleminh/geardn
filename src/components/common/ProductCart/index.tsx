import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import SkeletonImage from '../SkeletonImage';
import BANNER_BG from '@/assets/geardn.jpg';
import StarRateIcon from '@mui/icons-material/StarRate';
import AppLink from '../AppLink';

interface IProductCard {
  link: string;
}

const ProductCard = (props: IProductCard) => {
  return (
    <AppLink href={props.link}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '250px' },
          mb: 1.5,
          borderRadius: 3,
          overflow: 'hidden',
          '& img': {
            objectFit: 'cover',
          },
        }}
        className='product-img'>
        <SkeletonImage src={BANNER_BG} alt='geardn' fill />
      </Box>
      <Typography sx={{ mb: 1, fontSize: 18, fontWeight: 600 }}>
        Logitech G102
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StarRateIcon sx={{ mr: 0.5, color: '#F19B4C', fontSize: 20 }} />
          <Typography sx={{ fontSize: 14 }}>5.0 (2 reviews)</Typography>
        </Box>
        <Typography sx={{ fontSize: 18, fontWeight: 600 }}>$20</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant='outlined'
          sx={{ minWidth: '46%', borderRadius: 10, textTransform: 'none' }}>
          Thêm vào giỏ
        </Button>
        <Button
          variant='contained'
          sx={{ minWidth: '46%', borderRadius: 10, textTransform: 'none' }}>
          Mua ngay
        </Button>
      </Box>
    </AppLink>
  );
};

export default ProductCard;
