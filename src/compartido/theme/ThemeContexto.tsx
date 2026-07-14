import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from 'react';
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  PaletteMode,
} from '@mui/material';
import { alpha, Theme } from '@mui/material/styles';

// ─── Paleta de marca ─────────────────────────────────────────────────────────
// Color predominante: tealBright (#34BAAB) — menú lateral e interfaz pública.
// El resto de la paleta se deriva de la misma familia para mantenerla general
// y reutilizable en toda la app (ver TOKENS más abajo).

export const TOKENS = {
  tealBright: '#34BAAB', // color predominante: sidebar, CTAs, marca
  tealMid: '#459A96', // secundario: acentos, hover, texto sobre chips
  slateBlue: '#466067', // superficie oscura alterna / gradientes
  negro: '#000000', // fondo base en modo oscuro
  greyLight: '#C4C8C5', // fondos y bordes neutros en modo claro
};

// ─── Sombras reutilizables ───────────────────────────────────────────────────
// Antes cada componente repetía su propio `isDark ? rgba(...) : rgba(...)`.
// Centralizarlas aquí evita que cada uno reinvente un valor ligeramente
// distinto y facilita ajustar la elevación de toda la app desde un solo sitio.

/** Sombra tipo "glow" para tarjetas/paneles destacados (hero, FormCard). */
export const sombraDestacada = (theme: Theme): string =>
  theme.palette.mode === 'dark'
    ? '0 24px 60px rgba(0,0,0,0.45)'
    : `0 24px 60px ${alpha(theme.palette.secondary.main, 0.16)}`;

/** Sombra para el efecto hover de tarjetas (Tarjeta.tsx). */
export const sombraHover = (theme: Theme): string =>
  theme.palette.mode === 'dark'
    ? '0 12px 32px rgba(0,0,0,0.4)'
    : '0 12px 32px rgba(0,0,0,0.12)';

// ─── Contexto ────────────────────────────────────────────────────────────────

interface ThemeContextValue {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContexto = createContext<ThemeContextValue>({
  mode: 'light',
  toggleTheme: () => {},
});

export const useThemeContext = (): ThemeContextValue => useContext(ThemeContexto);

// ─── Detectar preferencia inicial ────────────────────────────────────────────

function detectarModoInicial(): PaletteMode {
  const guardado = localStorage.getItem('themeMode') as PaletteMode | null;
  if (guardado === 'light' || guardado === 'dark') return guardado;
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

// ─── Provider ────────────────────────────────────────────────────────────────

interface Props {
  children: ReactNode;
}

export const ThemeContextProvider: React.FC<Props> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>(detectarModoInicial);

  const toggleTheme = () => {
    setMode((prev) => {
      const next: PaletteMode = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next);
      return next;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            'Oxygen',
            'Ubuntu',
            'Cantarell',
            '"Fira Sans"',
            '"Droid Sans"',
            '"Helvetica Neue"',
            'sans-serif',
          ].join(','),
          h1: {
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            fontSize: 'clamp(2.6rem, 2rem + 3vw, 4rem)',
          },
          h3: {
            fontWeight: 800,
            fontSize: 'clamp(1.8rem, 1.4rem + 1.5vw, 2.4rem)',
          },
        },
        palette: {
          mode,
          primary: {
            main: TOKENS.tealBright,
          },
          secondary: {
            main: TOKENS.tealMid,
          },
          background: {
            default: mode === 'light' ? '#ffffff' : TOKENS.negro,
            paper: mode === 'light' ? '#ffffff' : TOKENS.negro,
          },
          divider: mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)',
        },
        shape: {
          borderRadius: 10,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: 10,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 600,
              },
            },
          },
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                fontSize: '0.75rem',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContexto.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContexto.Provider>
  );
};
