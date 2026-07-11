import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { crearMensaje } from '../../../../../app/utilidades/funciones/mensaje';
import { WorkflowServicio, Etapa } from '../../../../../app/servicios/privados/WorkflowServicio';

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
    <Dialog open={abierto} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editando ? 'Editar etapa' : 'Nueva etapa'}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Una etapa agrupa los pasos de una parte de tu proceso. Por ejemplo: "Documentación inicial", "Revisión" o "Aprobación".
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Nombre de la etapa" placeholder="Ej: Documentación inicial" value={nombreEtapa} onChange={(e) => setNombreEtapa(e.target.value)} fullWidth />
          <TextField label="Descripción (opcional)" value={descripcionEtapa} onChange={(e) => setDescripcionEtapa(e.target.value)} fullWidth multiline rows={2} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={guardar} disabled={guardando}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EtapaDialogo;
