import { keyframes, SxProps, Theme } from "@mui/material";

export const HeaderStyle: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: {xs:60, lg:80},
    px: {xs: 1, sm: 0},
    '.header-logo': {
        'svg': {
            width: {xs: 100, lg: 130}
        }
    },
    '.header-search': {
        position: 'relative',
        display: {xs: 'none', lg:'flex'},
        alignItems: 'center',
        '> div': {
            '& .MuiInputBase-root': {
              width: {xs:100,lg:120},
              transition: 'width 0.3s ease',
              '&:focus-within': {
                width: 300,
              },
            },
        }
    },
    '.mobile-btn': {
        display: {xs: 'block', lg: 'none'},
    },
    '.search-mobile': {
        display: {xs: 'block', lg:'none'}
    }
}

export const MenuListStyle: SxProps<Theme> = {
    display: {xs: 'none', lg:'flex'},
    alignItems: 'center',
    ml: { sm: 1,md:2},
    pb: 0,
    whiteSpace: 'nowrap',
    '& >li': {
      p: 0,
      mx: {lg:2},
      position: 'relative',
      '& >a': {
        pb: 1,
        fontSize: {lg: 16}
      },
      ':before': {
        position: 'absolute',
        content: '""',
        height: '3px',
        right: '0',
        bottom: '0',
        width: '100%',
        bgcolor: (theme) => (theme.palette.mode === 'light' ? '#000' : '#fff'),
        transition: 'transform .2s',
        transform: 'scaleX(0)',
        transformOrigin: 'top right',
      },
      ':hover': {
        ':before': {
          transform: 'scaleX(1)',
        },
      },
    },
  };

const slideIn = keyframes`
from {
  transform: translate(-50%, -100%);
  opacity: 0;
}
to {
  transform: translate(-50%, -50%);
  opacity: 1;
}
`;

export const SearchModalStyle: SxProps<Theme> = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '90%',
    md: '90%',
    lg: 900
  },
  p: 2,
  bgcolor: 'background.paper',
  border: '1px solid #696969',
  animation: `${slideIn} 500ms cubic-bezier(0.34, 1.61, 0.7, 1)`,
  ['&.MuiSlide-entered']: {
    opacity: 1,
  },
  borderRadius: {xs:2},
  overflow: 'hidden'
}
