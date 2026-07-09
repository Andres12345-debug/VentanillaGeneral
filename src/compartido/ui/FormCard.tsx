import React, { ReactNode } from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface FormCardProps {
  titulo: string;
  subtitulo?: string;
  maxWidth?: number | string;
  children: ReactNode;
}

const FormCard: React.FC<FormCardProps> = ({
  titulo,
  subtitulo,
  maxWidth = 480,
  children,
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', px: 2 }}>
      <Paper
        elevation={8}
        sx={{
          width: '100%',
          maxWidth,
          borderRadius: 4,
          p: { xs: 3, sm: 4 },
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: subtitulo ? 0.5 : 2 }}>
          {titulo}
        </Typography>
        {subtitulo && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {subtitulo}
          </Typography>
        )}
        {children}
      </Paper>
    </Box>
  );
};

export default FormCard;
