import React, { useState, ReactNode } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface CampoTextoProps {
  nombre?: string;
  etiqueta?: string;
  valor?: string;
  tipo?: string;
  error?: string | boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  icono?: ReactNode;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  autoFocus?: boolean;
  autoComplete?: string;
}

const CampoTexto: React.FC<CampoTextoProps> = ({
  nombre,
  etiqueta,
  valor,
  tipo,
  error,
  onChange,
  icono,
  multiline,
  rows,
  disabled,
  required,
  placeholder,
  fullWidth = true,
  size,
  autoFocus,
  autoComplete,
}) => {
  const [mostrar, setMostrar] = useState(false);
  const esPassword = tipo === 'password';
  const tipoEfectivo = esPassword ? (mostrar ? 'text' : 'password') : tipo;
  const mensajeError = typeof error === 'string' ? error : undefined;
  const tieneError = Boolean(error);

  return (
    <TextField
      name={nombre}
      label={etiqueta}
      value={valor ?? ''}
      type={tipoEfectivo}
      error={tieneError}
      helperText={mensajeError}
      onChange={onChange}
      fullWidth={fullWidth}
      multiline={multiline}
      rows={rows}
      disabled={disabled}
      required={required}
      placeholder={placeholder}
      size={size}
      autoFocus={autoFocus}
      autoComplete={autoComplete}
      slotProps={{
        input: {
          sx: { borderRadius: 2.5, minHeight: 52 },
          startAdornment: icono ? (
            <InputAdornment position="start">{icono}</InputAdornment>
          ) : undefined,
          endAdornment: esPassword ? (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setMostrar((v) => !v)}
                edge="end"
                tabIndex={-1}
                aria-label={mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {mostrar ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
};

export default CampoTexto;
