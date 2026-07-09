import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, FormControlLabel, Checkbox } from '@mui/material';
import { useFormulario } from '../../../utilidades/funciones/UsoFormulario';
import { crearMensaje } from '../../../utilidades/funciones/mensaje';
import { EmpresaServicio } from '../../../servicios/privados/EmpresaServicio';
import FormCard from '../../../../compartido/ui/FormCard';
import CampoTexto from '../../../../compartido/ui/CampoTexto';
import BotonPrincipal from '../../../../compartido/ui/BotonPrincipal';

interface CamposEmpresa {
  nombreEmpresa: string;
}

const validar = (campos: CamposEmpresa): Partial<Record<keyof CamposEmpresa, string>> => {
  const errores: Partial<Record<keyof CamposEmpresa, string>> = {};
  if (!campos.nombreEmpresa.trim()) errores.nombreEmpresa = 'El nombre de la empresa es obligatorio';
  return errores;
};

const EmpresaCrear: React.FC = () => {
  const navigate = useNavigate();
  const [esDemo, setEsDemo] = useState(false);

  const { campos, errores, cargando, handleChange, handleSubmit } = useFormulario<CamposEmpresa>(
    { nombreEmpresa: '' },
    validar,
    async (valores) => {
      const { empresa } = await EmpresaServicio.crear({ nombreEmpresa: valores.nombreEmpresa, esDemo });
      crearMensaje('success', 'Empresa creada correctamente');
      navigate(`/dashboard/empresas/${empresa.codEmpresa}`);
    }
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', p: 4 }}>
      <FormCard titulo="Nueva Empresa" subtitulo="Después de crearla, agrega su primer administrador desde el detalle.">
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <CampoTexto nombre="nombreEmpresa" etiqueta="Nombre de la empresa" valor={campos.nombreEmpresa} onChange={handleChange} error={errores.nombreEmpresa} />
          <FormControlLabel
            control={<Checkbox checked={esDemo} onChange={(e) => setEsDemo(e.target.checked)} />}
            label="Es una empresa demo (para mostrarle el producto a prospectos)"
          />
          <BotonPrincipal type="submit" cargando={cargando}>Crear Empresa</BotonPrincipal>
        </Box>
      </FormCard>
    </Box>
  );
};

export default EmpresaCrear;
