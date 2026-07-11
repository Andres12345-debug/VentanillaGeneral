import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, Chip, Button, CircularProgress, Divider, Grid,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { crearMensaje } from '../../../utilidades/funciones/mensaje';
import { useFormulario } from '../../../utilidades/funciones/UsoFormulario';
import { EmpresaServicio, Empresa } from '../../../servicios/privados/EmpresaServicio';
import CampoTexto from '../../../../compartido/ui/CampoTexto';
import BotonPrincipal from '../../../../compartido/ui/BotonPrincipal';
import Tarjeta from '../../../../compartido/ui/Tarjeta';
import TituloPagina from '../../../../compartido/ui/TituloPagina';

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CamposAdmin {
  correoUsuario: string;
  nombreAcceso: string;
  claveAcceso: string;
  telefonoUsuario: string;
  paisUsuario: string;
  ciudadUsuario: string;
}

const validarAdmin = (campos: CamposAdmin): Partial<Record<keyof CamposAdmin, string>> => {
  const errores: Partial<Record<keyof CamposAdmin, string>> = {};
  if (!REGEX_EMAIL.test(campos.correoUsuario)) errores.correoUsuario = 'Ingresa un correo válido';
  if (campos.nombreAcceso.length < 3) errores.nombreAcceso = 'Mínimo 3 caracteres';
  if (campos.claveAcceso.length < 6) errores.claveAcceso = 'Mínimo 6 caracteres';
  if (campos.telefonoUsuario.length < 7) errores.telefonoUsuario = 'Mínimo 7 caracteres';
  if (!campos.paisUsuario.trim()) errores.paisUsuario = 'El país es obligatorio';
  if (!campos.ciudadUsuario.trim()) errores.ciudadUsuario = 'La ciudad es obligatoria';
  return errores;
};

const EmpresaDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [cargando, setCargando] = useState(true);
  const [reseteando, setReseteando] = useState(false);

  const cargarEmpresa = useCallback(async () => {
    if (!id) return;
    setCargando(true);
    try {
      const datos = await EmpresaServicio.detalle(Number(id));
      setEmpresa(datos);
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al cargar la empresa');
      navigate('/dashboard/empresas');
    } finally {
      setCargando(false);
    }
  }, [id, navigate]);

  useEffect(() => { cargarEmpresa(); }, [cargarEmpresa]);

  const { campos, errores, cargando: creandoAdmin, handleChange, handleSubmit } = useFormulario<CamposAdmin>(
    { correoUsuario: '', nombreAcceso: '', claveAcceso: '', telefonoUsuario: '', paisUsuario: '', ciudadUsuario: '' },
    validarAdmin,
    async (valores) => {
      if (!empresa) return;
      await EmpresaServicio.crearAdmin(empresa.codEmpresa, valores);
      crearMensaje('success', 'Admin de la empresa creado correctamente');
    }
  );

  const copiarEnlaceRegistro = async () => {
    if (!empresa) return;
    const enlace = `${window.location.origin}/registro?empresa=${empresa.tokenRegistro}`;
    try {
      await navigator.clipboard.writeText(enlace);
      crearMensaje('success', 'Enlace de registro copiado');
    } catch {
      crearMensaje('error', 'No se pudo copiar el enlace');
    }
  };

  const toggleEstado = async () => {
    if (!empresa) return;
    try {
      await EmpresaServicio.actualizar(empresa.codEmpresa, { estadoEmpresa: !empresa.estadoEmpresa });
      crearMensaje('success', empresa.estadoEmpresa ? 'Empresa desactivada' : 'Empresa activada');
      cargarEmpresa();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al actualizar la empresa');
    }
  };

  const handleResetDemo = async () => {
    if (!empresa) return;
    if (!window.confirm('Esto borra los workflows y clientes de ejemplo actuales de esta empresa demo y los reemplaza por un set nuevo. ¿Continuar?')) return;
    setReseteando(true);
    try {
      await EmpresaServicio.resetDemo(empresa.codEmpresa);
      crearMensaje('success', 'Empresa demo reseteada correctamente');
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al resetear la demo');
    } finally {
      setReseteando(false);
    }
  };

  if (cargando) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>;
  }

  if (!empresa) return null;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <TituloPagina>{empresa.nombreEmpresa}</TituloPagina>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Chip label={empresa.estadoEmpresa ? 'Activa' : 'Inactiva'} color={empresa.estadoEmpresa ? 'success' : 'default'} size="small" />
            {empresa.esDemo && <Chip label="Demo" color="info" size="small" />}
            {empresa.esPruebaGratis && <Chip label="Prueba gratis" color="warning" size="small" />}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button size="small" startIcon={<LinkIcon />} onClick={copiarEnlaceRegistro}>
            Copiar enlace de registro
          </Button>
          <Button size="small" color={empresa.estadoEmpresa ? 'error' : 'success'} onClick={toggleEstado}>
            {empresa.estadoEmpresa ? 'Desactivar' : 'Activar'}
          </Button>
          {empresa.esDemo && (
            <Button size="small" startIcon={<RestartAltIcon />} onClick={handleResetDemo} disabled={reseteando}>
              {reseteando ? 'Reseteando…' : 'Resetear demo'}
            </Button>
          )}
        </Box>
      </Box>

      <Tarjeta hoverable={false} padding={3} sx={{ maxWidth: 640 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <PersonAddIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Crear admin de la empresa</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Esta es la única forma de crear el primer administrador de la empresa. Comparte estas credenciales con quien vaya a gestionarla.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoTexto nombre="correoUsuario" etiqueta="Correo electrónico" tipo="email" valor={campos.correoUsuario} onChange={handleChange} error={errores.correoUsuario} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoTexto nombre="nombreAcceso" etiqueta="Nombre de usuario" valor={campos.nombreAcceso} onChange={handleChange} error={errores.nombreAcceso} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoTexto nombre="claveAcceso" etiqueta="Contraseña temporal" tipo="password" valor={campos.claveAcceso} onChange={handleChange} error={errores.claveAcceso} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoTexto nombre="telefonoUsuario" etiqueta="Teléfono" valor={campos.telefonoUsuario} onChange={handleChange} error={errores.telefonoUsuario} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoTexto nombre="paisUsuario" etiqueta="País" valor={campos.paisUsuario} onChange={handleChange} error={errores.paisUsuario} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoTexto nombre="ciudadUsuario" etiqueta="Ciudad" valor={campos.ciudadUsuario} onChange={handleChange} error={errores.ciudadUsuario} />
            </Grid>
          </Grid>
          <BotonPrincipal type="submit" cargando={creandoAdmin}>Crear admin</BotonPrincipal>
        </Box>
      </Tarjeta>
    </Box>
  );
};

export default EmpresaDetalle;
