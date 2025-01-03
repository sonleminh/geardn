'use client';

import { useGetCategories, useGetProducts } from '@/services/product/api';
import ProductCard from '@/components/common/ProductCard';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import {
  Box,
  FormControl,
  Grid2,
  List,
  ListItem,
  NativeSelect,
  Pagination,
  Typography,
} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { ProductListStyle } from './style';
import { IProduct } from '@/interfaces/IProduct';
import LayoutContainer from '@/components/common/sharing/layout-container';
import SkeletonImage from '@/components/common/SkeletonImage';

const ProductList = () => {
  const { products } = useGetProducts();
  const { categories } = useGetCategories();
  console.log('cate:', categories);
  return (
    <LayoutContainer>
      <Box sx={ProductListStyle}>
        <Grid2 container spacing={4} sx={{}}>
          <Grid2
            size={3}
            className='category'
            sx={{ position: 'sticky', top: 100, height: '100%' }}>
            <Box
              sx={{
                p: '12px 16px',
                boxShadow:
                  '0 1px 2px 0 rgba(60, 64, 67, .1), 0 2px 6px 2px rgba(60, 64, 67, .15)',
                borderRadius: 1,
              }}>
              <Typography className='category-heading'>Danh mục</Typography>
              <List>
                {categories?.categories.map((item) => (
                  <ListItem sx={{ display: 'flex', px: 0 }} key={item._id}>
                    <Box
                      sx={{
                        position: 'relative',
                        width: '20px',
                        height: { xs: '20px' },
                        mr: 1.5,
                        overflow: 'hidden',
                        '& img': {
                          objectFit: 'cover',
                        },
                      }}>
                      <SkeletonImage src={item.icon} alt={'geardn'} />
                    </Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                      {item.name}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid2>
          <Grid2 size={9}>
            <Box>
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
              <Grid2 container spacing={4}>
                {products?.products?.map((item, index) => (
                  <Grid2 key={index} size={4}>
                    <ProductCard data={item} />
                  </Grid2>
                ))}
              </Grid2>
              <Pagination
                count={10}
                // renderItem={(item) => (
                //   <PaginationItem
                //     slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                //     {...item}
                //   />
                // )}
              />
            </Box>
          </Grid2>
        </Grid2>
      </Box>
    </LayoutContainer>
  );
};

export default ProductList;
