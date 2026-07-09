import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../compartido/layout/MainLayout';
import InicioLayout from '../compartido/layout/InicioLayout';
import DashboardLayout from '../compartido/layout/DashboardLayout';
import Vigilante from '../app/seguridad/Vigilante';
import GuardiaRol from '../app/seguridad/GuardiaRol';
import Error from '../compartido/Error';

// ── Páginas públicas ──────────────────────────────────────────────
const Inicio = lazy(() => import('../app/publico/paginas/Inicio'));
const Login = lazy(() => import('../app/publico/paginas/Login'));
const Registro = lazy(() => import('../app/publico/paginas/Registro'));
const RecuperarContrasenia = lazy(() => import('../app/publico/paginas/RecuperarContrasenia'));
const NuevaContrasenia = lazy(() => import('../app/publico/paginas/NuevaContrasenia'));
const WorkflowPublico = lazy(() => import('../app/publico/paginas/WorkflowPublico'));
const VentanillaUnica = lazy(() => import('../app/publico/paginas/VentanillaUnica'));

// ── Dashboard compartido ──────────────────────────────────────────
const TableroPrincipal = lazy(() => import('../app/privado/TableroPrincipal'));

// ── Admin ─────────────────────────────────────────────────────────
const WorkflowsLista = lazy(() => import('../app/privado/admin/workflows/WorkflowsLista'));
const WorkflowCrear = lazy(() => import('../app/privado/admin/workflows/WorkflowCrear'));
const WorkflowDetalle = lazy(() => import('../app/privado/admin/workflows/WorkflowDetalle'));
const UsuariosLista = lazy(() => import('../app/privado/admin/usuarios/UsuariosLista'));
const UsuarioCrear = lazy(() => import('../app/privado/admin/usuarios/UsuarioCrear'));
const AsignacionesLista = lazy(() => import('../app/privado/admin/asignaciones/AsignacionesLista'));
const AsignacionDetalle = lazy(() => import('../app/privado/admin/asignaciones/AsignacionDetalle'));

// ── Cliente ───────────────────────────────────────────────────────
const MisAsignaciones = lazy(() => import('../app/privado/cliente/MisAsignaciones'));
const AsignacionFormulario = lazy(() => import('../app/privado/cliente/AsignacionFormulario'));

const RuteoPrincipal: React.FC = () => {
  return (
    <Routes>
      {/* 🏠 LANDING — sin espaciador (el hero maneja el padding) */}
      <Route element={<InicioLayout />}>
        <Route path="/" element={<Inicio />} />
      </Route>

      {/* 🌐 PÚBLICO — con Nav y Footer */}
      <Route element={<MainLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar-password" element={<RecuperarContrasenia />} />
        <Route path="/restablecer-password/:token" element={<NuevaContrasenia />} />
        <Route path="/tramite/:token" element={<WorkflowPublico />} />
        <Route path="/ventanilla-unica" element={<VentanillaUnica />} />
      </Route>

      {/* 🔐 PRIVADO — con sidebar y autenticación */}
      <Route element={<Vigilante><DashboardLayout /></Vigilante>}>

        {/* Compartido (admin + cliente) */}
        <Route path="/dashboard" element={<TableroPrincipal />} />

        {/* Solo admin */}
        <Route element={<GuardiaRol rolesPermitidos={['admin']} />}>
          <Route path="/dashboard/workflows" element={<WorkflowsLista />} />
          <Route path="/dashboard/workflows/crear" element={<WorkflowCrear />} />
          <Route path="/dashboard/workflows/:id" element={<WorkflowDetalle />} />
          <Route path="/dashboard/usuarios" element={<UsuariosLista />} />
          <Route path="/dashboard/usuarios/crear" element={<UsuarioCrear />} />
          <Route path="/dashboard/asignaciones" element={<AsignacionesLista />} />
          <Route path="/dashboard/asignaciones/:id" element={<AsignacionDetalle />} />
        </Route>

        {/* Solo cliente */}
        <Route element={<GuardiaRol rolesPermitidos={['cliente']} />}>
          <Route path="/dashboard/mis-tramites" element={<MisAsignaciones />} />
          <Route path="/dashboard/mis-tramites/:id" element={<AsignacionFormulario />} />
        </Route>

        {/* Catch-all privado */}
        <Route path="/dashboard/*" element={<Error />} />
      </Route>

      {/* 🌍 404 global */}
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default RuteoPrincipal;
