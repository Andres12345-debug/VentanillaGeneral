import React, { useEffect, useState } from 'react';
import { crearMensaje } from '../../../../../app/utilidades/funciones/mensaje';
import { WorkflowServicio, Paso } from '../../../../../app/servicios/privados/WorkflowServicio';
import NivelDialogoBase from './NivelDialogoBase';

interface PasoDialogoProps {
  abierto: boolean;
  editando: Paso | null;
  codEtapa: number | null;
  siguienteOrden: number;
  onClose: () => void;
  onGuardado: () => void;
}

// codEtapa y siguienteOrden solo se usan al crear (editando === null); al
// editar, el backend ya sabe a qué etapa pertenece y conserva el orden
// actual por el id del paso.
const PasoDialogo: React.FC<PasoDialogoProps> = ({ abierto, editando, codEtapa, siguienteOrden, onClose, onGuardado }) => {
  const [nombrePaso, setNombrePaso] = useState('');
  const [descripcionPaso, setDescripcionPaso] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!abierto) return;
    setNombrePaso(editando?.nombrePaso ?? '');
    setDescripcionPaso(editando?.descripcionPaso ?? '');
  }, [abierto, editando]);

  const guardar = async () => {
    if (!codEtapa && !editando) return;
    if (!nombrePaso.trim()) {
      crearMensaje('error', 'El nombre del paso es obligatorio');
      return;
    }
    setGuardando(true);
    try {
      const body = {
        nombrePaso,
        descripcionPaso: descripcionPaso || undefined,
        ordenPaso: editando ? undefined : siguienteOrden,
      };
      if (editando) {
        await WorkflowServicio.actualizarPaso(editando.codPaso, body);
      } else if (codEtapa) {
        await WorkflowServicio.crearPaso(codEtapa, body);
      }
      crearMensaje('success', 'Paso guardado correctamente');
      onGuardado();
      onClose();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al guardar el paso');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <NivelDialogoBase
      nivel="paso"
      abierto={abierto}
      titulo={editando ? 'Editar paso' : 'Nuevo paso'}
      descripcionAyuda="Un paso es una acción concreta dentro de la etapa. Cada paso puede tener su propio formulario para pedirle información al cliente."
      nombreLabel="Nombre del paso"
      nombrePlaceholder="Ej: Cargar documento de identidad"
      nombreValor={nombrePaso}
      onNombreChange={setNombrePaso}
      descripcionValor={descripcionPaso}
      onDescripcionChange={setDescripcionPaso}
      guardando={guardando}
      onGuardar={guardar}
      onClose={onClose}
    />
  );
};

export default PasoDialogo;
