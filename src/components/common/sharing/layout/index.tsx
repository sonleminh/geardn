'use client';

import React, { useEffect, useState } from 'react';

import Footer from '../footer';
import Header from '../header';

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Brightness3Icon from '@mui/icons-material/Brightness3';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Box, keyframes, useTheme } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { ColorModeContext } from '@/contexts/ColorModeContext';
import FullWidthHeader from '../fullwidth-header';

type LayoutType = {
  children?: React.ReactNode;
};

const Layout = ({ children }: LayoutType) => {
  const theme = useTheme();
  const pathname = usePathname();
  const context = React.useContext(ColorModeContext);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showFullWidthHeader, setShowFullWidthHeader] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (window.scrollY > 200) {
      // You can adjust this value as needed
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
    if (window.scrollY > 600) {
      // You can adjust this value as needed
      setShowFullWidthHeader(true);
    } else {
      setShowFullWidthHeader(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: showFullWidthHeader ? 'none' : 'block',
          // animation: showFullWidthHeader ? 'none' : `${slideDown} 4s ease-out`,
        }}>
        <Header />
      </Box>
      <Box
        sx={{
          position: 'relative',
          top: -30,
          right: 0,
          display: showFullWidthHeader ? 'block' : 'none',
          animation: `${slideDown} 2s ease`,
        }}>
        <FullWidthHeader />
      </Box>
      {/* {pathname !== '/' && <Box sx={{ mb: '80px' }} />} */}
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: '11.5%', lg: '11%' },
          right: '3%',
          display: showScrollTop ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
          width: '36px',
          height: '36px',
          bgcolor: '#000',
          color: '#fff',
          border: '1px solid #696969',
          borderRadius: 2,
          cursor: 'pointer',
          zIndex: 69,
        }}
        onClick={handleScrollToTop}>
        <KeyboardArrowUpIcon sx={{ fontSize: 24 }} />
      </Box>
      <Box
        sx={{
          position: 'fixed',
          bottom: '5%',
          right: '3%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '36px',
          height: '36px',
          bgcolor: '#000',
          color: '#fff',
          border: '1px solid #696969',
          borderRadius: 2,
          cursor: 'pointer',
          zIndex: 69,
        }}
        onClick={context.toggleColorMode}>
        {theme.palette.mode === 'light' ? (
          <Brightness3Icon sx={{ fontSize: 13 }} />
        ) : (
          <LightModeIcon sx={{ fontSize: 13 }} />
        )}
      </Box>
      <Box
        sx={{
          minHeight: 'calc(100vh - 241.23px)',
          pt: pathname !== '/' ? '100px' : '0',
          bgcolor: '#fff',
        }}>
        {children}
      </Box>
      <Footer />
    </>
  );
};

export default Layout;

const slideDown = keyframes`
 0%   {background-color: red;}
  25%  {background-color: yellow;}
  50%  {background-color: blue;}
  100% {background-color: green;}
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
