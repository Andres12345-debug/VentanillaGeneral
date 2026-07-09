import React, { ReactNode } from 'react';
import { Button, CircularProgress } from '@mui/material';

interface BotonPrincipalProps {
  cargando: boolean;
  children: ReactNode;
  disabled?: boolean;
  type?: 'submit' | 'button' | 'reset';
  onClick?: () => void;
}

const BotonPrincipal: React.FC<BotonPrincipalProps> = ({
  cargando,
  children,
  disabled,
  type = 'button',
  onClick,
}) => {
  return (
    <Button
      type={type}
      variant="contained"
      fullWidth
      disabled={cargando || disabled}
      onClick={onClick}
      sx={{ py: 1.5 }}
    >
      {cargando ? <CircularProgress size={24} color="inherit" /> : children}
    </Button>
  );
};

export default BotonPrincipal;
