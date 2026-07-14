import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails,
  Chip, CircularProgress, Button, List, ListItem, ListItemText, ListItemIcon,
  IconButton, Switch, FormControlLabel, Paper,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { crearMensaje } from '../../../../app/utilidades/funciones/mensaje';
import {
  WorkflowServicio, WorkflowDetalle as WorkflowDetalleType, Etapa, Paso, Formulario, Campo,
} from '../../../../app/servicios/privados/WorkflowServicio';
import { TIPO_CAMPO } from '../../../../app/utilidades/dominios/tipoCampo';
import { ESTADO_WORKFLOW } from '../../../../app/utilidades/dominios/estados';
import { useUsuarioToken } from '../../../../app/utilidades/auth/usuarioToken';
import TituloPagina from '../../../../compartido/ui/TituloPagina';
import EtapaDialogo from './dialogos/EtapaDialogo';
import PasoDialogo from './dialogos/PasoDialogo';
import FormularioDialogo from './dialogos/FormularioDialogo';
import CampoDialogo from './dialogos/CampoDialogo';
import AsignarClientesDialogo from './dialogos/AsignarClientesDialogo';

// Cada diálogo (Etapa/Paso/Formulario/Campo/Asignar clientes) es dueño de su
// propio formulario y su propia llamada al backend — este componente solo
// decide CUÁL diálogo está abierto y sobre QUÉ padre/registro, y refresca
// el árbol cuando alguno avisa que guardó algo.
interface EtapaDialogoTarget { abierto: boolean; editando: Etapa | null }
interface PasoDialogoTarget { abierto: boolean; codEtapa: number | null; editando: Paso | null }
interface FormularioDialogoTarget { abierto: boolean; codPaso: number | null; editando: Formulario | null }
interface CampoDialogoTarget { abierto: boolean; codFormulario: number | null; editando: Campo | null }

const CERRADO = { abierto: false, editando: null } as const;

// Reordenar "mueve un elemento con su vecino adyacente" es la misma lógica
// para etapas/pasos/campos (ordenar, ubicar al vecino, intercambiar el
// campo de orden) — antes estaba copiada 3 veces en moverEtapa/moverPaso/
// moverCampo. Como el backend no ofrece un endpoint transaccional de swap,
// las dos actualizaciones siguen siendo 2 requests independientes, pero acá
// van secuenciales (no Promise.all) y si la segunda falla se intenta
// revertir la primera, para no dejar dos elementos con el mismo orden.
async function moverPorOrden<T>(
  lista: T[],
  elemento: T,
  direccion: -1 | 1,
  obtenerId: (item: T) => number,
  obtenerOrden: (item: T) => number,
  actualizarOrden: (id: number, orden: number) => Promise<unknown>,
): Promise<boolean> {
  const ordenados = [...lista].sort((a, b) => obtenerOrden(a) - obtenerOrden(b));
  const indice = ordenados.findIndex((item) => obtenerId(item) === obtenerId(elemento));
  const vecino = ordenados[indice + direccion];
  if (!vecino) return false;

  const ordenOriginal = obtenerOrden(elemento);
  const ordenVecino = obtenerOrden(vecino);

  await actualizarOrden(obtenerId(elemento), ordenVecino);
  try {
    await actualizarOrden(obtenerId(vecino), ordenOriginal);
  } catch (error) {
    await actualizarOrden(obtenerId(elemento), ordenOriginal).catch(() => {});
    throw error;
  }
  return true;
}

const WorkflowDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Asignar workflows a clientes es exclusivo de admin (el backend rechaza
  // a funcionario con 403) — sin este chequeo, un funcionario podía abrir
  // el diálogo, elegir clientes y recién ahí enterarse de que no puede.
  const usuario = useUsuarioToken();
  const esAdmin = usuario?.role === 'admin';
  const [workflow, setWorkflow] = useState<WorkflowDetalleType | null>(null);
  const [cargando, setCargando] = useState(true);
  const [actualizandoPublico, setActualizandoPublico] = useState(false);
  const [actualizandoEstado, setActualizandoEstado] = useState(false);

  const [dialogoAsignarAbierto, setDialogoAsignarAbierto] = useState(false);
  const [etapaDialogo, setEtapaDialogo] = useState<EtapaDialogoTarget>(CERRADO);
  const [pasoDialogo, setPasoDialogo] = useState<PasoDialogoTarget>({ ...CERRADO, codEtapa: null });
  const [formularioDialogo, setFormularioDialogo] = useState<FormularioDialogoTarget>({ ...CERRADO, codPaso: null });
  const [campoDialogo, setCampoDialogo] = useState<CampoDialogoTarget>({ ...CERRADO, codFormulario: null });

  const cargarDatos = useCallback(async () => {
    if (!id) return;
    setCargando(true);
    try {
      const wf = await WorkflowServicio.detalle(Number(id));
      setWorkflow(wf);
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al cargar el workflow');
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  // ─── Publicar / volver a borrador ───────────────────────────────────────
  // El backend exige estadoWorkflow === 'publicado' para poder asignar el
  // workflow a clientes (tanto por POST /workflows/:id/asignaciones como por
  // el enlace público) — este switch es la única forma de llegar a ese estado.

  const handleCambiarEstado = async (publicar: boolean) => {
    if (!id) return;
    setActualizandoEstado(true);
    try {
      await WorkflowServicio.actualizar(Number(id), { estadoWorkflow: publicar ? 'publicado' : 'borrador' });
      crearMensaje('success', publicar ? 'Workflow publicado' : 'Workflow vuelto a borrador');
      cargarDatos();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al actualizar el workflow');
    } finally {
      setActualizandoEstado(false);
    }
  };

  // ─── Enlace público (sin asignación previa) ────────────────────────────

  const handleTogglePublico = async (esPublico: boolean) => {
    if (!id) return;
    setActualizandoPublico(true);
    try {
      await WorkflowServicio.actualizar(Number(id), { esPublico });
      crearMensaje('success', esPublico ? 'Workflow marcado como público' : 'Workflow marcado como privado');
      cargarDatos();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al actualizar el workflow');
    } finally {
      setActualizandoPublico(false);
    }
  };

  const copiarEnlacePublico = async () => {
    if (!workflow?.tokenPublico) return;
    const enlace = `${window.location.origin}/tramite/${workflow.tokenPublico}`;
    try {
      await navigator.clipboard.writeText(enlace);
      crearMensaje('success', 'Enlace copiado al portapapeles');
    } catch {
      crearMensaje('error', 'No se pudo copiar el enlace');
    }
  };

  // ─── Eliminar (sin diálogo propio, se queda acá por ser una sola llamada) ─

  const eliminarEtapa = async (etapa: Etapa) => {
    if (!window.confirm(`¿Eliminar la etapa "${etapa.nombreEtapa}"?`)) return;
    try {
      await WorkflowServicio.eliminarEtapa(etapa.codEtapa);
      crearMensaje('success', 'Etapa eliminada correctamente');
      cargarDatos();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al eliminar la etapa');
    }
  };

  const eliminarPaso = async (paso: Paso) => {
    if (!window.confirm(`¿Eliminar el paso "${paso.nombrePaso}"?`)) return;
    try {
      await WorkflowServicio.eliminarPaso(paso.codPaso);
      crearMensaje('success', 'Paso eliminado correctamente');
      cargarDatos();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al eliminar el paso');
    }
  };

  const eliminarFormulario = async (formulario: Formulario) => {
    if (!window.confirm(`¿Eliminar el formulario "${formulario.nombreFormulario}" y todos sus campos?`)) return;
    try {
      await WorkflowServicio.eliminarFormulario(formulario.codFormulario);
      crearMensaje('success', 'Formulario eliminado correctamente');
      cargarDatos();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al eliminar el formulario');
    }
  };

  const eliminarCampo = async (campo: Campo) => {
    if (!window.confirm(`¿Eliminar el campo "${campo.etiquetaCampo}"?`)) return;
    try {
      await WorkflowServicio.eliminarCampo(campo.codCampo);
      crearMensaje('success', 'Campo eliminado correctamente');
      cargarDatos();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al eliminar el campo');
    }
  };

  // ─── Reordenar (intercambia el orden con el hermano adyacente) ─────────

  const moverEtapa = async (etapa: Etapa, direccion: -1 | 1) => {
    try {
      const movido = await moverPorOrden(
        workflow?.etapas ?? [], etapa, direccion,
        (e) => e.codEtapa, (e) => e.ordenEtapa,
        (id, orden) => WorkflowServicio.actualizarEtapa(id, { ordenEtapa: orden }),
      );
      if (movido) cargarDatos();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al reordenar la etapa');
    }
  };

  const moverPaso = async (paso: Paso, direccion: -1 | 1) => {
    const etapa = (workflow?.etapas ?? []).find((e) => e.codEtapa === paso.codEtapa);
    try {
      const movido = await moverPorOrden(
        etapa?.pasos ?? [], paso, direccion,
        (p) => p.codPaso, (p) => p.ordenPaso,
        (id, orden) => WorkflowServicio.actualizarPaso(id, { ordenPaso: orden }),
      );
      if (movido) cargarDatos();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al reordenar el paso');
    }
  };

  const moverCampo = async (campo: Campo, direccion: -1 | 1) => {
    let hermanos: Campo[] = [];
    for (const etapa of workflow?.etapas ?? []) {
      for (const paso of etapa.pasos ?? []) {
        if (paso.formulario?.codFormulario === campo.codFormulario) {
          hermanos = paso.formulario.campos ?? [];
        }
      }
    }
    try {
      const movido = await moverPorOrden(
        hermanos, campo, direccion,
        (c) => c.codCampo, (c) => c.ordenCampo,
        (id, orden) => WorkflowServicio.actualizarCampo(id, { ordenCampo: orden }),
      );
      if (movido) cargarDatos();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al reordenar el campo');
    }
  };

  if (cargando) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>;
  if (!workflow) return <Box sx={{ p: 4 }}><Typography color="error">No se encontró el workflow</Typography></Box>;

  // ─── Datos derivados para el orden automático y la guía de progreso ────

  const etapasOrdenadas = [...(workflow.etapas ?? [])].sort((a, b) => a.ordenEtapa - b.ordenEtapa);
  const todosPasos = etapasOrdenadas.flatMap((e) => e.pasos ?? []);
  const todosFormularios = todosPasos
    .map((p) => p.formulario)
    .filter((f): f is Formulario => Boolean(f));

  const siguienteOrdenEtapa = etapasOrdenadas.reduce((max, e) => Math.max(max, e.ordenEtapa), 0) + 1;

  const obtenerSiguienteOrdenPaso = (codEtapa: number | null): number => {
    const etapa = etapasOrdenadas.find((e) => e.codEtapa === codEtapa);
    return (etapa?.pasos ?? []).reduce((max, p) => Math.max(max, p.ordenPaso), 0) + 1;
  };

  const obtenerSiguienteOrdenCampo = (codFormulario: number | null): number => {
    const formulario = todosFormularios.find((f) => f.codFormulario === codFormulario);
    return (formulario?.campos ?? []).reduce((max, c) => Math.max(max, c.ordenCampo), 0) + 1;
  };

  const guia = [
    { etiqueta: 'Agrega al menos una etapa', hecho: etapasOrdenadas.length > 0 },
    { etiqueta: 'Agrega pasos dentro de tus etapas', hecho: todosPasos.length > 0 },
    { etiqueta: 'Crea el formulario de cada paso', hecho: todosPasos.length > 0 && todosPasos.every((p) => Boolean(p.formulario)) },
    { etiqueta: 'Agrega campos a tus formularios', hecho: todosFormularios.length > 0 && todosFormularios.every((f) => (f.campos ?? []).length > 0) },
    { etiqueta: 'Publica el workflow para poder asignarlo a clientes', hecho: workflow.estadoWorkflow === 'publicado' },
  ];
  const workflowIncompleto = guia.some((item) => !item.hecho);

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <TituloPagina>{workflow.nombreWorkflow}</TituloPagina>
          {workflow.descripcionWorkflow && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{workflow.descripcionWorkflow}</Typography>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            <Chip
              label={ESTADO_WORKFLOW[workflow.estadoWorkflow]?.label ?? workflow.estadoWorkflow}
              color={ESTADO_WORKFLOW[workflow.estadoWorkflow]?.color ?? 'default'}
              size="small"
            />
            <Button
              size="small"
              variant="outlined"
              disabled={actualizandoEstado}
              onClick={() => handleCambiarEstado(workflow.estadoWorkflow !== 'publicado')}
            >
              {workflow.estadoWorkflow === 'publicado' ? 'Volver a borrador' : 'Publicar'}
            </Button>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(workflow.esPublico)}
                  disabled={actualizandoPublico}
                  onChange={(e) => handleTogglePublico(e.target.checked)}
                />
              }
              label="Público (enlace sin asignación previa)"
            />
            {workflow.esPublico && workflow.tokenPublico && (
              <Button size="small" startIcon={<LinkIcon />} onClick={copiarEnlacePublico}>
                Copiar enlace
              </Button>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {esAdmin && (
            <Button variant="contained" startIcon={<AssignmentIcon />} onClick={() => setDialogoAsignarAbierto(true)}>
              Asignar a clientes
            </Button>
          )}
          <Button variant="outlined" startIcon={<ListAltIcon />} onClick={() => navigate(`/dashboard/asignaciones?workflow=${id}`)}>
            Ver asignaciones
          </Button>
        </Box>
      </Box>

      {workflowIncompleto && (
        <Paper
          variant="outlined"
          sx={{
            p: 2.5, mb: 3, borderColor: 'primary.main',
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.08 : 0.06),
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Guía rápida para armar tu workflow</Typography>
          <List dense disablePadding>
            {guia.map((item) => (
              <ListItem key={item.etiqueta} disableGutters sx={{ py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {item.hecho
                    ? <CheckCircleIcon fontSize="small" color="success" />
                    : <RadioButtonUncheckedIcon fontSize="small" color="disabled" />}
                </ListItemIcon>
                <ListItemText
                  primary={item.etiqueta}
                  slotProps={{ primary: { variant: 'body2', sx: { fontWeight: item.hecho ? 400 : 600 } } }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Estructura del workflow</Typography>
        {etapasOrdenadas.length > 0 && (
          <Button size="small" startIcon={<AddIcon />} onClick={() => setEtapaDialogo({ abierto: true, editando: null })}>
            Agregar etapa
          </Button>
        )}
      </Box>

      {etapasOrdenadas.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Todavía no agregaste ninguna etapa. Las etapas agrupan los pasos de tu proceso, por ejemplo "Documentación inicial" y "Revisión".
          </Typography>
          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setEtapaDialogo({ abierto: true, editando: null })}>
            Crear primera etapa
          </Button>
        </Paper>
      ) : etapasOrdenadas.map((etapa, indiceEtapa) => {
        const pasosOrdenados = [...(etapa.pasos ?? [])].sort((a, b) => a.ordenPaso - b.ordenPaso);

        return (
          <Accordion key={etapa.codEtapa} defaultExpanded sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 1 }}>
                <Typography sx={{ fontWeight: 600 }}>{etapa.nombreEtapa}</Typography>
                <Box onClick={(e) => e.stopPropagation()} sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton size="small" disabled={indiceEtapa === 0} onClick={() => moverEtapa(etapa, -1)} title="Mover arriba"><ArrowUpwardIcon fontSize="small" /></IconButton>
                  <IconButton size="small" disabled={indiceEtapa === etapasOrdenadas.length - 1} onClick={() => moverEtapa(etapa, 1)} title="Mover abajo"><ArrowDownwardIcon fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={() => setEtapaDialogo({ abierto: true, editando: etapa })} title="Editar etapa"><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" color="error" onClick={() => eliminarEtapa(etapa)} title="Eliminar etapa"><DeleteIcon fontSize="small" /></IconButton>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {etapa.descripcionEtapa && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{etapa.descripcionEtapa}</Typography>
              )}

              {pasosOrdenados.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 2, mb: 1, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Esta etapa todavía no tiene pasos. Un paso es una acción concreta, por ejemplo "Cargar documento" o "Firmar contrato".
                  </Typography>
                  <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => setPasoDialogo({ abierto: true, codEtapa: etapa.codEtapa, editando: null })}>
                    Agregar primer paso
                  </Button>
                </Paper>
              ) : (
                <>
                  {pasosOrdenados.map((paso, indicePaso) => {
                    const camposOrdenados = [...(paso.formulario?.campos ?? [])].sort((a, b) => a.ordenCampo - b.ordenCampo);

                    return (
                      <Box key={paso.codPaso} sx={{ mb: 2, pl: 2, borderLeft: '2px solid', borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{paso.nombrePaso}</Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton size="small" disabled={indicePaso === 0} onClick={() => moverPaso(paso, -1)} title="Mover arriba"><ArrowUpwardIcon fontSize="small" /></IconButton>
                            <IconButton size="small" disabled={indicePaso === pasosOrdenados.length - 1} onClick={() => moverPaso(paso, 1)} title="Mover abajo"><ArrowDownwardIcon fontSize="small" /></IconButton>
                            <IconButton size="small" onClick={() => setPasoDialogo({ abierto: true, codEtapa: etapa.codEtapa, editando: paso })} title="Editar paso"><EditIcon fontSize="small" /></IconButton>
                            <IconButton size="small" color="error" onClick={() => eliminarPaso(paso)} title="Eliminar paso"><DeleteIcon fontSize="small" /></IconButton>
                          </Box>
                        </Box>
                        {paso.descripcionPaso && (
                          <Typography variant="body2" color="text.secondary">{paso.descripcionPaso}</Typography>
                        )}

                        {!paso.formulario ? (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Este paso todavía no tiene formulario. El formulario define qué le vas a pedir al cliente acá.
                            </Typography>
                            <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => setFormularioDialogo({ abierto: true, codPaso: paso.codPaso, editando: null })}>
                              Crear formulario
                            </Button>
                          </Box>
                        ) : (
                          <Box sx={{ mt: 1, pl: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>Formulario: {paso.formulario.nombreFormulario}</Typography>
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <IconButton size="small" onClick={() => setFormularioDialogo({ abierto: true, codPaso: paso.codPaso, editando: paso.formulario! })} title="Editar formulario"><EditIcon fontSize="small" /></IconButton>
                                <IconButton size="small" color="error" onClick={() => eliminarFormulario(paso.formulario!)} title="Eliminar formulario"><DeleteIcon fontSize="small" /></IconButton>
                              </Box>
                            </Box>

                            {camposOrdenados.length === 0 ? (
                              <Typography variant="body2" color="text.secondary" sx={{ pl: 2, mb: 1 }}>
                                Este formulario todavía no tiene campos. Un campo es cada dato que le pedís al cliente, ej. "Nombre completo".
                              </Typography>
                            ) : (
                              <List dense>
                                {camposOrdenados.map((campo, indiceCampo) => (
                                  <ListItem
                                    key={campo.codCampo}
                                    secondaryAction={
                                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                                        <IconButton size="small" disabled={indiceCampo === 0} onClick={() => moverCampo(campo, -1)} title="Mover arriba"><ArrowUpwardIcon fontSize="small" /></IconButton>
                                        <IconButton size="small" disabled={indiceCampo === camposOrdenados.length - 1} onClick={() => moverCampo(campo, 1)} title="Mover abajo"><ArrowDownwardIcon fontSize="small" /></IconButton>
                                        <IconButton size="small" onClick={() => setCampoDialogo({ abierto: true, codFormulario: paso.formulario!.codFormulario, editando: campo })} title="Editar campo"><EditIcon fontSize="small" /></IconButton>
                                        <IconButton size="small" color="error" onClick={() => eliminarCampo(campo)} title="Eliminar campo"><DeleteIcon fontSize="small" /></IconButton>
                                      </Box>
                                    }
                                  >
                                    <ListItemText
                                      primary={`${campo.etiquetaCampo}${campo.requeridoCampo ? ' *' : ''}`}
                                      secondary={TIPO_CAMPO[campo.tipoCampo]?.label ?? campo.tipoCampo}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            )}
                            <Button size="small" startIcon={<AddIcon />} onClick={() => setCampoDialogo({ abierto: true, codFormulario: paso.formulario!.codFormulario, editando: null })}>
                              Agregar campo
                            </Button>
                          </Box>
                        )}
                      </Box>
                    );
                  })}

                  <Button size="small" startIcon={<AddIcon />} onClick={() => setPasoDialogo({ abierto: true, codEtapa: etapa.codEtapa, editando: null })}>
                    Agregar paso
                  </Button>
                </>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}

      <AsignarClientesDialogo
        abierto={dialogoAsignarAbierto}
        codWorkflow={Number(id)}
        onClose={() => setDialogoAsignarAbierto(false)}
        onAsignado={() => {}}
      />

      <EtapaDialogo
        abierto={etapaDialogo.abierto}
        editando={etapaDialogo.editando}
        codWorkflow={Number(id)}
        siguienteOrden={siguienteOrdenEtapa}
        onClose={() => setEtapaDialogo(CERRADO)}
        onGuardado={cargarDatos}
      />

      <PasoDialogo
        abierto={pasoDialogo.abierto}
        editando={pasoDialogo.editando}
        codEtapa={pasoDialogo.codEtapa}
        siguienteOrden={obtenerSiguienteOrdenPaso(pasoDialogo.codEtapa)}
        onClose={() => setPasoDialogo({ ...CERRADO, codEtapa: null })}
        onGuardado={cargarDatos}
      />

      <FormularioDialogo
        abierto={formularioDialogo.abierto}
        editando={formularioDialogo.editando}
        codPaso={formularioDialogo.codPaso}
        onClose={() => setFormularioDialogo({ ...CERRADO, codPaso: null })}
        onGuardado={cargarDatos}
      />

      <CampoDialogo
        abierto={campoDialogo.abierto}
        editando={campoDialogo.editando}
        codFormulario={campoDialogo.codFormulario}
        siguienteOrden={obtenerSiguienteOrdenCampo(campoDialogo.codFormulario)}
        onClose={() => setCampoDialogo({ ...CERRADO, codFormulario: null })}
        onGuardado={cargarDatos}
      />
    </Box>
  );
};

export default WorkflowDetalle;
