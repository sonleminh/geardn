'use client';

import { IProduct } from '@/interfaces/IProduct';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import { formatPrice } from '@/utils/format-price';
import Link from 'next/link';

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images?.[0] || '/placeholder-product.jpg';
  const displayPrice =
    product.priceMin === product.priceMax
      ? formatPrice(product.priceMin)
      : `${formatPrice(product.priceMin)} - ${formatPrice(product.priceMax)}`;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}>
      <Link
        href={`/products/${product.slug}`}
        style={{ textDecoration: 'none' }}>
        <CardMedia
          component='img'
          height='200'
          image={mainImage}
          alt={product.name}
          sx={{
            objectFit: 'cover',
            backgroundColor: 'grey.100',
          }}
        />
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Stack spacing={1}>
            <Typography
              variant='h6'
              component='h3'
              sx={{
                fontSize: '1rem',
                fontWeight: 600,
                lineHeight: 1.3,
                color: 'text.primary',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '2.6em',
              }}>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant='h6'
                sx={{
                  color: 'primary.main',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                }}>
                {displayPrice}
              </Typography>
              {product.tags && product.tags.length > 0 && (
                <Chip
                  label={product.tags[0].label}
                  size='small'
                  color='secondary'
                  sx={{ fontSize: '0.75rem' }}
                />
              )}
            </Box>

            <Typography
              variant='body2'
              color='text.secondary'
              sx={{
                fontSize: '0.875rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '2.8em',
              }}>
              {product.description || 'No description available'}
            </Typography>

            {product.brand && (
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                Brand: {product.brand}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Link>
    </Card>
  );
}
