import React, { useEffect, useState } from 'react';
import {
  Autocomplete, Box, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, List, ListItem, ListItemText, TextField,
} from '@mui/material';
import { crearMensaje } from '../../../../../app/utilidades/funciones/mensaje';
import { AsignacionServicio } from '../../../../../app/servicios/privados/AsignacionServicio';
import { UsuarioServicio, Usuario } from '../../../../../app/servicios/privados/UsuarioServicio';

interface AsignarClientesDialogoProps {
  abierto: boolean;
  codWorkflow: number;
  onClose: () => void;
  onAsignado: () => void;
}

// Carga la lista de clientes (de la propia empresa, ya filtrada por el
// backend) recién cuando se abre, no antes — evita pedirla si el admin
// nunca llega a usar el botón "Asignar a clientes".
const AsignarClientesDialogo: React.FC<AsignarClientesDialogoProps> = ({ abierto, codWorkflow, onClose, onAsignado }) => {
  const [clientes, setClientes] = useState<Usuario[]>([]);
  const [seleccionados, setSeleccionados] = useState<Usuario[]>([]);
  const [asignando, setAsignando] = useState(false);

  useEffect(() => {
    if (!abierto) return;
    setSeleccionados([]);
    UsuarioServicio.listar()
      .then((lista) => setClientes(lista.filter((u) => u.nombreRol === 'cliente')))
      .catch(() => crearMensaje('error', 'Error al cargar los clientes'));
  }, [abierto]);

  const asignar = async () => {
    if (seleccionados.length === 0) return;
    setAsignando(true);
    try {
      await AsignacionServicio.asignar(codWorkflow, {
        codClientes: seleccionados.map((c) => c.codUsuario),
      });
      crearMensaje('success', 'Workflow asignado correctamente');
      onAsignado();
      onClose();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al asignar');
    } finally {
      setAsignando(false);
    }
  };

  return (
    <Dialog open={abierto} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Asignar workflow a clientes</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Autocomplete
            multiple
            options={clientes}
            getOptionLabel={(opcion) => `${opcion.nombreAcceso} (${opcion.correoUsuario})`}
            value={seleccionados}
            onChange={(_, nuevosValores) => setSeleccionados(nuevosValores)}
            renderInput={(params) => (
              <TextField {...params} label="Seleccionar clientes" placeholder="Buscar cliente..." />
            )}
          />
          {seleccionados.length > 0 && (
            <List dense sx={{ mt: 1 }}>
              {seleccionados.map((c) => (
                <ListItem key={c.codUsuario}>
                  <ListItemText primary={c.nombreAcceso} secondary={c.correoUsuario} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={asignar} disabled={asignando || seleccionados.length === 0}>
          {asignando ? 'Asignando...' : 'Asignar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AsignarClientesDialogo;
