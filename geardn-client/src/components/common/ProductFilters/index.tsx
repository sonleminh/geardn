// components/ProductFilters.tsx
'use client';
import { IQueryParams } from '@/interfaces/IQuery';
import { Box, NativeSelect, Typography } from '@mui/material';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type UIValue = '' | 'asc' | 'desc';

function toUIValue(q: IQueryParams): UIValue {
  if (q.sortBy === 'price') return q.order === 'asc' ? 'asc' : 'desc';
  // coi các sort khác là "Mới nhất"
  return '';
}

function fromUIValue(v: UIValue): {
  sortBy?: 'createdAt' | 'price';
  order?: 'asc' | 'desc';
} {
  if (v === '') return {}; // hoặc {} nếu BE có default
  return { sortBy: 'price', order: v };
}

export function ProductFilters({ initial }: { initial: IQueryParams }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const initialUI = useMemo(() => toUIValue(initial), [initial]);
  const [sort, setSort] = useState<UIValue>(initialUI);

  useEffect(() => {
    const cur: IQueryParams = {
      sortBy: (sp.get('sortBy') as 'createdAt' | 'price') ?? undefined,
      order: (sp.get('order') as 'asc' | 'desc') ?? undefined,
    };
    setSort(toUIValue(cur));
  }, [sp]);
  const patchQuery = useMemo(() => {
    return (patch: Record<string, string | undefined>) => {
      const next = new URLSearchParams(sp.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v == null || v === '') next.delete(k);
        else next.set(k, v);
      }
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    };
  }, [sp, router, pathname]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography sx={{ mr: 1, fontSize: 14 }}>Sắp xếp theo:</Typography>
      <NativeSelect
        value={sort}
        onChange={(e) => {
          const v = e.target.value as UIValue;
          setSort(v);
          const mapped = fromUIValue(v);
          patchQuery({
            sort: '',
            sortBy: mapped.sortBy,
            order: mapped.order,
            page: '1',
          });
        }}
        disableUnderline
        sx={{
          p: 0,
          border: '1px solid #000',
          borderRadius: 1.5,
          fontSize: 14,
          '.MuiNativeSelect-select': {
            p: '4px 8px',
          },
          '& select': {
            backgroundColor: '#f5f5f5',
            color: '#000',
            borderRadius: '4px',
            padding: '8px',
          },
          '& option': {
            backgroundColor: '#fff',
            color: '#333',
            padding: '8px',
          },
        }}>
        <option value=''>Mới nhất</option>
        <option value='asc'>Giá thấp đến cao</option>
        <option value='desc'>Giá cao đến thấp</option>
      </NativeSelect>
    </Box>
  );
}
