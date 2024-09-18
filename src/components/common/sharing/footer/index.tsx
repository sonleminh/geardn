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
// import NextJSLogo from '@/assests/nextjs-logo';
// import HeaderLogo from '../header/components/HeaderLogo';
// import NestLogo from '@/assests/nestjs-logo';
// import MUILogo from '@/assests/mui-logo';
import { FooterStyle } from './style';
import SkeletonImage from '../../SkeletonImage';
import YouTubeIcon from '@mui/icons-material/YouTube';
const Footer = () => {
  return (
    <Box sx={FooterStyle}>
      <LayoutContainer>
        Footer
        <Grid2 container>
          <Grid2>
            <Box
              sx={{
                position: 'relative',
                width: '145px',
                height: { xs: '60.5px' },
                borderRadius: 2,
                overflow: 'hidden',
                '& img': {
                  objectFit: 'cover',
                },
              }}>
              <SkeletonImage src={LOGO} alt='geardn' fill unoptimized={true} />
            </Box>
          </Grid2>
          <Grid2>
            <Typography>About</Typography>
          </Grid2>
          <Grid2>
            <Typography>Support</Typography>
          </Grid2>
          <Grid2>
            <List>
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
    </Box>
  );
};

export default Footer;
