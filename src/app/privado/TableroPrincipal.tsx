import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Chip, Grid } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BusinessIcon from '@mui/icons-material/Business';
import { useUsuarioToken } from '../../app/utilidades/auth/usuarioToken';
import { ROL_CONFIG, Rol } from '../../app/utilidades/dominios/roles';
import Tarjeta from '../../compartido/ui/Tarjeta';
import TituloPagina from '../../compartido/ui/TituloPagina';
import { WorkflowServicio } from '../servicios/privados/WorkflowServicio';
import { UsuarioServicio } from '../servicios/privados/UsuarioServicio';
import { AsignacionServicio } from '../servicios/privados/AsignacionServicio';
import { EmpresaServicio } from '../servicios/privados/EmpresaServicio';

interface Contadores {
  empresas: number | null;
  usuarios: number | null;
  workflows: number | null;
  asignaciones: number | null;
}

function ContadorTarjeta({ valor }: { valor: number | null }) {
  if (valor === null) return null;
  return <Chip label={valor} size="small" sx={{ fontWeight: 700 }} />;
}

const TableroPrincipal: React.FC = () => {
  const navigate = useNavigate();
  const usuario = useUsuarioToken();
  const [contadores, setContadores] = useState<Contadores>({
    empresas: null,
    usuarios: null,
    workflows: null,
    asignaciones: null,
  });

  useEffect(() => {
    let cancelado = false;

    async function cargarContadores() {
      try {
        if (usuario?.role === 'super_admin') {
          const [empresas, usuarios] = await Promise.all([
            EmpresaServicio.listar(),
            UsuarioServicio.listar(),
          ]);
          if (!cancelado) {
            setContadores((prev) => ({ ...prev, empresas: empresas.length, usuarios: usuarios.length }));
          }
        } else if (usuario?.role === 'admin') {
          const [workflows, usuarios, asignaciones] = await Promise.all([
            WorkflowServicio.listar(),
            UsuarioServicio.listar(),
            AsignacionServicio.listar(),
          ]);
          if (!cancelado) {
            setContadores((prev) => ({
              ...prev,
              workflows: workflows.length,
              usuarios: usuarios.length,
              asignaciones: asignaciones.length,
            }));
          }
        } else if (usuario?.role === 'funcionario') {
          const [workflows, asignaciones] = await Promise.all([
            WorkflowServicio.listar(),
            AsignacionServicio.listar(),
          ]);
          if (!cancelado) {
            setContadores((prev) => ({ ...prev, workflows: workflows.length, asignaciones: asignaciones.length }));
          }
        } else if (usuario?.role === 'cliente') {
          const asignaciones = await AsignacionServicio.miAsignaciones();
          if (!cancelado) {
            setContadores((prev) => ({ ...prev, asignaciones: asignaciones.length }));
          }
        }
      } catch {
        // Si falla el conteo, las tarjetas simplemente no muestran badge.
      }
    }

    cargarContadores();

    return () => {
      cancelado = true;
    };
  }, [usuario?.role]);

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <TituloPagina>
          Bienvenido, {usuario?.name}
        </TituloPagina>
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
                <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>Empresas</Typography>
                <ContadorTarjeta valor={contadores.empresas} />
              </Box>
              <Typography variant="body2" color="text.secondary">Crea empresas, sus administradores y gestiona la demo de ventas</Typography>
            </Tarjeta>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Tarjeta onClick={() => navigate('/dashboard/usuarios-globales')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <PeopleIcon color="secondary" fontSize="large" />
                <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>Usuarios</Typography>
                <ContadorTarjeta valor={contadores.usuarios} />
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
                <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>Workflows</Typography>
                <ContadorTarjeta valor={contadores.workflows} />
              </Box>
              <Typography variant="body2" color="text.secondary">Gestiona los flujos de trabajo y sus etapas</Typography>
            </Tarjeta>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Tarjeta onClick={() => navigate('/dashboard/asignaciones')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <AssignmentIcon color="action" fontSize="large" />
                <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>Asignaciones</Typography>
                <ContadorTarjeta valor={contadores.asignaciones} />
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
                <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>Workflows</Typography>
                <ContadorTarjeta valor={contadores.workflows} />
              </Box>
              <Typography variant="body2" color="text.secondary">Gestiona los flujos de trabajo y sus etapas</Typography>
            </Tarjeta>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Tarjeta onClick={() => navigate('/dashboard/usuarios')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <PeopleIcon color="secondary" fontSize="large" />
                <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>Usuarios</Typography>
                <ContadorTarjeta valor={contadores.usuarios} />
              </Box>
              <Typography variant="body2" color="text.secondary">Administra los usuarios del sistema</Typography>
            </Tarjeta>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Tarjeta onClick={() => navigate('/dashboard/asignaciones')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <AssignmentIcon color="action" fontSize="large" />
                <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>Asignaciones</Typography>
                <ContadorTarjeta valor={contadores.asignaciones} />
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
                <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>Mis trámites</Typography>
                <ContadorTarjeta valor={contadores.asignaciones} />
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
