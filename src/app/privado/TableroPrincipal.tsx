import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  Grid,
  Paper,
  CardActionArea,
  CardContent,
} from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useUsuarioToken } from '../../app/utilidades/auth/usuarioToken';

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
          label={usuario?.role === 'admin' ? 'Administrador' : 'Cliente'}
          color={usuario?.role === 'admin' ? 'primary' : 'success'}
          variant="outlined"
        />
      </Box>

      {usuario?.role === 'admin' && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper elevation={2} sx={{ borderRadius: 2 }}>
              <CardActionArea onClick={() => navigate('/dashboard/workflows')} sx={{ p: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <AccountTreeIcon color="primary" fontSize="large" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Workflows</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">Gestiona los flujos de trabajo y sus etapas</Typography>
                </CardContent>
              </CardActionArea>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper elevation={2} sx={{ borderRadius: 2 }}>
              <CardActionArea onClick={() => navigate('/dashboard/usuarios')} sx={{ p: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <PeopleIcon color="secondary" fontSize="large" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Usuarios</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">Administra los usuarios del sistema</Typography>
                </CardContent>
              </CardActionArea>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper elevation={2} sx={{ borderRadius: 2 }}>
              <CardActionArea onClick={() => navigate('/dashboard/asignaciones')} sx={{ p: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <AssignmentIcon color="action" fontSize="large" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Asignaciones</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">Revisa el estado de las solicitudes de clientes</Typography>
                </CardContent>
              </CardActionArea>
            </Paper>
          </Grid>
        </Grid>
      )}

      {usuario?.role === 'cliente' && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper elevation={2} sx={{ borderRadius: 2 }}>
              <CardActionArea onClick={() => navigate('/dashboard/mis-tramites')} sx={{ p: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <AssignmentIcon color="primary" fontSize="large" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Mis trámites</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">Revisa el estado de tus solicitudes y continúa donde dejaste</Typography>
                </CardContent>
              </CardActionArea>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default TableroPrincipal;
