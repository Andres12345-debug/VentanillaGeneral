import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { tokenHelper } from '../utilidades/auth/tokenHelper';
import { decodeToken } from '../utilidades/auth/usuarioToken';

interface VigilanteProps {
  children?: React.ReactNode;
}

function haySesionValida(): boolean {
  const token = tokenHelper.get();
  if (!token) return false;

  const decoded = decodeToken(token);
  if (!decoded) return false;

  if (decoded.exp && decoded.exp * 1000 < Date.now()) return false;

  return true;
}

const Vigilante: React.FC<VigilanteProps> = ({ children }) => {
  const navigate = useNavigate();
  // Se evalúa de forma síncrona (antes del primer render) para no montar
  // contenido protegido ni disparar peticiones autenticadas antes de saber
  // si hay sesión válida.
  const [autorizado] = useState(haySesionValida);

  useEffect(() => {
    if (!autorizado) {
      tokenHelper.remove();
      navigate('/login', { replace: true });
    }
  }, [autorizado, navigate]);

  if (!autorizado) return null;

  return <>{children ?? <Outlet />}</>;
};

export default Vigilante;
