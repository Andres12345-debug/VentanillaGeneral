import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeContext } from '../theme/ThemeContexto';

const SmallNav: React.FC = () => {
  const { mode, toggleTheme } = useThemeContext();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        height: 48,
        backgroundColor: 'sidebar.main',
        zIndex: (theme) => theme.zIndex.drawer + 2,
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          minHeight: 48,
          height: 48,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'white' }}>
          Workflows
        </Typography>
        <Box>
          <IconButton size="small" onClick={toggleTheme} sx={{ color: 'white' }}>
            {mode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default SmallNav;
