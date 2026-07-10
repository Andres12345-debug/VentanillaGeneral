import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { crearMensaje } from '../../../../../app/utilidades/funciones/mensaje';
import { WorkflowServicio, Etapa } from '../../../../../app/servicios/privados/WorkflowServicio';

interface EtapaDialogoProps {
  abierto: boolean;
  editando: Etapa | null;
  codWorkflow: number;
  onClose: () => void;
  onGuardado: () => void;
}

// Crea o edita una etapa. codWorkflow solo se usa al crear (editando === null);
// al editar, el backend ya sabe a qué workflow pertenece por el id de la etapa.
const EtapaDialogo: React.FC<EtapaDialogoProps> = ({ abierto, editando, codWorkflow, onClose, onGuardado }) => {
  const [nombreEtapa, setNombreEtapa] = useState('');
  const [descripcionEtapa, setDescripcionEtapa] = useState('');
  const [ordenEtapa, setOrdenEtapa] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!abierto) return;
    setNombreEtapa(editando?.nombreEtapa ?? '');
    setDescripcionEtapa(editando?.descripcionEtapa ?? '');
    setOrdenEtapa(editando ? String(editando.ordenEtapa) : '');
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
        ordenEtapa: ordenEtapa ? Number(ordenEtapa) : undefined,
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Nombre de la etapa" value={nombreEtapa} onChange={(e) => setNombreEtapa(e.target.value)} fullWidth />
          <TextField label="Descripción (opcional)" value={descripcionEtapa} onChange={(e) => setDescripcionEtapa(e.target.value)} fullWidth multiline rows={2} />
          <TextField label="Orden" type="number" value={ordenEtapa} onChange={(e) => setOrdenEtapa(e.target.value)} fullWidth />
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
