import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, IconButton, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { crearMensaje } from '../../../../app/utilidades/funciones/mensaje';
import { WorkflowServicio, Workflow } from '../../../../app/servicios/privados/WorkflowServicio';
import { ESTADO_WORKFLOW } from '../../../../app/utilidades/dominios/estados';
import TablaDatos, { ColumnaTabla } from '../../../../compartido/ui/TablaDatos';
import TituloPagina from '../../../../compartido/ui/TituloPagina';

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

  const columnas: ColumnaTabla<Workflow>[] = [
    { id: 'id', etiqueta: 'ID', render: (wf) => wf.codWorkflow },
    { id: 'nombre', etiqueta: 'Nombre', render: (wf) => wf.nombreWorkflow },
    {
      id: 'estado',
      etiqueta: 'Estado',
      render: (wf) => (
        <Chip
          label={ESTADO_WORKFLOW[wf.estadoWorkflow]?.label ?? wf.estadoWorkflow}
          color={ESTADO_WORKFLOW[wf.estadoWorkflow]?.color ?? 'default'}
          size="small"
        />
      ),
    },
    { id: 'fecha', etiqueta: 'Fecha de creación', render: (wf) => new Date(wf.fechaCreacion).toLocaleDateString('es-CO') },
    {
      id: 'acciones',
      etiqueta: 'Acciones',
      align: 'center',
      render: (wf) => (
        <>
          <IconButton size="small" color="primary" onClick={() => navigate(`/dashboard/workflows/${wf.codWorkflow}`)} title="Ver detalle">
            <VisibilityIcon />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleEliminar(wf.codWorkflow)} title="Eliminar">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TituloPagina>Workflows</TituloPagina>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/dashboard/workflows/crear')}>
          Nuevo Workflow
        </Button>
      </Box>

      <TablaDatos
        columnas={columnas}
        filas={workflows}
        claveFila={(wf) => wf.codWorkflow}
        cargando={cargando}
        mensajeVacio="No hay workflows registrados"
      />
    </Box>
  );
};

export default WorkflowsLista;
