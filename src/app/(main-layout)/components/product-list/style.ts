import { SxProps, Theme } from "@mui/material";

export const ProductListStyle: SxProps<Theme> = {
    p: '32px 0 40px',
    '.category': {
        '.category-heading': {
            mb: 0.5, fontSize: 18, fontWeight: 600
        },
        '> div': {
            ':hover': {
                '.MuiButtonBase-root': {
                bgcolor: '#f1f1f1',
                borderRadius: '8px !important',
                },
            },
            },
        '.category-accordion': {
            boxShadow: 'none',
                ':before': {
                  display: 'none',
                }
        }
    }
}