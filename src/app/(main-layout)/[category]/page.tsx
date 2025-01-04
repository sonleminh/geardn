import ProductCard from '@/components/common/ProductCard';
import LayoutContainer from '@/components/common/sharing/layout-container';
import { getPrdByCateSlug } from '@/services/product/api';
import { Box, FormControl, Grid2, Typography } from '@mui/material';
import React from 'react';

const Category = async ({ params }: { params: { category: string } }) => {
  const { data } = await getPrdByCateSlug(params?.category);
  return (
    <Box sx={{ py: 4, bgcolor: '#eee' }}>
      <LayoutContainer>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            mb: 1,
          }}>
          <Typography>Tìm thấy 12 kết quả</Typography>
          <FormControl sx={{ width: '120px' }} size='small'>
            {/* <InputLabel variant='standard' htmlFor='uncontrolled-native'>
                    Age
                  </InputLabel> */}
            {/* <NativeSelect
                    defaultValue={30}
                    // inputProps={{
                    //   name: 'age',
                    //   id: 'uncontrolled-native',
                    // }}
                    disableUnderline
                    // variant='filled'
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
                    <option value={'latest'}>Mới nhất</option>
                    <option value={'20'}>Giá thấp đến cao</option>
                    <option value={30}>Giá cao đến thấp</option>
                  </NativeSelect> */}
            <select>
              <option>cc</option>
              <option>cc</option>
              <option>cc</option>
            </select>
          </FormControl>
        </Box>
        <Grid2 container spacing={2}>
          {data?.map((item) => (
            <Grid2 size={3} key={item._id}>
              <ProductCard data={item} />
            </Grid2>
          ))}
          {data?.map((item) => (
            <Grid2 size={3} key={item._id}>
              <ProductCard data={item} />
            </Grid2>
          ))}
          {data?.map((item) => (
            <Grid2 size={3} key={item._id}>
              <ProductCard data={item} />
            </Grid2>
          ))}
        </Grid2>
      </LayoutContainer>
    </Box>
  );
};

export default Category;
