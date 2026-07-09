import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import SmallNav from '../nav/SmallNav';
import Nav from '../nav/Nav';
import Footer from '../footer/Footer';

const SMALL_NAV_HEIGHT = 48;
const NAV_HEIGHT = 64;
const SPACER = SMALL_NAV_HEIGHT + NAV_HEIGHT;

const MainLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SmallNav />
      <Nav />
      {/* Espaciador para compensar los dos AppBar fijos */}
      <Box sx={{ height: SPACER }} />
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;
