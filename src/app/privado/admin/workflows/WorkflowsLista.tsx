import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, IconButton, Chip, CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { crearMensaje } from '../../../../app/utilidades/funciones/mensaje';
import { WorkflowServicio, Workflow } from '../../../../app/servicios/privados/WorkflowServicio';

const WorkflowsLista: React.FC = () => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarWorkflows = useCallback(async () => {
    setCargando(true);
    try {
      const datos = await WorkflowServicio.listar();
      setWorkflows(datos);
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al cargar workflows');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargarWorkflows(); }, [cargarWorkflows]);

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este workflow?')) return;
    try {
      await WorkflowServicio.eliminar(id);
      crearMensaje('success', 'Workflow eliminado correctamente');
      cargarWorkflows();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al eliminar');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Workflows</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/dashboard/workflows/crear')}>
          Nuevo Workflow
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
                <TableCell>Fecha de creación</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workflows.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center">No hay workflows registrados</TableCell></TableRow>
              ) : (
                workflows.map((wf) => (
                  <TableRow key={wf.codWorkflow} hover>
                    <TableCell>{wf.codWorkflow}</TableCell>
                    <TableCell>{wf.nombreWorkflow}</TableCell>
                    <TableCell>
                      <Chip label={wf.estadoWorkflow} color={wf.estadoWorkflow === 'borrador' ? 'default' : 'success'} size="small" />
                    </TableCell>
                    <TableCell>{new Date(wf.fechaCreacion).toLocaleDateString('es-CO')}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary" onClick={() => navigate(`/dashboard/workflows/${wf.codWorkflow}`)} title="Ver detalle">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleEliminar(wf.codWorkflow)} title="Eliminar">
                        <DeleteIcon />
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

export default WorkflowsLista;
