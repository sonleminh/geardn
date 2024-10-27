'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import Header from '../header';
import Footer from '../footer';
import DarkModeBtn from '../dark-mode-btn';
import FullWidthHeader from '../fullwidth-header';
import ScrollToTopBtn from '../scroll-to-top-btn';

import { Box } from '@mui/material';

type LayoutType = {
  children?: React.ReactNode;
};

const Layout = ({ children }: LayoutType) => {
  const pathname = usePathname();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [showFullWidthHeader, setShowFullWidthHeader] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
    if (window.scrollY > 720) {
      setShowHeader(false);
      setShowFullWidthHeader(true);
    } else {
      setShowHeader(true);
      setShowFullWidthHeader(false);
    }
  };
  return (
    <>
      {pathname === '/' && <Header showHeader={showHeader} />}
      <FullWidthHeader showFullWidthHeader={showFullWidthHeader} />
      <ScrollToTopBtn
        showScrollTop={showScrollTop}
        handleScrollToTop={handleScrollToTop}
      />
      <DarkModeBtn />
      <Box
        sx={{
          minHeight: 'calc(100vh - 241.23px)',
          pt: pathname !== '/' ? '80px' : '0',
        }}>
        {children}
      </Box>
      <Footer />
    </>
  );
};

export default Layout;
