import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useFormulario } from '../../../app/utilidades/funciones/UsoFormulario';
import { crearMensaje } from '../../../app/utilidades/funciones/mensaje';
import { AccesoServicio } from '../../../app/servicios/publicos/AccesoServicio';
import FormCard from '../../../compartido/ui/FormCard';
import CampoTexto from '../../../compartido/ui/CampoTexto';
import BotonPrincipal from '../../../compartido/ui/BotonPrincipal';

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CamposRecuperar {
  correoUsuario: string;
}

const validar = (campos: CamposRecuperar): Partial<Record<keyof CamposRecuperar, string>> => {
  const errores: Partial<Record<keyof CamposRecuperar, string>> = {};
  if (!REGEX_EMAIL.test(campos.correoUsuario)) errores.correoUsuario = 'Ingresa un correo válido';
  return errores;
};

const RecuperarContrasenia: React.FC = () => {
  const navigate = useNavigate();

  const { campos, errores, cargando, handleChange, handleSubmit } = useFormulario<CamposRecuperar>(
    { correoUsuario: '' },
    validar,
    async (valores) => {
      try {
        await AccesoServicio.recuperarPassword({ correoUsuario: valores.correoUsuario });
      } finally {
        crearMensaje('info', 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.');
        navigate('/login');
      }
    }
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
      <FormCard titulo="Recuperar contraseña">
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <CampoTexto nombre="correoUsuario" etiqueta="Correo electrónico" tipo="email" valor={campos.correoUsuario} onChange={handleChange} error={errores.correoUsuario} />
          <BotonPrincipal type="submit" cargando={cargando}>Enviar enlace</BotonPrincipal>
        </Box>
      </FormCard>
    </Box>
  );
};

export default RecuperarContrasenia;
