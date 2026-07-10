import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Grid, Link, Typography } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useFormulario } from '../../../app/utilidades/funciones/UsoFormulario';
import { crearMensaje } from '../../../app/utilidades/funciones/mensaje';
import { tokenHelper } from '../../../app/utilidades/auth/tokenHelper';
import { PruebaGratisServicio } from '../../../app/servicios/publicos/PruebaGratisServicio';
import FormCard from '../../../compartido/ui/FormCard';
import CampoTexto from '../../../compartido/ui/CampoTexto';
import BotonPrincipal from '../../../compartido/ui/BotonPrincipal';

const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CamposPruebaGratis {
  nombreEmpresa: string;
  correoUsuario: string;
  nombreAcceso: string;
  claveAcceso: string;
  confirmarClave: string;
  telefonoUsuario: string;
  paisUsuario: string;
  ciudadUsuario: string;
}

const validar = (campos: CamposPruebaGratis): Partial<Record<keyof CamposPruebaGratis, string>> => {
  const errores: Partial<Record<keyof CamposPruebaGratis, string>> = {};
  if (!campos.nombreEmpresa.trim()) errores.nombreEmpresa = 'El nombre de tu empresa es obligatorio';
  if (!REGEX_EMAIL.test(campos.correoUsuario)) errores.correoUsuario = 'Ingresa un correo válido';
  if (campos.nombreAcceso.length < 3 || campos.nombreAcceso.length > 50)
    errores.nombreAcceso = 'El nombre debe tener entre 3 y 50 caracteres';
  if (!REGEX_PASSWORD.test(campos.claveAcceso))
    errores.claveAcceso = 'Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)';
  if (campos.confirmarClave !== campos.claveAcceso)
    errores.confirmarClave = 'Las contraseñas no coinciden';
  if (campos.telefonoUsuario.length < 7)
    errores.telefonoUsuario = 'El teléfono debe tener al menos 7 caracteres';
  if (!campos.paisUsuario.trim()) errores.paisUsuario = 'El país es obligatorio';
  if (!campos.ciudadUsuario.trim()) errores.ciudadUsuario = 'La ciudad es obligatoria';
  return errores;
};

const PruebaGratis: React.FC = () => {
  const navigate = useNavigate();

  const { campos, errores, cargando, handleChange, handleSubmit } = useFormulario<CamposPruebaGratis>(
    {
      nombreEmpresa: '', correoUsuario: '', nombreAcceso: '', claveAcceso: '',
      confirmarClave: '', telefonoUsuario: '', paisUsuario: '', ciudadUsuario: '',
    },
    validar,
    async (valores) => {
      const { token } = await PruebaGratisServicio.registrar({
        nombreEmpresa: valores.nombreEmpresa,
        correoUsuario: valores.correoUsuario,
        nombreAcceso: valores.nombreAcceso,
        claveAcceso: valores.claveAcceso,
        telefonoUsuario: valores.telefonoUsuario,
        paisUsuario: valores.paisUsuario,
        ciudadUsuario: valores.ciudadUsuario,
      });
      // A diferencia del registro normal, acá sí autologueamos: el usuario
      // ya queda como admin de su propia empresa nueva.
      tokenHelper.set(token);
      crearMensaje('success', '¡Tu espacio de trabajo está listo!');
      navigate('/dashboard');
    }
  );

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <FormCard
        titulo="Empieza gratis"
        subtitulo="Crea tu empresa y prueba la plataforma sin compromiso. Quedas como admin de tu propio espacio de trabajo."
        icono={<RocketLaunchIcon />}
        maxWidth={760}
        footer={(
          <Typography variant="body2" color="text.secondary">
            ¿Ya tienes cuenta?{' '}
            <Link component={RouterLink} to="/login" sx={{ color: '#128C7E', fontWeight: 700 }}>
              Inicia sesión
            </Link>
          </Typography>
        )}
      >
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Grid container spacing={2.5}>
            <Grid size={12}>
              <CampoTexto nombre="nombreEmpresa" etiqueta="Nombre de tu empresa" valor={campos.nombreEmpresa} onChange={handleChange} error={errores.nombreEmpresa} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoTexto nombre="correoUsuario" etiqueta="Correo electrónico" tipo="email" valor={campos.correoUsuario} onChange={handleChange} error={errores.correoUsuario} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoTexto nombre="nombreAcceso" etiqueta="Nombre de usuario" valor={campos.nombreAcceso} onChange={handleChange} error={errores.nombreAcceso} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoTexto nombre="claveAcceso" etiqueta="Contraseña" tipo="password" valor={campos.claveAcceso} onChange={handleChange} error={errores.claveAcceso} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoTexto nombre="confirmarClave" etiqueta="Confirmar contraseña" tipo="password" valor={campos.confirmarClave} onChange={handleChange} error={errores.confirmarClave} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoTexto nombre="telefonoUsuario" etiqueta="Teléfono" valor={campos.telefonoUsuario} onChange={handleChange} error={errores.telefonoUsuario} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoTexto nombre="paisUsuario" etiqueta="País" valor={campos.paisUsuario} onChange={handleChange} error={errores.paisUsuario} />
            </Grid>
            <Grid size={12}>
              <CampoTexto nombre="ciudadUsuario" etiqueta="Ciudad" valor={campos.ciudadUsuario} onChange={handleChange} error={errores.ciudadUsuario} />
            </Grid>
          </Grid>
          <BotonPrincipal type="submit" cargando={cargando}>Crear mi espacio de trabajo</BotonPrincipal>
        </Box>
      </FormCard>
    </Box>
  );
};

export default PruebaGratis;
