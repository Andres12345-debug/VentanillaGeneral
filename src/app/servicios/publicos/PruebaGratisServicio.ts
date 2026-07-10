import { URLS } from '../../utilidades/dominios/urls';
import { ApiPublicoServicio } from '../reutilizables/ApiPublicoServicio';

interface RegistrarPruebaGratisBody {
  nombreEmpresa: string;
  correoUsuario: string;
  nombreAcceso: string;
  claveAcceso: string;
  telefonoUsuario: string;
  paisUsuario: string;
  ciudadUsuario: string;
}

export interface RegistrarPruebaGratisRespuesta {
  token: string;
}

export const PruebaGratisServicio = {
  // Crea la empresa + su primer admin en un solo paso y devuelve el JWT
  // ya listo (autologueo), a diferencia de AccesoServicio.registrar que
  // solo une un cliente a una empresa existente.
  registrar(body: RegistrarPruebaGratisBody): Promise<RegistrarPruebaGratisRespuesta> {
    return ApiPublicoServicio.post<RegistrarPruebaGratisRespuesta>(URLS.REGISTRAR_PRUEBA_GRATIS, body);
  },
};
