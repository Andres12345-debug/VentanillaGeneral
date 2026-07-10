import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails,
  Chip, CircularProgress, Button, List, ListItem, ListItemText,
  IconButton, Switch, FormControlLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import { crearMensaje } from '../../../../app/utilidades/funciones/mensaje';
import {
  WorkflowServicio, WorkflowDetalle as WorkflowDetalleType, Etapa, Paso, Formulario, Campo,
} from '../../../../app/servicios/privados/WorkflowServicio';
import { TIPO_CAMPO } from '../../../../app/utilidades/dominios/tipoCampo';
import { ESTADO_WORKFLOW } from '../../../../app/utilidades/dominios/estados';
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

const WorkflowDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  if (cargando) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>;
  if (!workflow) return <Box sx={{ p: 4 }}><Typography color="error">No se encontró el workflow</Typography></Box>;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>{workflow.nombreWorkflow}</Typography>
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
          <Button variant="contained" startIcon={<AssignmentIcon />} onClick={() => setDialogoAsignarAbierto(true)}>
            Asignar a clientes
          </Button>
          <Button variant="outlined" startIcon={<ListAltIcon />} onClick={() => navigate(`/dashboard/asignaciones?workflow=${id}`)}>
            Ver asignaciones
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Estructura del workflow</Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={() => setEtapaDialogo({ abierto: true, editando: null })}>
          Agregar etapa
        </Button>
      </Box>

      {(workflow.etapas ?? []).map((etapa) => (
        <Accordion key={etapa.codEtapa} defaultExpanded sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 1 }}>
              <Typography sx={{ fontWeight: 600 }}>{etapa.nombreEtapa}</Typography>
              <Box onClick={(e) => e.stopPropagation()} sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton size="small" onClick={() => setEtapaDialogo({ abierto: true, editando: etapa })} title="Editar etapa"><EditIcon fontSize="small" /></IconButton>
                <IconButton size="small" color="error" onClick={() => eliminarEtapa(etapa)} title="Eliminar etapa"><DeleteIcon fontSize="small" /></IconButton>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {etapa.descripcionEtapa && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{etapa.descripcionEtapa}</Typography>
            )}

            {(etapa.pasos ?? []).map((paso) => (
              <Box key={paso.codPaso} sx={{ mb: 2, pl: 2, borderLeft: '2px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{paso.nombrePaso}</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" onClick={() => setPasoDialogo({ abierto: true, codEtapa: etapa.codEtapa, editando: paso })} title="Editar paso"><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => eliminarPaso(paso)} title="Eliminar paso"><DeleteIcon fontSize="small" /></IconButton>
                  </Box>
                </Box>
                {paso.descripcionPaso && (
                  <Typography variant="body2" color="text.secondary">{paso.descripcionPaso}</Typography>
                )}

                {!paso.formulario ? (
                  <Button size="small" startIcon={<AddIcon />} sx={{ mt: 1 }} onClick={() => setFormularioDialogo({ abierto: true, codPaso: paso.codPaso, editando: null })}>
                    Crear formulario
                  </Button>
                ) : (
                  <Box sx={{ mt: 1, pl: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Formulario: {paso.formulario.nombreFormulario}</Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton size="small" onClick={() => setFormularioDialogo({ abierto: true, codPaso: paso.codPaso, editando: paso.formulario! })} title="Editar formulario"><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" color="error" onClick={() => eliminarFormulario(paso.formulario!)} title="Eliminar formulario"><DeleteIcon fontSize="small" /></IconButton>
                      </Box>
                    </Box>

                    <List dense>
                      {(paso.formulario.campos ?? []).map((campo) => (
                        <ListItem
                          key={campo.codCampo}
                          secondaryAction={
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
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
                      {(paso.formulario.campos ?? []).length === 0 && (
                        <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>Sin campos definidos</Typography>
                      )}
                    </List>
                    <Button size="small" startIcon={<AddIcon />} onClick={() => setCampoDialogo({ abierto: true, codFormulario: paso.formulario!.codFormulario, editando: null })}>
                      Agregar campo
                    </Button>
                  </Box>
                )}
              </Box>
            ))}

            <Button size="small" startIcon={<AddIcon />} onClick={() => setPasoDialogo({ abierto: true, codEtapa: etapa.codEtapa, editando: null })}>
              Agregar paso
            </Button>

            {(etapa.pasos ?? []).length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ pl: 2, mb: 1 }}>Sin pasos definidos</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      {(workflow.etapas ?? []).length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 2 }}>Este workflow no tiene etapas configuradas</Typography>
      )}

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
        onClose={() => setEtapaDialogo(CERRADO)}
        onGuardado={cargarDatos}
      />

      <PasoDialogo
        abierto={pasoDialogo.abierto}
        editando={pasoDialogo.editando}
        codEtapa={pasoDialogo.codEtapa}
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
        onClose={() => setCampoDialogo({ ...CERRADO, codFormulario: null })}
        onGuardado={cargarDatos}
      />
    </Box>
  );
};

export default WorkflowDetalle;
