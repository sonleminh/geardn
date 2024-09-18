import BANNER_BG from '@/assets/geardn.jpg';
import LayoutContainer from '@/components/common/sharing/layout-container';
import SkeletonImage from '@/components/common/SkeletonImage';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import StarIcon from '@mui/icons-material/Star';
import {
  Box,
  Button,
  Grid2,
  List,
  ListItem,
  Pagination,
  Typography,
} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Explore from './components/explore';
import ProductCard from '@/components/common/ProductCart';

export default function Homepage() {
  return (
    <Box sx={{ pb: 10 }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '800px' },
          overflow: 'hidden',
          '& img': {
            objectFit: 'cover',
          },
          ':before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            filter: 'blur(8px)',
            zIndex: 1,
          },
        }}>
        <SkeletonImage src={BANNER_BG} alt='geardn' fill unoptimized={true} />
      </Box>
      <LayoutContainer>
        <Box sx={{ p: '32px 0 40px' }}>
          <Grid2 container spacing={4}>
            <Grid2 size={3}>
              <Typography sx={{ fontSize: 22, fontWeight: 600 }}>
                Danh mục
              </Typography>
              <Accordion sx={{ boxShadow: 'none' }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls='panel1-content'
                  id='panel1-header'
                  sx={{
                    height: '30px',
                    '.MuiAccordionSummary-root': {
                      minHeight: '30px',
                    },
                    // '.MuiAccordionSummary-content': {
                    //   m: 0,
                    // },
                  }}>
                  <ShoppingBasketOutlinedIcon sx={{ mr: 1 }} /> Tất cả sản phẩm
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
              <Accordion
                sx={{
                  boxShadow: 'none',
                  ':before': {
                    display: 'none',
                  },
                }}>
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
              <Accordion
                sx={{
                  boxShadow: 'none',
                  ':before': {
                    display: 'none',
                  },
                }}>
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
            <Grid2 container size={9} spacing={3}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                <Grid2 key={index} size={4}>
                  <ProductCard link={'c'} />
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
      <Box
        sx={{
          ml: { lg: 'calc((100% - 1070px)/2)', xl: 'calc((100% - 1200px)/2)' },
        }}>
        <Explore />
      </Box>
      <LayoutContainer>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            p: 5,
            backgroundImage: 'linear-gradient(#363636, #1E1E1E)',
            color: '#fff',
          }}>
          <Box>
            <Typography>Ready amksfnajk sbfjk asbfjkasb</Typography>
            <Box>
              <input />
            </Box>
          </Box>
          <Box>
            <Typography>asf asfas fasf as</Typography>
            <Typography>asf asfas fasf as</Typography>
          </Box>
        </Box>
      </LayoutContainer>
    </Box>
  );
}
