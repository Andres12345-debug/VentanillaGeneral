import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useFormulario } from '../../../../app/utilidades/funciones/UsoFormulario';
import { crearMensaje } from '../../../../app/utilidades/funciones/mensaje';
import { WorkflowServicio } from '../../../../app/servicios/privados/WorkflowServicio';
import FormCard from '../../../../compartido/ui/FormCard';
import CampoTexto from '../../../../compartido/ui/CampoTexto';
import BotonPrincipal from '../../../../compartido/ui/BotonPrincipal';

interface CamposWorkflow {
  nombreWorkflow: string;
  descripcionWorkflow: string;
}

const validar = (campos: CamposWorkflow): Partial<Record<keyof CamposWorkflow, string>> => {
  const errores: Partial<Record<keyof CamposWorkflow, string>> = {};
  if (!campos.nombreWorkflow.trim()) errores.nombreWorkflow = 'El nombre del workflow es obligatorio';
  return errores;
};

const WorkflowCrear: React.FC = () => {
  const navigate = useNavigate();

  const { campos, errores, cargando, handleChange, handleSubmit } = useFormulario<CamposWorkflow>(
    { nombreWorkflow: '', descripcionWorkflow: '' },
    validar,
    async (valores) => {
      await WorkflowServicio.crear(valores);
      crearMensaje('success', 'Workflow creado correctamente');
      navigate('/dashboard/workflows');
    }
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', p: 4 }}>
      <FormCard titulo="Nuevo Workflow">
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <CampoTexto nombre="nombreWorkflow" etiqueta="Nombre del workflow" valor={campos.nombreWorkflow} onChange={handleChange} error={errores.nombreWorkflow} />
          <CampoTexto nombre="descripcionWorkflow" etiqueta="Descripción (opcional)" valor={campos.descripcionWorkflow} onChange={handleChange} error={errores.descripcionWorkflow} multiline rows={3} />
          <BotonPrincipal type="submit" cargando={cargando}>Guardar Workflow</BotonPrincipal>
        </Box>
      </FormCard>
    </Box>
  );
};

export default WorkflowCrear;
