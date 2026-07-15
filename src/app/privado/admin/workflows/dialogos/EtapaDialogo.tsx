import React, { useEffect, useState } from 'react';
import { crearMensaje } from '../../../../../app/utilidades/funciones/mensaje';
import { WorkflowServicio, Etapa } from '../../../../../app/servicios/privados/WorkflowServicio';
import NivelDialogoBase from './NivelDialogoBase';

interface EtapaDialogoProps {
  abierto: boolean;
  editando: Etapa | null;
  codWorkflow: number;
  siguienteOrden: number;
  onClose: () => void;
  onGuardado: () => void;
}

// Crea o edita una etapa. codWorkflow y siguienteOrden solo se usan al crear
// (editando === null); al editar, el backend ya sabe a qué workflow pertenece
// y conserva el orden actual por el id de la etapa.
const EtapaDialogo: React.FC<EtapaDialogoProps> = ({ abierto, editando, codWorkflow, siguienteOrden, onClose, onGuardado }) => {
  const [nombreEtapa, setNombreEtapa] = useState('');
  const [descripcionEtapa, setDescripcionEtapa] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!abierto) return;
    setNombreEtapa(editando?.nombreEtapa ?? '');
    setDescripcionEtapa(editando?.descripcionEtapa ?? '');
  }, [abierto, editando]);

  const guardar = async () => {
    if (!nombreEtapa.trim()) {
      crearMensaje('error', 'El nombre de la etapa es obligatorio');
      return;
    }
    setGuardando(true);
    try {
      const body = {
        nombreEtapa,
        descripcionEtapa: descripcionEtapa || undefined,
        ordenEtapa: editando ? undefined : siguienteOrden,
      };
      if (editando) {
        await WorkflowServicio.actualizarEtapa(editando.codEtapa, body);
      } else {
        await WorkflowServicio.crearEtapa(codWorkflow, body);
      }
      crearMensaje('success', 'Etapa guardada correctamente');
      onGuardado();
      onClose();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al guardar la etapa');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <NivelDialogoBase
      nivel="etapa"
      abierto={abierto}
      titulo={editando ? 'Editar etapa' : 'Nueva etapa'}
      descripcionAyuda='Una etapa agrupa los pasos de una parte de tu proceso. Por ejemplo: "Documentación inicial", "Revisión" o "Aprobación".'
      nombreLabel="Nombre de la etapa"
      nombrePlaceholder="Ej: Documentación inicial"
      nombreValor={nombreEtapa}
      onNombreChange={setNombreEtapa}
      descripcionValor={descripcionEtapa}
      onDescripcionChange={setDescripcionEtapa}
      guardando={guardando}
      onGuardar={guardar}
      onClose={onClose}
    />
  );
};

export default EtapaDialogo;
