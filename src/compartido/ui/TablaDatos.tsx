import React, { Key, ReactNode } from 'react';
import {
  Box, CircularProgress, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

export interface ColumnaTabla<T> {
  id: string;
  etiqueta: string;
  align?: 'left' | 'center' | 'right';
  ancho?: number | string;
  // Evita que un click en esta celda dispare el onClick de la fila
  // (necesario cuando la columna trae sus propios botones, ej. "Acciones").
  detenerClick?: boolean;
  render: (fila: T) => ReactNode;
}

interface TablaDatosProps<T> {
  columnas: ColumnaTabla<T>[];
  filas: T[];
  claveFila: (fila: T) => Key;
  cargando?: boolean;
  mensajeVacio?: string;
  onRowClick?: (fila: T) => void;
}

function TablaDatos<T>({
  columnas,
  filas,
  claveFila,
  cargando = false,
  mensajeVacio = 'No hay datos para mostrar',
  onRowClick,
}: TablaDatosProps<T>) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const bordeColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';

  if (cargando) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: bordeColor,
        overflow: 'hidden',
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              '& th': {
                fontWeight: 700,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                color: 'text.secondary',
                bgcolor: isDark ? 'rgba(255,255,255,0.04)' : alpha(theme.palette.secondary.main, 0.06),
                borderBottom: '1px solid',
                borderColor: bordeColor,
              },
            }}
          >
            {columnas.map((col) => (
              <TableCell key={col.id} align={col.align} sx={{ width: col.ancho }}>
                {col.etiqueta}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {filas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columnas.length} align="center" sx={{ py: 6, color: 'text.secondary', border: 0 }}>
                {mensajeVacio}
              </TableCell>
            </TableRow>
          ) : (
            filas.map((fila) => (
              <TableRow
                key={claveFila(fila)}
                hover
                onClick={onRowClick ? () => onRowClick(fila) : undefined}
                sx={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  '&:last-of-type td': { borderBottom: 0 },
                  '& td': { borderColor: bordeColor },
                }}
              >
                {columnas.map((col) => (
                  <TableCell
                    key={col.id}
                    align={col.align}
                    onClick={col.detenerClick ? (e) => e.stopPropagation() : undefined}
                  >
                    {col.render(fila)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TablaDatos;
