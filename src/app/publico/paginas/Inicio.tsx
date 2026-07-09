import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Container, Grid, Paper, Chip, Divider, useTheme,
} from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SecurityIcon from '@mui/icons-material/Security';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DescriptionIcon from '@mui/icons-material/Description';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import GavelIcon from '@mui/icons-material/Gavel';

// ─── Datos ───────────────────────────────────────────────────────────────────

const pasos = [
  {
    numero: '01',
    titulo: 'Crea tu cuenta',
    descripcion: 'Regístrate con tu correo electrónico e información básica. Es gratis y toma menos de 2 minutos.',
    icono: <PersonAddIcon sx={{ fontSize: 32 }} />,
    color: '#25D366',
  },
  {
    numero: '02',
    titulo: 'Accede al sistema',
    descripcion: 'Inicia sesión y accede a tu panel personal donde encontrarás todos tus trámites asignados.',
    icono: <PlayArrowIcon sx={{ fontSize: 32 }} />,
    color: '#0d9488',
  },
  {
    numero: '03',
    titulo: 'Completa el formulario',
    descripcion: 'Sigue el flujo de trabajo paso a paso. Cada etapa te guía con instrucciones claras y precisas.',
    icono: <DescriptionIcon sx={{ fontSize: 32 }} />,
    color: '#8b5cf6',
  },
  {
    numero: '04',
    titulo: 'Recibe tu respuesta',
    descripcion: 'El equipo revisa tu solicitud y recibirás la resolución directamente en tu panel de usuario.',
    icono: <NotificationsActiveIcon sx={{ fontSize: 32 }} />,
    color: '#f59e0b',
  },
];

const caracteristicas = [
  {
    icono: <AccountTreeIcon sx={{ fontSize: 40, color: '#25D366' }} />,
    titulo: 'Flujos estructurados',
    descripcion: 'Cada trámite sigue un proceso definido con etapas y pasos claros, garantizando que ningún requerimiento quede sin atender.',
  },
  {
    icono: <TrackChangesIcon sx={{ fontSize: 40, color: '#0d9488' }} />,
    titulo: 'Seguimiento en tiempo real',
    descripcion: 'Consulta el estado de tu solicitud en cualquier momento. Sabrás exactamente en qué etapa se encuentra y quién la revisa.',
  },
  {
    icono: <AssignmentTurnedInIcon sx={{ fontSize: 40, color: '#8b5cf6' }} />,
    titulo: 'Gestión integral',
    descripcion: 'Los funcionarios administran y asignan los trámites, con la posibilidad de aprobar, rechazar o delegar la revisión.',
  },
  {
    icono: <SecurityIcon sx={{ fontSize: 40, color: '#f59e0b' }} />,
    titulo: 'Seguridad garantizada',
    descripcion: 'Tus datos están protegidos. El acceso al sistema es mediante autenticación segura y cada acción queda registrada.',
  },
  {
    icono: <HowToRegIcon sx={{ fontSize: 40, color: '#ef4444' }} />,
    titulo: 'Control de acceso por roles',
    descripcion: 'Administradores, funcionarios y ciudadanos tienen accesos diferenciados según su función dentro del sistema.',
  },
  {
    icono: <GavelIcon sx={{ fontSize: 40, color: '#06b6d4' }} />,
    titulo: 'Resolución ágil',
    descripcion: 'Si tu solicitud es rechazada, puedes corregir y volver a presentarla sin perder el historial de tu proceso.',
  },
];

// ─── Componente ──────────────────────────────────────────────────────────────

const Inicio: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          bgcolor: 'background.default',
          color: 'text.primary',
          pt: { xs: 10, md: 14 },
          pb: { xs: 8, md: 12 },
          px: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Círculos decorativos */}
        <Box sx={{
          position: 'absolute', top: -80, right: -80,
          width: 400, height: 400, borderRadius: '50%',
          background: 'rgba(37,211,102,0.18)', pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', bottom: -100, left: -60,
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(18,140,126,0.15)', pointerEvents: 'none',
        }} />

        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                label="Ventanilla Única Digital"
                size="small"
                sx={{ bgcolor: 'rgba(18,140,126,0.15)', color: '#128C7E', mb: 2, fontWeight: 700, letterSpacing: 1 }}
              />
              <Typography
                variant="h2"
                sx={{ fontWeight: 800, lineHeight: 1.15, mb: 2, fontSize: { xs: '2.2rem', md: '3rem' } }}
              >
                Gestiona tus trámites
                <Box component="span" sx={{ color: '#25D366' }}> en línea</Box>
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, mb: 4, maxWidth: 560, lineHeight: 1.7 }}>
                Realiza tus solicitudes de forma digital, sigue su progreso en tiempo real y recibe respuestas sin necesidad de desplazarte a las oficinas.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/registro')}
                  sx={{
                    bgcolor: '#25D366', color: '#0b3d2e', '&:hover': { bgcolor: '#1fb857' },
                    borderRadius: 999,
                    px: 3.5, py: 1.4, fontSize: '1rem', fontWeight: 700,
                    boxShadow: '0 4px 24px rgba(37,211,102,0.4)',
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
                    '&:hover': { borderColor: '#25D366', bgcolor: 'background.paper' },
                    px: 3.5, py: 1.4, fontSize: '1rem',
                  }}
                >
                  Iniciar sesión
                </Button>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pl: { md: 4 } }}>
                {[
                  'Sin filas ni desplazamientos físicos',
                  'Seguimiento en tiempo real del trámite',
                  'Historial completo de tus solicitudes',
                  'Notificaciones de aprobación o rechazo',
                ].map((item) => (
                  <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircleOutlinedIcon sx={{ color: '#25D366', flexShrink: 0 }} />
                    <Typography sx={{ color: 'text.primary' }}>{item}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── ESTADÍSTICAS ─────────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: '#128C7E', py: 3 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
            {[
              { valor: '100%', etiqueta: 'Trámites en línea' },
              { valor: '24/7', etiqueta: 'Disponibilidad' },
              { valor: '0', etiqueta: 'Papeles físicos' },
              { valor: '∞', etiqueta: 'Seguimientos posibles' },
            ].map((stat) => (
              <Grid size={{ xs: 6, sm: 3 }} key={stat.etiqueta}>
                <Box sx={{ textAlign: 'center', color: 'white' }}>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>{stat.valor}</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>{stat.etiqueta}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CÓMO FUNCIONA ────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 7, md: 10 }, px: 2, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Chip label="Guía de uso" size="small" color="primary" sx={{ mb: 2, fontWeight: 700 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
              ¿Cómo funciona?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 550, mx: 'auto' }}>
              En cuatro sencillos pasos, gestiona tus trámites desde cualquier dispositivo.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {pasos.map((paso, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={paso.numero}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3.5, height: '100%', borderRadius: 3,
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
                    position: 'relative', overflow: 'hidden',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 32px rgba(0,0,0,0.12)' },
                  }}
                >
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
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Divider />

      {/* ── CARACTERÍSTICAS ──────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 7, md: 10 }, px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Chip label="Funcionalidades" size="small" color="secondary" sx={{ mb: 2, fontWeight: 700 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
              Todo lo que necesitas
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 500, mx: 'auto' }}>
              Una plataforma completa diseñada para simplificar la gestión de trámites administrativos.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {caracteristicas.map((c) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={c.titulo}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3.5, height: '100%', borderRadius: 3,
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{c.icono}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{c.titulo}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {c.descripcion}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #075E54 0%, #128C7E 100%)',
          color: 'white', py: { xs: 7, md: 10 }, px: 2, textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
            ¿Listo para comenzar?
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.75)', fontWeight: 400, mb: 5 }}>
            Crea tu cuenta en minutos y accede a todos tus trámites desde cualquier lugar.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<HowToRegIcon />}
              onClick={() => navigate('/registro')}
              sx={{
                bgcolor: '#25D366', color: '#0b3d2e', '&:hover': { bgcolor: '#1fb857' },
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

export default Inicio;
