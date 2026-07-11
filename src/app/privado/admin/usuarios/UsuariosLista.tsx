import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, IconButton, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { crearMensaje } from '../../../../app/utilidades/funciones/mensaje';
import { UsuarioServicio, Usuario } from '../../../../app/servicios/privados/UsuarioServicio';
import { ROL_CONFIG, Rol } from '../../../../app/utilidades/dominios/roles';
import TablaDatos, { ColumnaTabla } from '../../../../compartido/ui/TablaDatos';
import TituloPagina from '../../../../compartido/ui/TituloPagina';

const UsuariosLista: React.FC = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);

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

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      await UsuarioServicio.eliminar(id);
      crearMensaje('success', 'Usuario eliminado correctamente');
      cargarUsuarios();
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al eliminar el usuario');
    }
  };

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
      id: 'acciones',
      etiqueta: 'Acciones',
      align: 'center',
      render: (usuario) => (
        <IconButton size="small" color="error" onClick={() => handleEliminar(usuario.codUsuario)} title="Eliminar">
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TituloPagina>Usuarios</TituloPagina>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/dashboard/usuarios/crear')}>
          Nuevo Usuario
        </Button>
      </Box>

      <TablaDatos
        columnas={columnas}
        filas={usuarios}
        claveFila={(usuario) => usuario.codUsuario}
        cargando={cargando}
        mensajeVacio="No hay usuarios registrados"
      />
    </Box>
  );
};

export default UsuariosLista;
