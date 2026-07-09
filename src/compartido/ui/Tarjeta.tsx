import React, { ReactNode } from 'react';
import { Card, CardActionArea, CardActions, CardContent, SxProps, Theme, useTheme } from '@mui/material';

interface TarjetaProps {
  children: ReactNode;
  pie?: ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
  sx?: SxProps<Theme>;
}

const Tarjeta: React.FC<TarjetaProps> = ({ children, pie, onClick, hoverable = true, sx }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const contenido = (
    <CardContent sx={{ flex: 1, p: 3.5, '&:last-child': { pb: 3.5 } }}>
      {children}
    </CardContent>
  );

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: '1px solid',
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        ...(hoverable && {
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: isDark ? '0 12px 32px rgba(0,0,0,0.4)' : '0 12px 32px rgba(0,0,0,0.12)',
          },
        }),
        ...sx,
      }}
    >
      {onClick ? (
        <CardActionArea onClick={onClick} sx={{ flex: 1, display: 'flex', alignItems: 'stretch' }}>
          {contenido}
        </CardActionArea>
      ) : (
        contenido
      )}
      {pie && <CardActions>{pie}</CardActions>}
    </Card>
  );
};

export default Tarjeta;
