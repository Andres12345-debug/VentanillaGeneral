import { ApiServicio } from '../reutilizables/ApiServicio';
import { URLS } from '../../utilidades/dominios/urls';

export interface Mensaje {
  mensaje: string;
}

export interface Empresa {
  codEmpresa: number;
  nombreEmpresa: string;
  tokenRegistro: string;
  esDemo: boolean;
  esPruebaGratis: boolean;
  estadoEmpresa: boolean;
  fechaCreacion: string;
}

export interface CreateEmpresaDto {
  nombreEmpresa: string;
  esDemo?: boolean;
}

export interface UpdateEmpresaDto {
  nombreEmpresa?: string;
  estadoEmpresa?: boolean;
}

export interface CrearAdminEmpresaDto {
  correoUsuario: string;
  nombreAcceso: string;
  claveAcceso: string;
  telefonoUsuario: string;
  paisUsuario: string;
  ciudadUsuario: string;
}

export const EmpresaServicio = {
  crear(body: CreateEmpresaDto): Promise<Mensaje & { empresa: Empresa }> {
    return ApiServicio.post<Mensaje & { empresa: Empresa }>(URLS.EMPRESAS, body);
  },

  listar(): Promise<Empresa[]> {
    return ApiServicio.get<Empresa[]>(URLS.EMPRESAS);
  },

  detalle(id: number): Promise<Empresa> {
    return ApiServicio.get<Empresa>(URLS.EMPRESA_POR_ID(id));
  },

  actualizar(id: number, body: UpdateEmpresaDto): Promise<Mensaje> {
    return ApiServicio.put<Mensaje>(URLS.EMPRESA_POR_ID(id), body);
  },

  crearAdmin(id: number, body: CrearAdminEmpresaDto): Promise<Mensaje> {
    return ApiServicio.post<Mensaje>(URLS.EMPRESA_CREAR_ADMIN(id), body);
  },

  resetDemo(id: number): Promise<Mensaje> {
    return ApiServicio.post<Mensaje>(URLS.EMPRESA_RESET_DEMO(id), undefined);
  },
};
