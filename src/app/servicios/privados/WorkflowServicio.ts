import { ApiServicio } from '../reutilizables/ApiServicio';
import { URLS } from '../../utilidades/dominios/urls';
import { TipoCampo } from '../../utilidades/dominios/tipoCampo';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface Mensaje {
  mensaje: string;
}

// Resumen tal como lo devuelve GET /workflows (listar)
export interface Workflow {
  codWorkflow: number;
  nombreWorkflow: string;
  descripcionWorkflow?: string;
  estadoWorkflow: string;
  esPublico?: boolean;
  tokenPublico?: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  correoUsuario: string;
  nombreAcceso: string;
}

export interface Campo {
  codCampo: number;
  codFormulario: number;
  nombreCampo: string;
  etiquetaCampo: string;
  tipoCampo: TipoCampo;
  requeridoCampo: boolean;
  ordenCampo: number;
  placeholderCampo?: string;
  opcionesCampo?: string[];
}

export interface Formulario {
  codFormulario: number;
  codPaso: number;
  nombreFormulario: string;
  descripcionFormulario?: string;
  campos?: Campo[];
}

export interface Paso {
  codPaso: number;
  codEtapa: number;
  nombrePaso: string;
  descripcionPaso?: string;
  ordenPaso: number;
  formulario?: Formulario;
}

export interface Etapa {
  codEtapa: number;
  codWorkflow: number;
  nombreEtapa: string;
  descripcionEtapa?: string;
  ordenEtapa: number;
  pasos?: Paso[];
}

// Detalle tal como lo devuelve GET /workflows/:id (estructura anidada completa)
export interface WorkflowDetalle extends Workflow {
  codUsuario: number;
  etapas: Etapa[];
}

export interface CreateWorkflowDto {
  nombreWorkflow: string;
  descripcionWorkflow?: string;
}

export interface UpdateWorkflowDto {
  nombreWorkflow?: string;
  descripcionWorkflow?: string;
  estadoWorkflow?: string;
  esPublico?: boolean;
}

export interface CreateEtapaDto {
  nombreEtapa: string;
  descripcionEtapa?: string;
  ordenEtapa?: number;
}

export interface UpdateEtapaDto {
  nombreEtapa?: string;
  descripcionEtapa?: string;
  ordenEtapa?: number;
}

export interface CreatePasoDto {
  nombrePaso: string;
  descripcionPaso?: string;
  ordenPaso?: number;
}

export interface UpdatePasoDto {
  nombrePaso?: string;
  descripcionPaso?: string;
  ordenPaso?: number;
}

export interface CreateFormularioDto {
  nombreFormulario: string;
  descripcionFormulario?: string;
}

export interface UpdateFormularioDto {
  nombreFormulario?: string;
  descripcionFormulario?: string;
}

export interface CreateCampoDto {
  nombreCampo: string;
  etiquetaCampo: string;
  tipoCampo: TipoCampo;
  requeridoCampo?: boolean;
  ordenCampo?: number;
  placeholderCampo?: string;
  opcionesCampo?: string[];
}

export interface UpdateCampoDto {
  nombreCampo?: string;
  etiquetaCampo?: string;
  tipoCampo?: TipoCampo;
  requeridoCampo?: boolean;
  ordenCampo?: number;
  placeholderCampo?: string;
  opcionesCampo?: string[];
}

// ─── Workflows ───────────────────────────────────────────────────────────────

export const WorkflowServicio = {
  crear(body: CreateWorkflowDto): Promise<Mensaje> {
    return ApiServicio.post<Mensaje>(URLS.WORKFLOWS, body);
  },

  listar(): Promise<Workflow[]> {
    return ApiServicio.get<Workflow[]>(URLS.WORKFLOWS);
  },

  detalle(id: number): Promise<WorkflowDetalle> {
    return ApiServicio.get<WorkflowDetalle>(URLS.WORKFLOW_POR_ID(id));
  },

  actualizar(id: number, body: UpdateWorkflowDto): Promise<Mensaje> {
    return ApiServicio.put<Mensaje>(URLS.WORKFLOW_POR_ID(id), body);
  },

  eliminar(id: number): Promise<Mensaje> {
    return ApiServicio.delete<Mensaje>(URLS.WORKFLOW_POR_ID(id));
  },

  // ─── Etapas ───────────────────────────────────────────────────────────

  crearEtapa(workflowId: number, body: CreateEtapaDto): Promise<Mensaje> {
    return ApiServicio.post<Mensaje>(URLS.ETAPAS_POR_WORKFLOW(workflowId), body);
  },

  listarEtapas(workflowId: number): Promise<Etapa[]> {
    return ApiServicio.get<Etapa[]>(URLS.ETAPAS_POR_WORKFLOW(workflowId));
  },

  actualizarEtapa(etapaId: number, body: UpdateEtapaDto): Promise<Mensaje> {
    return ApiServicio.put<Mensaje>(URLS.ETAPA_POR_ID(etapaId), body);
  },

  eliminarEtapa(etapaId: number): Promise<Mensaje> {
    return ApiServicio.delete<Mensaje>(URLS.ETAPA_POR_ID(etapaId));
  },

  // ─── Pasos ────────────────────────────────────────────────────────────

  crearPaso(etapaId: number, body: CreatePasoDto): Promise<Mensaje> {
    return ApiServicio.post<Mensaje>(URLS.PASOS_POR_ETAPA(etapaId), body);
  },

  listarPasos(etapaId: number): Promise<Paso[]> {
    return ApiServicio.get<Paso[]>(URLS.PASOS_POR_ETAPA(etapaId));
  },

  actualizarPaso(pasoId: number, body: UpdatePasoDto): Promise<Mensaje> {
    return ApiServicio.put<Mensaje>(URLS.PASO_POR_ID(pasoId), body);
  },

  eliminarPaso(pasoId: number): Promise<Mensaje> {
    return ApiServicio.delete<Mensaje>(URLS.PASO_POR_ID(pasoId));
  },

  // ─── Formularios ──────────────────────────────────────────────────────

  crearFormulario(pasoId: number, body: CreateFormularioDto): Promise<Mensaje> {
    return ApiServicio.post<Mensaje>(URLS.FORMULARIO_POR_PASO(pasoId), body);
  },

  obtenerFormulario(pasoId: number): Promise<Formulario> {
    return ApiServicio.get<Formulario>(URLS.FORMULARIO_POR_PASO(pasoId));
  },

  actualizarFormulario(formularioId: number, body: UpdateFormularioDto): Promise<Mensaje> {
    return ApiServicio.put<Mensaje>(URLS.FORMULARIO_POR_ID(formularioId), body);
  },

  eliminarFormulario(formularioId: number): Promise<Mensaje> {
    return ApiServicio.delete<Mensaje>(URLS.FORMULARIO_POR_ID(formularioId));
  },

  // ─── Campos ───────────────────────────────────────────────────────────

  crearCampo(formularioId: number, body: CreateCampoDto): Promise<Mensaje> {
    return ApiServicio.post<Mensaje>(URLS.CAMPOS_POR_FORMULARIO(formularioId), body);
  },

  listarCampos(formularioId: number): Promise<Campo[]> {
    return ApiServicio.get<Campo[]>(URLS.CAMPOS_POR_FORMULARIO(formularioId));
  },

  actualizarCampo(campoId: number, body: UpdateCampoDto): Promise<Mensaje> {
    return ApiServicio.put<Mensaje>(URLS.CAMPO_POR_ID(campoId), body);
  },

  eliminarCampo(campoId: number): Promise<Mensaje> {
    return ApiServicio.delete<Mensaje>(URLS.CAMPO_POR_ID(campoId));
  },
};
