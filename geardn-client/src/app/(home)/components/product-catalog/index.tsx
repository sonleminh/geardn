'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid2,
  List,
  ListItem,
  Pagination,
  Skeleton,
  Typography,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import ProductCard from '@/components/common/ProductCard';
import LayoutContainer from '@/components/layout-container';

import { ProductFilters } from '@/components/common/ProductFilters';
import { IProduct } from '@/interfaces/IProduct';
import { Pagination as PaginationType } from '@/types/response.type';
import { ProductListStyle } from './style';
import { IQueryParams } from '@/interfaces/IQuery';
import { ICategory } from '@/interfaces/ICategory';
import AppLink from '@/components/common/AppLink';
import SkeletonImage from '@/components/common/SkeletonImage';

const ProductCatalog = ({
  products,
  categories,
  pagination,
  params,
}: {
  products: IProduct[] | undefined;
  categories: ICategory[] | undefined;
  pagination: PaginationType | undefined;
  params: IQueryParams;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') ?? 1);
  const total = pagination?.total ?? 0;

  const handlePageChange = (_: unknown, value: number) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set('page', String(value));
    router.replace(`/?${next.toString()}`, { scroll: false });
  };
  return (
    <Box>
      <LayoutContainer>
        <Box sx={ProductListStyle}>
          <Grid2 container spacing={3} sx={{}}>
            <Grid2
              size={3}
              className='category'
              sx={{
                position: 'sticky',
                top: 100,
                height: '100%',
              }}>
              <Box
                sx={{
                  pt: 2,
                  bgcolor: '#fff',
                  boxShadow:
                    '0 1px 2px 0 rgba(60, 64, 67, .1), 0 2px 6px 2px rgba(60, 64, 67, .15)',
                  borderRadius: 1,
                }}>
                <Typography className='category-heading' sx={{ mx: 2 }}>
                  Danh mục
                </Typography>
                <List>
                  {categories?.map((item: ICategory) => (
                    <AppLink
                      href={item?.slug}
                      key={item?.id}
                      sx={{
                        color: '#000',
                      }}>
                      <ListItem
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '100%',
                          pl: 2,
                          pr: 1,
                          '&:hover': {
                            backgroundColor: '#eee',
                            transition: 'all 0.3s ease',
                            svg: {
                              display: 'block',
                            },
                          },
                        }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}>
                          <Box
                            marginY={0.2}
                            sx={{
                              position: 'relative',
                              width: '28px',
                              height: { xs: '28px' },
                              mr: 2,
                              overflow: 'hidden',
                              '& img': {
                                objectFit: 'cover',
                              },
                            }}>
                            <SkeletonImage src={item?.icon} alt={'geardn'} />
                          </Box>
                          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                        </Box>
                        <ChevronRightIcon
                          sx={{ display: 'none', color: '#696969' }}
                        />
                      </ListItem>
                    </AppLink>
                  ))}
                </List>
              </Box>
            </Grid2>
            <Grid2 size={9}>
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}>
                  <Typography sx={{ fontSize: 15 }}>
                    Tìm thấy <b>{total} </b>kết quả
                  </Typography>
                  <ProductFilters initial={params} />
                </Box>
                <Grid2 container spacing={2} sx={{ mb: 3 }}>
                  {products?.length === 0
                    ? [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => (
                        <Grid2 key={index} size={4}>
                          <Card>
                            <CardMedia>
                              <Skeleton
                                variant='rectangular'
                                width='100%'
                                height={250}
                              />
                            </CardMedia>
                            <CardContent
                              sx={{
                                p: '12px',
                                paddingBottom: '12px !important',
                              }}>
                              <Skeleton
                                variant='text'
                                width='100%'
                                height={21}
                              />
                              <Skeleton
                                variant='text'
                                width='100%'
                                height={21}
                                sx={{ mb: '8px' }}
                              />
                              <Box
                                sx={{
                                  height: 24,
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}>
                                <Skeleton
                                  variant='text'
                                  height={24}
                                  width={'40%'}
                                />
                                <Skeleton
                                  variant='text'
                                  height={24}
                                  width={'40%'}
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid2>
                      ))
                    : products?.map((item, index) => (
                        <Grid2 key={index} size={4}>
                          <ProductCard data={item} />
                        </Grid2>
                      ))}
                </Grid2>
                <Pagination
                  sx={{ display: 'flex', justifyContent: 'center' }}
                  count={Math.ceil(total / 9)}
                  page={page ?? 1}
                  onChange={handlePageChange}
                  showFirstButton
                  showLastButton
                />
              </Box>
            </Grid2>
          </Grid2>
        </Box>
      </LayoutContainer>
    </Box>
  );
};

export default ProductCatalog;
