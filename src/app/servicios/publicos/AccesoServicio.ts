import { URLS } from '../../utilidades/dominios/urls';

interface LoginBody {
  correoUsuario: string;
  claveAcceso: string;
}

interface RegistrarBody {
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

async function requestPublico<T>(method: 'POST' | 'PATCH', url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody?.message ?? errorMessage;
    } catch {
      // no-op
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json() as Promise<T>;
}

export const AccesoServicio = {
  login(body: LoginBody): Promise<LoginResponse> {
    return requestPublico<LoginResponse>('POST', URLS.LOGIN, body);
  },

  registrar(body: RegistrarBody): Promise<RegistrarResponse> {
    return requestPublico<RegistrarResponse>('POST', URLS.REGISTRAR_USUARIO, body);
  },

  recuperarPassword(body: RecuperarPasswordBody): Promise<void> {
    return requestPublico<void>('POST', URLS.RECUPERAR_PASSWORD, body);
  },

  nuevaPassword(body: NuevaPasswordBody): Promise<void> {
    return requestPublico<void>('PATCH', URLS.NUEVA_PASSWORD, body);
  },
};
