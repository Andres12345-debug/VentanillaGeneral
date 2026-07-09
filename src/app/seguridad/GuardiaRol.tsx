import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useUsuarioToken } from '../utilidades/auth/usuarioToken';

interface GuardiaRolProps {
  rolesPermitidos: string[];
}

const GuardiaRol: React.FC<GuardiaRolProps> = ({ rolesPermitidos }) => {
  const navigate = useNavigate();
  const decoded = useUsuarioToken();
  const autorizado = Boolean(decoded && rolesPermitidos.includes(decoded.role));

  useEffect(() => {
    if (!autorizado) {
      navigate('/dashboard', { replace: true });
    }
  }, [autorizado, navigate]);

  if (!autorizado) return null;

  return <Outlet />;
};

export default GuardiaRol;
