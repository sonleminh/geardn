'use client';

import Breadcrumbs from '@/components/common/Breadcrumbs';
import ProductCard from '@/components/common/ProductCard';
import { ProductFilters } from '@/components/common/ProductFilters';
import LayoutContainer from '@/components/layout-container';
import { IProduct } from '@/interfaces/IProduct';
import { IQueryParams } from '@/interfaces/IQuery';
import { useSearchProductsInfinite } from '@/queries/product';
import { SearchProductsResponse } from '@/types/response.type';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button, Grid2, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

type Props = {
  initial: SearchProductsResponse<IProduct> | null;
  params: IQueryParams;
};

export default function SearchClient({ initial, params }: Props) {
  const sp = useSearchParams();
  const q = useSearchProductsInfinite(initial, sp);
  const total = q?.data?.meta?.total ?? 0;
  const products = useMemo(() => {
    const seen = new Set<number>();
    const out = [];
    for (const it of q.data?.items || [])
      if (!seen.has(it.id)) {
        seen.add(it.id);
        out.push(it);
      }
    return out;
  }, [q.data]);

  const breadcrumbsOptions = [
    { href: '/', label: 'Trang chủ' },
    { href: '', label: 'Tìm kiếm' },
  ];

  return (
    <LayoutContainer>
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs options={breadcrumbsOptions} />
      </Box>
      <Box sx={{ display: ' flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography>Tìm thấy {total} sản phẩm</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ProductFilters initial={params} />
        </Box>
      </Box>
      <Grid2 container spacing={2}>
        {products?.map((item) => (
          <Grid2 size={3} key={item.id}>
            <ProductCard data={item} />
          </Grid2>
        ))}
      </Grid2>
      {q.hasNextPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            onClick={() => q.fetchNextPage()}
            disabled={!q.hasNextPage || q.isFetchingNextPage}
            variant='outlined'
            sx={{
              borderRadius: 100,
              textTransform: 'none',
              fontSize: 14,
              fontWeight: 600,
            }}>
            {q.isFetchingNextPage
              ? 'Đang tải...'
              : `Xem thêm ${total - products?.length} kết quả`}{' '}
            {!q.isFetchingNextPage && <ExpandMoreIcon sx={{ ml: 0.5 }} />}
          </Button>
        </Box>
      )}
    </LayoutContainer>
  );
}
