import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { crearMensaje } from '../../utilidades/funciones/mensaje';
import { tokenHelper } from '../../utilidades/auth/tokenHelper';
import { WorkflowPublicoServicio, WorkflowPublicoInfo } from '../../servicios/publicos/WorkflowPublicoServicio';
import FormCard from '../../../compartido/ui/FormCard';
import BotonPrincipal from '../../../compartido/ui/BotonPrincipal';

const WorkflowPublico: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [info, setInfo] = useState<WorkflowPublicoInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [comenzando, setComenzando] = useState(false);

  const cargar = useCallback(async () => {
    if (!token) return;
    setCargando(true);
    try {
      const datos = await WorkflowPublicoServicio.info(token);
      setInfo(datos);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Este enlace no es válido');
    } finally {
      setCargando(false);
    }
  }, [token]);

  useEffect(() => { cargar(); }, [cargar]);

  const handleComenzar = async () => {
    if (!token) return;
    setComenzando(true);
    try {
      const { codAsignacion } = await WorkflowPublicoServicio.comenzar(token);
      navigate(`/dashboard/mis-tramites/${codAsignacion}`);
    } catch (err: unknown) {
      crearMensaje('error', err instanceof Error ? err.message : 'Error al iniciar el trámite');
    } finally {
      setComenzando(false);
    }
  };

  if (cargando) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !info) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', px: 2 }}>
        <Alert severity="error" sx={{ maxWidth: 480 }}>{error ?? 'Este enlace no es válido'}</Alert>
      </Box>
    );
  }

  const sesionActiva = Boolean(tokenHelper.get());
  const rutaRetorno = `/tramite/${token}`;

  return (
    <FormCard titulo={info.nombreWorkflow} subtitulo={info.descripcionWorkflow ?? undefined}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {sesionActiva ? (
          <BotonPrincipal onClick={handleComenzar} cargando={comenzando}>
            Comenzar
          </BotonPrincipal>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary">
              Para completar este trámite primero debes iniciar sesión o crear una cuenta.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              sx={{ py: 1.5 }}
              onClick={() => navigate('/login', { state: { from: rutaRetorno, tokenRegistroEmpresa: info.tokenRegistroEmpresa } })}
            >
              Iniciar sesión
            </Button>
            {info.tokenRegistroEmpresa && (
              <Button
                component={RouterLink}
                to={`/registro?empresa=${info.tokenRegistroEmpresa}`}
                state={{ from: rutaRetorno }}
                variant="outlined"
                fullWidth
              >
                Crear una cuenta
              </Button>
            )}
          </>
        )}
      </Box>
    </FormCard>
  );
};

export default WorkflowPublico;
