import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, IconButton, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { crearMensaje } from '../../../utilidades/funciones/mensaje';
import { EmpresaServicio, Empresa } from '../../../servicios/privados/EmpresaServicio';
import TablaDatos, { ColumnaTabla } from '../../../../compartido/ui/TablaDatos';
import TituloPagina from '../../../../compartido/ui/TituloPagina';

const EmpresasLista: React.FC = () => {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarEmpresas = useCallback(async () => {
    setCargando(true);
    try {
      const datos = await EmpresaServicio.listar();
      setEmpresas(datos);
    } catch (error: unknown) {
      crearMensaje('error', error instanceof Error ? error.message : 'Error al cargar empresas');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargarEmpresas(); }, [cargarEmpresas]);

  const columnas: ColumnaTabla<Empresa>[] = [
    { id: 'id', etiqueta: 'ID', render: (empresa) => empresa.codEmpresa },
    { id: 'nombre', etiqueta: 'Nombre', render: (empresa) => empresa.nombreEmpresa },
    {
      id: 'estado',
      etiqueta: 'Estado',
      render: (empresa) => (
        <Chip label={empresa.estadoEmpresa ? 'Activa' : 'Inactiva'} color={empresa.estadoEmpresa ? 'success' : 'default'} size="small" />
      ),
    },
    {
      id: 'tipo',
      etiqueta: 'Tipo',
      render: (empresa) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {empresa.esDemo && <Chip label="Demo" color="info" size="small" />}
          {empresa.esPruebaGratis && <Chip label="Prueba gratis" color="warning" size="small" />}
        </Box>
      ),
    },
    { id: 'fecha', etiqueta: 'Fecha de creación', render: (empresa) => new Date(empresa.fechaCreacion).toLocaleDateString('es-CO') },
    {
      id: 'acciones',
      etiqueta: 'Acciones',
      align: 'center',
      render: (empresa) => (
        <IconButton size="small" color="primary" onClick={() => navigate(`/dashboard/empresas/${empresa.codEmpresa}`)} title="Ver detalle">
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TituloPagina>Empresas</TituloPagina>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/dashboard/empresas/crear')}>
          Nueva Empresa
        </Button>
      </Box>

      <TablaDatos
        columnas={columnas}
        filas={empresas}
        claveFila={(empresa) => empresa.codEmpresa}
        cargando={cargando}
        mensajeVacio="No hay empresas registradas"
      />
    </Box>
  );
};

export default EmpresasLista;
