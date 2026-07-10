import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, MenuItem, Select, FormControl, InputLabel, FormHelperText } from '@mui/material';
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
  codRol: number | '';
  correoUsuario: string;
  nombreAcceso: string;
  claveAcceso: string;
  telefonoUsuario: string;
  paisUsuario: string;
  ciudadUsuario: string;
  empresaUsuario: string;
}

type ErroresCampos = Partial<Record<keyof CamposUsuario, string>>;

const UsuarioCrear: React.FC = () => {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [campos, setCampos] = useState<CamposUsuario>({
    codRol: '',
    correoUsuario: '',
    nombreAcceso: '',
    claveAcceso: '',
    telefonoUsuario: '',
    paisUsuario: '',
    ciudadUsuario: '',
    empresaUsuario: '',
  });
  const [errores, setErrores] = useState<ErroresCampos>({});

  useEffect(() => {
    RolesServicio.listar()
      .then((todos) => setRoles(todos.filter((rol) => ROLES_ASIGNABLES.includes(rol.nombreRol))))
      .catch(() => crearMensaje('error', 'Error al cargar los roles'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCampos((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: undefined }));
  };

  const validar = (): boolean => {
    const nuevosErrores: ErroresCampos = {};
    if (!campos.codRol) nuevosErrores.codRol = 'El rol es obligatorio';
    if (!REGEX_EMAIL.test(campos.correoUsuario)) nuevosErrores.correoUsuario = 'Ingresa un correo válido';
    if (campos.nombreAcceso.length < 3 || campos.nombreAcceso.length > 50)
      nuevosErrores.nombreAcceso = 'El nombre debe tener entre 3 y 50 caracteres';
    if (!REGEX_PASSWORD.test(campos.claveAcceso))
      nuevosErrores.claveAcceso = 'Mínimo 8 caracteres, una mayúscula y un número';
    if (campos.telefonoUsuario.length < 7)
      nuevosErrores.telefonoUsuario = 'El teléfono debe tener al menos 7 caracteres';
    if (!campos.paisUsuario.trim()) nuevosErrores.paisUsuario = 'El país es obligatorio';
    if (!campos.ciudadUsuario.trim()) nuevosErrores.ciudadUsuario = 'La ciudad es obligatoria';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;
    setCargando(true);
    try {
      await UsuarioServicio.crear({
        correoUsuario: campos.correoUsuario,
        nombreAcceso: campos.nombreAcceso,
        claveAcceso: campos.claveAcceso,
        telefonoUsuario: campos.telefonoUsuario,
        paisUsuario: campos.paisUsuario,
        ciudadUsuario: campos.ciudadUsuario,
        empresaUsuario: campos.empresaUsuario || undefined,
        codRol: campos.codRol as number,
      });
      crearMensaje('success', 'Usuario creado correctamente');
      navigate('/dashboard/usuarios');
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al crear el usuario');
    } finally {
      setCargando(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', p: 4 }}>
      <FormCard titulo="Nuevo Usuario">
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth error={!!errores.codRol}>
            <InputLabel>Rol</InputLabel>
            <Select
              value={campos.codRol}
              label="Rol"
              onChange={(e) => {
                setCampos((prev) => ({ ...prev, codRol: e.target.value as number }));
                setErrores((prev) => ({ ...prev, codRol: undefined }));
              }}
            >
              {roles.map((rol) => (
                <MenuItem key={rol.codRol} value={rol.codRol}>
                  {rol.nombreRol.charAt(0).toUpperCase() + rol.nombreRol.slice(1)}
                </MenuItem>
              ))}
            </Select>
            {errores.codRol && <FormHelperText>{errores.codRol}</FormHelperText>}
          </FormControl>

          <CampoTexto nombre="correoUsuario" etiqueta="Correo electrónico" tipo="email" valor={campos.correoUsuario} onChange={handleChange} error={errores.correoUsuario} />
          <CampoTexto nombre="nombreAcceso" etiqueta="Nombre de usuario" valor={campos.nombreAcceso} onChange={handleChange} error={errores.nombreAcceso} />
          <CampoTexto nombre="claveAcceso" etiqueta="Contraseña" tipo="password" valor={campos.claveAcceso} onChange={handleChange} error={errores.claveAcceso} />
          <CampoTexto nombre="telefonoUsuario" etiqueta="Teléfono" valor={campos.telefonoUsuario} onChange={handleChange} error={errores.telefonoUsuario} />
          <CampoTexto nombre="paisUsuario" etiqueta="País" valor={campos.paisUsuario} onChange={handleChange} error={errores.paisUsuario} />
          <CampoTexto nombre="ciudadUsuario" etiqueta="Ciudad" valor={campos.ciudadUsuario} onChange={handleChange} error={errores.ciudadUsuario} />
          <CampoTexto nombre="empresaUsuario" etiqueta="Empresa (opcional)" valor={campos.empresaUsuario} onChange={handleChange} error={errores.empresaUsuario} />

          <BotonPrincipal type="submit" cargando={cargando}>Crear Usuario</BotonPrincipal>
        </Box>
      </FormCard>
    </Box>
  );
};

export default UsuarioCrear;
