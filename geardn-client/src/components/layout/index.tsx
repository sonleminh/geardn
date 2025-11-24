'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import Header from '../header';
import Footer from '../footer';
import DarkModeBtn from '../common/dark-mode-btn';
import ScrollToTopBtn from '../common/scroll-to-top-btn';

import { Box } from '@mui/material';
import { Notification } from '../common/notification';
import { IUser } from '@/interfaces/IUser';

const Layout = ({
  children,
  initialUser,
}: {
  children?: React.ReactNode;
  initialUser?: IUser | null;
}) => {
  const pathname = usePathname();
  const [showScrollTop, setShowScrollTop] = useState(false);

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
  };
  return (
    <>
      <Header initialUser={initialUser} />
      <ScrollToTopBtn
        showScrollTop={showScrollTop}
        handleScrollToTop={handleScrollToTop}
      />
      <DarkModeBtn />
      <Box
        sx={{
          pt: pathname !== '/' ? '80px' : '0',
          bgcolor: '#F3F4F6',
        }}>
        {children}
      </Box>
      <Notification />
      <Footer />
    </>
  );
};

export default Layout;
