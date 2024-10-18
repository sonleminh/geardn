'use client';

import { useGetProducts } from '@/services/product/api';
import ProductCard from '@/components/common/ProductCard';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import {
  Box,
  Grid2,
  List,
  ListItem,
  Pagination,
  Typography,
} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { ProductListStyle } from './style';
import { IProduct } from '@/interfaces/IProduct';
import LayoutContainer from '@/components/common/sharing/layout-container';

const ProductList = () => {
  const { products } = useGetProducts();
  return (
    <LayoutContainer>
      <Box sx={ProductListStyle}>
        <Grid2 container spacing={4}>
          <Grid2 size={3} className='category'>
            <Typography className='category-heading'>Danh mục</Typography>
            <Accordion className='category-accordion'>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1-content'
                id='panel1-header'
                sx={{
                  height: '30px',
                  '.MuiAccordionSummary-root': {
                    minHeight: '30px',
                  },
                }}>
                <ShoppingBasketOutlinedIcon sx={{ mr: 1 }} /> Tất cả sản phẩm
              </AccordionSummary>
              <AccordionDetails sx={{ py: 0 }}>
                <List
                  sx={{
                    pt: 0,
                    li: {
                      ':hover': {
                        textDecoration: 'underline',
                      },
                    },
                  }}>
                  <ListItem>Laptop</ListItem>
                  <ListItem>Laptop</ListItem>
                  <ListItem>Laptop</ListItem>
                  <ListItem>Laptop</ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
            <Accordion className='category-accordion'>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel2-content'
                id='panel2-header'>
                Mới nhất
              </AccordionSummary>
              <AccordionDetails sx={{ py: 0 }}>
                <List sx={{ pt: 0 }}>
                  <ListItem>Laptop</ListItem>
                  <ListItem>Laptop</ListItem>
                  <ListItem>Laptop</ListItem>
                  <ListItem>Laptop</ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
            <Accordion className='category-accordion'>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel2-content'
                id='panel2-header'>
                Khuyến mãi
              </AccordionSummary>
              <AccordionDetails sx={{ py: 0 }}>
                <List sx={{ pt: 0 }}>
                  <ListItem>Laptop</ListItem>
                  <ListItem>Laptop</ListItem>
                  <ListItem>Laptop</ListItem>
                  <ListItem>Laptop</ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          </Grid2>
          <Grid2 container size={9} spacing={4}>
            {products?.productList.map((item, index) => (
              <Grid2 key={index} size={4}>
                <ProductCard data={item} />
              </Grid2>
            ))}
            <Pagination
              count={10}
              // renderItem={(item) => (
              //   <PaginationItem
              //     slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
              //     {...item}
              //   />
              // )}
            />
          </Grid2>
        </Grid2>
      </Box>
    </LayoutContainer>
  );
};

export default ProductList;
