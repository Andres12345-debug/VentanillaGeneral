import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, MenuItem, Select, FormControl, InputLabel, FormHelperText } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useFormulario } from '../../../../app/utilidades/funciones/UsoFormulario';
import { crearMensaje } from '../../../../app/utilidades/funciones/mensaje';
import { UsuarioServicio } from '../../../../app/servicios/privados/UsuarioServicio';
import { RolesServicio, Rol } from '../../../../app/servicios/privados/RolesServicio';
import FormCard from '../../../../compartido/ui/FormCard';
import CampoTexto from '../../../../compartido/ui/CampoTexto';
import BotonPrincipal from '../../../../compartido/ui/BotonPrincipal';

const REGEX_PASSWORD = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Un admin de empresa solo puede crear usuarios 'funcionario' o 'cliente'
// (el backend rechaza cualquier otro rol en POST /usuarios de todas formas).
const ROLES_ASIGNABLES = ['funcionario', 'cliente'];

interface CamposUsuario {
  correoUsuario: string;
  nombreAcceso: string;
  claveAcceso: string;
  telefonoUsuario: string;
  paisUsuario: string;
  ciudadUsuario: string;
  empresaUsuario: string;
}

const validar = (campos: CamposUsuario): Partial<Record<keyof CamposUsuario, string>> => {
  const errores: Partial<Record<keyof CamposUsuario, string>> = {};
  if (!REGEX_EMAIL.test(campos.correoUsuario)) errores.correoUsuario = 'Ingresa un correo válido';
  if (campos.nombreAcceso.length < 3 || campos.nombreAcceso.length > 50)
    errores.nombreAcceso = 'El nombre debe tener entre 3 y 50 caracteres';
  if (!REGEX_PASSWORD.test(campos.claveAcceso))
    errores.claveAcceso = 'Mínimo 8 caracteres, una mayúscula y un número';
  if (campos.telefonoUsuario.length < 7)
    errores.telefonoUsuario = 'El teléfono debe tener al menos 7 caracteres';
  if (!campos.paisUsuario.trim()) errores.paisUsuario = 'El país es obligatorio';
  if (!campos.ciudadUsuario.trim()) errores.ciudadUsuario = 'La ciudad es obligatoria';
  return errores;
};

const UsuarioCrear: React.FC = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Rol[]>([]);
  const [codRol, setCodRol] = useState<number | ''>('');
  const [errorRol, setErrorRol] = useState<string>();

  useEffect(() => {
    RolesServicio.listar()
      .then((todos) => setRoles(todos.filter((rol) => ROLES_ASIGNABLES.includes(rol.nombreRol))))
      .catch(() => crearMensaje('error', 'Error al cargar los roles'));
  }, []);

  const { campos, errores, cargando, handleChange, handleSubmit } = useFormulario<CamposUsuario>(
    { correoUsuario: '', nombreAcceso: '', claveAcceso: '', telefonoUsuario: '', paisUsuario: '', ciudadUsuario: '', empresaUsuario: '' },
    validar,
    async (valores) => {
      await UsuarioServicio.crear({
        correoUsuario: valores.correoUsuario,
        nombreAcceso: valores.nombreAcceso,
        claveAcceso: valores.claveAcceso,
        telefonoUsuario: valores.telefonoUsuario,
        paisUsuario: valores.paisUsuario,
        ciudadUsuario: valores.ciudadUsuario,
        empresaUsuario: valores.empresaUsuario || undefined,
        codRol: codRol as number,
      });
      crearMensaje('success', 'Usuario creado correctamente');
      navigate('/dashboard/usuarios');
    }
  );

  const onSubmit = (e: React.FormEvent) => {
    if (!codRol) {
      e.preventDefault();
      setErrorRol('El rol es obligatorio');
      return;
    }
    setErrorRol(undefined);
    handleSubmit(e);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', p: 4 }}>
      <FormCard
        titulo="Nuevo usuario"
        subtitulo="Crea un acceso para un funcionario o cliente de tu empresa."
        icono={<PersonAddIcon />}
        maxWidth={760}
      >
        <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={!!errorRol}>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={codRol}
                  label="Rol"
                  onChange={(e) => {
                    setCodRol(e.target.value as number);
                    setErrorRol(undefined);
                  }}
                >
                  {roles.map((rol) => (
                    <MenuItem key={rol.codRol} value={rol.codRol}>
                      {rol.nombreRol.charAt(0).toUpperCase() + rol.nombreRol.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
                {errorRol && <FormHelperText>{errorRol}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoTexto nombre="correoUsuario" etiqueta="Correo electrónico" tipo="email" valor={campos.correoUsuario} onChange={handleChange} error={errores.correoUsuario} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoTexto nombre="nombreAcceso" etiqueta="Nombre de usuario" valor={campos.nombreAcceso} onChange={handleChange} error={errores.nombreAcceso} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoTexto nombre="claveAcceso" etiqueta="Contraseña" tipo="password" valor={campos.claveAcceso} onChange={handleChange} error={errores.claveAcceso} />
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <CampoTexto nombre="empresaUsuario" etiqueta="Empresa (opcional)" valor={campos.empresaUsuario} onChange={handleChange} error={errores.empresaUsuario} />
            </Grid>
          </Grid>
          <BotonPrincipal type="submit" cargando={cargando}>Crear usuario</BotonPrincipal>
        </Box>
      </FormCard>
    </Box>
  );
};

export default UsuarioCrear;
