import AppLink from '@/components/common/AppLink';
import LayoutContainer from '../layout-container';

import {
  Box,
  Button,
  Divider,
  Grid,
  Grid2,
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
import LOGO from '@/assets/geardn-logo.png';
import { FooterStyle } from './style';
import SkeletonImage from '../../SkeletonImage';
import YouTubeIcon from '@mui/icons-material/YouTube';
const Footer = () => {
  return (
    <Box sx={FooterStyle}>
      <LayoutContainer>
        <Grid2 container sx={{ mt: 3, mb: 4 }}>
          <Grid2 size={2}>
            <Box
              sx={{
                position: 'relative',
                width: '145px',
                height: { xs: '60.5px' },
                border: '2px solid #a3a3a3',
                borderRadius: 2,
                overflow: 'hidden',
                '& img': {
                  objectFit: 'cover',
                },
              }}>
              <SkeletonImage src={LOGO} alt='geardn' fill unoptimized={true} />
            </Box>
          </Grid2>
          <Grid2 size={2}>
            <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
              Về chúng tôi
            </Typography>
            <List
              sx={{
                li: {
                  px: 0,
                  py: 0.6,
                  color: '#696969',
                  fontSize: 14,
                },
              }}>
              <ListItem>Blog</ListItem>
              <ListItem>Hợp tác</ListItem>
              <ListItem>Liên hệ</ListItem>
            </List>
          </Grid2>
          <Grid2 size={2}>
            <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
              Hỗ trợ
            </Typography>
            <List
              sx={{
                li: {
                  px: 0,
                  py: 0.6,
                  color: '#696969',
                  fontSize: 14,
                },
              }}>
              <ListItem>Liên hệ</ListItem>
              <ListItem>Vận chuyển</ListItem>
              <ListItem>FAQ</ListItem>
            </List>
          </Grid2>
          <Grid2 size={3.5}></Grid2>
          <Grid2 size={2.5}>
            <Typography sx={{ mt: 6, mb: 1 }}>Social Media</Typography>
            <List
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                li: {
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '40px',
                  height: '40px',
                  bgcolor: '#000',
                  color: '#fff',
                  borderRadius: '50%',
                },
              }}>
              <ListItem>
                <FacebookIcon />
              </ListItem>
              <ListItem>
                <InstagramIcon />
              </ListItem>
              <ListItem>
                <YouTubeIcon />
              </ListItem>
              <ListItem>
                <XIcon />
              </ListItem>
            </List>
          </Grid2>
        </Grid2>
      </LayoutContainer>
      <Box sx={{ height: '1px', bgcolor: '#dbdbdb' }}></Box>
      <LayoutContainer>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 3,
          }}>
          <Typography sx={{ fontSize: 15 }}>
            Copyright © 2024 Son Le | All Rights Reserved .
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              '& p': {
                fontSize: 15,
              },
            }}>
            <Typography sx={{ mr: 4 }}>Điều khoản dịch vụ</Typography>
            <Typography>Chính sách</Typography>
          </Box>
        </Box>
      </LayoutContainer>
    </Box>
  );
};

export default Footer;
