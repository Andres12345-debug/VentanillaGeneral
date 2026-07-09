import { ApiServicio } from '../reutilizables/ApiServicio';
import { URLS } from '../../utilidades/dominios/urls';

export interface Rol {
  codRol: number;
  nombreRol: string;
  estadoRol: number;
}

export const RolesServicio = {
  listar(): Promise<Rol[]> {
    return ApiServicio.get<Rol[]>(URLS.ROLES);
  },
};
