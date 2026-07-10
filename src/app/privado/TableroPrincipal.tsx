import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Chip, Grid } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BusinessIcon from '@mui/icons-material/Business';
import { useUsuarioToken } from '../../app/utilidades/auth/usuarioToken';
import { ROL_CONFIG, Rol } from '../../app/utilidades/dominios/roles';
import Tarjeta from '../../compartido/ui/Tarjeta';

const TableroPrincipal: React.FC = () => {
  const navigate = useNavigate();
  const usuario = useUsuarioToken();

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Bienvenido, {usuario?.name}
        </Typography>
        <Chip
          label={usuario ? ROL_CONFIG[usuario.role as Rol]?.label ?? usuario.role : ''}
          color={usuario ? ROL_CONFIG[usuario.role as Rol]?.color ?? 'default' : 'default'}
          variant="outlined"
        />
      </Box>

      {usuario?.role === 'super_admin' && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Tarjeta onClick={() => navigate('/dashboard/empresas')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <BusinessIcon color="primary" fontSize="large" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Empresas</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">Crea empresas, sus administradores y gestiona la demo de ventas</Typography>
            </Tarjeta>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Tarjeta onClick={() => navigate('/dashboard/usuarios-globales')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <PeopleIcon color="secondary" fontSize="large" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Usuarios</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">Ve todos los usuarios registrados y a qué empresa pertenece cada uno</Typography>
            </Tarjeta>
          </Grid>
        </Grid>
      )}

      {usuario?.role === 'funcionario' && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Tarjeta onClick={() => navigate('/dashboard/workflows')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <AccountTreeIcon color="primary" fontSize="large" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Workflows</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">Gestiona los flujos de trabajo y sus etapas</Typography>
            </Tarjeta>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Tarjeta onClick={() => navigate('/dashboard/asignaciones')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <AssignmentIcon color="action" fontSize="large" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Asignaciones</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">Revisa las solicitudes que te delegaron para aprobar o rechazar</Typography>
            </Tarjeta>
          </Grid>
        </Grid>
      )}

      {usuario?.role === 'admin' && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Tarjeta onClick={() => navigate('/dashboard/workflows')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <AccountTreeIcon color="primary" fontSize="large" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Workflows</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">Gestiona los flujos de trabajo y sus etapas</Typography>
            </Tarjeta>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Tarjeta onClick={() => navigate('/dashboard/usuarios')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <PeopleIcon color="secondary" fontSize="large" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Usuarios</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">Administra los usuarios del sistema</Typography>
            </Tarjeta>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Tarjeta onClick={() => navigate('/dashboard/asignaciones')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <AssignmentIcon color="action" fontSize="large" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Asignaciones</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">Revisa el estado de las solicitudes de clientes</Typography>
            </Tarjeta>
          </Grid>
        </Grid>
      )}

      {usuario?.role === 'cliente' && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Tarjeta onClick={() => navigate('/dashboard/mis-tramites')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <AssignmentIcon color="primary" fontSize="large" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Mis trámites</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">Revisa el estado de tus solicitudes y continúa donde dejaste</Typography>
            </Tarjeta>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default TableroPrincipal;
