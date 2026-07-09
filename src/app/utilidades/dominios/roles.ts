export type Rol = 'admin' | 'cliente';

export const ROL_CONFIG: Record<
  Rol,
  { label: string; color: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default' }
> = {
  admin: { label: 'Administrador', color: 'primary' },
  cliente: { label: 'Cliente', color: 'success' },
};
