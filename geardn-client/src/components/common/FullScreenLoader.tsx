import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export const FullScreenLoader = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        width: '100%',
        height: '100vh',
        backgroundSize: 'cover',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 70,
      }}>
      <CircularProgress color='inherit' />
    </Box>
  );
};
