import { SxProps, Theme } from "@mui/material";

export const FooterStyle: SxProps<Theme> = {
  bgcolor: (theme)=> theme.palette.mode === 'light' ? '#fff' : '#222',
  color: '#000',
  '.footer-logo': {
    p: 0,
    border: '1px solid #696969',
    'svg': {
      width: {xs: 100,sm: 130},
      height: {xs: 35, sm: 45}
    }
  },
  'h4': {
    mb: {xs:1,sm:3}, fontSize: {xs:16, sm:20}, fontWeight: 600
  },
  '.footer-introduce': {
    '.introduce-heading': {
      mb: {xs:1,sm:3}
    },
    '.introduce-content': {
      color: '#bdbdbd',
      fontSize: {xs:13, sm:14}
    }
  },
  '.footer-blog': {
    'h4': {
      mb: {xs:1, sm:2}
    },
    'li': {
      py: {xs: '4px', sm: '6px'},
      'a': {
        fontSize: {xs:13, sm: 14}
      }
    }
  },
  '.footer-follow': {
    'h4': {
      mb: {xs: 2, sm: 3}
    }
  },
  '.footer-copyright': {
    mb: 2, fontSize: {xs:13, sm: 14}, color: '#e1e1e1'
  },
  '.footer-tech': {
    'svg': {
      mx: {xs: '4px', sm: '8px'}
    }
  }
}