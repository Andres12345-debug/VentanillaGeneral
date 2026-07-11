import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { crearMensaje } from '../../../../../app/utilidades/funciones/mensaje';
import { WorkflowServicio, Formulario } from '../../../../../app/servicios/privados/WorkflowServicio';

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
    <Dialog open={abierto} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editando ? 'Editar formulario' : 'Nuevo formulario'}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          El formulario define qué le vas a pedir al cliente en este paso. Ponle un nombre y después agregá los campos que necesités.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Nombre del formulario" placeholder="Ej: Datos personales" value={nombreFormulario} onChange={(e) => setNombreFormulario(e.target.value)} fullWidth />
          <TextField label="Descripción (opcional)" value={descripcionFormulario} onChange={(e) => setDescripcionFormulario(e.target.value)} fullWidth multiline rows={2} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={guardar} disabled={guardando}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormularioDialogo;
