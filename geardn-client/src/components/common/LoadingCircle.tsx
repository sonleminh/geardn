import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export const LoadingCircle = () => {
  return (
    <Box
      className='w-full h-screen bg-home-section bg-cover flex justify-center items-center'
      sx={{
        width: '100%',
        height: '100vh',
        backgroundSize: 'cover',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <CircularProgress color='inherit' />
    </Box>
  );
};
