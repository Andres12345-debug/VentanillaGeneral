import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { crearMensaje } from '../../../../../app/utilidades/funciones/mensaje';
import { WorkflowServicio, Paso } from '../../../../../app/servicios/privados/WorkflowServicio';

interface PasoDialogoProps {
  abierto: boolean;
  editando: Paso | null;
  codEtapa: number | null;
  onClose: () => void;
  onGuardado: () => void;
}

// codEtapa solo se usa al crear (editando === null); al editar, el backend
// ya sabe a qué etapa pertenece por el id del paso.
const PasoDialogo: React.FC<PasoDialogoProps> = ({ abierto, editando, codEtapa, onClose, onGuardado }) => {
  const [nombrePaso, setNombrePaso] = useState('');
  const [descripcionPaso, setDescripcionPaso] = useState('');
  const [ordenPaso, setOrdenPaso] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!abierto) return;
    setNombrePaso(editando?.nombrePaso ?? '');
    setDescripcionPaso(editando?.descripcionPaso ?? '');
    setOrdenPaso(editando ? String(editando.ordenPaso) : '');
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
        ordenPaso: ordenPaso ? Number(ordenPaso) : undefined,
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
    <Dialog open={abierto} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editando ? 'Editar paso' : 'Nuevo paso'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Nombre del paso" value={nombrePaso} onChange={(e) => setNombrePaso(e.target.value)} fullWidth />
          <TextField label="Descripción (opcional)" value={descripcionPaso} onChange={(e) => setDescripcionPaso(e.target.value)} fullWidth multiline rows={2} />
          <TextField label="Orden" type="number" value={ordenPaso} onChange={(e) => setOrdenPaso(e.target.value)} fullWidth />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={guardar} disabled={guardando}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasoDialogo;
