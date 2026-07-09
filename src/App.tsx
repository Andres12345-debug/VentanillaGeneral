import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeContextProvider } from './compartido/theme/ThemeContexto';
import RuteoPrincipal from './ruteo/RuteoPrincipal';
import { CircularProgress, Box } from '@mui/material';

function App() {
  return (
    <BrowserRouter>
      <ThemeContextProvider>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          theme="colored"
          draggable
          closeButton
        />
        <Suspense
          fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
              <CircularProgress />
            </Box>
          }
        >
          <RuteoPrincipal />
        </Suspense>
      </ThemeContextProvider>
    </BrowserRouter>
  );
}

export default App;
