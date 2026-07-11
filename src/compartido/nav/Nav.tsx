import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Container } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeContext } from '../theme/ThemeContexto';

const Nav: React.FC = () => {
  const { pathname } = useLocation();
  const { mode, toggleTheme } = useThemeContext();
  const isLanding = pathname === '/';
  const isVentanillaUnica = pathname === '/ventanilla-unica';

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        height: 64,
        justifyContent: 'center',
        bgcolor: 'sidebar.main',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar disableGutters sx={{ px: 2 }}>
        <Container
          maxWidth="lg"
          disableGutters
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box
            component={RouterLink}
            to="/"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'inherit' }}
          >
            <AccountTreeIcon sx={{ color: 'white', fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.3px', color: 'white' }}>
              Ventanilla Única
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isVentanillaUnica && (
              <Button
                component={RouterLink}
                to="/ventanilla-unica"
                sx={{ color: 'white', fontWeight: 600, opacity: 0.85, '&:hover': { opacity: 1 } }}
              >
                Ventanilla Única
              </Button>
            )}
            {isLanding && (
              <Button
                component={RouterLink}
                to="/prueba-gratis"
                sx={{ color: 'white', fontWeight: 600, opacity: 0.85, '&:hover': { opacity: 1 } }}
              >
                Registrarse
              </Button>
            )}
            <Button
              variant="outlined"
              component={RouterLink}
              to="/login"
              sx={{
                borderColor: 'rgba(255,255,255,0.4)',
                color: 'white',
                borderRadius: 999,
                px: 2.5,
                fontWeight: 600,
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.08)' },
              }}
            >
              Ingresar
            </Button>
            <IconButton size="small" onClick={toggleTheme} sx={{ color: 'white', ml: 0.5 }}>
              {mode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
            </IconButton>
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
