import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, Chip, CircularProgress, Paper, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Divider, Alert, Accordion,
  AccordionSummary, AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { crearMensaje } from '../../../../app/utilidades/funciones/mensaje';
import { AsignacionServicio, AsignacionDetalle as AsignacionDetalleType } from '../../../../app/servicios/privados/AsignacionServicio';

type ColorChip = 'default' | 'warning' | 'info' | 'success' | 'error' | 'primary' | 'secondary';

const colorPorEstado: Record<string, ColorChip> = {
  pendiente: 'warning', en_progreso: 'info', en_revision: 'primary', aprobado: 'success', rechazado: 'error',
};

const AsignacionDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [datos, setDatos] = useState<AsignacionDetalleType | null>(null);
  const [cargando, setCargando] = useState(true);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [procesando, setProcesando] = useState(false);

  const cargar = useCallback(async () => {
    if (!id) return;
    setCargando(true);
    try {
      setDatos(await AsignacionServicio.detalle(Number(id)));
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al cargar la asignación');
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => { cargar(); }, [cargar]);

  const handleAprobar = async () => {
    if (!id || !window.confirm('¿Aprobar esta asignación?')) return;
    setProcesando(true);
    try {
      await AsignacionServicio.aprobar(Number(id));
      crearMensaje('success', 'Asignación aprobada');
      cargar();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al aprobar');
    } finally {
      setProcesando(false);
    }
  };

  const handleRechazar = async () => {
    if (!id) return;
    if (!motivoRechazo.trim()) { crearMensaje('error', 'El motivo de rechazo es obligatorio'); return; }
    setProcesando(true);
    try {
      await AsignacionServicio.rechazar(Number(id), { motivoRechazo });
      crearMensaje('success', 'Asignación rechazada');
      setDialogoAbierto(false);
      cargar();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al rechazar');
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>;
  if (!datos) return <Box sx={{ p: 4 }}><Typography color="error">No se encontró la asignación</Typography></Box>;

  const pasos = datos.etapas.flatMap((etapa) => etapa.pasos);

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>
            Asignación #{datos.codAsignacion}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label={datos.estadoAsignacion.replace('_', ' ')} color={colorPorEstado[datos.estadoAsignacion] ?? 'default'} />
            <Chip label={`Cliente: ${datos.nombreCliente}`} variant="outlined" />
            <Chip label={`Workflow: ${datos.nombreWorkflow}`} variant="outlined" />
            <Chip label={`Fecha: ${new Date(datos.fechaAsignacion).toLocaleDateString('es-CO')}`} variant="outlined" />
          </Box>
        </Box>

        {datos.estadoAsignacion === 'en_revision' && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="success" disabled={procesando} onClick={handleAprobar}>Aprobar</Button>
            <Button variant="outlined" color="error" disabled={procesando} onClick={() => { setMotivoRechazo(''); setDialogoAbierto(true); }}>Rechazar</Button>
          </Box>
        )}
      </Box>

      {datos.motivoRechazo && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Motivo de rechazo:</Typography>
          {datos.motivoRechazo}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }} gutterBottom>Información del revisor</Typography>
        {datos.codRevisor ? (
          <Typography variant="body2">Revisor asignado: {datos.nombreRevisor ?? `#${datos.codRevisor}`}</Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">Sin revisor asignado (revisará el administrador)</Typography>
        )}
      </Paper>

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Progreso de pasos</Typography>

      {pasos.length === 0 ? (
        <Typography color="text.secondary">No hay pasos registrados aún.</Typography>
      ) : (
        pasos.map((paso) => (
          <Accordion key={paso.codPaso} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {paso.estadoEjecucionPaso === 'completado'
                  ? <CheckCircleIcon color="success" fontSize="small" />
                  : <HourglassEmptyIcon color="disabled" fontSize="small" />}
                <Typography sx={{ fontWeight: paso.estadoEjecucionPaso === 'completado' ? 600 : 400 }}>
                  {paso.nombrePaso}
                </Typography>
                <Chip label={paso.estadoEjecucionPaso} size="small" color={paso.estadoEjecucionPaso === 'completado' ? 'success' : 'default'} sx={{ ml: 1 }} />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {paso.respuestas.length > 0 ? (
                <>
                  <Divider sx={{ mb: 1 }} />
                  {paso.respuestas.map((r) => {
                    const campo = paso.campos.find((c) => c.codCampo === r.codCampo);
                    return (
                      <Box key={r.codCampo} sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140 }}>
                          {campo?.etiquetaCampo ?? `Campo #${r.codCampo}`}:
                        </Typography>
                        <Typography variant="body2">{String(r.valorRespuesta)}</Typography>
                      </Box>
                    );
                  })}
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">Sin respuestas enviadas</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))
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

export default AsignacionDetalle;
