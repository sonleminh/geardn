import { useColorModeStore } from '@/stores/color-mode-store';
import { Box, useTheme } from '@mui/material';
import Brightness3Icon from '@mui/icons-material/Brightness3';
import LightModeIcon from '@mui/icons-material/LightMode';

const DarkModeBtn = () => {
  const theme = useTheme();
  const { toggleColorMode } = useColorModeStore();
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '5%',
        right: '3%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '36px',
        height: '36px',
        bgcolor: '#000',
        color: '#fff',
        border: '1px solid #696969',
        borderRadius: 2,
        cursor: 'pointer',
        zIndex: 69,
      }}
      onClick={toggleColorMode}>
      {theme.palette.mode === 'light' ? (
        <Brightness3Icon sx={{ fontSize: 13 }} />
      ) : (
        <LightModeIcon sx={{ fontSize: 13 }} />
      )}
    </Box>
  );
};

export default DarkModeBtn;
