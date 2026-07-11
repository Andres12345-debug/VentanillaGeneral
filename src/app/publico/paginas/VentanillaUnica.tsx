import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Container, Grid, Paper, Chip, useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { TOKENS } from '../../../compartido/theme/ThemeContexto';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DescriptionIcon from '@mui/icons-material/Description';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SecurityIcon from '@mui/icons-material/Security';
import GavelIcon from '@mui/icons-material/Gavel';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import Tarjeta from '../../../compartido/ui/Tarjeta';

// ─── Datos ───────────────────────────────────────────────────────────────────

const pasos = [
  {
    numero: '01',
    titulo: 'Crea tu cuenta',
    descripcion: 'Regístrate con tu correo electrónico e información básica. Es gratis y toma menos de 2 minutos.',
    icono: <PersonAddIcon sx={{ fontSize: 32 }} />,
    color: TOKENS.tealBright,
  },
  {
    numero: '02',
    titulo: 'Accede al sistema',
    descripcion: 'Inicia sesión y accede a tu panel personal donde encontrarás todos tus trámites asignados.',
    icono: <PlayArrowIcon sx={{ fontSize: 32 }} />,
    color: TOKENS.tealMid,
  },
  {
    numero: '03',
    titulo: 'Completa el formulario',
    descripcion: 'Sigue el flujo paso a paso. Cada etapa te guía con instrucciones claras sobre qué información diligenciar.',
    icono: <DescriptionIcon sx={{ fontSize: 32 }} />,
    color: '#8b5cf6',
  },
  {
    numero: '04',
    titulo: 'Recibe tu respuesta',
    descripcion: 'El equipo encargado revisa tu solicitud y recibirás la resolución directamente en tu panel de usuario.',
    icono: <NotificationsActiveIcon sx={{ fontSize: 32 }} />,
    color: '#f59e0b',
  },
];

const beneficios = [
  {
    icono: <TrackChangesIcon sx={{ fontSize: 40, color: TOKENS.tealMid }} />,
    titulo: 'Seguimiento en tiempo real',
    descripcion: 'Consulta el estado de tu solicitud en cualquier momento. Sabrás exactamente en qué etapa se encuentra.',
  },
  {
    icono: <SecurityIcon sx={{ fontSize: 40, color: '#f59e0b' }} />,
    titulo: 'Seguridad garantizada',
    descripcion: 'Tus datos están protegidos. El acceso al sistema es mediante autenticación segura.',
  },
  {
    icono: <GavelIcon sx={{ fontSize: 40, color: '#06b6d4' }} />,
    titulo: 'Resolución ágil',
    descripcion: 'Si tu solicitud es rechazada, puedes corregirla y volver a presentarla sin perder tu historial.',
  },
];

// ─── Componente ──────────────────────────────────────────────────────────────

const VentanillaUnica: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: 'background.default', color: 'text.primary', py: { xs: 7, md: 10 }, px: 2 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                label="Ventanilla Única Digital"
                size="small"
                sx={{ bgcolor: (t) => alpha(t.palette.secondary.main, 0.15), color: 'secondary.dark', mb: 3, fontWeight: 700, letterSpacing: 1 }}
              />
              <Typography variant="h1" sx={{ mb: 3 }}>
                Todos tus trámites,
                <Box component="span" sx={{ display: 'block', color: 'primary.main' }}>en un solo lugar</Box>
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, mb: 5, maxWidth: 560, lineHeight: 1.7 }}>
                Realiza tus solicitudes de forma digital, sigue su progreso en tiempo real y recibe respuestas sin necesidad de desplazarte a las oficinas.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/prueba-gratis')}
                  sx={{
                    borderRadius: 999,
                    px: 3.5, py: 1.4, fontSize: '1rem', fontWeight: 700,
                    boxShadow: (t) => `0 4px 24px ${alpha(t.palette.primary.main, 0.4)}`,
                  }}
                >
                  Comenzar ahora
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderColor: 'rgba(0,0,0,0.2)', color: 'text.primary',
                    bgcolor: 'background.paper',
                    borderRadius: 999,
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'background.paper' },
                    px: 3.5, py: 1.4, fontSize: '1rem',
                  }}
                >
                  Iniciar sesión
                </Button>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Paper
                elevation={0}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  p: 4,
                  pl: 5,
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  boxShadow: isDark ? '0 24px 60px rgba(0,0,0,0.45)' : `0 24px 60px ${alpha(theme.palette.secondary.main, 0.16)}`,
                  bgcolor: 'background.paper',
                }}
              >
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: 6, height: '100%', bgcolor: 'primary.main' }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {[
                    'Sin filas ni desplazamientos físicos',
                    'Seguimiento en tiempo real de tu trámite',
                    'Historial completo de tus solicitudes',
                    'Notificaciones de aprobación o rechazo',
                  ].map((item) => (
                    <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CheckCircleOutlinedIcon sx={{ color: 'primary.main', flexShrink: 0 }} />
                      <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>{item}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── CÓMO RADICAR UN TRÁMITE ──────────────────────────────────────── */}
      <Box sx={{ py: { xs: 7, md: 10 }, px: 2, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Chip label="Guía de uso" size="small" color="primary" sx={{ mb: 2, fontWeight: 700 }} />
            <Typography variant="h3" sx={{ mb: 2 }}>
              ¿Cómo radicar un trámite?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 550, mx: 'auto' }}>
              En cuatro sencillos pasos, gestiona tus trámites desde cualquier dispositivo.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {pasos.map((paso, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={paso.numero}>
                <Tarjeta sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      width: 60, height: 60, borderRadius: 2, mb: 2,
                      bgcolor: `${paso.color}18`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: paso.color,
                    }}
                  >
                    {paso.icono}
                  </Box>
                  <Typography
                    sx={{ fontSize: '2.5rem', fontWeight: 900, color: `${paso.color}25`, lineHeight: 1, mb: 1 }}
                  >
                    {paso.numero}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{paso.titulo}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {paso.descripcion}
                  </Typography>
                  {index < pasos.length - 1 && (
                    <ArrowForwardIcon
                      sx={{
                        position: 'absolute', right: -16, top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'divider', fontSize: 28,
                        display: { xs: 'none', md: 'block' },
                      }}
                    />
                  )}
                </Tarjeta>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── BENEFICIOS ───────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 7, md: 10 }, px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Chip label="Ventajas" size="small" color="secondary" sx={{ mb: 2, fontWeight: 700 }} />
            <Typography variant="h3" sx={{ mb: 2 }}>
              Pensada para ti
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 500, mx: 'auto' }}>
              Una ventanilla única digital para hacer tus solicitudes sin filas ni papeleo.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {beneficios.map((b) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={b.titulo}>
                <Tarjeta>
                  <Box sx={{ mb: 2 }}>{b.icono}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{b.titulo}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {b.descripcion}
                  </Typography>
                </Tarjeta>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${TOKENS.slateBlue} 0%, ${TOKENS.tealBright} 100%)`,
          color: 'white', py: { xs: 7, md: 10 }, px: 2, textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h3" sx={{ mb: 2 }}>
            ¿Listo para radicar tu trámite?
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.75)', fontWeight: 400, mb: 5 }}>
            Crea tu cuenta en minutos y accede a todos tus trámites desde cualquier lugar.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<HowToRegIcon />}
              onClick={() => navigate('/prueba-gratis')}
              sx={{
                borderRadius: 999,
                px: 4, py: 1.5, fontSize: '1rem', fontWeight: 700,
                boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
              }}
            >
              Registrarme gratis
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                borderColor: 'rgba(255,255,255,0.4)', color: 'white',
                borderRadius: 999,
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.08)' },
                px: 4, py: 1.5, fontSize: '1rem',
              }}
            >
              Ya tengo cuenta
            </Button>
          </Box>
        </Container>
      </Box>

    </Box>
  );
};

export default VentanillaUnica;
