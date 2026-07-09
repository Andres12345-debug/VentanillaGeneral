import { URLS } from '../../utilidades/dominios/urls';
import { ApiPublicoServicio } from '../reutilizables/ApiPublicoServicio';

export interface EmpresaPublica {
  codEmpresa: number;
  nombreEmpresa: string;
}

export const EmpresaPublicoServicio = {
  resolverTokenRegistro(token: string): Promise<EmpresaPublica> {
    return ApiPublicoServicio.get<EmpresaPublica>(URLS.EMPRESA_POR_TOKEN_REGISTRO(token));
  },
};
