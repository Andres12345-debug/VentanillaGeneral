// Debe mantenerse en sync con TipoCampo (backend: modelos/campo/tipo-campo.enum.ts)
export type TipoCampo =
  | 'texto'
  | 'area_texto'
  | 'numero'
  | 'fecha'
  | 'booleano'
  | 'seleccion_unica'
  | 'seleccion_multiple'
  | 'documento';

export const TIPO_CAMPO: Record<TipoCampo, { label: string }> = {
  texto: { label: 'Texto corto' },
  area_texto: { label: 'Texto largo' },
  numero: { label: 'Número' },
  fecha: { label: 'Fecha' },
  booleano: { label: 'Sí / No' },
  seleccion_unica: { label: 'Selección única' },
  seleccion_multiple: { label: 'Selección múltiple' },
  documento: { label: 'Documento adjunto' },
};

export const TIPOS_CON_OPCIONES: TipoCampo[] = ['seleccion_unica', 'seleccion_multiple'];
