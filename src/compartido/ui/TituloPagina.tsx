import React, { ReactNode } from 'react';
import { Typography, SxProps, Theme } from '@mui/material';

interface TituloPaginaProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

// Título de página/sección unificado para todo el dashboard: h5/600 en
// todas las listas y detalles (antes había un h4 suelto en TableroPrincipal).
const TituloPagina: React.FC<TituloPaginaProps> = ({ children, sx }) => (
  <Typography variant="h5" sx={{ fontWeight: 600, ...sx }}>
    {children}
  </Typography>
);

export default TituloPagina;
