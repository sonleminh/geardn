import { keyframes, SxProps, Theme } from "@mui/material";

export const FullWidthHeaderStyle: (pathname: string, showFullWidthHeader: boolean) => SxProps<Theme> = (pathname: string, showFullWidthHeader: boolean) => ({
  position: 'fixed',
  top: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 69,

  display: 'block',
  visibility:
  showFullWidthHeader || pathname !== '/' ? 'visible' : 'hidden',
  width:  '100%',
  height: { xs: 80 },
  px: 3,
  bgcolor: 'white',
  border: '1px solid #cccccc',
  boxShadow:
    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    '.header-logo': {
      position: 'relative',
      width: '145px',
      height: { xs: '60.5px' },
      borderRadius: 2,
      overflow: 'hidden',
      '& img': {
        objectFit: 'cover',
      },
    },
    animation: 
    showFullWidthHeader && pathname === '/'
      ? `${slideDown} 0.2s ease-out`
      : 'none',
  '.user-avatar': {
    position: 'relative',
    minWidth: '30px',
    height: { xs: '30px' },
    borderRadius: '50%',
    overflow: 'hidden',
    '& img': {
      objectFit: 'cover',
    },
  },
});

const slideDown = keyframes`
 from {
    transform: translate(-50%,-100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%,0);
    opacity: 1;
  }
`;