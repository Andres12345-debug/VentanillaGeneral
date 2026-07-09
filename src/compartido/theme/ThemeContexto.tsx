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

// ─── Paleta WhatsApp ─────────────────────────────────────────────────────────

declare module '@mui/material/styles' {
  interface Palette {
    sidebar: { main: string; contrastText: string };
  }
  interface PaletteOptions {
    sidebar?: { main: string; contrastText: string };
  }
}

const TOKENS = {
  greenBright: '#25D366', // verde de acción WhatsApp (botones, CTA)
  greenTeal: '#00A884', // verde-teal usado en modo oscuro
  tealDark: '#128C7E', // verde-teal secundario
  headerTeal: '#075E54', // verde oscuro de header/sidebar, fijo en ambos modos
  mintLight: '#e7f8e4', // fondo claro tipo landing de WhatsApp
  bgDark: '#0b141a', // fondo oscuro estilo WhatsApp
  paperDark: '#182229', // superficie oscura
};

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
        },
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? TOKENS.greenBright : TOKENS.greenTeal,
            contrastText: mode === 'light' ? '#0b3d2e' : '#ffffff',
          },
          secondary: {
            main: mode === 'light' ? TOKENS.tealDark : TOKENS.greenBright,
          },
          background: {
            default: mode === 'light' ? TOKENS.mintLight : TOKENS.bgDark,
            paper: mode === 'light' ? '#ffffff' : TOKENS.paperDark,
          },
          sidebar: {
            main: TOKENS.headerTeal,
            contrastText: '#ffffff',
          },
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
