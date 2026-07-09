import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useFormulario } from '../../../app/utilidades/funciones/UsoFormulario';
import { crearMensaje } from '../../../app/utilidades/funciones/mensaje';
import { AccesoServicio } from '../../../app/servicios/publicos/AccesoServicio';
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
  empresaUsuario: string;
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

  const { campos, errores, cargando, handleChange, handleSubmit } = useFormulario<CamposRegistro>(
    { correoUsuario: '', nombreAcceso: '', claveAcceso: '', confirmarClave: '', telefonoUsuario: '', paisUsuario: '', ciudadUsuario: '', empresaUsuario: '' },
    validar,
    async (valores) => {
      await AccesoServicio.registrar({
        correoUsuario: valores.correoUsuario,
        nombreAcceso: valores.nombreAcceso,
        claveAcceso: valores.claveAcceso,
        telefonoUsuario: valores.telefonoUsuario,
        paisUsuario: valores.paisUsuario,
        ciudadUsuario: valores.ciudadUsuario,
        empresaUsuario: valores.empresaUsuario || undefined,
      });
      crearMensaje('success', 'Cuenta creada. Inicia sesión para continuar.');
      navigate('/login');
    }
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <FormCard titulo="Crear cuenta">
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <CampoTexto nombre="correoUsuario" etiqueta="Correo electrónico" tipo="email" valor={campos.correoUsuario} onChange={handleChange} error={errores.correoUsuario} />
          <CampoTexto nombre="nombreAcceso" etiqueta="Nombre de usuario" valor={campos.nombreAcceso} onChange={handleChange} error={errores.nombreAcceso} />
          <CampoTexto nombre="claveAcceso" etiqueta="Contraseña" tipo="password" valor={campos.claveAcceso} onChange={handleChange} error={errores.claveAcceso} />
          <CampoTexto nombre="confirmarClave" etiqueta="Confirmar contraseña" tipo="password" valor={campos.confirmarClave} onChange={handleChange} error={errores.confirmarClave} />
          <CampoTexto nombre="telefonoUsuario" etiqueta="Teléfono" valor={campos.telefonoUsuario} onChange={handleChange} error={errores.telefonoUsuario} />
          <CampoTexto nombre="paisUsuario" etiqueta="País" valor={campos.paisUsuario} onChange={handleChange} error={errores.paisUsuario} />
          <CampoTexto nombre="ciudadUsuario" etiqueta="Ciudad" valor={campos.ciudadUsuario} onChange={handleChange} error={errores.ciudadUsuario} />
          <CampoTexto nombre="empresaUsuario" etiqueta="Empresa (opcional)" valor={campos.empresaUsuario} onChange={handleChange} error={errores.empresaUsuario} />
          <BotonPrincipal type="submit" cargando={cargando}>Registrarse</BotonPrincipal>
        </Box>
      </FormCard>
    </Box>
  );
};

export default Registro;
