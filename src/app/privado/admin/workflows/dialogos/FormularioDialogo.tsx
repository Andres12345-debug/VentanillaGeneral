import React, { useEffect, useState } from 'react';
import { crearMensaje } from '../../../../../app/utilidades/funciones/mensaje';
import { WorkflowServicio, Formulario } from '../../../../../app/servicios/privados/WorkflowServicio';
import NivelDialogoBase from './NivelDialogoBase';

interface FormularioDialogoProps {
  abierto: boolean;
  editando: Formulario | null;
  codPaso: number | null;
  onClose: () => void;
  onGuardado: () => void;
}

// codPaso solo se usa al crear (editando === null); al editar, el backend
// ya sabe a qué paso pertenece por el id del formulario.
const FormularioDialogo: React.FC<FormularioDialogoProps> = ({ abierto, editando, codPaso, onClose, onGuardado }) => {
  const [nombreFormulario, setNombreFormulario] = useState('');
  const [descripcionFormulario, setDescripcionFormulario] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!abierto) return;
    setNombreFormulario(editando?.nombreFormulario ?? '');
    setDescripcionFormulario(editando?.descripcionFormulario ?? '');
  }, [abierto, editando]);

  const guardar = async () => {
    if (!codPaso && !editando) return;
    if (!nombreFormulario.trim()) {
      crearMensaje('error', 'El nombre del formulario es obligatorio');
      return;
    }
    setGuardando(true);
    try {
      const body = {
        nombreFormulario,
        descripcionFormulario: descripcionFormulario || undefined,
      };
      if (editando) {
        await WorkflowServicio.actualizarFormulario(editando.codFormulario, body);
      } else if (codPaso) {
        await WorkflowServicio.crearFormulario(codPaso, body);
      }
      crearMensaje('success', 'Formulario guardado correctamente');
      onGuardado();
      onClose();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al guardar el formulario');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <NivelDialogoBase
      nivel="formulario"
      abierto={abierto}
      titulo={editando ? 'Editar formulario' : 'Nuevo formulario'}
      descripcionAyuda="El formulario define qué le vas a pedir al cliente en este paso. Ponle un nombre y después agregá los campos que necesités."
      nombreLabel="Nombre del formulario"
      nombrePlaceholder="Ej: Datos personales"
      nombreValor={nombreFormulario}
      onNombreChange={setNombreFormulario}
      descripcionValor={descripcionFormulario}
      onDescripcionChange={setDescripcionFormulario}
      guardando={guardando}
      onGuardar={guardar}
      onClose={onClose}
    />
  );
};

export default FormularioDialogo;
