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
        <Grid2 container spacing={4}>
          <Grid2 size={3} className='category'>
            <Typography className='category-heading'>Danh mục</Typography>
            <List>
              {categories?.categories.map((item) => (
                <ListItem sx={{ display: 'flex' }} key={item._id}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: '20px',
                      height: { xs: '20px' },
                      mr: 1,
                      overflow: 'hidden',
                      '& img': {
                        objectFit: 'cover',
                      },
                    }}>
                    <SkeletonImage src={item.icon} alt={'geardn'} />
                  </Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                    {item.name}
                  </Typography>
                </ListItem>
              ))}
            </List>
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
                  <NativeSelect
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
                      borderRadius: 2,
                      '.MuiNativeSelect-select': {
                        p: '4px 8px',
                      },
                    }}>
                    <option value={10}>Ten</option>
                    <option value={20}>Twenty</option>
                    <option value={30}>Thirty</option>
                  </NativeSelect>
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
