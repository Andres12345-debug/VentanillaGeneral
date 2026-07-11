import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Chip, CircularProgress, Grid,
} from '@mui/material';
import { crearMensaje } from '../../../app/utilidades/funciones/mensaje';
import { AsignacionServicio, AsignacionResumen } from '../../../app/servicios/privados/AsignacionServicio';
import Tarjeta from '../../../compartido/ui/Tarjeta';
import TituloPagina from '../../../compartido/ui/TituloPagina';

type ColorChip = 'default' | 'warning' | 'info' | 'success' | 'error' | 'primary' | 'secondary';

const colorPorEstado: Record<string, ColorChip> = {
  pendiente: 'warning', en_progreso: 'info', en_revision: 'primary', aprobado: 'success', rechazado: 'error',
};

const MisAsignaciones: React.FC = () => {
  const navigate = useNavigate();
  const [asignaciones, setAsignaciones] = useState<AsignacionResumen[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        setAsignaciones(await AsignacionServicio.miAsignaciones());
      } catch (error: unknown) {
        crearMensaje('error', error instanceof Error ? error.message : 'Error al cargar tus trámites');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  if (cargando) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 4 }}>
      <TituloPagina sx={{ mb: 3 }}>Mis trámites</TituloPagina>

      {asignaciones.length === 0 ? (
        <Typography color="text.secondary">No tienes trámites asignados aún.</Typography>
      ) : (
        <Grid container spacing={3}>
          {asignaciones.map((a) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={a.codAsignacion}>
              <Tarjeta
                hoverable={false}
                pie={(
                  <>
                    {(a.estadoAsignacion === 'pendiente' || a.estadoAsignacion === 'en_progreso') && (
                      <Button size="small" variant="contained" onClick={() => navigate(`/dashboard/mis-tramites/${a.codAsignacion}`)}>
                        Continuar
                      </Button>
                    )}
                    {(a.estadoAsignacion === 'aprobado' || a.estadoAsignacion === 'rechazado') && (
                      <Button size="small" variant="outlined" onClick={() => navigate(`/dashboard/mis-tramites/${a.codAsignacion}`)}>
                        Ver resultado
                      </Button>
                    )}
                    {a.estadoAsignacion === 'en_revision' && (
                      <Button size="small" variant="outlined" color="primary" onClick={() => navigate(`/dashboard/mis-tramites/${a.codAsignacion}`)}>
                        Ver detalle
                      </Button>
                    )}
                  </>
                )}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                  {a.nombreWorkflow ?? `Trámite #${a.codAsignacion}`}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  <Chip label={a.estadoAsignacion.replace('_', ' ')} color={colorPorEstado[a.estadoAsignacion] ?? 'default'} size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Fecha: {new Date(a.fechaAsignacion).toLocaleDateString('es-CO')}
                </Typography>
              </Tarjeta>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MisAsignaciones;
