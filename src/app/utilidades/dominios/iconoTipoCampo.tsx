import React from 'react';
import { SvgIconProps } from '@mui/material';
import ShortTextRounded from '@mui/icons-material/ShortTextRounded';
import NotesRounded from '@mui/icons-material/NotesRounded';
import NumbersRounded from '@mui/icons-material/NumbersRounded';
import CalendarTodayRounded from '@mui/icons-material/CalendarTodayRounded';
import ToggleOnRounded from '@mui/icons-material/ToggleOnRounded';
import RadioButtonCheckedRounded from '@mui/icons-material/RadioButtonCheckedRounded';
import PlaylistAddCheckRounded from '@mui/icons-material/PlaylistAddCheckRounded';
import UploadFileRounded from '@mui/icons-material/UploadFileRounded';
import { TipoCampo } from './tipoCampo';

interface IconoTipoCampoProps extends SvgIconProps {
  tipo: TipoCampo;
}

// Mismo ícono para el mismo tipo de campo en el builder (admin) y en el
// formulario que completa el cliente, para que uno reconozca en el editor
// lo que después va a ver del otro lado.
const IconoTipoCampo: React.FC<IconoTipoCampoProps> = ({ tipo, ...props }) => {
  switch (tipo) {
    case 'area_texto': return <NotesRounded {...props} />;
    case 'numero': return <NumbersRounded {...props} />;
    case 'fecha': return <CalendarTodayRounded {...props} />;
    case 'booleano': return <ToggleOnRounded {...props} />;
    case 'seleccion_unica': return <RadioButtonCheckedRounded {...props} />;
    case 'seleccion_multiple': return <PlaylistAddCheckRounded {...props} />;
    case 'documento': return <UploadFileRounded {...props} />;
    case 'texto':
    default: return <ShortTextRounded {...props} />;
  }
};

export default IconoTipoCampo;
