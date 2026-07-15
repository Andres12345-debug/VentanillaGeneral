import React, { useRef } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { QRCodeCanvas } from 'qrcode.react';

interface EnlaceQrDialogoProps {
  abierto: boolean;
  enlace: string;
  nombreWorkflow: string;
  onClose: () => void;
}

// Muestra el mismo enlace público (/tramite/:token) como QR, para imprimir o
// compartir en un cartel — la descarga exporta el <canvas> a PNG directamente
// en el navegador, sin pasar por el backend.
const EnlaceQrDialogo: React.FC<EnlaceQrDialogoProps> = ({ abierto, enlace, nombreWorkflow, onClose }) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const descargarQr = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.download = `qr-${nombreWorkflow.trim().toLowerCase().replace(/\s+/g, '-')}.png`;
    enlaceDescarga.href = canvas.toDataURL('image/png');
    enlaceDescarga.click();
  };

  return (
    <Dialog open={abierto} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Código QR del workflow</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 1 }}>
          <Box ref={canvasRef} sx={{ p: 2, bgcolor: '#fff', borderRadius: 1, lineHeight: 0 }}>
            <QRCodeCanvas value={enlace} size={220} includeMargin />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all', textAlign: 'center' }}>
            {enlace}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
        <Button variant="contained" startIcon={<DownloadIcon />} onClick={descargarQr}>
          Descargar QR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EnlaceQrDialogo;
