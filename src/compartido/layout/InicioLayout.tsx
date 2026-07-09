import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import SmallNav from '../nav/SmallNav';
import Nav from '../nav/Nav';
import Footer from '../footer/Footer';

// Layout sin espaciador — la landing page maneja su propio padding superior
const InicioLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SmallNav />
      <Nav />
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default InicioLayout;
