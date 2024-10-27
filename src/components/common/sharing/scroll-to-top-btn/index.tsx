import React from 'react';
import { Box } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollToTopBtn = ({
  showScrollTop,
  handleScrollToTop,
}: {
  showScrollTop: boolean;
  handleScrollToTop: () => void;
}) => {
  return (
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
  );
};

export default ScrollToTopBtn;
