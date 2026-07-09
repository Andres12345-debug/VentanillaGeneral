import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { tokenHelper } from '../utilidades/auth/tokenHelper';
import { decodeToken } from '../utilidades/auth/usuarioToken';

interface VigilanteProps {
  children?: React.ReactNode;
}

const Vigilante: React.FC<VigilanteProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = tokenHelper.get();

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const decoded = decodeToken(token);

    if (!decoded) {
      tokenHelper.remove();
      navigate('/login', { replace: true });
      return;
    }

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      tokenHelper.remove();
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return <>{children ?? <Outlet />}</>;
};

export default Vigilante;
