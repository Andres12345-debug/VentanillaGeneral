import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails,
  Chip, CircularProgress, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Autocomplete, TextField, List, ListItem, ListItemText,
  IconButton, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { crearMensaje } from '../../../../app/utilidades/funciones/mensaje';
import {
  WorkflowServicio, WorkflowDetalle as WorkflowDetalleType, Etapa, Paso, Formulario, Campo,
} from '../../../../app/servicios/privados/WorkflowServicio';
import { AsignacionServicio } from '../../../../app/servicios/privados/AsignacionServicio';
import { UsuarioServicio, Usuario } from '../../../../app/servicios/privados/UsuarioServicio';
import { TipoCampo, TIPO_CAMPO, TIPOS_CON_OPCIONES } from '../../../../app/utilidades/dominios/tipoCampo';

interface EtapaDialogoState {
  abierto: boolean;
  editando: Etapa | null;
  nombreEtapa: string;
  descripcionEtapa: string;
  ordenEtapa: string;
}

const ETAPA_DIALOGO_VACIO: EtapaDialogoState = {
  abierto: false, editando: null, nombreEtapa: '', descripcionEtapa: '', ordenEtapa: '',
};

interface PasoDialogoState {
  abierto: boolean;
  codEtapa: number | null;
  editando: Paso | null;
  nombrePaso: string;
  descripcionPaso: string;
  ordenPaso: string;
}

const PASO_DIALOGO_VACIO: PasoDialogoState = {
  abierto: false, codEtapa: null, editando: null, nombrePaso: '', descripcionPaso: '', ordenPaso: '',
};

interface FormularioDialogoState {
  abierto: boolean;
  codPaso: number | null;
  editando: Formulario | null;
  nombreFormulario: string;
  descripcionFormulario: string;
}

const FORMULARIO_DIALOGO_VACIO: FormularioDialogoState = {
  abierto: false, codPaso: null, editando: null, nombreFormulario: '', descripcionFormulario: '',
};

interface CampoDialogoState {
  abierto: boolean;
  codFormulario: number | null;
  editando: Campo | null;
  nombreCampo: string;
  etiquetaCampo: string;
  tipoCampo: TipoCampo;
  requeridoCampo: boolean;
  ordenCampo: string;
  placeholderCampo: string;
  opcionesCampo: string[];
  opcionNueva: string;
}

const CAMPO_DIALOGO_VACIO: CampoDialogoState = {
  abierto: false, codFormulario: null, editando: null, nombreCampo: '', etiquetaCampo: '',
  tipoCampo: 'texto', requeridoCampo: false, ordenCampo: '', placeholderCampo: '', opcionesCampo: [], opcionNueva: '',
};

const WorkflowDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState<WorkflowDetalleType | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [clientes, setClientes] = useState<Usuario[]>([]);
  const [clientesSeleccionados, setClientesSeleccionados] = useState<Usuario[]>([]);
  const [asignando, setAsignando] = useState(false);

  const [etapaDialogo, setEtapaDialogo] = useState<EtapaDialogoState>(ETAPA_DIALOGO_VACIO);
  const [pasoDialogo, setPasoDialogo] = useState<PasoDialogoState>(PASO_DIALOGO_VACIO);
  const [formularioDialogo, setFormularioDialogo] = useState<FormularioDialogoState>(FORMULARIO_DIALOGO_VACIO);
  const [campoDialogo, setCampoDialogo] = useState<CampoDialogoState>(CAMPO_DIALOGO_VACIO);

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

  // ─── Asignar a clientes ────────────────────────────────────────────────

  const abrirDialogoAsignar = async () => {
    try {
      const lista = await UsuarioServicio.listar();
      setClientes(lista.filter((u) => u.nombreRol === 'cliente'));
      setClientesSeleccionados([]);
      setDialogoAbierto(true);
    } catch {
      crearMensaje('error', 'Error al cargar los clientes');
    }
  };

  const handleAsignar = async () => {
    if (!id || clientesSeleccionados.length === 0) return;
    setAsignando(true);
    try {
      await AsignacionServicio.asignar(Number(id), {
        codClientes: clientesSeleccionados.map((c) => c.codUsuario),
      });
      crearMensaje('success', 'Workflow asignado correctamente');
      setDialogoAbierto(false);
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al asignar');
    } finally {
      setAsignando(false);
    }
  };

  // ─── Etapas ─────────────────────────────────────────────────────────────

  const abrirEtapaDialogo = (etapa?: Etapa) => {
    setEtapaDialogo(etapa
      ? {
        abierto: true, editando: etapa, nombreEtapa: etapa.nombreEtapa,
        descripcionEtapa: etapa.descripcionEtapa ?? '', ordenEtapa: String(etapa.ordenEtapa),
      }
      : { ...ETAPA_DIALOGO_VACIO, abierto: true });
  };

  const guardarEtapa = async () => {
    if (!id || !etapaDialogo.nombreEtapa.trim()) {
      crearMensaje('error', 'El nombre de la etapa es obligatorio');
      return;
    }
    setGuardando(true);
    try {
      const body = {
        nombreEtapa: etapaDialogo.nombreEtapa,
        descripcionEtapa: etapaDialogo.descripcionEtapa || undefined,
        ordenEtapa: etapaDialogo.ordenEtapa ? Number(etapaDialogo.ordenEtapa) : undefined,
      };
      if (etapaDialogo.editando) {
        await WorkflowServicio.actualizarEtapa(etapaDialogo.editando.codEtapa, body);
      } else {
        await WorkflowServicio.crearEtapa(Number(id), body);
      }
      crearMensaje('success', 'Etapa guardada correctamente');
      setEtapaDialogo(ETAPA_DIALOGO_VACIO);
      cargarDatos();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al guardar la etapa');
    } finally {
      setGuardando(false);
    }
  };

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

  // ─── Pasos ──────────────────────────────────────────────────────────────

  const abrirPasoDialogo = (codEtapa: number, paso?: Paso) => {
    setPasoDialogo(paso
      ? {
        abierto: true, codEtapa, editando: paso, nombrePaso: paso.nombrePaso,
        descripcionPaso: paso.descripcionPaso ?? '', ordenPaso: String(paso.ordenPaso),
      }
      : { ...PASO_DIALOGO_VACIO, abierto: true, codEtapa });
  };

  const guardarPaso = async () => {
    if (!pasoDialogo.codEtapa || !pasoDialogo.nombrePaso.trim()) {
      crearMensaje('error', 'El nombre del paso es obligatorio');
      return;
    }
    setGuardando(true);
    try {
      const body = {
        nombrePaso: pasoDialogo.nombrePaso,
        descripcionPaso: pasoDialogo.descripcionPaso || undefined,
        ordenPaso: pasoDialogo.ordenPaso ? Number(pasoDialogo.ordenPaso) : undefined,
      };
      if (pasoDialogo.editando) {
        await WorkflowServicio.actualizarPaso(pasoDialogo.editando.codPaso, body);
      } else {
        await WorkflowServicio.crearPaso(pasoDialogo.codEtapa, body);
      }
      crearMensaje('success', 'Paso guardado correctamente');
      setPasoDialogo(PASO_DIALOGO_VACIO);
      cargarDatos();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al guardar el paso');
    } finally {
      setGuardando(false);
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

  // ─── Formulario ─────────────────────────────────────────────────────────

  const abrirFormularioDialogo = (codPaso: number, formulario?: Formulario) => {
    setFormularioDialogo(formulario
      ? {
        abierto: true, codPaso, editando: formulario, nombreFormulario: formulario.nombreFormulario,
        descripcionFormulario: formulario.descripcionFormulario ?? '',
      }
      : { ...FORMULARIO_DIALOGO_VACIO, abierto: true, codPaso });
  };

  const guardarFormulario = async () => {
    if (!formularioDialogo.codPaso || !formularioDialogo.nombreFormulario.trim()) {
      crearMensaje('error', 'El nombre del formulario es obligatorio');
      return;
    }
    setGuardando(true);
    try {
      const body = {
        nombreFormulario: formularioDialogo.nombreFormulario,
        descripcionFormulario: formularioDialogo.descripcionFormulario || undefined,
      };
      if (formularioDialogo.editando) {
        await WorkflowServicio.actualizarFormulario(formularioDialogo.editando.codFormulario, body);
      } else {
        await WorkflowServicio.crearFormulario(formularioDialogo.codPaso, body);
      }
      crearMensaje('success', 'Formulario guardado correctamente');
      setFormularioDialogo(FORMULARIO_DIALOGO_VACIO);
      cargarDatos();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al guardar el formulario');
    } finally {
      setGuardando(false);
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

  // ─── Campos ─────────────────────────────────────────────────────────────

  const abrirCampoDialogo = (codFormulario: number, campo?: Campo) => {
    setCampoDialogo(campo
      ? {
        abierto: true, codFormulario, editando: campo, nombreCampo: campo.nombreCampo,
        etiquetaCampo: campo.etiquetaCampo, tipoCampo: campo.tipoCampo, requeridoCampo: campo.requeridoCampo,
        ordenCampo: String(campo.ordenCampo), placeholderCampo: campo.placeholderCampo ?? '',
        opcionesCampo: campo.opcionesCampo ?? [], opcionNueva: '',
      }
      : { ...CAMPO_DIALOGO_VACIO, abierto: true, codFormulario });
  };

  const agregarOpcion = () => {
    const valor = campoDialogo.opcionNueva.trim();
    if (!valor) return;
    setCampoDialogo((prev) => ({ ...prev, opcionesCampo: [...prev.opcionesCampo, valor], opcionNueva: '' }));
  };

  const quitarOpcion = (opcion: string) => {
    setCampoDialogo((prev) => ({ ...prev, opcionesCampo: prev.opcionesCampo.filter((o) => o !== opcion) }));
  };

  const guardarCampo = async () => {
    if (!campoDialogo.codFormulario || !campoDialogo.nombreCampo.trim() || !campoDialogo.etiquetaCampo.trim()) {
      crearMensaje('error', 'Nombre y etiqueta del campo son obligatorios');
      return;
    }
    if (TIPOS_CON_OPCIONES.includes(campoDialogo.tipoCampo) && campoDialogo.opcionesCampo.length === 0) {
      crearMensaje('error', 'Los campos de selección requieren al menos una opción');
      return;
    }
    setGuardando(true);
    try {
      const body = {
        nombreCampo: campoDialogo.nombreCampo,
        etiquetaCampo: campoDialogo.etiquetaCampo,
        tipoCampo: campoDialogo.tipoCampo,
        requeridoCampo: campoDialogo.requeridoCampo,
        ordenCampo: campoDialogo.ordenCampo ? Number(campoDialogo.ordenCampo) : undefined,
        placeholderCampo: campoDialogo.placeholderCampo || undefined,
        opcionesCampo: TIPOS_CON_OPCIONES.includes(campoDialogo.tipoCampo) ? campoDialogo.opcionesCampo : undefined,
      };
      if (campoDialogo.editando) {
        await WorkflowServicio.actualizarCampo(campoDialogo.editando.codCampo, body);
      } else {
        await WorkflowServicio.crearCampo(campoDialogo.codFormulario, body);
      }
      crearMensaje('success', 'Campo guardado correctamente');
      setCampoDialogo(CAMPO_DIALOGO_VACIO);
      cargarDatos();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al guardar el campo');
    } finally {
      setGuardando(false);
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
          <Chip label={workflow.estadoWorkflow} color={workflow.estadoWorkflow === 'borrador' ? 'default' : 'success'} size="small" sx={{ mt: 1 }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" startIcon={<AssignmentIcon />} onClick={abrirDialogoAsignar}>
            Asignar a clientes
          </Button>
          <Button variant="outlined" startIcon={<ListAltIcon />} onClick={() => navigate(`/dashboard/asignaciones?workflow=${id}`)}>
            Ver asignaciones
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Estructura del workflow</Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={() => abrirEtapaDialogo()}>Agregar etapa</Button>
      </Box>

      {(workflow.etapas ?? []).map((etapa) => (
        <Accordion key={etapa.codEtapa} defaultExpanded sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 1 }}>
              <Typography sx={{ fontWeight: 600 }}>{etapa.nombreEtapa}</Typography>
              <Box onClick={(e) => e.stopPropagation()} sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton size="small" onClick={() => abrirEtapaDialogo(etapa)} title="Editar etapa"><EditIcon fontSize="small" /></IconButton>
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
                    <IconButton size="small" onClick={() => abrirPasoDialogo(etapa.codEtapa, paso)} title="Editar paso"><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => eliminarPaso(paso)} title="Eliminar paso"><DeleteIcon fontSize="small" /></IconButton>
                  </Box>
                </Box>
                {paso.descripcionPaso && (
                  <Typography variant="body2" color="text.secondary">{paso.descripcionPaso}</Typography>
                )}

                {!paso.formulario ? (
                  <Button size="small" startIcon={<AddIcon />} sx={{ mt: 1 }} onClick={() => abrirFormularioDialogo(paso.codPaso)}>
                    Crear formulario
                  </Button>
                ) : (
                  <Box sx={{ mt: 1, pl: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Formulario: {paso.formulario.nombreFormulario}</Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton size="small" onClick={() => abrirFormularioDialogo(paso.codPaso, paso.formulario)} title="Editar formulario"><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" color="error" onClick={() => eliminarFormulario(paso.formulario!)} title="Eliminar formulario"><DeleteIcon fontSize="small" /></IconButton>
                      </Box>
                    </Box>

                    <List dense>
                      {(paso.formulario.campos ?? []).map((campo) => (
                        <ListItem
                          key={campo.codCampo}
                          secondaryAction={
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton size="small" onClick={() => abrirCampoDialogo(paso.formulario!.codFormulario, campo)} title="Editar campo"><EditIcon fontSize="small" /></IconButton>
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
                    <Button size="small" startIcon={<AddIcon />} onClick={() => abrirCampoDialogo(paso.formulario!.codFormulario)}>
                      Agregar campo
                    </Button>
                  </Box>
                )}
              </Box>
            ))}

            <Button size="small" startIcon={<AddIcon />} onClick={() => abrirPasoDialogo(etapa.codEtapa)}>
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

      {/* Diálogo: asignar a clientes */}
      <Dialog open={dialogoAbierto} onClose={() => setDialogoAbierto(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Asignar workflow a clientes</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Autocomplete
              multiple
              options={clientes}
              getOptionLabel={(opcion) => `${opcion.nombreAcceso} (${opcion.correoUsuario})`}
              value={clientesSeleccionados}
              onChange={(_, nuevosValores) => setClientesSeleccionados(nuevosValores)}
              renderInput={(params) => (
                <TextField {...params} label="Seleccionar clientes" placeholder="Buscar cliente..." />
              )}
            />
            {clientesSeleccionados.length > 0 && (
              <List dense sx={{ mt: 1 }}>
                {clientesSeleccionados.map((c) => (
                  <ListItem key={c.codUsuario}>
                    <ListItemText primary={c.nombreAcceso} secondary={c.correoUsuario} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogoAbierto(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAsignar} disabled={asignando || clientesSeleccionados.length === 0}>
            {asignando ? 'Asignando...' : 'Asignar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo: etapa */}
      <Dialog open={etapaDialogo.abierto} onClose={() => setEtapaDialogo(ETAPA_DIALOGO_VACIO)} maxWidth="sm" fullWidth>
        <DialogTitle>{etapaDialogo.editando ? 'Editar etapa' : 'Nueva etapa'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Nombre de la etapa" value={etapaDialogo.nombreEtapa} onChange={(e) => setEtapaDialogo((prev) => ({ ...prev, nombreEtapa: e.target.value }))} fullWidth />
            <TextField label="Descripción (opcional)" value={etapaDialogo.descripcionEtapa} onChange={(e) => setEtapaDialogo((prev) => ({ ...prev, descripcionEtapa: e.target.value }))} fullWidth multiline rows={2} />
            <TextField label="Orden" type="number" value={etapaDialogo.ordenEtapa} onChange={(e) => setEtapaDialogo((prev) => ({ ...prev, ordenEtapa: e.target.value }))} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEtapaDialogo(ETAPA_DIALOGO_VACIO)}>Cancelar</Button>
          <Button variant="contained" onClick={guardarEtapa} disabled={guardando}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo: paso */}
      <Dialog open={pasoDialogo.abierto} onClose={() => setPasoDialogo(PASO_DIALOGO_VACIO)} maxWidth="sm" fullWidth>
        <DialogTitle>{pasoDialogo.editando ? 'Editar paso' : 'Nuevo paso'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Nombre del paso" value={pasoDialogo.nombrePaso} onChange={(e) => setPasoDialogo((prev) => ({ ...prev, nombrePaso: e.target.value }))} fullWidth />
            <TextField label="Descripción (opcional)" value={pasoDialogo.descripcionPaso} onChange={(e) => setPasoDialogo((prev) => ({ ...prev, descripcionPaso: e.target.value }))} fullWidth multiline rows={2} />
            <TextField label="Orden" type="number" value={pasoDialogo.ordenPaso} onChange={(e) => setPasoDialogo((prev) => ({ ...prev, ordenPaso: e.target.value }))} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasoDialogo(PASO_DIALOGO_VACIO)}>Cancelar</Button>
          <Button variant="contained" onClick={guardarPaso} disabled={guardando}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo: formulario */}
      <Dialog open={formularioDialogo.abierto} onClose={() => setFormularioDialogo(FORMULARIO_DIALOGO_VACIO)} maxWidth="sm" fullWidth>
        <DialogTitle>{formularioDialogo.editando ? 'Editar formulario' : 'Nuevo formulario'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Nombre del formulario" value={formularioDialogo.nombreFormulario} onChange={(e) => setFormularioDialogo((prev) => ({ ...prev, nombreFormulario: e.target.value }))} fullWidth />
            <TextField label="Descripción (opcional)" value={formularioDialogo.descripcionFormulario} onChange={(e) => setFormularioDialogo((prev) => ({ ...prev, descripcionFormulario: e.target.value }))} fullWidth multiline rows={2} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormularioDialogo(FORMULARIO_DIALOGO_VACIO)}>Cancelar</Button>
          <Button variant="contained" onClick={guardarFormulario} disabled={guardando}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo: campo */}
      <Dialog open={campoDialogo.abierto} onClose={() => setCampoDialogo(CAMPO_DIALOGO_VACIO)} maxWidth="sm" fullWidth>
        <DialogTitle>{campoDialogo.editando ? 'Editar campo' : 'Nuevo campo'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Nombre interno" value={campoDialogo.nombreCampo} onChange={(e) => setCampoDialogo((prev) => ({ ...prev, nombreCampo: e.target.value }))} fullWidth />
            <TextField label="Etiqueta (visible al cliente)" value={campoDialogo.etiquetaCampo} onChange={(e) => setCampoDialogo((prev) => ({ ...prev, etiquetaCampo: e.target.value }))} fullWidth />
            <FormControl fullWidth>
              <InputLabel>Tipo de campo</InputLabel>
              <Select
                label="Tipo de campo"
                value={campoDialogo.tipoCampo}
                onChange={(e) => setCampoDialogo((prev) => ({ ...prev, tipoCampo: e.target.value as TipoCampo }))}
              >
                {(Object.keys(TIPO_CAMPO) as TipoCampo[]).map((tipo) => (
                  <MenuItem key={tipo} value={tipo}>{TIPO_CAMPO[tipo].label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Placeholder (opcional)" value={campoDialogo.placeholderCampo} onChange={(e) => setCampoDialogo((prev) => ({ ...prev, placeholderCampo: e.target.value }))} fullWidth />
            <TextField label="Orden" type="number" value={campoDialogo.ordenCampo} onChange={(e) => setCampoDialogo((prev) => ({ ...prev, ordenCampo: e.target.value }))} fullWidth />
            <FormControlLabel
              control={<Switch checked={campoDialogo.requeridoCampo} onChange={(e) => setCampoDialogo((prev) => ({ ...prev, requeridoCampo: e.target.checked }))} />}
              label="Campo obligatorio"
            />

            {TIPOS_CON_OPCIONES.includes(campoDialogo.tipoCampo) && (
              <>
                <Divider />
                <Typography variant="subtitle2">Opciones</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    label="Nueva opción"
                    value={campoDialogo.opcionNueva}
                    onChange={(e) => setCampoDialogo((prev) => ({ ...prev, opcionNueva: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); agregarOpcion(); } }}
                    fullWidth
                  />
                  <Button variant="outlined" onClick={agregarOpcion}>Agregar</Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {campoDialogo.opcionesCampo.map((opcion) => (
                    <Chip key={opcion} label={opcion} onDelete={() => quitarOpcion(opcion)} deleteIcon={<CloseIcon />} />
                  ))}
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCampoDialogo(CAMPO_DIALOGO_VACIO)}>Cancelar</Button>
          <Button variant="contained" onClick={guardarCampo} disabled={guardando}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowDetalle;
