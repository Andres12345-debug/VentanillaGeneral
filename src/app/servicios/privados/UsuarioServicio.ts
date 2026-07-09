import { ApiServicio } from '../reutilizables/ApiServicio';
import { URLS } from '../../utilidades/dominios/urls';
import { TokenPayload } from '../../utilidades/auth/usuarioToken';

// ─── Tipos ───────────────────────────────────────────────────────────────────

// Tal como lo devuelve GET /usuarios (join con accesos + roles)
export interface Usuario {
  codUsuario: number;
  nombreAcceso: string;
  correoUsuario: string;
  telefonoUsuario: string;
  empresaUsuario?: string;
  paisUsuario: string;
  ciudadUsuario: string;
  nombreRol: string;
}

export interface CreateUsuarioDto {
  codRol: number;
  correoUsuario: string;
  nombreAcceso: string;
  claveAcceso: string;
  telefonoUsuario: string;
  paisUsuario: string;
  ciudadUsuario: string;
  empresaUsuario?: string;
}

export interface Mensaje {
  mensaje: string;
}

// ─── Servicio ────────────────────────────────────────────────────────────────

export const UsuarioServicio = {
  listar(): Promise<Usuario[]> {
    return ApiServicio.get<Usuario[]>(URLS.USUARIOS);
  },

  crear(body: CreateUsuarioDto): Promise<Mensaje> {
    return ApiServicio.post<Mensaje>(URLS.USUARIOS, body);
  },

  eliminar(id: number): Promise<Mensaje> {
    return ApiServicio.delete<Mensaje>(URLS.USUARIO_POR_ID(id));
  },

  perfil(): Promise<{ usuario: TokenPayload }> {
    return ApiServicio.get<{ usuario: TokenPayload }>(URLS.USUARIO_PERFIL);
  },
};
