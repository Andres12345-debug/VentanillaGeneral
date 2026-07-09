import React, { ReactNode } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';

interface FormCardProps {
  titulo: string;
  subtitulo?: string;
  icono?: ReactNode;
  maxWidth?: number | string;
  footer?: ReactNode;
  children: ReactNode;
}

const FormCard: React.FC<FormCardProps> = ({
  titulo,
  subtitulo,
  icono,
  maxWidth = 480,
  footer,
  children,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', px: 2, py: 6 }}>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth,
          borderRadius: 4,
          p: { xs: 3, sm: 5 },
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          boxShadow: isDark ? '0 24px 60px rgba(0,0,0,0.5)' : '0 24px 60px rgba(18,140,126,0.16)',
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 6, background: 'linear-gradient(90deg, #128C7E 0%, #25D366 100%)' }} />

        {icono && (
          <Box
            sx={{
              width: 56, height: 56, borderRadius: 2.5, mb: 2.5,
              bgcolor: 'rgba(37,211,102,0.15)', color: '#128C7E',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {icono}
          </Box>
        )}
        <Typography variant="h5" sx={{ fontWeight: 800, mb: subtitulo ? 0.5 : 3 }}>
          {titulo}
        </Typography>
        {subtitulo && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {subtitulo}
          </Typography>
        )}
        {children}
        {footer && <Box sx={{ mt: 3, textAlign: 'center' }}>{footer}</Box>}
      </Paper>
    </Box>
  );
};

export default FormCard;
