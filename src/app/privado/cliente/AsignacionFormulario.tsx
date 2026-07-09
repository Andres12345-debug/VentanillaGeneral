import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, Stepper, Step, StepLabel, CircularProgress, TextField,
  Button, Alert, Paper, Divider, Switch, FormControlLabel, FormControl,
  InputLabel, Select, MenuItem, FormHelperText,
} from '@mui/material';
import { crearMensaje } from '../../../app/utilidades/funciones/mensaje';
import {
  AsignacionServicio, AsignacionDetalle as AsignacionDetalleType, PasoConProgreso, RespuestaEnviar,
} from '../../../app/servicios/privados/AsignacionServicio';
import { Campo } from '../../../app/servicios/privados/WorkflowServicio';

type ValorCampo = string | boolean | string[];
type Valores = Record<number, ValorCampo>;

const valorInicialPorTipo = (campo: Campo): ValorCampo => {
  if (campo.tipoCampo === 'booleano') return false;
  if (campo.tipoCampo === 'seleccion_multiple') return [];
  return '';
};

const tieneValor = (campo: Campo, valor: ValorCampo | undefined): boolean => {
  if (campo.tipoCampo === 'booleano') return typeof valor === 'boolean';
  if (campo.tipoCampo === 'seleccion_multiple') return Array.isArray(valor) && valor.length > 0;
  return typeof valor === 'string' && valor.trim() !== '';
};

const AsignacionFormulario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [datos, setDatos] = useState<AsignacionDetalleType | null>(null);
  const [cargando, setCargando] = useState(true);
  const [valores, setValores] = useState<Valores>({});
  const [enviando, setEnviando] = useState(false);
  const [reabriendo, setReabriendo] = useState(false);

  const cargar = useCallback(async () => {
    if (!id) return;
    setCargando(true);
    try {
      const detalle = await AsignacionServicio.detalle(Number(id));
      setDatos(detalle);
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al cargar el formulario');
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => { cargar(); }, [cargar]);

  const pasos = datos?.etapas.flatMap((etapa) => etapa.pasos) ?? [];
  const completados = pasos.filter((p) => p.estadoEjecucionPaso === 'completado');
  const pasoActual: PasoConProgreso | undefined = pasos.find((p) => p.estadoEjecucionPaso === 'pendiente');

  useEffect(() => {
    if (!pasoActual) return;
    const iniciales: Valores = {};
    for (const campo of pasoActual.campos) {
      iniciales[campo.codCampo] = valorInicialPorTipo(campo);
    }
    setValores(iniciales);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pasoActual?.codPaso]);

  const handleValorChange = (codCampo: number, valor: ValorCampo) => {
    setValores((prev) => ({ ...prev, [codCampo]: valor }));
  };

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !pasoActual) return;

    const faltantes = pasoActual.campos.filter(
      (campo) => campo.requeridoCampo && !tieneValor(campo, valores[campo.codCampo])
    );

    if (faltantes.length > 0) {
      crearMensaje('error', `Completa los campos obligatorios: ${faltantes.map((c) => c.etiquetaCampo).join(', ')}`);
      return;
    }

    const respuestas: RespuestaEnviar[] = pasoActual.campos
      .filter((campo) => tieneValor(campo, valores[campo.codCampo]))
      .map((campo) => ({
        codCampo: campo.codCampo,
        valor: campo.tipoCampo === 'numero' ? Number(valores[campo.codCampo]) : valores[campo.codCampo],
      }));

    if (respuestas.length === 0) {
      crearMensaje('error', 'Debes ingresar al menos una respuesta');
      return;
    }

    setEnviando(true);
    try {
      await AsignacionServicio.enviarRespuestas(Number(id), pasoActual.codPaso, { respuestas });
      crearMensaje('success', 'Respuestas enviadas correctamente');
      cargar();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al enviar respuestas');
    } finally {
      setEnviando(false);
    }
  };

  const handleReabrir = async () => {
    if (!id) return;
    setReabriendo(true);
    try {
      await AsignacionServicio.reabrir(Number(id));
      crearMensaje('success', 'Solicitud reabierta');
      cargar();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al reabrir la solicitud');
    } finally {
      setReabriendo(false);
    }
  };

  if (cargando) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>;
  if (!datos) return <Box sx={{ p: 4 }}><Typography color="error">No se encontró el formulario</Typography></Box>;

  if (datos.estadoAsignacion === 'aprobado') {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <Paper elevation={2} sx={{ p: 4, maxWidth: 500, textAlign: 'center' }}>
          <Typography variant="h5" color="success.main" sx={{ fontWeight: 700 }} gutterBottom>¡Solicitud aprobada!</Typography>
          <Typography variant="body1" color="text.secondary">Tu trámite ha sido revisado y aprobado exitosamente.</Typography>
        </Paper>
      </Box>
    );
  }

  if (datos.estadoAsignacion === 'rechazado') {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }} gutterBottom>Solicitud rechazada</Typography>
          {datos.motivoRechazo && <Typography variant="body2">{datos.motivoRechazo}</Typography>}
        </Alert>
        <Button variant="contained" onClick={handleReabrir} disabled={reabriendo}>
          {reabriendo ? 'Reabriendo...' : 'Reabrir solicitud'}
        </Button>
      </Box>
    );
  }

  if (datos.estadoAsignacion === 'en_revision') {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>En revisión</Typography>
          <Typography variant="body2">Tu solicitud está siendo revisada por el equipo. Te notificaremos cuando haya una respuesta.</Typography>
        </Alert>
      </Box>
    );
  }

  const pasoActivoIndex = pasos.findIndex((p) => p.estadoEjecucionPaso === 'pendiente');

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>{datos.nombreWorkflow}</Typography>

      {pasos.length > 0 && (
        <Stepper activeStep={pasoActivoIndex === -1 ? pasos.length : pasoActivoIndex} alternativeLabel sx={{ mb: 4 }}>
          {pasos.map((p) => (
            <Step key={p.codPaso} completed={p.estadoEjecucionPaso === 'completado'}>
              <StepLabel>{p.nombrePaso}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}

      {pasoActual ? (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>{pasoActual.nombrePaso}</Typography>
          <Divider sx={{ mb: 3 }} />
          {pasoActual.campos.length === 0 ? (
            <Alert severity="warning">Este paso todavía no tiene un formulario configurado.</Alert>
          ) : (
            <Box component="form" onSubmit={handleEnviar} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {pasoActual.campos.map((campo) => (
                <CampoDinamico
                  key={campo.codCampo}
                  campo={campo}
                  valor={valores[campo.codCampo]}
                  onChange={(valor) => handleValorChange(campo.codCampo, valor)}
                />
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained" size="large" disabled={enviando}>
                  {enviando ? 'Enviando...' : 'Enviar y continuar'}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      ) : (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="info.main" sx={{ fontWeight: 600 }}>Todos los pasos completados</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Tu solicitud está siendo revisada. Te notificaremos cuando haya una respuesta.
          </Typography>
        </Paper>
      )}

      {completados.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Pasos completados</Typography>
          {completados.map((p) => (
            <Paper key={p.codPaso} elevation={1} sx={{ p: 2, mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{p.nombrePaso}</Typography>
              {p.respuestas.length > 0 && p.respuestas.map((r) => {
                const campo = p.campos.find((c) => c.codCampo === r.codCampo);
                return (
                  <Typography key={r.codCampo} variant="body2" color="text.secondary">
                    {campo?.etiquetaCampo ?? `Campo #${r.codCampo}`}: {String(r.valorRespuesta)}
                  </Typography>
                );
              })}
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

interface CampoDinamicoProps {
  campo: Campo;
  valor: ValorCampo | undefined;
  onChange: (valor: ValorCampo) => void;
}

const CampoDinamico: React.FC<CampoDinamicoProps> = ({ campo, valor, onChange }) => {
  const etiqueta = `${campo.etiquetaCampo}${campo.requeridoCampo ? ' *' : ''}`;

  switch (campo.tipoCampo) {
    case 'area_texto':
      return (
        <TextField
          fullWidth multiline rows={4} label={etiqueta} placeholder={campo.placeholderCampo}
          value={(valor as string) ?? ''} onChange={(e) => onChange(e.target.value)}
        />
      );

    case 'numero':
      return (
        <TextField
          fullWidth type="number" label={etiqueta} placeholder={campo.placeholderCampo}
          value={(valor as string) ?? ''} onChange={(e) => onChange(e.target.value)}
        />
      );

    case 'fecha':
      return (
        <TextField
          fullWidth type="date" label={etiqueta} slotProps={{ inputLabel: { shrink: true } }}
          value={(valor as string) ?? ''} onChange={(e) => onChange(e.target.value)}
        />
      );

    case 'booleano':
      return (
        <FormControlLabel
          control={<Switch checked={Boolean(valor)} onChange={(e) => onChange(e.target.checked)} />}
          label={etiqueta}
        />
      );

    case 'seleccion_unica':
      return (
        <FormControl fullWidth>
          <InputLabel>{etiqueta}</InputLabel>
          <Select label={etiqueta} value={(valor as string) ?? ''} onChange={(e) => onChange(e.target.value)}>
            {(campo.opcionesCampo ?? []).map((opcion) => (
              <MenuItem key={opcion} value={opcion}>{opcion}</MenuItem>
            ))}
          </Select>
          {campo.placeholderCampo && <FormHelperText>{campo.placeholderCampo}</FormHelperText>}
        </FormControl>
      );

    case 'seleccion_multiple':
      return (
        <FormControl fullWidth>
          <InputLabel>{etiqueta}</InputLabel>
          <Select
            multiple
            label={etiqueta}
            value={(valor as string[]) ?? []}
            onChange={(e) => onChange(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
          >
            {(campo.opcionesCampo ?? []).map((opcion) => (
              <MenuItem key={opcion} value={opcion}>{opcion}</MenuItem>
            ))}
          </Select>
        </FormControl>
      );

    case 'texto':
    default:
      return (
        <TextField
          fullWidth label={etiqueta} placeholder={campo.placeholderCampo}
          value={(valor as string) ?? ''} onChange={(e) => onChange(e.target.value)}
        />
      );
  }
};

export default AsignacionFormulario;
