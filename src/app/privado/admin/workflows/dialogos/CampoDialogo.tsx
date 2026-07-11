import React, { useEffect, useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField, Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { crearMensaje } from '../../../../../app/utilidades/funciones/mensaje';
import { WorkflowServicio, Campo } from '../../../../../app/servicios/privados/WorkflowServicio';
import { TipoCampo, TIPO_CAMPO, TIPOS_CON_OPCIONES } from '../../../../../app/utilidades/dominios/tipoCampo';

interface CampoDialogoProps {
  abierto: boolean;
  editando: Campo | null;
  codFormulario: number | null;
  siguienteOrden: number;
  onClose: () => void;
  onGuardado: () => void;
}

const CAMPO_VACIO = {
  etiquetaCampo: '', tipoCampo: 'texto' as TipoCampo,
  requeridoCampo: false, placeholderCampo: '', opcionesCampo: [] as string[],
};

// El nombre interno del campo no se le pide al usuario: se genera a partir
// de la etiqueta (ej. "Fecha de nacimiento" -> "fecha_de_nacimiento").
const generarNombreCampo = (etiqueta: string): string =>
  etiqueta
    .trim()
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'campo';

// codFormulario y siguienteOrden solo se usan al crear (editando === null);
// al editar, el backend ya sabe a qué formulario pertenece y conserva el
// orden actual por el id del campo.
const CampoDialogo: React.FC<CampoDialogoProps> = ({ abierto, editando, codFormulario, siguienteOrden, onClose, onGuardado }) => {
  const [etiquetaCampo, setEtiquetaCampo] = useState(CAMPO_VACIO.etiquetaCampo);
  const [tipoCampo, setTipoCampo] = useState<TipoCampo>(CAMPO_VACIO.tipoCampo);
  const [requeridoCampo, setRequeridoCampo] = useState(CAMPO_VACIO.requeridoCampo);
  const [placeholderCampo, setPlaceholderCampo] = useState(CAMPO_VACIO.placeholderCampo);
  const [opcionesCampo, setOpcionesCampo] = useState<string[]>(CAMPO_VACIO.opcionesCampo);
  const [opcionNueva, setOpcionNueva] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!abierto) return;
    setEtiquetaCampo(editando?.etiquetaCampo ?? CAMPO_VACIO.etiquetaCampo);
    setTipoCampo(editando?.tipoCampo ?? CAMPO_VACIO.tipoCampo);
    setRequeridoCampo(editando?.requeridoCampo ?? CAMPO_VACIO.requeridoCampo);
    setPlaceholderCampo(editando?.placeholderCampo ?? CAMPO_VACIO.placeholderCampo);
    setOpcionesCampo(editando?.opcionesCampo ?? CAMPO_VACIO.opcionesCampo);
    setOpcionNueva('');
  }, [abierto, editando]);

  const agregarOpcion = () => {
    const valor = opcionNueva.trim();
    if (!valor) return;
    setOpcionesCampo((prev) => [...prev, valor]);
    setOpcionNueva('');
  };

  const quitarOpcion = (opcion: string) => {
    setOpcionesCampo((prev) => prev.filter((o) => o !== opcion));
  };

  const guardar = async () => {
    if (!codFormulario && !editando) return;
    if (!etiquetaCampo.trim()) {
      crearMensaje('error', 'La etiqueta del campo es obligatoria');
      return;
    }
    if (TIPOS_CON_OPCIONES.includes(tipoCampo) && opcionesCampo.length === 0) {
      crearMensaje('error', 'Los campos de selección requieren al menos una opción');
      return;
    }
    setGuardando(true);
    try {
      const body = {
        nombreCampo: editando?.nombreCampo ?? generarNombreCampo(etiquetaCampo),
        etiquetaCampo,
        tipoCampo,
        requeridoCampo,
        ordenCampo: editando ? undefined : siguienteOrden,
        placeholderCampo: placeholderCampo || undefined,
        opcionesCampo: TIPOS_CON_OPCIONES.includes(tipoCampo) ? opcionesCampo : undefined,
      };
      if (editando) {
        await WorkflowServicio.actualizarCampo(editando.codCampo, body);
      } else if (codFormulario) {
        await WorkflowServicio.crearCampo(codFormulario, body);
      }
      crearMensaje('success', 'Campo guardado correctamente');
      onGuardado();
      onClose();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al guardar el campo');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Dialog open={abierto} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editando ? 'Editar campo' : 'Nuevo campo'}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Un campo es cada dato que le pedís al cliente en este formulario. Elegí cómo se llama, qué tipo de dato es y si es obligatorio.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Etiqueta (lo que ve el cliente)" placeholder="Ej: Fecha de nacimiento" value={etiquetaCampo} onChange={(e) => setEtiquetaCampo(e.target.value)} fullWidth />
          <FormControl fullWidth>
            <InputLabel>Tipo de campo</InputLabel>
            <Select
              label="Tipo de campo"
              value={tipoCampo}
              onChange={(e) => setTipoCampo(e.target.value as TipoCampo)}
            >
              {(Object.keys(TIPO_CAMPO) as TipoCampo[]).map((tipo) => (
                <MenuItem key={tipo} value={tipo}>{TIPO_CAMPO[tipo].label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Placeholder (opcional)"
            placeholder="Ej: DD/MM/AAAA"
            helperText="Un ejemplo del dato que se muestra vacío en el campo, para guiar al cliente"
            value={placeholderCampo}
            onChange={(e) => setPlaceholderCampo(e.target.value)}
            fullWidth
          />
          <FormControlLabel
            control={<Switch checked={requeridoCampo} onChange={(e) => setRequeridoCampo(e.target.checked)} />}
            label="Campo obligatorio"
          />

          {TIPOS_CON_OPCIONES.includes(tipoCampo) && (
            <>
              <Divider />
              <Typography variant="subtitle2">Opciones</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  label="Nueva opción"
                  value={opcionNueva}
                  onChange={(e) => setOpcionNueva(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); agregarOpcion(); } }}
                  fullWidth
                />
                <Button variant="outlined" onClick={agregarOpcion}>Agregar</Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {opcionesCampo.map((opcion) => (
                  <Chip key={opcion} label={opcion} onDelete={() => quitarOpcion(opcion)} deleteIcon={<CloseIcon />} />
                ))}
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={guardar} disabled={guardando}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CampoDialogo;
