import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, CircularProgress, Select, MenuItem, FormControl,
  InputLabel, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
} from '@mui/material';
import { crearMensaje } from '../../../../app/utilidades/funciones/mensaje';
import { AsignacionServicio, AsignacionResumen } from '../../../../app/servicios/privados/AsignacionServicio';
import { ESTADO_ASIGNACION } from '../../../../app/utilidades/dominios/estados';

const TODOS = 'todos';

const AsignacionesLista: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workflowId = searchParams.get('workflow');

  const [asignaciones, setAsignaciones] = useState<AsignacionResumen[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState(TODOS);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [asignacionActiva, setAsignacionActiva] = useState<AsignacionResumen | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [procesando, setProcesando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const datos = workflowId
        ? await AsignacionServicio.listarPorWorkflow(Number(workflowId))
        : await AsignacionServicio.listar();
      setAsignaciones(datos);
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al cargar asignaciones');
    } finally {
      setCargando(false);
    }
  }, [workflowId]);

  useEffect(() => { cargar(); }, [cargar]);

  const filtradas = filtroEstado === TODOS ? asignaciones : asignaciones.filter((a) => a.estadoAsignacion === filtroEstado);

  const handleAprobar = async (a: AsignacionResumen) => {
    if (!window.confirm('¿Aprobar esta asignación?')) return;
    setProcesando(true);
    try {
      await AsignacionServicio.aprobar(a.codAsignacion);
      crearMensaje('success', 'Asignación aprobada');
      cargar();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al aprobar');
    } finally {
      setProcesando(false);
    }
  };

  const handleRechazar = async () => {
    if (!asignacionActiva || !motivoRechazo.trim()) {
      crearMensaje('error', 'El motivo de rechazo es obligatorio');
      return;
    }
    setProcesando(true);
    try {
      await AsignacionServicio.rechazar(asignacionActiva.codAsignacion, { motivoRechazo });
      crearMensaje('success', 'Asignación rechazada');
      setDialogoAbierto(false);
      cargar();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al rechazar');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Asignaciones {workflowId ? `— Workflow #${workflowId}` : ''}
        </Typography>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Filtrar por estado</InputLabel>
          <Select value={filtroEstado} label="Filtrar por estado" onChange={(e) => setFiltroEstado(e.target.value)}>
            <MenuItem value={TODOS}>Todos</MenuItem>
            {(Object.keys(ESTADO_ASIGNACION) as Array<keyof typeof ESTADO_ASIGNACION>).map((k) => (
              <MenuItem key={k} value={k}>{ESTADO_ASIGNACION[k].label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {cargando ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Workflow</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtradas.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center">No hay asignaciones</TableCell></TableRow>
              ) : (
                filtradas.map((a) => {
                  const estadoConf = ESTADO_ASIGNACION[a.estadoAsignacion];
                  return (
                    <TableRow key={a.codAsignacion} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/dashboard/asignaciones/${a.codAsignacion}`)}>
                      <TableCell>{a.codAsignacion}</TableCell>
                      <TableCell>{a.nombreCliente}</TableCell>
                      <TableCell>{a.nombreWorkflow}</TableCell>
                      <TableCell>
                        <Chip label={estadoConf?.label ?? a.estadoAsignacion} color={estadoConf?.color ?? 'default'} size="small" />
                      </TableCell>
                      <TableCell>{new Date(a.fechaAsignacion).toLocaleDateString('es-CO')}</TableCell>
                      <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                        {a.estadoAsignacion === 'en_revision' && (
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Button size="small" variant="contained" color="success" disabled={procesando} onClick={() => handleAprobar(a)}>Aprobar</Button>
                            <Button size="small" variant="outlined" color="error" disabled={procesando} onClick={() => { setAsignacionActiva(a); setMotivoRechazo(''); setDialogoAbierto(true); }}>Rechazar</Button>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogoAbierto} onClose={() => setDialogoAbierto(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Rechazar asignación</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField fullWidth label="Motivo de rechazo" multiline rows={3} value={motivoRechazo} onChange={(e) => setMotivoRechazo(e.target.value)} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogoAbierto(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleRechazar} disabled={procesando}>
            {procesando ? 'Rechazando...' : 'Confirmar rechazo'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AsignacionesLista;
