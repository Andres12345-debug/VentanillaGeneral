export type Rol = 'super_admin' | 'admin' | 'funcionario' | 'cliente';

export const ROL_CONFIG: Record<
  Rol,
  { label: string; color: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default' }
> = {
  super_admin: { label: 'Super Admin', color: 'error' },
  admin: { label: 'Administrador', color: 'primary' },
  funcionario: { label: 'Funcionario', color: 'info' },
  cliente: { label: 'Cliente', color: 'success' },
};
