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
  onClose: () => void;
  onGuardado: () => void;
}

const CAMPO_VACIO = {
  nombreCampo: '', etiquetaCampo: '', tipoCampo: 'texto' as TipoCampo,
  requeridoCampo: false, ordenCampo: '', placeholderCampo: '', opcionesCampo: [] as string[],
};

// codFormulario solo se usa al crear (editando === null); al editar, el
// backend ya sabe a qué formulario pertenece por el id del campo.
const CampoDialogo: React.FC<CampoDialogoProps> = ({ abierto, editando, codFormulario, onClose, onGuardado }) => {
  const [nombreCampo, setNombreCampo] = useState(CAMPO_VACIO.nombreCampo);
  const [etiquetaCampo, setEtiquetaCampo] = useState(CAMPO_VACIO.etiquetaCampo);
  const [tipoCampo, setTipoCampo] = useState<TipoCampo>(CAMPO_VACIO.tipoCampo);
  const [requeridoCampo, setRequeridoCampo] = useState(CAMPO_VACIO.requeridoCampo);
  const [ordenCampo, setOrdenCampo] = useState(CAMPO_VACIO.ordenCampo);
  const [placeholderCampo, setPlaceholderCampo] = useState(CAMPO_VACIO.placeholderCampo);
  const [opcionesCampo, setOpcionesCampo] = useState<string[]>(CAMPO_VACIO.opcionesCampo);
  const [opcionNueva, setOpcionNueva] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!abierto) return;
    setNombreCampo(editando?.nombreCampo ?? CAMPO_VACIO.nombreCampo);
    setEtiquetaCampo(editando?.etiquetaCampo ?? CAMPO_VACIO.etiquetaCampo);
    setTipoCampo(editando?.tipoCampo ?? CAMPO_VACIO.tipoCampo);
    setRequeridoCampo(editando?.requeridoCampo ?? CAMPO_VACIO.requeridoCampo);
    setOrdenCampo(editando ? String(editando.ordenCampo) : CAMPO_VACIO.ordenCampo);
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
    if (!nombreCampo.trim() || !etiquetaCampo.trim()) {
      crearMensaje('error', 'Nombre y etiqueta del campo son obligatorios');
      return;
    }
    if (TIPOS_CON_OPCIONES.includes(tipoCampo) && opcionesCampo.length === 0) {
      crearMensaje('error', 'Los campos de selección requieren al menos una opción');
      return;
    }
    setGuardando(true);
    try {
      const body = {
        nombreCampo,
        etiquetaCampo,
        tipoCampo,
        requeridoCampo,
        ordenCampo: ordenCampo ? Number(ordenCampo) : undefined,
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Nombre interno" value={nombreCampo} onChange={(e) => setNombreCampo(e.target.value)} fullWidth />
          <TextField label="Etiqueta (visible al cliente)" value={etiquetaCampo} onChange={(e) => setEtiquetaCampo(e.target.value)} fullWidth />
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
          <TextField label="Placeholder (opcional)" value={placeholderCampo} onChange={(e) => setPlaceholderCampo(e.target.value)} fullWidth />
          <TextField label="Orden" type="number" value={ordenCampo} onChange={(e) => setOrdenCampo(e.target.value)} fullWidth />
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
