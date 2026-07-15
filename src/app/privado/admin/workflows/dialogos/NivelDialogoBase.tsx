import React, { ReactNode } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, useTheme,
} from '@mui/material';
import { alpha, Theme } from '@mui/material/styles';
import FlagRounded from '@mui/icons-material/FlagRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import DescriptionRounded from '@mui/icons-material/DescriptionRounded';
import { TOKENS } from '../../../../../compartido/theme/ThemeContexto';

export type NivelWorkflow = 'etapa' | 'paso' | 'formulario';

const obtenerConfigNivel = (theme: Theme, nivel: NivelWorkflow): { icono: ReactNode; color: string } => {
  switch (nivel) {
    case 'etapa': return { icono: <FlagRounded />, color: theme.palette.primary.main };
    case 'paso': return { icono: <ArrowForwardRounded />, color: theme.palette.secondary.main };
    case 'formulario': return { icono: <DescriptionRounded />, color: TOKENS.slateBlue };
  }
};

interface NivelDialogoBaseProps {
  nivel: NivelWorkflow;
  abierto: boolean;
  titulo: string;
  descripcionAyuda: string;
  nombreLabel: string;
  nombrePlaceholder?: string;
  nombreValor: string;
  onNombreChange: (valor: string) => void;
  descripcionValor: string;
  onDescripcionChange: (valor: string) => void;
  guardando: boolean;
  onGuardar: () => void;
  onClose: () => void;
}

// Shell visual compartido por Etapa/Paso/Formulario: mismo layout de
// nombre + descripción, con un color e ícono propio por nivel para que el
// usuario reconozca de un vistazo en qué profundidad del workflow está
// parado (etapa, paso o formulario).
const NivelDialogoBase: React.FC<NivelDialogoBaseProps> = ({
  nivel, abierto, titulo, descripcionAyuda,
  nombreLabel, nombrePlaceholder, nombreValor, onNombreChange,
  descripcionValor, onDescripcionChange,
  guardando, onGuardar, onClose,
}) => {
  const theme = useTheme();
  const { icono, color } = obtenerConfigNivel(theme, nivel);

  return (
    <Dialog open={abierto} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 40, height: 40, borderRadius: 2, flexShrink: 0,
            bgcolor: alpha(color, 0.15),
            color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {icono}
        </Box>
        {titulo}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {descripcionAyuda}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label={nombreLabel}
            placeholder={nombrePlaceholder}
            value={nombreValor}
            onChange={(e) => onNombreChange(e.target.value)}
            fullWidth
          />
          <TextField
            label="Descripción (opcional)"
            value={descripcionValor}
            onChange={(e) => onDescripcionChange(e.target.value)}
            fullWidth
            multiline
            rows={2}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={onGuardar} disabled={guardando}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NivelDialogoBase;
