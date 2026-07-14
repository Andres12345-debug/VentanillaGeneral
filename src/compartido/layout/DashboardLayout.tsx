import React, { useState } from 'react';
import { AppBar, Box, IconButton, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet } from 'react-router-dom';
import Sidebar from '../nav/Sidebar';
import { TOKENS } from '../theme/ThemeContexto';

const DashboardLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {!isDesktop && (
          <AppBar
            position="sticky"
            elevation={0}
            sx={{ bgcolor: TOKENS.negro, zIndex: (t) => t.zIndex.drawer + 1 }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                aria-label="Abrir menú"
                onClick={() => setMobileOpen(true)}
                sx={{ color: '#ffffff' }}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        )}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: 3,
            maxWidth: 1400,
            mx: 'auto',
            width: '100%',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
