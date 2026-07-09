import { URLS } from '../../utilidades/dominios/urls';
import { ApiPublicoServicio } from '../reutilizables/ApiPublicoServicio';
import { ApiServicio } from '../reutilizables/ApiServicio';

export interface WorkflowPublicoInfo {
  nombreWorkflow: string;
  descripcionWorkflow: string | null;
}

export interface ComenzarPublicoRespuesta {
  codAsignacion: number;
}

export const WorkflowPublicoServicio = {
  // Sin sesión: cualquier visitante con el enlace puede ver esta info mínima.
  info(token: string): Promise<WorkflowPublicoInfo> {
    return ApiPublicoServicio.get<WorkflowPublicoInfo>(URLS.WORKFLOW_PUBLICO_POR_TOKEN(token));
  },

  // Requiere sesión (el backend exige JWT): crea o reutiliza la asignación
  // del cliente autenticado y devuelve su id para continuar el flujo normal.
  comenzar(token: string): Promise<ComenzarPublicoRespuesta> {
    return ApiServicio.post<ComenzarPublicoRespuesta>(URLS.WORKFLOW_PUBLICO_COMENZAR(token));
  },
};
