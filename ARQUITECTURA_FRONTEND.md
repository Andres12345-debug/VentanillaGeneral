# Arquitectura Frontend — Ventanilla Única Alcaldía de Tunja

> Este documento describe la arquitectura completa de un frontend React ya construido, para que pueda usarse como **especificación** al pedirle a otra sesión de Claude que genere un proyecto nuevo con la misma base (auth, ruteo, tema, servicios). Es una foto de la arquitectura, no del dominio de negocio — el nuevo proyecto puede tener módulos distintos, pero debe seguir estos mismos patrones.

---

## 1. Stack y dependencias

- **React 19** + **TypeScript 4.9**, bootstrapped con **Create React App** (`react-scripts 5.0.1`)
- **MUI v7** (`@mui/material`, `@mui/icons-material`) — toda la UI vía `sx` prop, sin CSS externo salvo excepciones puntuales (bootstrap solo para utilidades de grid heredadas)
- **React Router v7** (`react-router-dom`) para el ruteo
- **react-toastify** para notificaciones
- **jwt-decode** para leer el payload del JWT en cliente (sin verificar firma — la verificación es responsabilidad del backend)
- **react-google-recaptcha** en el login
- **sessionStorage** (nunca `localStorage`) para el token de sesión
- **localStorage** sí se usa, pero solo para preferencia de tema (`themeMode`)

```json
"dependencies": {
  "@emotion/react": "^11.14.0",
  "@emotion/styled": "^11.14.1",
  "@mui/icons-material": "^7.3.6",
  "@mui/material": "^7.3.6",
  "jwt-decode": "^4.0.0",
  "react": "^19.2.1",
  "react-dom": "^19.2.1",
  "react-google-recaptcha": "^3.1.0",
  "react-router-dom": "^7.10.1",
  "react-scripts": "5.0.1",
  "react-toastify": "^11.1.0",
  "typescript": "^4.9.5"
}
```

Comandos:
```bash
npm start        # dev server http://localhost:3000
npm run build    # build de producción en /build
npm test         # tests con Jest (watch mode)
```

---

## 2. Estructura de carpetas

```
src/
├── App.tsx                          # BrowserRouter + ThemeContextProvider + ToastContainer + Suspense
├── ruteo/
│   └── RuteoPrincipal.tsx           # Todas las rutas de la app (única fuente de verdad del ruteo)
├── app/
│   ├── modelos/                     # Interfaces de payloads (ej. Login)
│   ├── servicios/
│   │   ├── publicos/                # Llamadas SIN auth (fetch directo, sin ApiServicio)
│   │   ├── reutilizables/
│   │   │   └── ApiServicio.ts       # Cliente HTTP base para llamadas CON auth (inyecta Bearer)
│   │   └── privados/                # Un archivo de servicio por entidad de dominio (con auth)
│   ├── seguridad/
│   │   ├── Vigilate.tsx             # Guard de autenticación (token + expiración)
│   │   └── GuardiaRol.tsx           # Guard de autorización (roles permitidos)
│   ├── utilidades/
│   │   ├── auth/
│   │   │   ├── tokenHelper.ts       # ÚNICA fuente de verdad del token (sessionStorage)
│   │   │   └── usuarioToken.ts      # decodeToken() + hook useUsuarioToken()
│   │   ├── dominios/
│   │   │   ├── urls.tsx             # TODAS las constantes/builders de endpoints de la API
│   │   │   └── *.ts                 # enums/constantes de dominio (roles, estados, etc.)
│   │   └── funciones/
│   │       ├── UsoFormulario.tsx    # Hook genérico de formularios con doble enlace + sanitización
│   │       └── mensaje.tsx          # Wrapper de react-toastify → crearMensaje()
│   ├── compartido/
│   │   ├── layout/MainLayout.tsx    # Wrapper páginas públicas: SmallNav + Nav + Footer + Outlet
│   │   ├── nav/
│   │   │   ├── Nav.tsx              # TopNavigation (AppBar público)
│   │   │   ├── SmallNav.tsx         # Barra superior fija (logo + toggle tema)
│   │   │   └── Sidebar.tsx          # Sidebar colapsable del dashboard privado, con menú por rol
│   │   ├── footer/Footer.tsx
│   │   ├── theme/ThemeConext.tsx    # Contexto MUI dark/light + paleta custom
│   │   ├── ui/                      # Componentes de formulario reutilizables (ver §7)
│   │   └── Error.tsx                # Página 404 / ruta errónea
│   ├── publico/
│   │   ├── paginas/                 # Páginas montadas directamente en rutas públicas
│   │   └── componentes/             # Secciones/bloques usados dentro de esas páginas
│   └── privado/
│       ├── compartido/
│       │   └── DashboardLayout.tsx  # Layout área privada: Sidebar + Outlet centrado
│       ├── TableroPrincipal.tsx     # Página raíz del dashboard (/dashboard)
│       ├── Profile.tsx
│       ├── admin/<modulo>/          # Un subdirectorio por módulo, con Lista/Crear/Editar
│       ├── funcionario/
│       └── ciudadano/
```

**Regla de oro:** cada "dominio" de negocio (ej. `usuarios`, `workflows`, `tramites`) tiene:
1. Un archivo de servicio en `servicios/privados/<Dominio>Servicio.ts` (tipos + funciones que llaman a `ApiServicio`)
2. Un grupo de endpoints en `urls.tsx`
3. Una carpeta de páginas en `privado/<rol>/<dominio>/` con `XLista.tsx`, `XCrear.tsx`, `XEditar.tsx`

---

## 3. Ruteo (`react-router-dom` v7)

`App.tsx` monta `BrowserRouter` → `ThemeContextProvider` → `ToastContainer` global → `Suspense` → `RuteoPrincipal`.

`RuteoPrincipal.tsx` es el **único archivo** con definiciones de `<Route>`. Todas las páginas se cargan con `React.lazy()`.

### Patrón de rutas

```tsx
<Routes>
  {/* 🌐 PÚBLICO — layout compartido con Nav/Footer */}
  <Route element={<MainLayout />}>
    <Route path="/" element={<Welcome />} />
    <Route path="/login" element={<Login />} />
    <Route path="/registro" element={<Registro />} />
    <Route path="/recuperar-password" element={<RecuperarContrasenia />} />
    <Route path="/restablecer-password/:token" element={<NuevaContrasenia />} />
  </Route>

  {/* 🔐 PRIVADO — envuelto en <Vigilante> (auth) + <DashboardLayout> (sidebar) */}
  <Route element={<Vigilante><DashboardLayout /></Vigilante>}>
    <Route path="/dashboard" element={<Dashboard />} />

    {/* Sub-árbol restringido por rol vía <GuardiaRol> */}
    <Route element={<GuardiaRol rolesPermitidos={["admin"]} />}>
      <Route path="/dashboard/admin/usuarios" element={<UsuariosLista />} />
      <Route path="/dashboard/admin/usuarios/crear" element={<UsuariosCrear />} />
      {/* ... resto de rutas solo-admin */}
    </Route>

    <Route element={<GuardiaRol rolesPermitidos={["funcionario", "supervisor", "visitante"]} />}>
      <Route path="/dashboard/tramites" element={<DashboardGestionTramites />} />
    </Route>

    <Route path="/dashboard/*" element={<Error />} />
  </Route>

  {/* 🌍 404 global */}
  <Route path="*" element={<Error />} />
</Routes>
```

Puntos clave del patrón:
- **Rutas públicas** comparten un layout (`MainLayout`) montado como `element` de una `<Route>` contenedora sin `path` — los hijos se renderizan en su `<Outlet />`.
- **Rutas privadas** están anidadas dentro de `<Vigilante><DashboardLayout /></Vigilante>` — un solo guard cubre todo el subárbol.
- **Autorización por rol** se hace con `<GuardiaRol rolesPermitidos={[...]} />` como elemento de una `<Route>` contenedora (sin `path`), de forma que cualquier ruta anidada hereda la restricción. Nunca se mezcla la lógica de rol dentro de las páginas.
- Catch-all `/dashboard/*` y `*` global apuntan a la misma página `Error`.

---

## 4. Autenticación y autorización

### Flujo

```
Login / Registro
    └─ AccesoServicio → POST /publico/auth/login  (o /publico/registros/user)
           └─ Respuesta: { token, mensaje }
                  └─ decodeToken(token)            → valida que decodifique antes de guardar
                  └─ tokenHelper.set(token)        → sessionStorage
                  └─ navigate("/dashboard", { replace: true })

Rutas privadas (<Vigilante>)
    ├─ Sin token          → redirect /login
    ├─ Token corrupto      → tokenHelper.remove() + redirect /login
    ├─ Token expirado (exp * 1000 < Date.now()) → tokenHelper.remove() + redirect /login
    └─ Token válido        → renderiza <Outlet /> (o children)

Sub-rutas con rol (<GuardiaRol rolesPermitidos={[...]}>)
    ├─ Sin token o corrupto              → redirect /login
    ├─ decoded.nombre_rol no permitido    → redirect /dashboard
    └─ Rol permitido                     → renderiza <Outlet />

Logout (botón en Sidebar)
    └─ tokenHelper.remove() + navigate("/")
```

### JWT payload esperado

```ts
interface TokenPayload {
  sub: number;                  // id del usuario
  name: string;                 // nombre completo
  nombre_rol: string;           // "admin" | "supervisor" | "funcionario" | "ciudadano" | "visitante"
  cod_entidad: number | null;
  cod_departamento: number | null;
  exp?: number;
}
```

### Archivos clave

- **`tokenHelper.ts`** — única fuente de verdad del token; API mínima `get/set/remove` sobre `sessionStorage`, con una constante `KEY` privada.
- **`usuarioToken.ts`** — `decodeToken(token)` (try/catch sobre `jwtDecode`, devuelve `null` si falla) + `useUsuarioToken()` (hook que lee y decodifica en un solo paso).
- **`Vigilate.tsx`** (`<Vigilante>`) — guard de **autenticación**. Verifica existencia, integridad y expiración del token. Acepta `children` opcionales o renderiza `<Outlet />`.
- **`GuardiaRol.tsx`** — guard de **autorización**. Recibe `rolesPermitidos: string[]`, asume que ya pasó por `<Vigilante>` (no revalida expiración), y compara `decoded.nombre_rol` contra la lista.

---

## 5. Servicios HTTP

Dos capas separadas, sin mezclar:

### `ApiServicio.ts` (privado/con auth)

Cliente genérico basado en `fetch`, sin librerías externas (no axios):

```ts
type Metodo = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function peticion<T>(metodo: Metodo, endpoint: string, body?: Record<string, any> | FormData): Promise<T> {
  const token = tokenHelper.get();
  const esFormData = body instanceof FormData;
  const headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(!esFormData ? { "Content-Type": "application/json; charset=UTF-8" } : {}),
  };
  const respuesta = await fetch(URLS.URL_BASE + endpoint, {
    method: metodo, headers,
    ...(body !== undefined ? { body: esFormData ? body : JSON.stringify(body) } : {}),
  });
  if (!respuesta.ok) throw new Error(await parsearError(respuesta));
  if (respuesta.status === 204) return undefined as T;
  return respuesta.json();
}

export const ApiServicio = {
  get: <T>(endpoint: string) => peticion<T>("GET", endpoint),
  post: <T>(endpoint: string, body: Record<string, any> | FormData) => peticion<T>("POST", endpoint, body),
  put: <T>(endpoint: string, body: Record<string, any>) => peticion<T>("PUT", endpoint, body),
  patch: <T>(endpoint: string, body: Record<string, any>) => peticion<T>("PATCH", endpoint, body),
  delete: <T>(endpoint: string) => peticion<T>("DELETE", endpoint),
};
```

Detalles importantes: soporta `FormData` (para subir archivos, omite `Content-Type` para que el browser ponga el boundary), maneja `204 No Content`, y parsea el mensaje de error del body JSON con fallback al status HTTP.

### `AccesoServicio.ts` (público/sin auth)

Mismo patrón pero sin inyectar `Authorization`, vive en `servicios/publicos/`, solo soporta `POST`/`PATCH` (login, registro, recuperar/resetear password).

### Servicios de dominio (`servicios/privados/*Servicio.ts`)

Un archivo por entidad de negocio. Cada uno:
1. Define sus **tipos/DTOs** con TypeScript interfaces (`Crear*Dto`, `*Creado`, `*Resumen`, `*Detalle`, `Paginado*`).
2. Expone un objeto con funciones que envuelven `ApiServicio`, referenciando siempre `URLS`.

```ts
export const WorkflowServicio = {
  crear: (body: CrearWorkflowDto) => ApiServicio.post<WorkflowCreado>(URLS.WORKFLOWS, body),
  listar: (filtros?: { activo?: boolean; nombre?: string }) => {
    const params = filtros ? "?" + new URLSearchParams(filtros as Record<string, string>).toString() : "";
    return ApiServicio.get<PaginadoWorkflows>(URLS.WORKFLOWS + params);
  },
  detalle: (id: number) => ApiServicio.get<WorkflowCreado>(URLS.WORKFLOW(id)),
  actualizar: (id: number, body: Partial<CrearWorkflowDto>) => ApiServicio.put<WorkflowCreado>(URLS.WORKFLOW(id), body),
  eliminar: (id: number) => ApiServicio.delete<void>(URLS.WORKFLOW(id)),
  // ... sub-recursos anidados (etapas, pasos) con la misma convención
};
```

Convención de nombres de métodos: `crear`, `listar` (con filtros opcionales vía query params), `detalle`, `actualizar`, `eliminar`, más verbos de dominio específicos (`iniciar`, `timeline`, `crearEtapa`, etc.).

---

## 6. URLs / endpoints (`utilidades/dominios/urls.tsx`)

**Todas** las rutas del backend viven en un único objeto `URLS`, nunca hardcodeadas en componentes o servicios. Endpoints estáticos son strings; endpoints con parámetros son funciones:

```ts
export const URLS = {
    URL_BASE: "http://localhost:3550",   // cambia por entorno (comentario con la URL de producción al lado)

    // Públicos
    INICIAR_SESION: "/publico/auth/login",
    REGISTRO: "/publico/registros/user",
    RECUPERAR_PASSWORD: "/publico/registros/recuperar-password",
    NUEVA_PASSWORD: "/publico/registros/nueva-password",

    // Privados — agrupados por entidad con comentario de sección "── Nombre ──"
    WORKFLOWS: "/privado/workflows",
    WORKFLOW: (id: number) => `/privado/workflows/${id}`,
    WORKFLOW_ETAPAS: (wId: number) => `/privado/workflows/${wId}/etapas`,
    // ...

    USUARIOS_TODOS: "/privado/usuarios/todos",
    USUARIOS_AGREGAR: "/privado/usuarios/agregar",
    USUARIO_ELIMINAR: (id: number) => `/privado/usuarios/delete/${id}`,
}
```

Convenciones:
- Prefijo `/publico/...` vs `/privado/...` en el backend, reflejado 1:1 en el nombre del grupo.
- Nombres en `MAYUSCULAS_CON_GUION_BAJO`.
- Endpoints con parámetros son arrow functions tipadas (`(id: number) => ...`), nunca template strings sueltos en el código de llamada.
- Comentarios de sección `// ── Nombre ──` para agrupar por dominio.

---

## 7. Componentes UI compartidos (`compartido/ui/`)

Wrappers delgados sobre MUI para consistencia visual, todos con `sx` embebido (`borderRadius`, tipografía, spacing):

- **`FormCard`** — `Paper` con `elevation={8}`, `borderRadius: 4`, título + subtítulo opcional, `maxWidth` configurable (default 480). Es el contenedor estándar de cualquier formulario público (login, registro, recuperar password).
- **`CampoTexto`** — wrapper de `TextField` que añade: icono opcional como `startAdornment`, y si `type="password"`, un botón de mostrar/ocultar clave automático (`endAdornment` con `Visibility`/`VisibilityOff`). `borderRadius: 2.5`, `minHeight: 52`.
- **`BotonPrincipal`** — wrapper de `Button` (`type="submit"`, `variant="contained"`, `fullWidth`) que acepta prop `cargando` y muestra `CircularProgress` en vez del label mientras está en proceso.
- **`CampoSwitch`**, **`FormSeccion`**, **`CardSistema`** — variantes especializadas del mismo patrón (switch con label, sección de formulario con encabezado, card de listado).

Patrón general: **nunca usar los componentes MUI crudos para inputs/botones de formulario** — siempre pasar por estos wrappers para heredar estilo y comportamiento consistente.

---

## 8. Tema MUI (`compartido/theme/ThemeConext.tsx`)

Contexto propio (`ThemeContext`) que envuelve `ThemeProvider` de MUI + `CssBaseline`, con soporte dark/light persistido en `localStorage` (`themeMode`) y detección de `prefers-color-scheme` en el primer render si no hay preferencia guardada.

### Extensión de la paleta

```ts
declare module "@mui/material/styles" {
  interface Palette {
    accent: { main: string; contrastText: string };
    neutral: { main: string; contrastText: string };
    sidebar: { main: string; contrastText: string };
  }
  interface PaletteOptions {
    accent?: { main: string; contrastText: string };
    neutral?: { main: string; contrastText: string };
    sidebar?: { main: string; contrastText: string };
  }
}
```

### Tokens de color (escala Slate + Blue de Tailwind)

| Uso | Light | Dark |
|---|---|---|
| `primary.main` | `#1d4ed8` (blue700) | `#3b82f6` (blue500) |
| `secondary.main` | `#0d9488` (teal600) | `#2dd4bf` (teal400) |
| `background.default` | `#f1f5f9` (slate100) | `oklch(14.1% 0.005 285.823)` |
| `sidebar.main` | `#0f172a` (slate900) — **siempre oscuro**, independiente del modo |
| `accent.main` | `#f59e0b` (ámbar) — highlights/advertencias |
| `divider` | `#e2e8f0` (slate200) | `#334155` (slate700) |

Todos los tokens crudos viven en un objeto `TOKENS` al inicio del archivo (no valores hex sueltos en el resto del theme).

### Tipografía

Familia `"Roboto", "Helvetica Neue", Arial, sans-serif`. Escalas explícitas h1–h6, subtitle1/2, body1/2, button (`textTransform: none`), caption, overline.

### Shape y overrides globales

- `shape.borderRadius: 10` (global)
- `MuiButton`: `borderRadius: 10`, `fontWeight: 600`, `textTransform: none`, sin sombra ni en hover
- `MuiOutlinedInput`: `borderRadius: 10`
- `MuiPaper` (rounded): `borderRadius: 16`
- `MuiChip`: `fontWeight: 600`
- `MuiTooltip`: `fontSize: 0.78rem`

### Hook de consumo

```ts
export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext debe usarse dentro de ThemeContextProvider");
  return ctx;
};
```

Expone `{ mode, toggleTheme }`. Se usa en `SmallNav`/`Nav` para el botón de sol/luna.

---

## 9. Layouts y navegación

### Público — `MainLayout.tsx`

```
SmallNav (48px fijo)
TopNavigation / Nav (56px móvil / 64px sm+)
[Espaciador Box con height = suma exacta de ambas barras, para compensar position:fixed]
<Outlet />
Footer
```

`Nav.tsx` (AppBar `position="fixed"`, `top: 48` para quedar debajo del SmallNav): logo enlazado a `/`, links centrados solo en `md+`, buscador expandido en `md+` (con debounce de 600ms que navega a `/land/buscar/:query`) o ícono que abre un `Dialog` en pantallas chicas, botón de acceso a `/login`, y un `Drawer` lateral con los mismos links para móvil.

### Privado — `DashboardLayout.tsx`

```tsx
<Box sx={{ display: "flex" }}>
  <Sidebar open={open} onClose={...} collapsed={collapsed} setCollapsed={...} />
  <Box sx={{ p: 3, display: "flex", justifyContent: "center", flex: 1 }}>
    <Box sx={{ width: "100%", maxWidth: "1400px" }}>
      <Outlet />
    </Box>
  </Box>
</Box>
```

### `Sidebar.tsx` — pieza más compleja del proyecto

- `Drawer` `variant="permanent"` en desktop, `variant="temporary"` en `md` para abajo (`useMediaQuery`).
- Ancho `268px` expandido / `68px` colapsado, con transición de `theme.transitions`.
- **Menú por rol**: objeto `MENUS_POR_ROL: Record<string, MenuItem[]>` con una lista distinta de items (con posibles `children` para submenús colapsables) por cada rol (`admin`, `supervisor`, `funcionario`, `ciudadano`, `visitante`). El rol se lee de `useUsuarioToken()`.
- Ítems con `seccion` renderizan un encabezado `overline` de grupo antes del item.
- Submenús usan `Collapse` + una línea vertical conectora dibujada con un `Box` absoluto, y un "nodo" circular por sub-ítem activo.
- Bloque de perfil (avatar con iniciales, nombre, chip de rol coloreado por `ROL_CONFIG`) arriba de la lista de navegación.
- Botón de logout al final: `tokenHelper.remove()` + `navigate("/")`.
- Colores fijos independientes del theme mode (`bg = "#0f172a"` siempre), consistente con `palette.sidebar` del theme.

---

## 10. Formularios

### Hook `useFormulario<T>` (`UsoFormulario.tsx`)

```ts
export const useFormulario = <T extends Object>(objetoInicial: T) => {
    const [objeto, setObjeto] = useState(objetoInicial);
    const dobleEnlace = ({ target }: ChangeEvent<any>) => {
        const { name, value } = target;
        const sanitizedValue = value.replace(/[<>\"'&]/g, '');  // sanitización básica anti-XSS
        setObjeto({ ...objeto, [name]: sanitizedValue });
    }
    return { objeto, dobleEnlace, ...objeto };  // spread: acceso directo a cada campo por nombre
}
```

Uso típico:
```tsx
const { username, claveAcceso, dobleEnlace } = useFormulario<Login>({ username: "", claveAcceso: "" });
// <CampoTexto name="username" value={username} onChange={dobleEnlace} />
```

El `name` del input debe coincidir exactamente con la key del objeto inicial (doble enlace por convención de nombre, no por índice).

### Validación

Validación de formato se hace **inline en el componente de página**, no en el hook (ej. regex de email, longitud mínima de clave, estado de reCAPTCHA), combinada en una variable `formularioValido: boolean` que deshabilita el botón de submit.

### Reglas de contraseña (frontend y backend deben coincidir)

Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número, 1 especial de `@$!%*?&`:
```
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
```

---

## 11. Notificaciones (`mensaje.tsx`)

Wrapper obligatorio sobre `react-toastify` — **nunca llamar a `toast` directamente** en componentes:

```ts
export const crearMensaje = (tipo: string, mensaje: string) => {
  switch (tipo.toLowerCase()) {
    case "success": toast.success(mensaje, configuracion); break;
    case "error":   toast.error(mensaje, configuracion); break;
    case "info":    toast.info(mensaje, configuracion); break;
    case "warning": toast.warning(mensaje, configuracion); break;
    default:        toast.warn(mensaje, configuracion); break;
  }
}
```

`configuracion` fija: `position: "top-center"`, `autoClose: 5000`, `theme: "colored"`, `draggable`, `closeButton`. El `<ToastContainer>` global se monta una sola vez en `App.tsx` con la misma configuración.

---

## 12. Convenciones de nomenclatura y dominio

- **Idioma**: nombres de archivos, componentes, variables y comentarios en **español** (`Vigilante`, `dobleEnlace`, `cargando`, `crearMensaje`). Los tipos que reflejan el backend (DTOs) también.
- **Constantes de dominio** (`utilidades/dominios/*.ts`) — cada enum/estado del backend se refleja como `type` + objeto de display (`label`, `color`) para usar directo en `Chip`/badges de MUI, con comentario explícito de que debe mantenerse en sync con el enum real del backend:
  ```ts
  export type EstadoTramite = "EN_PROCESO" | "COMPLETADO" | "ANULADO" | "DEVUELTO" | "CANCELADO";
  export const ESTADO_TRAMITE: Record<EstadoTramite, { label: string; color: "info"|"success"|"error"|"default" }> = { ... };
  ```
- **Roles** (`roles.ts`) — `ROL_CONFIG` (label + color por rol) y listas específicas de roles permitidos para ciertas operaciones (ej. `ROLES_RESPONSABLES_ETAPA`, `ROLES_EJECUTORES_PASO`), documentando en comentario que deben coincidir con el backend.
- **Paginación** — cualquier listado devuelve `{ data: T[]; total: number; page: number; limit: number }` (`Paginado<Entidad>`).
- **IDs** — prefijo `cod` (`codUsuario`, `codWorkflow`, `codTramite`, `codEtapa`, `codTramitePaso`) reflejando la convención de nombres de columnas del backend.

---

## 13. Cómo pedirle a otra sesión que recree esto

Al iniciar el nuevo proyecto, indicar:
1. Stack exacto (CRA + TS 4.9 + React 19 + MUI v7 + React Router v7 + react-toastify + jwt-decode).
2. Pegar este documento completo como contexto.
3. Especificar el dominio de negocio nuevo (entidades, roles, endpoints) para que genere `urls.tsx`, servicios y páginas siguiendo estos mismos patrones.
4. Aclarar si se reutiliza la misma paleta de colores/tema o se necesita una nueva (en cuyo caso, mantener la estructura del `ThemeContextProvider` pero cambiar los `TOKENS`).
