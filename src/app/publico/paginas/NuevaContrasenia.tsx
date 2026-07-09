import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { useFormulario } from '../../../app/utilidades/funciones/UsoFormulario';
import { crearMensaje } from '../../../app/utilidades/funciones/mensaje';
import { AccesoServicio } from '../../../app/servicios/publicos/AccesoServicio';
import FormCard from '../../../compartido/ui/FormCard';
import CampoTexto from '../../../compartido/ui/CampoTexto';
import BotonPrincipal from '../../../compartido/ui/BotonPrincipal';

const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

interface CamposNuevaClave {
  nuevaClave: string;
  confirmarClave: string;
}

const validar = (campos: CamposNuevaClave): Partial<Record<keyof CamposNuevaClave, string>> => {
  const errores: Partial<Record<keyof CamposNuevaClave, string>> = {};
  if (!REGEX_PASSWORD.test(campos.nuevaClave))
    errores.nuevaClave = 'Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)';
  if (campos.confirmarClave !== campos.nuevaClave)
    errores.confirmarClave = 'Las contraseñas no coinciden';
  return errores;
};

const NuevaContrasenia: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const { campos, errores, cargando, handleChange, handleSubmit } = useFormulario<CamposNuevaClave>(
    { nuevaClave: '', confirmarClave: '' },
    validar,
    async (valores) => {
      if (!token) {
        crearMensaje('error', 'Token inválido o expirado');
        navigate('/login');
        return;
      }
      await AccesoServicio.nuevaPassword({ token, nuevaClave: valores.nuevaClave });
      crearMensaje('success', 'Contraseña actualizada correctamente');
      navigate('/login');
    }
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
      <FormCard titulo="Nueva contraseña">
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <CampoTexto nombre="nuevaClave" etiqueta="Nueva contraseña" tipo="password" valor={campos.nuevaClave} onChange={handleChange} error={errores.nuevaClave} />
          <CampoTexto nombre="confirmarClave" etiqueta="Confirmar contraseña" tipo="password" valor={campos.confirmarClave} onChange={handleChange} error={errores.confirmarClave} />
          <BotonPrincipal type="submit" cargando={cargando}>Guardar contraseña</BotonPrincipal>
        </Box>
      </FormCard>
    </Box>
  );
};

export default NuevaContrasenia;
