import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Nav from '../nav/Nav';
import Footer from '../footer/Footer';

const NAV_HEIGHT = 64;

const MainLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Nav />
      {/* Espaciador para compensar el AppBar fijo */}
      <Box sx={{ height: NAV_HEIGHT }} />
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;
