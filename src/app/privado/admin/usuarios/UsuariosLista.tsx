import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, IconButton, Chip, CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { crearMensaje } from '../../../../app/utilidades/funciones/mensaje';
import { UsuarioServicio, Usuario } from '../../../../app/servicios/privados/UsuarioServicio';
import { ROL_CONFIG, Rol } from '../../../../app/utilidades/dominios/roles';

const UsuariosLista: React.FC = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarUsuarios = async () => {
    setCargando(true);
    try {
      setUsuarios(await UsuarioServicio.listar());
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al cargar usuarios');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarUsuarios(); }, []);

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

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Usuarios</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/dashboard/usuarios/crear')}>
          Nuevo Usuario
        </Button>
      </Box>

      {cargando ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center">No hay usuarios registrados</TableCell></TableRow>
              ) : (
                usuarios.map((usuario) => (
                  <TableRow key={usuario.codUsuario} hover>
                    <TableCell>{usuario.codUsuario}</TableCell>
                    <TableCell>{usuario.nombreAcceso}</TableCell>
                    <TableCell>{usuario.correoUsuario}</TableCell>
                    <TableCell>
                      <Chip
                        label={ROL_CONFIG[usuario.nombreRol as Rol]?.label ?? usuario.nombreRol}
                        color={ROL_CONFIG[usuario.nombreRol as Rol]?.color ?? 'default'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="error" onClick={() => handleEliminar(usuario.codUsuario)} title="Eliminar">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default UsuariosLista;
