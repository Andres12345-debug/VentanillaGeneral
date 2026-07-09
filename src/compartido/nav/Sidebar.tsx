import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Chip,
  Divider,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUsuarioToken } from '../../app/utilidades/auth/usuarioToken';
import { tokenHelper } from '../../app/utilidades/auth/tokenHelper';
import { ROL_CONFIG } from '../../app/utilidades/dominios/roles';

const DRAWER_WIDTH_EXPANDED = 268;
const DRAWER_WIDTH_COLLAPSED = 68;

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const MENUS_POR_ROL: Record<string, MenuItem[]> = {
  admin: [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Workflows', path: '/dashboard/workflows', icon: <AccountTreeIcon /> },
    { label: 'Usuarios', path: '/dashboard/usuarios', icon: <PeopleIcon /> },
    { label: 'Asignaciones', path: '/dashboard/asignaciones', icon: <AssignmentIcon /> },
  ],
  cliente: [
    { label: 'Mi Panel', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Mis Trámites', path: '/dashboard/mis-tramites', icon: <AssignmentIndIcon /> },
  ],
};

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onMobileClose }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const decoded = useUsuarioToken();

  const width = isDesktop
    ? collapsed
      ? DRAWER_WIDTH_COLLAPSED
      : DRAWER_WIDTH_EXPANDED
    : DRAWER_WIDTH_EXPANDED;

  const menus: MenuItem[] =
    decoded?.role ? MENUS_POR_ROL[decoded.role] ?? [] : [];

  const handleLogout = () => {
    tokenHelper.remove();
    navigate('/login', { replace: true });
  };

  const drawerContent = (
    <Box
      sx={{
        width,
        height: '100%',
        backgroundColor: 'sidebar.main',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
      }}
    >
      {/* Perfil */}
      <Box sx={{ p: collapsed ? 1 : 2, pt: 2 }}>
        {!collapsed && decoded && (
          <>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
              {decoded.name}
            </Typography>
            <Chip
              label={ROL_CONFIG[decoded.role]?.label ?? decoded.role}
              color={ROL_CONFIG[decoded.role]?.color ?? 'default'}
              size="small"
              sx={{ mt: 0.5 }}
            />
          </>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Menú */}
      <List sx={{ flex: 1, pt: 1 }}>
        {menus.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding>
              <Tooltip title={collapsed ? item.label : ''} placement="right">
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    px: 2,
                    borderRadius: 1,
                    mx: 0.5,
                    backgroundColor: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
                  }}
                >
                  <ListItemIcon
                    sx={{ color: active ? '#25D366' : 'rgba(255,255,255,0.7)', minWidth: 40 }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.label}
                      slotProps={{ primary: { sx: { fontSize: 14, fontWeight: active ? 700 : 400, color: active ? 'white' : 'rgba(255,255,255,0.7)' } } }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Logout */}
      <Box sx={{ p: 1 }}>
        <Tooltip title={collapsed ? 'Cerrar sesión' : ''} placement="right">
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 1,
              px: 2,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
            }}
          >
            <ListItemIcon sx={{ color: 'rgba(255,255,255,0.7)', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="Cerrar sesión"
                slotProps={{ primary: { sx: { fontSize: 14, color: 'rgba(255,255,255,0.7)' } } }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>

      {/* Toggle colapso (solo desktop) */}
      {isDesktop && (
        <Box sx={{ p: 1, display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end' }}>
          <IconButton
            size="small"
            onClick={() => setCollapsed((v) => !v)}
            sx={{ color: 'rgba(255,255,255,0.5)' }}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>
      )}
    </Box>
  );

  if (isDesktop) {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width,
            boxSizing: 'border-box',
            backgroundColor: 'sidebar.main',
            border: 'none',
            transition: 'width 0.2s ease',
            overflow: 'hidden',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={onMobileClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH_EXPANDED,
          backgroundColor: 'sidebar.main',
          border: 'none',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
