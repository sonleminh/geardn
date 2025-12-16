import React from 'react';
import AppLink from '@/components/common/AppLink';

import { Box, List, ListItem, Typography, useTheme } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

type TInitDataRes = {
  tags?: { value: string; label: string }[];
};

export const MenuDropDown = ({ data }: { data?: TInitDataRes }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: 'relative',
        pb: 1,
        ':hover': {
          '.dropdown-content': {
            top: '100%',
            visibility: 'visible',
            opacity: 1,
          },
        },
      }}>
      <Box
        className='dropdown-btn'
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}>
        <Typography sx={{ mr: 0.5, fontSize: { sm: 14, md: 16 } }}>
          Lập Trình
        </Typography>{' '}
        <KeyboardArrowDownIcon sx={{ fontSize: { sm: 20, md: 24 } }} />
      </Box>
      <List
        className='dropdown-content'
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 69,
          visibility: 'hidden',
          opacity: 0,
          bgcolor: theme.palette.mode === 'light' ? '#fff' : '#000',
          border: theme.palette.mode === 'dark' ? '1px solid #696969' : '',
          boxShadow: 2,
          borderRadius:
            'box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          transition: 'all .2s',
        }}>
        {data?.tags?.map((item) => (
          <AppLink key={item?.value} href={`/tag/${item?.value}`}>
            <ListItem
              sx={{
                fontSize: { sm: 12, md: 13.5 },
                textTransform: 'capitalize',
                transition: 'all 0.2s ease',
                ':hover': {
                  bgcolor: theme.palette.mode === 'light' ? '#000' : '#fff',
                  color: theme.palette.mode === 'light' ? '#fff' : '#000',
                  cursor: 'pointer',
                },
              }}>
              {item.label}
            </ListItem>
          </AppLink>
        ))}
      </List>
    </Box>
  );
};
