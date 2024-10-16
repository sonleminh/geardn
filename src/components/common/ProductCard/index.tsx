import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import SkeletonImage from '../SkeletonImage';
import StarRateIcon from '@mui/icons-material/StarRate';
import AppLink from '../AppLink';
import { IProduct } from '@/interfaces/IProduct';
import { formatPrice } from '@/utils/format-price';

const ProductCard = ({ data }: { data: IProduct }) => {
  return (
    <AppLink href={`product/${data._id}`}>
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
        <SkeletonImage src={data?.images[0]} alt='geardn' fill />
      </Box>
      <Typography sx={{ mb: 1, fontSize: 18, fontWeight: 600 }}>
        {data?.name}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StarRateIcon sx={{ mr: 0.5, color: '#F19B4C', fontSize: 20 }} />
          <Typography sx={{ fontSize: 14 }}>5.0 (2 reviews)</Typography>
        </Box>
        <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
          {formatPrice(data?.original_price)}
        </Typography>
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
