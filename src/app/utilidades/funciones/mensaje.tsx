import { toast, ToastOptions } from 'react-toastify';

const opciones: ToastOptions = {
  position: 'top-center',
  autoClose: 5000,
  theme: 'colored',
  draggable: true,
};

export const crearMensaje = (tipo: string, mensaje: string): void => {
  switch (tipo) {
    case 'success':
      toast.success(mensaje, opciones);
      break;
    case 'error':
      toast.error(mensaje, opciones);
      break;
    case 'warning':
      toast.warning(mensaje, opciones);
      break;
    case 'info':
      toast.info(mensaje, opciones);
      break;
    default:
      toast(mensaje, opciones);
  }
};
