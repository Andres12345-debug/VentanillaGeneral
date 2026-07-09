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
