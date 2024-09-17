import AppLink from '@/components/common/AppLink';
import LayoutContainer from '../layout-container';

import {
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  SxProps,
  Theme,
  Typography,
  useTheme,
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';

// import NextJSLogo from '@/assests/nextjs-logo';
// import HeaderLogo from '../header/components/HeaderLogo';
// import NestLogo from '@/assests/nestjs-logo';
// import MUILogo from '@/assests/mui-logo';
import { FooterStyle } from './style';

const Footer = () => {
  return (
    <Box sx={FooterStyle}>
      <LayoutContainer>
        Footer
        {/* <Grid
          container
          spacing={{ xs: 2, sm: 3 }}
          sx={{
            pb: 4,
            '.footer-content': {
              fontSize: 14,
              color: '#bdbdbd',
            },
          }}>
          <Grid item xs={12} sm={3}>
            <AppLink href='/'>
              <Button className='footer-logo'>
                <HeaderLogo />
              </Button>
            </AppLink>
          </Grid>
          <Grid item xs={12} sm={4} className='footer-introduce'>
            <Typography variant='h4' className='introduce-heading'>
              Giới thiệu
            </Typography>
            <Typography className='introduce-content'>
              Phát triển bởi Son Le vào năm 2024, là blog cá nhân chia sẻ kiến
              thức IT.
            </Typography>
          </Grid>
          <Grid item xs={6} sm={2} className='footer-blog'>
            <Typography variant='h4'>Blog</Typography>
            <List sx={{ p: 0, li: { px: 0 } }}>
              <ListItem>
                <AppLink href={'/blog'} className='footer-content'>
                  Mới nhất
                </AppLink>
              </ListItem>
              <ListItem>
                <AppLink href={'/tag/develop'} className='footer-content'>
                  Lập trình
                </AppLink>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={6} sm={3} className='footer-follow'>
            <Typography variant='h4'>Follow me</Typography>
            <Box
              sx={{
                '& svg': {
                  m: '0 8px',
                  fontSize: 18,
                },
              }}>
              <AppLink href={'https://www.facebook.com/sonlele2/'}>
                <FacebookIcon />
              </AppLink>
              <XIcon />
              <InstagramIcon />
              <LinkedInIcon />
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ bgcolor: '#696969' }} />
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography className='footer-copyright'>
            Copyright © 2024 Son Le | Powered by NextJS .
          </Typography>
          <Box
            className='footer-tech'
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <NextJSLogo />
            <NestLogo />
            <MUILogo />
          </Box>
        </Box> */}
      </LayoutContainer>
    </Box>
  );
};

export default Footer;
