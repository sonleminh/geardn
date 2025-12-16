import StarRateIcon from '@mui/icons-material/StarRate';
import { Box, Typography } from '@mui/material';

import { IProduct } from '@/interfaces/IProduct';
import { truncateTextByLine } from '@/utils/css-helper.util';
import { formatPrice } from '@/utils/format-price';

import AppLink from '../AppLink';
import SkeletonImage from '../SkeletonImage';

const ProductCard = ({ data }: { data: IProduct }) => {
  return (
    <AppLink href={`${data?.category?.slug}/${data?.slug}`}>
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
            overflow: 'hidden',
            '& img': {
              objectFit: 'contain',
              transition: 'all 0.5s ease',
            },
          }}
          className='product-img'>
          <SkeletonImage src={data?.images[0]} alt='geardn' fill />
        </Box>
        <Box sx={{ p: '12px' }}>
          <Typography
            sx={{
              height: 42,
              mb: 1,
              fontSize: 14,
              fontWeight: 500,
              ...truncateTextByLine(2),
            }}>
            {data?.name}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StarRateIcon sx={{ mr: 0.5, color: '#F19B4C', fontSize: 18 }} />
              <Typography sx={{ fontSize: 13 }}>5.0 (2 reviews)</Typography>
            </Box>
            <Box sx={{ fontWeight: 600 }}>
              <Typography>
                {formatPrice(data?.priceMin) ?? 'Đang cập nhật'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </AppLink>
  );
};

export default ProductCard;
