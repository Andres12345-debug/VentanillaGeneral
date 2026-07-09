import { URLS } from '../../utilidades/dominios/urls';
import { ApiPublicoServicio } from '../reutilizables/ApiPublicoServicio';

interface LoginBody {
  correoUsuario: string;
  claveAcceso: string;
}

interface RegistrarBody {
  tokenEmpresa: string;
  correoUsuario: string;
  nombreAcceso: string;
  claveAcceso: string;
  telefonoUsuario: string;
  paisUsuario: string;
  ciudadUsuario: string;
  empresaUsuario?: string;
}

interface RecuperarPasswordBody {
  correoUsuario: string;
}

interface NuevaPasswordBody {
  token: string;
  nuevaClave: string;
}

export interface LoginResponse {
  mensaje: string;
  token: string;
}

export interface RegistrarResponse {
  token: string;
}

export const AccesoServicio = {
  login(body: LoginBody): Promise<LoginResponse> {
    return ApiPublicoServicio.post<LoginResponse>(URLS.LOGIN, body);
  },

  registrar(body: RegistrarBody): Promise<RegistrarResponse> {
    return ApiPublicoServicio.post<RegistrarResponse>(URLS.REGISTRAR_USUARIO, body);
  },

  recuperarPassword(body: RecuperarPasswordBody): Promise<void> {
    return ApiPublicoServicio.post<void>(URLS.RECUPERAR_PASSWORD, body);
  },

  nuevaPassword(body: NuevaPasswordBody): Promise<void> {
    return ApiPublicoServicio.patch<void>(URLS.NUEVA_PASSWORD, body);
  },
};
