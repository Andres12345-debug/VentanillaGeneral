import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useUsuarioToken } from '../utilidades/auth/usuarioToken';

interface GuardiaRolProps {
  rolesPermitidos: string[];
}

const GuardiaRol: React.FC<GuardiaRolProps> = ({ rolesPermitidos }) => {
  const navigate = useNavigate();
  const decoded = useUsuarioToken();

  if (!decoded || !rolesPermitidos.includes(decoded.role)) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  return <Outlet />;
};

export default GuardiaRol;
