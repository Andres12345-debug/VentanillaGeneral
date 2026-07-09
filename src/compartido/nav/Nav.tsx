import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const Nav: React.FC = () => {
  const { pathname } = useLocation();
  const isLanding = pathname === '/';

  return (
    <AppBar
      position="fixed"
      elevation={isLanding ? 0 : 1}
      sx={{
        top: 48,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: isLanding ? 'background.paper' : undefined,
        color: isLanding ? 'text.primary' : undefined,
        backdropFilter: isLanding ? 'blur(12px)' : undefined,
        borderBottom: isLanding ? '1px solid' : undefined,
        borderColor: isLanding ? 'divider' : undefined,
      }}
    >
      <Toolbar>
        <Box
          component={RouterLink}
          to="/"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          <AccountTreeIcon sx={{ color: 'primary.main', fontSize: 22 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.3px' }}>
            Ventanilla Única
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {isLanding && (
            <Button color="inherit" component={RouterLink} to="/registro"
              sx={{ fontWeight: 600, opacity: 0.85, '&:hover': { opacity: 1 } }}>
              Registrarse
            </Button>
          )}
          <Button
            variant={isLanding ? 'outlined' : 'text'}
            color={isLanding ? 'primary' : 'inherit'}
            component={RouterLink}
            to="/login"
            sx={isLanding ? {
              borderRadius: 999,
              px: 2.5,
              fontWeight: 600,
            } : {}}
          >
            Ingresar
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
