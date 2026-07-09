import React from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Box, Link, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { tokenHelper } from '../../../app/utilidades/auth/tokenHelper';
import { useFormulario } from '../../../app/utilidades/funciones/UsoFormulario';
import { AccesoServicio } from '../../../app/servicios/publicos/AccesoServicio';
import FormCard from '../../../compartido/ui/FormCard';
import CampoTexto from '../../../compartido/ui/CampoTexto';
import BotonPrincipal from '../../../compartido/ui/BotonPrincipal';

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CamposLogin {
  correoUsuario: string;
  claveAcceso: string;
}

const validar = (campos: CamposLogin): Partial<Record<keyof CamposLogin, string>> => {
  const errores: Partial<Record<keyof CamposLogin, string>> = {};
  if (!REGEX_EMAIL.test(campos.correoUsuario)) errores.correoUsuario = 'Ingresa un correo válido';
  if (!campos.claveAcceso) errores.claveAcceso = 'La contraseña es obligatoria';
  return errores;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Si se llegó acá desde un enlace público de workflow (o cualquier ruta
  // protegida), "from" indica a dónde volver tras loguearse en vez del
  // dashboard genérico.
  const rutaRetorno = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  const { campos, errores, cargando, handleChange, handleSubmit } = useFormulario<CamposLogin>(
    { correoUsuario: '', claveAcceso: '' },
    validar,
    async (valores) => {
      const respuesta = await AccesoServicio.login(valores);
      tokenHelper.set(respuesta.token);
      navigate(rutaRetorno);
    }
  );

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <FormCard
        titulo="Iniciar sesión"
        subtitulo="Bienvenido de nuevo, ingresa tus datos para continuar."
        icono={<LoginIcon />}
        footer={(
          <Typography variant="body2" color="text.secondary">
            ¿No tienes cuenta?{' '}
            <Link component={RouterLink} to="/registro" sx={{ color: '#128C7E', fontWeight: 700 }}>
              Regístrate
            </Link>
          </Typography>
        )}
      >
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <CampoTexto nombre="correoUsuario" etiqueta="Correo electrónico" tipo="email" valor={campos.correoUsuario} onChange={handleChange} error={errores.correoUsuario} />
          <CampoTexto nombre="claveAcceso" etiqueta="Contraseña" tipo="password" valor={campos.claveAcceso} onChange={handleChange} error={errores.claveAcceso} />
          <BotonPrincipal type="submit" cargando={cargando}>Ingresar</BotonPrincipal>
        </Box>
      </FormCard>
    </Box>
  );
};

export default Login;
