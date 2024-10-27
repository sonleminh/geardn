import { keyframes, SxProps, Theme } from "@mui/material";

export const HeaderStyle: ( showHeader: boolean) => SxProps<Theme> = ( showHeader: boolean) => ({
  position: 'fixed',
  top: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 69,

  display: 'block',
  visibility: showHeader ? 'visible' : 'hidden',
  width:  {lg: 1070, xl: 1200 },
  height: { xs: 80 },
  px: 3,

  bgcolor: 'white',
  borderBottomLeftRadius: '8px',
  borderBottomRightRadius: '8px',
  border: '1px solid #cccccc',
  boxShadow:
    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  animation: `${slideDown} 0.5s ease-out`,
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