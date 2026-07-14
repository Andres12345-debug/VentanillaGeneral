import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, Stepper, Step, StepLabel, CircularProgress, TextField,
  Button, Alert, Divider, Switch, FormControlLabel, FormControl,
  InputLabel, Select, MenuItem, FormHelperText, InputAdornment, OutlinedInput, Chip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  ShortTextRounded, NotesRounded, NumbersRounded, CalendarTodayRounded,
  ToggleOnRounded, RadioButtonCheckedRounded, PlaylistAddCheckRounded,
  UploadFileRounded, DownloadRounded, VisibilityRounded,
} from '@mui/icons-material';
import { crearMensaje } from '../../../app/utilidades/funciones/mensaje';
import {
  AsignacionServicio, AsignacionDetalle as AsignacionDetalleType, PasoConProgreso, RespuestaEnviar,
} from '../../../app/servicios/privados/AsignacionServicio';
import { Campo } from '../../../app/servicios/privados/WorkflowServicio';
import { DocumentoValor, esDocumentoValor, descargarArchivo, previsualizarArchivo } from '../../../app/utilidades/dominios/documentos';
import Tarjeta from '../../../compartido/ui/Tarjeta';
import TituloPagina from '../../../compartido/ui/TituloPagina';
import VisorDocumentoDialog from '../../../compartido/ui/VisorDocumentoDialog';

type ValorCampo = string | boolean | string[] | DocumentoValor;
type Valores = Record<number, ValorCampo>;

const MAX_TAMANO_DOCUMENTO_BYTES = 10 * 1024 * 1024;

const valorInicialPorTipo = (campo: Campo): ValorCampo => {
  if (campo.tipoCampo === 'booleano') return false;
  if (campo.tipoCampo === 'seleccion_multiple') return [];
  return '';
};

const tieneValor = (campo: Campo, valor: ValorCampo | undefined): boolean => {
  if (campo.tipoCampo === 'booleano') return typeof valor === 'boolean';
  if (campo.tipoCampo === 'seleccion_multiple') return Array.isArray(valor) && valor.length > 0;
  if (campo.tipoCampo === 'documento') return esDocumentoValor(valor);
  return typeof valor === 'string' && valor.trim() !== '';
};

const AsignacionFormulario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [datos, setDatos] = useState<AsignacionDetalleType | null>(null);
  const [cargando, setCargando] = useState(true);
  const [valores, setValores] = useState<Valores>({});
  const [enviando, setEnviando] = useState(false);
  const [reabriendo, setReabriendo] = useState(false);
  const [preview, setPreview] = useState<{ url: string; mimeType: string; nombre: string; codDocumento: number } | null>(null);

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

  const handleVerDocumento = async (documento: DocumentoValor) => {
    try {
      const { url, mimeType } = await previsualizarArchivo(documento.codDocumento);
      setPreview({ url, mimeType, nombre: documento.nombreOriginal, codDocumento: documento.codDocumento });
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al abrir el documento');
    }
  };

  const handleCerrarPreview = () => {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
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
        <Tarjeta hoverable={false} padding={4} sx={{ maxWidth: 500, textAlign: 'center' }}>
          <Typography variant="h5" color="success.main" sx={{ fontWeight: 700 }} gutterBottom>¡Solicitud aprobada!</Typography>
          <Typography variant="body1" color="text.secondary">Tu trámite ha sido revisado y aprobado exitosamente.</Typography>
        </Tarjeta>
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
      <TituloPagina sx={{ mb: 3 }}>{datos.nombreWorkflow}</TituloPagina>

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
        <Tarjeta hoverable={false} padding={3}>
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
                  codAsignacion={Number(id)}
                  codPaso={pasoActual.codPaso}
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
        </Tarjeta>
      ) : (
        <Tarjeta hoverable={false} padding={4} sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="info.main" sx={{ fontWeight: 600 }}>Todos los pasos completados</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Tu solicitud está siendo revisada. Te notificaremos cuando haya una respuesta.
          </Typography>
        </Tarjeta>
      )}

      {completados.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Pasos completados</Typography>
          {completados.map((p) => (
            <Tarjeta key={p.codPaso} hoverable={false} padding={2} sx={{ mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{p.nombrePaso}</Typography>
              {p.respuestas.length > 0 && p.respuestas.map((r) => {
                const campo = p.campos.find((c) => c.codCampo === r.codCampo);
                const documento = campo?.tipoCampo === 'documento' && esDocumentoValor(r.valorRespuesta)
                  ? r.valorRespuesta
                  : null;
                return (
                  <Typography key={r.codCampo} variant="body2" color="text.secondary">
                    {campo?.etiquetaCampo ?? `Campo #${r.codCampo}`}:{' '}
                    {documento ? (
                      <>
                        <Button
                          size="small"
                          startIcon={<VisibilityRounded fontSize="small" />}
                          onClick={() => handleVerDocumento(documento)}
                        >
                          Ver
                        </Button>
                        <Button
                          size="small"
                          startIcon={<DownloadRounded fontSize="small" />}
                          onClick={() => descargarArchivo(documento.codDocumento, documento.nombreOriginal)}
                        >
                          {documento.nombreOriginal}
                        </Button>
                      </>
                    ) : String(r.valorRespuesta)}
                  </Typography>
                );
              })}
            </Tarjeta>
          ))}
        </Box>
      )}

      <VisorDocumentoDialog
        abierto={!!preview}
        onCerrar={handleCerrarPreview}
        url={preview?.url ?? null}
        mimeType={preview?.mimeType ?? null}
        nombreArchivo={preview?.nombre ?? null}
        onDescargar={preview ? () => descargarArchivo(preview.codDocumento, preview.nombre) : undefined}
      />
    </Box>
  );
};

interface CampoDinamicoProps {
  campo: Campo;
  valor: ValorCampo | undefined;
  codAsignacion: number;
  codPaso: number;
  onChange: (valor: ValorCampo) => void;
}

/** Ícono por tipo de campo: da una pista visual inmediata de qué tipo de dato se espera. */
const IconoCampo: React.FC<{ tipo: Campo['tipoCampo'] }> = ({ tipo }) => {
  const props = { fontSize: 'small' as const, sx: { color: 'text.disabled' } };
  switch (tipo) {
    case 'area_texto': return <NotesRounded {...props} />;
    case 'numero': return <NumbersRounded {...props} />;
    case 'fecha': return <CalendarTodayRounded {...props} />;
    case 'booleano': return <ToggleOnRounded {...props} />;
    case 'documento': return <UploadFileRounded {...props} />;
    case 'texto':
    default: return <ShortTextRounded {...props} />;
  }
};

interface CampoDocumentoProps {
  campo: Campo;
  valor: ValorCampo | undefined;
  codAsignacion: number;
  codPaso: number;
  onChange: (valor: ValorCampo) => void;
}

/**
 * Sube el archivo apenas se selecciona (no espera al "Enviar y continuar"
 * del paso): así el usuario ve de inmediato si falló por tamaño o por
 * estado del paso, en vez de perder el archivo al enviar todo el formulario.
 */
const CampoDocumento: React.FC<CampoDocumentoProps> = ({ campo, valor, codAsignacion, codPaso, onChange }) => {
  const [subiendo, setSubiendo] = useState(false);
  const [preview, setPreview] = useState<{ url: string; mimeType: string; nombre: string; codDocumento: number } | null>(null);
  const documentoActual = esDocumentoValor(valor) ? valor : null;
  const etiqueta = `${campo.etiquetaCampo}${campo.requeridoCampo ? ' *' : ''}`;

  const handleVer = async (documento: DocumentoValor) => {
    try {
      const { url, mimeType } = await previsualizarArchivo(documento.codDocumento);
      setPreview({ url, mimeType, nombre: documento.nombreOriginal, codDocumento: documento.codDocumento });
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al abrir el documento');
    }
  };

  const handleCerrarPreview = () => {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
  };

  const handleSeleccionar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    e.target.value = '';
    if (!archivo) return;

    if (archivo.size > MAX_TAMANO_DOCUMENTO_BYTES) {
      crearMensaje('error', 'El archivo supera el tamaño máximo permitido (10 MB)');
      return;
    }

    setSubiendo(true);
    try {
      const subido = await AsignacionServicio.subirDocumento(codAsignacion, codPaso, campo.codCampo, archivo);
      onChange({ codDocumento: subido.codDocumento, nombreOriginal: subido.nombreOriginal });
      crearMensaje('success', 'Archivo subido correctamente');
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al subir el archivo');
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <IconoCampo tipo="documento" />
        {etiqueta}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          component="label"
          size="small"
          disabled={subiendo}
          startIcon={subiendo ? <CircularProgress size={16} /> : <UploadFileRounded fontSize="small" />}
        >
          {documentoActual ? 'Reemplazar archivo' : 'Seleccionar archivo'}
          <input type="file" hidden onChange={handleSeleccionar} />
        </Button>
        {documentoActual && (
          <>
            <Button
              size="small"
              startIcon={<VisibilityRounded fontSize="small" />}
              onClick={() => handleVer(documentoActual)}
            >
              Ver
            </Button>
            <Button
              size="small"
              startIcon={<DownloadRounded fontSize="small" />}
              onClick={() => descargarArchivo(documentoActual.codDocumento, documentoActual.nombreOriginal)}
            >
              {documentoActual.nombreOriginal}
            </Button>
          </>
        )}
      </Box>

      <VisorDocumentoDialog
        abierto={!!preview}
        onCerrar={handleCerrarPreview}
        url={preview?.url ?? null}
        mimeType={preview?.mimeType ?? null}
        nombreArchivo={preview?.nombre ?? null}
        onDescargar={preview ? () => descargarArchivo(preview.codDocumento, preview.nombre) : undefined}
      />
      <FormHelperText>Cualquier tipo de archivo, tamaño máximo 10 MB.</FormHelperText>
    </Box>
  );
};

/**
 * Los campos de selección se envuelven con un acento de color + ícono propio
 * (distinto al de los campos de texto libre) para que sea evidente, de un
 * vistazo, que se trata de una lista de opciones y no de un campo para escribir.
 */
const ContenedorSeleccion: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    sx={{
      borderLeft: '3px solid',
      borderColor: 'secondary.main',
      borderRadius: '4px',
      pl: 2,
      py: 0.5,
      bgcolor: (theme) => alpha(theme.palette.secondary.main, theme.palette.mode === 'dark' ? 0.08 : 0.05),
    }}
  >
    {children}
  </Box>
);

const CampoDinamico: React.FC<CampoDinamicoProps> = ({ campo, valor, codAsignacion, codPaso, onChange }) => {
  const etiqueta = `${campo.etiquetaCampo}${campo.requeridoCampo ? ' *' : ''}`;
  const sinOpciones = (campo.opcionesCampo ?? []).length === 0;

  switch (campo.tipoCampo) {
    case 'documento':
      return (
        <CampoDocumento
          campo={campo}
          valor={valor}
          codAsignacion={codAsignacion}
          codPaso={codPaso}
          onChange={onChange}
        />
      );

    case 'area_texto':
      return (
        <TextField
          fullWidth multiline rows={4} label={etiqueta} placeholder={campo.placeholderCampo}
          value={(valor as string) ?? ''} onChange={(e) => onChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                  <IconoCampo tipo="area_texto" />
                </InputAdornment>
              ),
            },
          }}
        />
      );

    case 'numero':
      return (
        <TextField
          fullWidth type="number" label={etiqueta} placeholder={campo.placeholderCampo}
          value={(valor as string) ?? ''} onChange={(e) => onChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><IconoCampo tipo="numero" /></InputAdornment>,
            },
          }}
        />
      );

    case 'fecha':
      return (
        <TextField
          fullWidth type="date" label={etiqueta} slotProps={{
            inputLabel: { shrink: true },
            input: {
              startAdornment: <InputAdornment position="start"><IconoCampo tipo="fecha" /></InputAdornment>,
            },
          }}
          value={(valor as string) ?? ''} onChange={(e) => onChange(e.target.value)}
        />
      );

    case 'booleano':
      return (
        <FormControlLabel
          control={<Switch checked={Boolean(valor)} onChange={(e) => onChange(e.target.checked)} />}
          label={(
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <IconoCampo tipo="booleano" />
              <Typography variant="body2">{etiqueta}</Typography>
            </Box>
          )}
        />
      );

    case 'seleccion_unica':
      return (
        <ContenedorSeleccion>
          <FormControl fullWidth disabled={sinOpciones}>
            <InputLabel>{etiqueta}</InputLabel>
            <Select
              value={(valor as string) ?? ''}
              onChange={(e) => onChange(e.target.value)}
              displayEmpty
              input={(
                <OutlinedInput
                  label={etiqueta}
                  startAdornment={(
                    <InputAdornment position="start">
                      <RadioButtonCheckedRounded fontSize="small" sx={{ color: 'secondary.main' }} />
                    </InputAdornment>
                  )}
                />
              )}
              renderValue={(seleccionado) => (
                (seleccionado as string) || (
                  <Typography component="span" color="text.disabled">Selecciona una opción</Typography>
                )
              )}
            >
              {(campo.opcionesCampo ?? []).map((opcion) => (
                <MenuItem key={opcion} value={opcion}>{opcion}</MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {sinOpciones ? 'Este campo aún no tiene opciones configuradas' : (campo.placeholderCampo || 'Elige una opción de la lista')}
            </FormHelperText>
          </FormControl>
        </ContenedorSeleccion>
      );

    case 'seleccion_multiple':
      return (
        <ContenedorSeleccion>
          <FormControl fullWidth disabled={sinOpciones}>
            <InputLabel>{etiqueta}</InputLabel>
            <Select
              multiple
              displayEmpty
              value={(valor as string[]) ?? []}
              onChange={(e) => onChange(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
              input={(
                <OutlinedInput
                  label={etiqueta}
                  startAdornment={(
                    <InputAdornment position="start">
                      <PlaylistAddCheckRounded fontSize="small" sx={{ color: 'secondary.main' }} />
                    </InputAdornment>
                  )}
                />
              )}
              renderValue={(seleccionado) => {
                const seleccionArray = seleccionado as string[];
                if (seleccionArray.length === 0) {
                  return <Typography component="span" color="text.disabled">Selecciona una o varias opciones</Typography>;
                }
                return (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {seleccionArray.map((opcion) => (
                      <Chip key={opcion} label={opcion} size="small" color="secondary" variant="outlined" />
                    ))}
                  </Box>
                );
              }}
            >
              {(campo.opcionesCampo ?? []).map((opcion) => (
                <MenuItem key={opcion} value={opcion}>{opcion}</MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {sinOpciones ? 'Este campo aún no tiene opciones configuradas' : (campo.placeholderCampo || 'Puedes seleccionar varias opciones')}
            </FormHelperText>
          </FormControl>
        </ContenedorSeleccion>
      );

    case 'texto':
    default:
      return (
        <TextField
          fullWidth label={etiqueta} placeholder={campo.placeholderCampo}
          value={(valor as string) ?? ''} onChange={(e) => onChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><IconoCampo tipo="texto" /></InputAdornment>,
            },
          }}
        />
      );
  }
};

export default AsignacionFormulario;
