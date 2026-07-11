import React, { ReactNode } from 'react';
import { Card, CardActionArea, CardActions, CardContent, SxProps, Theme, useTheme } from '@mui/material';
import { sombraHover } from '../theme/ThemeContexto';

interface TarjetaProps {
  children: ReactNode;
  pie?: ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: number;
  sx?: SxProps<Theme>;
}

const Tarjeta: React.FC<TarjetaProps> = ({ children, pie, onClick, hoverable = true, padding = 3.5, sx }) => {
  const theme = useTheme();

  const contenido = (
    <CardContent sx={{ flex: 1, p: padding, '&:last-child': { pb: padding } }}>
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
        borderColor: 'divider',
        transition: 'transform 0.2s, box-shadow 0.2s',
        ...(hoverable && {
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: sombraHover(theme),
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
