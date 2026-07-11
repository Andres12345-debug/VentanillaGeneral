import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Typography, Chip, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { crearMensaje } from '../../../utilidades/funciones/mensaje';
import { UsuarioServicio, Usuario } from '../../../servicios/privados/UsuarioServicio';
import { ROL_CONFIG, Rol } from '../../../utilidades/dominios/roles';
import TablaDatos, { ColumnaTabla } from '../../../../compartido/ui/TablaDatos';
import TituloPagina from '../../../../compartido/ui/TituloPagina';

// Vista de solo lectura: super_admin ve TODOS los usuarios de TODAS las
// empresas (el backend no filtra por empresa cuando el rol es super_admin).
// Gestionar usuarios de una empresa puntual sigue siendo trabajo del admin
// de esa empresa, no de super_admin — por eso no hay crear/eliminar acá.
const UsuariosGlobal: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  const cargarUsuarios = useCallback(async () => {
    setCargando(true);
    try {
      setUsuarios(await UsuarioServicio.listar());
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al cargar usuarios');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargarUsuarios(); }, [cargarUsuarios]);

  const filtrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return usuarios;
    return usuarios.filter((u) =>
      u.nombreAcceso.toLowerCase().includes(termino) ||
      u.correoUsuario.toLowerCase().includes(termino) ||
      (u.nombreEmpresa ?? '').toLowerCase().includes(termino)
    );
  }, [usuarios, busqueda]);

  const columnas: ColumnaTabla<Usuario>[] = [
    { id: 'id', etiqueta: 'ID', render: (usuario) => usuario.codUsuario },
    { id: 'nombre', etiqueta: 'Nombre', render: (usuario) => usuario.nombreAcceso },
    { id: 'correo', etiqueta: 'Correo', render: (usuario) => usuario.correoUsuario },
    {
      id: 'rol',
      etiqueta: 'Rol',
      render: (usuario) => (
        <Chip
          label={ROL_CONFIG[usuario.nombreRol as Rol]?.label ?? usuario.nombreRol}
          color={ROL_CONFIG[usuario.nombreRol as Rol]?.color ?? 'default'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      id: 'empresa',
      etiqueta: 'Empresa',
      render: (usuario) => usuario.nombreEmpresa ?? (
        <Typography variant="body2" color="text.secondary">— (plataforma)</Typography>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <TituloPagina>Usuarios registrados</TituloPagina>
        <TextField
          size="small"
          placeholder="Buscar por nombre, correo o empresa..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          sx={{ minWidth: 280 }}
          slotProps={{
            input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> },
          }}
        />
      </Box>

      <TablaDatos
        columnas={columnas}
        filas={filtrados}
        claveFila={(usuario) => usuario.codUsuario}
        cargando={cargando}
        mensajeVacio="No hay usuarios que coincidan"
      />
    </Box>
  );
};

export default UsuariosGlobal;
