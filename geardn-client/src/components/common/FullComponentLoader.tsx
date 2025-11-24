import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export const FullComponentLoader = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        backgroundColor: 'rgba(255,255,255,0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 70,
      }}>
      <CircularProgress color='inherit' />
    </Box>
  );
};
