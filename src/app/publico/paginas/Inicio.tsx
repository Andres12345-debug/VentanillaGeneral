import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Container, Grid, Paper, Chip, useTheme,
} from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SecurityIcon from '@mui/icons-material/Security';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import TuneIcon from '@mui/icons-material/Tune';
import ShareIcon from '@mui/icons-material/Share';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import GavelIcon from '@mui/icons-material/Gavel';
import ShortTextIcon from '@mui/icons-material/ShortText';
import NotesIcon from '@mui/icons-material/Notes';
import NumbersIcon from '@mui/icons-material/Numbers';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import ChecklistIcon from '@mui/icons-material/Checklist';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Tarjeta from '../../../compartido/ui/Tarjeta';

// ─── Datos ───────────────────────────────────────────────────────────────────

const pasos = [
  {
    numero: '01',
    titulo: 'Diseña tu flujo',
    descripcion: 'Define las etapas y pasos que necesita tu trámite, tal como opera tu organización, sin depender de desarrollo.',
    icono: <AccountTreeIcon sx={{ fontSize: 32 }} />,
    color: '#25D366',
  },
  {
    numero: '02',
    titulo: 'Configura los campos',
    descripcion: 'Añade campos dinámicos —texto, número, fecha, selección— y marca cuáles son obligatorios en cada paso.',
    icono: <TuneIcon sx={{ fontSize: 32 }} />,
    color: '#0d9488',
  },
  {
    numero: '03',
    titulo: 'Publica y comparte',
    descripcion: 'Activa el trámite y compártelo con tus usuarios mediante un enlace o acceso directo desde el sistema.',
    icono: <ShareIcon sx={{ fontSize: 32 }} />,
    color: '#8b5cf6',
  },
  {
    numero: '04',
    titulo: 'Administra las solicitudes',
    descripcion: 'Revisa cada solicitud, apruébala, recházala o delégala a tu equipo desde un único panel de control.',
    icono: <AssignmentTurnedInIcon sx={{ fontSize: 32 }} />,
    color: '#f59e0b',
  },
];

const caracteristicas = [
  {
    icono: <ChecklistIcon sx={{ fontSize: 40, color: '#25D366' }} />,
    titulo: 'Campos dinámicos sin código',
    descripcion: 'Arma cada formulario eligiendo el tipo de campo, si es obligatorio y en qué orden aparece. Publícalo en minutos.',
  },
  {
    icono: <AccountTreeIcon sx={{ fontSize: 40, color: '#0d9488' }} />,
    titulo: 'Flujos por etapas y pasos',
    descripcion: 'Modela procesos tan simples o complejos como los necesites, con etapas y pasos claramente definidos.',
  },
  {
    icono: <TrackChangesIcon sx={{ fontSize: 40, color: '#8b5cf6' }} />,
    titulo: 'Panel de seguimiento',
    descripcion: 'Visualiza en tiempo real en qué estado se encuentra cada solicitud y quién la tiene asignada.',
  },
  {
    icono: <HowToRegIcon sx={{ fontSize: 40, color: '#ef4444' }} />,
    titulo: 'Control de acceso por roles',
    descripcion: 'Administradores y usuarios finales tienen accesos diferenciados según su función dentro del sistema.',
  },
  {
    icono: <SecurityIcon sx={{ fontSize: 40, color: '#f59e0b' }} />,
    titulo: 'Seguridad y auditoría',
    descripcion: 'El acceso se realiza mediante autenticación segura y cada acción sobre una solicitud queda registrada.',
  },
  {
    icono: <GavelIcon sx={{ fontSize: 40, color: '#06b6d4' }} />,
    titulo: 'Resolución ágil de reprocesos',
    descripcion: 'Si una solicitud se rechaza, tus usuarios pueden corregirla y reenviarla sin perder el historial del proceso.',
  },
];

const tiposCampo = [
  { icono: <ShortTextIcon fontSize="small" />, etiqueta: 'Texto corto' },
  { icono: <NotesIcon fontSize="small" />, etiqueta: 'Texto largo' },
  { icono: <NumbersIcon fontSize="small" />, etiqueta: 'Número' },
  { icono: <CalendarMonthIcon fontSize="small" />, etiqueta: 'Fecha' },
  { icono: <ToggleOnIcon fontSize="small" />, etiqueta: 'Sí / No' },
  { icono: <RadioButtonCheckedIcon fontSize="small" />, etiqueta: 'Selección única' },
  { icono: <ChecklistIcon fontSize="small" />, etiqueta: 'Selección múltiple' },
];

const camposEjemplo = [
  { etiqueta: 'Nombre completo', tipo: 'Texto corto', requerido: true, icono: <ShortTextIcon fontSize="small" /> },
  { etiqueta: 'Descripción del caso', tipo: 'Texto largo', requerido: true, icono: <NotesIcon fontSize="small" /> },
  { etiqueta: 'Monto solicitado', tipo: 'Número', requerido: false, icono: <NumbersIcon fontSize="small" /> },
  { etiqueta: 'Fecha de la solicitud', tipo: 'Fecha', requerido: true, icono: <CalendarMonthIcon fontSize="small" /> },
  { etiqueta: '¿Acepta los términos?', tipo: 'Sí / No', requerido: true, icono: <ToggleOnIcon fontSize="small" /> },
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
          pt: { xs: 10, md: 16 },
          pb: { xs: 8, md: 14 },
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
          <Grid container spacing={6} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                label="Software de gestión de trámites"
                size="small"
                sx={{ bgcolor: 'rgba(18,140,126,0.15)', color: '#128C7E', mb: 3, fontWeight: 700, letterSpacing: 1 }}
              />
              <Typography variant="h1" sx={{ mb: 3 }}>
                Digitaliza los trámites
                <Box component="span" sx={{ display: 'block', color: '#25D366' }}>de tu organización</Box>
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, mb: 5, maxWidth: 560, lineHeight: 1.7 }}>
                Crea, publica y administra formularios dinámicos para cualquier proceso, sin escribir una línea de código. Tú defines los campos, las etapas y quién los revisa.
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
                  Solicitar acceso
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
                  boxShadow: isDark ? '0 24px 60px rgba(0,0,0,0.45)' : '0 24px 60px rgba(18,140,126,0.16)',
                  bgcolor: 'background.paper',
                }}
              >
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: 6, height: '100%', bgcolor: '#25D366' }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {[
                    'Constructor de formularios sin código',
                    'Flujos configurables por etapas y pasos',
                    'Panel de administración de solicitudes',
                    'Roles y permisos diferenciados',
                  ].map((item) => (
                    <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CheckCircleOutlinedIcon sx={{ color: '#25D366', flexShrink: 0 }} />
                      <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>{item}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>


      {/* ── FORMULARIOS DINÁMICOS ────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 7, md: 10 }, px: 2, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Chip
                label="Constructor de trámites"
                size="small"
                sx={{ bgcolor: 'rgba(37,211,102,0.15)', color: '#128C7E', mb: 2, fontWeight: 700, letterSpacing: 1 }}
              />
              <Typography variant="h3" sx={{ mb: 2 }}>
                Crea formularios dinámicos sin escribir una línea de código
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, mb: 3, lineHeight: 1.7 }}>
                Define los campos de cada paso de tu trámite: elige el tipo de dato, marca cuáles son obligatorios
                y ordénalos como quieras. Publica un nuevo trámite en minutos, sin depender de desarrollo.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                {tiposCampo.map((t) => (
                  <Chip
                    key={t.etiqueta}
                    icon={t.icono}
                    label={t.etiqueta}
                    variant="outlined"
                    sx={{ borderColor: 'divider', fontWeight: 600 }}
                  />
                ))}
              </Box>
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
                Crear mi primer trámite
              </Button>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3, borderRadius: 4,
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  boxShadow: isDark ? '0 24px 60px rgba(0,0,0,0.45)' : '0 24px 60px rgba(18,140,126,0.16)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                    Paso 1 · Datos del solicitante
                  </Typography>
                  <Chip label="Editando" size="small" sx={{ bgcolor: 'rgba(37,211,102,0.15)', color: '#128C7E', fontWeight: 700 }} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {camposEjemplo.map((campo) => (
                    <Box
                      key={campo.etiqueta}
                      sx={{
                        display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2,
                        border: '1px solid',
                        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                      }}
                    >
                      <DragIndicatorIcon sx={{ color: 'text.disabled' }} />
                      <Box
                        sx={{
                          width: 36, height: 36, borderRadius: 1.5, flexShrink: 0,
                          bgcolor: 'rgba(37,211,102,0.15)', color: '#128C7E',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        {campo.icono}
                      </Box>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>{campo.etiqueta}</Typography>
                        <Typography variant="caption" color="text.secondary">{campo.tipo}</Typography>
                      </Box>
                      {campo.requerido && (
                        <Chip label="Obligatorio" size="small" sx={{ bgcolor: 'rgba(239,68,68,0.12)', color: '#ef4444', fontWeight: 700, fontSize: '0.7rem' }} />
                      )}
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── CÓMO FUNCIONA ────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 7, md: 10 }, px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Chip label="Guía de uso" size="small" color="primary" sx={{ mb: 2, fontWeight: 700 }} />
            <Typography variant="h3" sx={{ mb: 2 }}>
              ¿Cómo funciona para tu organización?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 550, mx: 'auto' }}>
              En cuatro pasos, pasa de un trámite manual a un proceso digital administrado desde un solo lugar.
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

      {/* ── CARACTERÍSTICAS ──────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 7, md: 10 }, px: 2, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Chip label="Funcionalidades" size="small" color="secondary" sx={{ mb: 2, fontWeight: 700 }} />
            <Typography variant="h3" sx={{ mb: 2 }}>
              Todo lo que necesitas para administrar
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 500, mx: 'auto' }}>
              Una plataforma completa para crear y gestionar los formularios dinámicos de tu organización.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {caracteristicas.map((c) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={c.titulo}>
                <Tarjeta>
                  <Box sx={{ mb: 2 }}>{c.icono}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{c.titulo}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {c.descripcion}
                  </Typography>
                </Tarjeta>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── PUENTE A VENTANILLA ÚNICA ────────────────────────────────────── */}
      <Box sx={{ py: { xs: 5, md: 6 }, px: 2 }}>
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 3,
              border: '1px solid',
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
              bgcolor: isDark ? 'rgba(37,211,102,0.06)' : 'rgba(37,211,102,0.08)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 52, height: 52, borderRadius: 2, flexShrink: 0,
                  bgcolor: 'rgba(37,211,102,0.18)', color: '#128C7E',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <HowToVoteIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>¿Buscas radicar un trámite?</Typography>
                <Typography variant="body2" color="text.secondary">
                  Si eres ciudadano o usuario final, conoce la Ventanilla Única para completar tus solicitudes.
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/ventanilla-unica')}
              sx={{
                borderColor: '#25D366', color: '#128C7E', borderRadius: 999,
                px: 3, fontWeight: 700, whiteSpace: 'nowrap',
                '&:hover': { borderColor: '#25D366', bgcolor: 'rgba(37,211,102,0.1)' },
              }}
            >
              Ir a la Ventanilla Única
            </Button>
          </Paper>
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
          <Typography variant="h3" sx={{ mb: 2 }}>
            ¿Listo para digitalizar tus trámites?
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.75)', fontWeight: 400, mb: 5 }}>
            Solicita acceso para tu organización y comienza a crear formularios dinámicos en minutos.
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
              Crear cuenta
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
