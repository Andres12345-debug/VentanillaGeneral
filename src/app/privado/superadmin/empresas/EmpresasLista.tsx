import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, IconButton, Chip, CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { crearMensaje } from '../../../utilidades/funciones/mensaje';
import { EmpresaServicio, Empresa } from '../../../servicios/privados/EmpresaServicio';

const EmpresasLista: React.FC = () => {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarEmpresas = useCallback(async () => {
    setCargando(true);
    try {
      const datos = await EmpresaServicio.listar();
      setEmpresas(datos);
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al cargar empresas');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargarEmpresas(); }, [cargarEmpresas]);

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Empresas</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/dashboard/empresas/crear')}>
          Nueva Empresa
        </Button>
      </Box>

      {cargando ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Fecha de creación</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {empresas.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center">No hay empresas registradas</TableCell></TableRow>
              ) : (
                empresas.map((empresa) => (
                  <TableRow key={empresa.codEmpresa} hover>
                    <TableCell>{empresa.codEmpresa}</TableCell>
                    <TableCell>{empresa.nombreEmpresa}</TableCell>
                    <TableCell>
                      <Chip label={empresa.estadoEmpresa ? 'Activa' : 'Inactiva'} color={empresa.estadoEmpresa ? 'success' : 'default'} size="small" />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {empresa.esDemo && <Chip label="Demo" color="info" size="small" />}
                        {empresa.esPruebaGratis && <Chip label="Prueba gratis" color="warning" size="small" />}
                      </Box>
                    </TableCell>
                    <TableCell>{new Date(empresa.fechaCreacion).toLocaleDateString('es-CO')}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary" onClick={() => navigate(`/dashboard/empresas/${empresa.codEmpresa}`)} title="Ver detalle">
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default EmpresasLista;
