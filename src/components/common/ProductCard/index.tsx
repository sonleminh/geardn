import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import SkeletonImage from '../SkeletonImage';
import StarRateIcon from '@mui/icons-material/StarRate';
import AppLink from '../AppLink';
import { IProduct } from '@/interfaces/IProduct';
import { formatPrice } from '@/utils/format-price';

const ProductCard = ({ data }: { data: IProduct }) => {
  return (
    <AppLink href={`${data._id}`}>
      <Box
        sx={{
          bgcolor: '#fff',
          borderRadius: '8px',
          overflow: 'hidden',
          ':hover': {
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px -1px rgba(0, 0, 0, .1)',
            '& img': {
              transform: 'scale(1.05)',
            },
          },
        }}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: '250px' },
            borderRadius: '8px',
            overflow: 'hidden',
            '& img': {
              objectFit: 'cover',
              transition: 'all 0.5s ease',
            },
          }}
          className='product-img'>
          <SkeletonImage src={data?.images[0]} alt='geardn' fill />
        </Box>
        <Box sx={{ p: '12px 12px 0' }}>
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
        </Box>
      </Box>
    </AppLink>
  );
};

export default ProductCard;
