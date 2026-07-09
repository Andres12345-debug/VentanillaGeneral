import { jwtDecode } from 'jwt-decode';
import { tokenHelper } from './tokenHelper';

export interface TokenPayload {
  sub: number;
  name: string;
  role: 'super_admin' | 'admin' | 'funcionario' | 'cliente';
  // null solo para super_admin (alcance global, sin empresa)
  empresa: number | null;
  exp?: number;
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
}

export function useUsuarioToken(): TokenPayload | null {
  const token = tokenHelper.get();
  if (!token) return null;
  return decodeToken(token);
}
