type MuiColor = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default';

// ─── Estado de Asignación ────────────────────────────────────────────────────

export type EstadoAsignacion =
  | 'pendiente'
  | 'en_progreso'
  | 'en_revision'
  | 'aprobado'
  | 'rechazado';

export const ESTADO_ASIGNACION: Record<EstadoAsignacion, { label: string; color: MuiColor }> = {
  pendiente: { label: 'Pendiente', color: 'default' },
  en_progreso: { label: 'En Progreso', color: 'info' },
  en_revision: { label: 'En Revisión', color: 'warning' },
  aprobado: { label: 'Aprobado', color: 'success' },
  rechazado: { label: 'Rechazado', color: 'error' },
};

// ─── Estado de Ejecución de Paso ────────────────────────────────────────────

export type EstadoEjecucionPaso = 'pendiente' | 'completado';

export const ESTADO_EJECUCION_PASO: Record<EstadoEjecucionPaso, { label: string; color: MuiColor }> = {
  pendiente: { label: 'Pendiente', color: 'default' },
  completado: { label: 'Completado', color: 'success' },
};

// ─── Estado de Workflow ──────────────────────────────────────────────────────
// 'publicado' es requisito para poder asignar el workflow a clientes (lo
// exige el backend); 'borrador' es el estado inicial de todo workflow nuevo.

export type EstadoWorkflow = 'borrador' | 'publicado';

export const ESTADO_WORKFLOW: Record<EstadoWorkflow, { label: string; color: MuiColor }> = {
  borrador: { label: 'Borrador', color: 'default' },
  publicado: { label: 'Publicado', color: 'success' },
};
