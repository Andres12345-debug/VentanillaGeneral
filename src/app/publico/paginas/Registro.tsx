import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Grid, Link, Typography, CircularProgress, Alert } from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { tokenHelper } from '../../../app/utilidades/auth/tokenHelper';
import { useFormulario } from '../../../app/utilidades/funciones/UsoFormulario';
import { crearMensaje } from '../../../app/utilidades/funciones/mensaje';
import { AccesoServicio } from '../../../app/servicios/publicos/AccesoServicio';
import { EmpresaPublicoServicio } from '../../../app/servicios/publicos/EmpresaPublicoServicio';
import FormCard from '../../../compartido/ui/FormCard';
import CampoTexto from '../../../compartido/ui/CampoTexto';
import BotonPrincipal from '../../../compartido/ui/BotonPrincipal';

const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CamposRegistro {
  correoUsuario: string;
  nombreAcceso: string;
  claveAcceso: string;
  confirmarClave: string;
  telefonoUsuario: string;
  paisUsuario: string;
  ciudadUsuario: string;
}

const validar = (campos: CamposRegistro): Partial<Record<keyof CamposRegistro, string>> => {
  const errores: Partial<Record<keyof CamposRegistro, string>> = {};
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

const Registro: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const tokenEmpresa = searchParams.get('empresa');

  // Tras el registro autologueamos con el token que devuelve el backend; si
  // venimos de un enlace público de workflow, "from" indica a dónde volver
  // en vez del dashboard genérico.
  const rutaRetorno = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  // El cliente nunca elige su empresa libremente: solo se une a la que
  // resuelve el link de registro que le compartió su empresa.
  const [nombreEmpresa, setNombreEmpresa] = useState<string | null>(null);
  const [validandoEmpresa, setValidandoEmpresa] = useState(true);
  const [empresaInvalida, setEmpresaInvalida] = useState(false);

  useEffect(() => {
    if (!tokenEmpresa) {
      setValidandoEmpresa(false);
      setEmpresaInvalida(true);
      return;
    }
    EmpresaPublicoServicio.resolverTokenRegistro(tokenEmpresa)
      .then((empresa) => setNombreEmpresa(empresa.nombreEmpresa))
      .catch(() => setEmpresaInvalida(true))
      .finally(() => setValidandoEmpresa(false));
  }, [tokenEmpresa]);

  const { campos, errores, cargando, handleChange, handleSubmit } = useFormulario<CamposRegistro>(
    { correoUsuario: '', nombreAcceso: '', claveAcceso: '', confirmarClave: '', telefonoUsuario: '', paisUsuario: '', ciudadUsuario: '' },
    validar,
    async (valores) => {
      if (!tokenEmpresa) return;
      const respuesta = await AccesoServicio.registrar({
        tokenEmpresa,
        correoUsuario: valores.correoUsuario,
        nombreAcceso: valores.nombreAcceso,
        claveAcceso: valores.claveAcceso,
        telefonoUsuario: valores.telefonoUsuario,
        paisUsuario: valores.paisUsuario,
        ciudadUsuario: valores.ciudadUsuario,
      });
      tokenHelper.set(respuesta.token);
      crearMensaje('success', 'Cuenta creada correctamente.');
      navigate(rutaRetorno);
    }
  );

  if (validandoEmpresa) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (empresaInvalida) {
    return (
      <Box sx={{ bgcolor: 'background.default' }}>
        <FormCard titulo="Enlace de registro no válido" icono={<HowToRegIcon />} maxWidth={560}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Este enlace de registro no es válido o la empresa ya no está activa. Pide a tu empresa el enlace correcto para registrarte.
          </Alert>
          <Typography variant="body2" color="text.secondary">
            ¿Ya tienes cuenta?{' '}
            <Link component={RouterLink} to="/login" sx={{ color: 'secondary.dark', fontWeight: 700 }}>
              Inicia sesión
            </Link>
          </Typography>
        </FormCard>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <FormCard
        titulo="Crear cuenta"
        subtitulo={`Te estás registrando en ${nombreEmpresa}.`}
        icono={<HowToRegIcon />}
        maxWidth={760}
        footer={(
          <Typography variant="body2" color="text.secondary">
            ¿Ya tienes cuenta?{' '}
            <Link component={RouterLink} to="/login" sx={{ color: 'secondary.dark', fontWeight: 700 }}>
              Inicia sesión
            </Link>
          </Typography>
        )}
      >
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Grid container spacing={2.5}>
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoTexto nombre="ciudadUsuario" etiqueta="Ciudad" valor={campos.ciudadUsuario} onChange={handleChange} error={errores.ciudadUsuario} />
            </Grid>
          </Grid>
          <BotonPrincipal type="submit" cargando={cargando}>Registrarse</BotonPrincipal>
        </Box>
      </FormCard>
    </Box>
  );
};

export default Registro;
