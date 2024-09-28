import { keyframes, SxProps, Theme } from "@mui/material";

export const HeaderStyle: (pathname: string) => SxProps<Theme> = (pathname: string) => ({
  position: 'fixed',
  top: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 69,
  width: { lg: 1070, xl: 1200  },
  // width: { lg: 1070, xl: pathname === '/' ? 1200 : '100%' },
  px: 3,
  bgcolor: 'white',
  borderBottomLeftRadius: '8px',
  borderBottomRightRadius: '8px',
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
  '.user-avatar': {
    position: 'relative',
    minWidth: '30px',
    height: { xs: '30px' },
    ml: 2.5,
    borderRadius: '50%',
    overflow: 'hidden',
    '& img': {
      objectFit: 'cover',
    },
    ':hover': {
      ':before': {
        display: 'block',
      },
    },
    ':before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      display: 'none',
      width: '100%',
      height: '100%',
      bgcolor: 'rgba(255,255,255, 0.4)',
      zIndex: 69,
    },
  },
  '.user-icon': {
    width: '30px',
    minWidth: '30px',
    height: { xs: '30px' },
    ml: 2.5,
  },
  '.username-icon': {
    height: { xs: '30px' },
    ml: 2.5,
  }
});