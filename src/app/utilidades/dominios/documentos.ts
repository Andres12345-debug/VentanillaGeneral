import { crearMensaje } from '../funciones/mensaje';
import { AsignacionServicio } from '../../servicios/privados/AsignacionServicio';

export interface DocumentoValor {
  codDocumento: number;
  nombreOriginal: string;
}

export const esDocumentoValor = (valor: unknown): valor is DocumentoValor =>
  typeof valor === 'object' && valor !== null && typeof (valor as { codDocumento?: unknown }).codDocumento === 'number';

// Un mimeType es previsualizable inline si el navegador lo puede renderizar
// directo en un <iframe>/<img> sin plugins (PDF e imágenes).
export const esPrevisualizable = (mimeType: string): boolean =>
  mimeType === 'application/pdf' || mimeType.startsWith('image/');

// Descarga autenticada: no se puede usar un <a href> plano porque el
// endpoint exige el token Bearer, así que se trae el blob y se dispara
// la descarga del navegador manualmente.
export const descargarArchivo = async (codDocumento: number, nombreOriginal: string) => {
  try {
    const blob = await AsignacionServicio.descargarDocumento(codDocumento);
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombreOriginal;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(url);
  } catch (error: unknown) {
    crearMensaje('error', error instanceof Error ? error.message : 'Error al descargar el archivo');
  }
};

// Trae el mismo blob autenticado pero, en vez de forzar la descarga, devuelve
// una object URL + su mimeType para previsualizarlo en un VisorDocumentoDialog.
// El llamador es responsable de revocar la URL cuando ya no se necesite.
export const previsualizarArchivo = async (
  codDocumento: number,
): Promise<{ url: string; mimeType: string }> => {
  const blob = await AsignacionServicio.descargarDocumento(codDocumento);
  return { url: URL.createObjectURL(blob), mimeType: blob.type };
};
