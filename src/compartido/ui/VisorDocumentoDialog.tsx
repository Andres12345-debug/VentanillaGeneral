import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { DownloadRounded } from '@mui/icons-material';

interface VisorDocumentoDialogProps {
  abierto: boolean;
  onCerrar: () => void;
  url: string | null;
  mimeType: string | null;
  nombreArchivo: string | null;
  onDescargar?: () => void;
}

const esPdf = (mimeType: string | null) => mimeType === 'application/pdf';
const esImagen = (mimeType: string | null) => !!mimeType && mimeType.startsWith('image/');

const VisorDocumentoDialog: React.FC<VisorDocumentoDialogProps> = ({
  abierto, onCerrar, url, mimeType, nombreArchivo, onDescargar,
}) => (
  <Dialog open={abierto} onClose={onCerrar} maxWidth="md" fullWidth>
    <DialogTitle>{nombreArchivo ?? 'Documento'}</DialogTitle>
    <DialogContent dividers sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
      {url && esPdf(mimeType) && (
        <Box component="iframe" src={url} title={nombreArchivo ?? 'documento'} sx={{ width: '100%', height: '70vh', border: 'none' }} />
      )}
      {url && esImagen(mimeType) && (
        <Box component="img" src={url} alt={nombreArchivo ?? 'documento'} sx={{ maxWidth: '100%', maxHeight: '70vh' }} />
      )}
      {url && !esPdf(mimeType) && !esImagen(mimeType) && (
        <Typography color="text.secondary">Este tipo de archivo no se puede previsualizar. Descárgalo para verlo.</Typography>
      )}
    </DialogContent>
    <DialogActions>
      {onDescargar && (
        <Button startIcon={<DownloadRounded fontSize="small" />} onClick={onDescargar}>Descargar</Button>
      )}
      <Button onClick={onCerrar}>Cerrar</Button>
    </DialogActions>
  </Dialog>
);

export default VisorDocumentoDialog;
