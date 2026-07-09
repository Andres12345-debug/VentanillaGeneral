export const URL_BASE = 'http://localhost:3550';

export const URLS = {
  URL_BASE,

  // ─── Auth ───────────────────────────────────────────────────────────────
  LOGIN: `${URL_BASE}/auth/login`,

  // ─── Registro / acceso público ──────────────────────────────────────────
  REGISTRAR_USUARIO: `${URL_BASE}/registros/user`,
  RECUPERAR_PASSWORD: `${URL_BASE}/registros/recuperar-password`,
  NUEVA_PASSWORD: `${URL_BASE}/registros/nueva-password`,

  // ─── Usuarios ───────────────────────────────────────────────────────────
  USUARIOS: `${URL_BASE}/usuarios`,
  USUARIO_PERFIL: `${URL_BASE}/usuarios/perfil`,
  USUARIO_POR_ID: (id: number) => `${URL_BASE}/usuarios/${id}`,

  // ─── Roles ──────────────────────────────────────────────────────────────
  ROLES: `${URL_BASE}/roles`,

  // ─── Workflows ──────────────────────────────────────────────────────────
  WORKFLOWS: `${URL_BASE}/workflows`,
  WORKFLOW_POR_ID: (id: number) => `${URL_BASE}/workflows/${id}`,

  // ─── Etapas ─────────────────────────────────────────────────────────────
  ETAPAS_POR_WORKFLOW: (workflowId: number) => `${URL_BASE}/workflows/${workflowId}/etapas`,
  ETAPA_POR_ID: (etapaId: number) => `${URL_BASE}/etapas/${etapaId}`,

  // ─── Pasos ──────────────────────────────────────────────────────────────
  PASOS_POR_ETAPA: (etapaId: number) => `${URL_BASE}/etapas/${etapaId}/pasos`,
  PASO_POR_ID: (pasoId: number) => `${URL_BASE}/pasos/${pasoId}`,

  // ─── Formularios ────────────────────────────────────────────────────────
  FORMULARIO_POR_PASO: (pasoId: number) => `${URL_BASE}/pasos/${pasoId}/formulario`,
  FORMULARIO_POR_ID: (formularioId: number) => `${URL_BASE}/formularios/${formularioId}`,

  // ─── Campos ─────────────────────────────────────────────────────────────
  CAMPOS_POR_FORMULARIO: (formularioId: number) => `${URL_BASE}/formularios/${formularioId}/campos`,
  CAMPO_POR_ID: (campoId: number) => `${URL_BASE}/campos/${campoId}`,

  // ─── Asignaciones (admin) ───────────────────────────────────────────────
  ASIGNACIONES: `${URL_BASE}/asignaciones`,
  ASIGNACIONES_POR_WORKFLOW: (workflowId: number) => `${URL_BASE}/workflows/${workflowId}/asignaciones`,
  ASIGNACION_POR_ID: (id: number) => `${URL_BASE}/asignaciones/${id}`,
  ASIGNACION_REVISOR: (id: number) => `${URL_BASE}/asignaciones/${id}/revisor`,
  ASIGNACION_APROBAR: (id: number) => `${URL_BASE}/asignaciones/${id}/aprobar`,
  ASIGNACION_RECHAZAR: (id: number) => `${URL_BASE}/asignaciones/${id}/rechazar`,

  // ─── Asignaciones (cliente) ─────────────────────────────────────────────
  MIS_ASIGNACIONES: `${URL_BASE}/mis-asignaciones`,
  ASIGNACION_REABRIR: (id: number) => `${URL_BASE}/asignaciones/${id}/reabrir`,

  // ─── Respuestas de pasos ────────────────────────────────────────────────
  RESPUESTAS_PASO: (asignacionId: number, codPaso: number) =>
    `${URL_BASE}/asignaciones/${asignacionId}/pasos/${codPaso}/respuestas`,
};
