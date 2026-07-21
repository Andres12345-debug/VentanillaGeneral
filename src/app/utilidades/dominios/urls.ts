// La URL del backend viene de REACT_APP_API_URL (ver .env / .env.production).
// Nunca hardcodear el host acá: en build de producción debe apuntar a HTTPS.
export const URL_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3550';

if (process.env.NODE_ENV === 'production' && !URL_BASE.startsWith('https://')) {
  // eslint-disable-next-line no-console
  console.warn('REACT_APP_API_URL no usa HTTPS en un build de producción.');
}

export const URLS = {
  URL_BASE,

  // ─── Auth ───────────────────────────────────────────────────────────────
  LOGIN: `${URL_BASE}/auth/login`,

  // ─── Registro / acceso público ──────────────────────────────────────────
  REGISTRAR_USUARIO: `${URL_BASE}/registros/user`,
  REGISTRAR_PRUEBA_GRATIS: `${URL_BASE}/registros/prueba-gratis`,
  RECUPERAR_PASSWORD: `${URL_BASE}/registros/recuperar-password`,
  NUEVA_PASSWORD: `${URL_BASE}/registros/nueva-password`,

  // ─── Usuarios ───────────────────────────────────────────────────────────
  USUARIOS: `${URL_BASE}/usuarios`,
  USUARIO_PERFIL: `${URL_BASE}/usuarios/perfil`,
  USUARIO_POR_ID: (id: number) => `${URL_BASE}/usuarios/${id}`,

  // ─── Roles ──────────────────────────────────────────────────────────────
  ROLES: `${URL_BASE}/roles`,

  // ─── Empresas (super_admin) ──────────────────────────────────────────────
  EMPRESAS: `${URL_BASE}/empresas`,
  EMPRESA_POR_ID: (id: number) => `${URL_BASE}/empresas/${id}`,
  EMPRESA_CREAR_ADMIN: (id: number) => `${URL_BASE}/empresas/${id}/admin`,
  EMPRESA_RESET_DEMO: (id: number) => `${URL_BASE}/empresas/${id}/reset-demo`,

  // ─── Empresas (público: resolver link de registro) ───────────────────────
  EMPRESA_POR_TOKEN_REGISTRO: (token: string) => `${URL_BASE}/empresas/registro/${token}`,

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
  ASIGNACIONES_EXPORTAR: (workflowId: number) => `${URL_BASE}/workflows/${workflowId}/asignaciones/exportar`,
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

  // ─── Documentos adjuntos (campos tipo "documento") ───────────────────────
  SUBIR_DOCUMENTO: (asignacionId: number, codPaso: number) =>
    `${URL_BASE}/asignaciones/${asignacionId}/pasos/${codPaso}/documentos`,
  DESCARGAR_DOCUMENTO: (codDocumento: number) => `${URL_BASE}/documentos/${codDocumento}`,

  // ─── Workflows públicos (enlace sin asignación previa) ───────────────────
  WORKFLOW_PUBLICO_POR_TOKEN: (token: string) => `${URL_BASE}/publico/workflows/${token}`,
  WORKFLOW_PUBLICO_COMENZAR: (token: string) => `${URL_BASE}/publico/workflows/${token}/comenzar`,
};
