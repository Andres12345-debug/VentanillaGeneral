import { ApiServicio } from '../reutilizables/ApiServicio';
import { URLS } from '../../utilidades/dominios/urls';
import { EstadoAsignacion, EstadoEjecucionPaso } from '../../utilidades/dominios/estados';
import { Campo } from './WorkflowServicio';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface Mensaje {
  mensaje: string;
}

// Resumen: GET /asignaciones, GET /workflows/:id/asignaciones, GET /mis-asignaciones
export interface AsignacionResumen {
  codAsignacion: number;
  codWorkflow: number;
  nombreWorkflow: string;
  codCliente: number;
  nombreCliente: string;
  correoCliente: string;
  codRevisor: number | null;
  nombreRevisor: string | null;
  estadoAsignacion: EstadoAsignacion;
  motivoRechazo: string | null;
  fechaAsignacion: string;
  fechaActualizacion: string;
}

export interface RespuestaCampo {
  codCampo: number;
  valorRespuesta: unknown;
}

export interface PasoConProgreso {
  codPaso: number;
  nombrePaso: string;
  ordenPaso: number;
  codFormulario: number | null;
  nombreFormulario: string | null;
  campos: Campo[];
  estadoEjecucionPaso: EstadoEjecucionPaso;
  fechaCompletado: string | null;
  respuestas: RespuestaCampo[];
}

export interface EtapaConProgreso {
  codEtapa: number;
  nombreEtapa: string;
  ordenEtapa: number;
  pasos: PasoConProgreso[];
}

// Detalle: GET /asignaciones/:id
export interface AsignacionDetalle {
  codAsignacion: number;
  codWorkflow: number;
  nombreWorkflow: string;
  descripcionWorkflow: string | null;
  codCliente: number;
  nombreCliente: string;
  correoCliente: string;
  codRevisor: number | null;
  nombreRevisor: string | null;
  estadoAsignacion: EstadoAsignacion;
  motivoRechazo: string | null;
  fechaAsignacion: string;
  fechaActualizacion: string;
  etapas: EtapaConProgreso[];
  siguientePaso: { codPaso: number; codFormulario: number } | null;
}

export interface AsignarBody {
  codClientes: number[];
}

export interface AsignarRevisorBody {
  codRevisor: number;
}

export interface RechazarBody {
  motivoRechazo: string;
}

export interface RespuestaEnviar {
  codCampo: number;
  valor: unknown;
}

export interface EnviarRespuestasBody {
  respuestas: RespuestaEnviar[];
}

export interface DocumentoSubido {
  codDocumento: number;
  nombreOriginal: string;
}

// ─── Servicio ────────────────────────────────────────────────────────────────

export const AsignacionServicio = {
  asignar(codWorkflow: number, body: AsignarBody): Promise<Mensaje> {
    return ApiServicio.post<Mensaje>(URLS.ASIGNACIONES_POR_WORKFLOW(codWorkflow), body);
  },

  listar(estado?: EstadoAsignacion): Promise<AsignacionResumen[]> {
    const url = estado ? `${URLS.ASIGNACIONES}?estado=${estado}` : URLS.ASIGNACIONES;
    return ApiServicio.get<AsignacionResumen[]>(url);
  },

  listarPorWorkflow(
    codWorkflow: number,
    estado?: EstadoAsignacion
  ): Promise<AsignacionResumen[]> {
    const url = estado
      ? `${URLS.ASIGNACIONES_POR_WORKFLOW(codWorkflow)}?estado=${estado}`
      : URLS.ASIGNACIONES_POR_WORKFLOW(codWorkflow);
    return ApiServicio.get<AsignacionResumen[]>(url);
  },

  exportarExcel(codWorkflow: number, estado?: EstadoAsignacion): Promise<Blob> {
    const url = estado
      ? `${URLS.ASIGNACIONES_EXPORTAR(codWorkflow)}?estado=${estado}`
      : URLS.ASIGNACIONES_EXPORTAR(codWorkflow);
    return ApiServicio.getBlob(url);
  },

  miAsignaciones(): Promise<AsignacionResumen[]> {
    return ApiServicio.get<AsignacionResumen[]>(URLS.MIS_ASIGNACIONES);
  },

  detalle(id: number): Promise<AsignacionDetalle> {
    return ApiServicio.get<AsignacionDetalle>(URLS.ASIGNACION_POR_ID(id));
  },

  enviarRespuestas(
    id: number,
    codPaso: number,
    body: EnviarRespuestasBody
  ): Promise<Mensaje> {
    return ApiServicio.post<Mensaje>(URLS.RESPUESTAS_PASO(id, codPaso), body);
  },

  subirDocumento(
    id: number,
    codPaso: number,
    codCampo: number,
    archivo: File
  ): Promise<DocumentoSubido> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('codCampo', String(codCampo));
    return ApiServicio.post<DocumentoSubido>(URLS.SUBIR_DOCUMENTO(id, codPaso), formData);
  },

  descargarDocumento(codDocumento: number): Promise<Blob> {
    return ApiServicio.getBlob(URLS.DESCARGAR_DOCUMENTO(codDocumento));
  },

  asignarRevisor(id: number, body: AsignarRevisorBody): Promise<Mensaje> {
    return ApiServicio.patch<Mensaje>(URLS.ASIGNACION_REVISOR(id), body);
  },

  aprobar(id: number): Promise<Mensaje> {
    return ApiServicio.put<Mensaje>(URLS.ASIGNACION_APROBAR(id));
  },

  rechazar(id: number, body: RechazarBody): Promise<Mensaje> {
    return ApiServicio.put<Mensaje>(URLS.ASIGNACION_RECHAZAR(id), body);
  },

  reabrir(id: number): Promise<Mensaje> {
    return ApiServicio.post<Mensaje>(URLS.ASIGNACION_REABRIR(id));
  },
};
