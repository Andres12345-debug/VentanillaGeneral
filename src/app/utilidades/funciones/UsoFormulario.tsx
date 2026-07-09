import React, { useState, ChangeEvent } from 'react';
import { crearMensaje } from './mensaje';

type ValidarFn<T> = (campos: T) => Partial<Record<keyof T, string>>;

export const useFormulario = <T extends object>(
  objetoInicial: T,
  validar: ValidarFn<T>,
  onSubmit: (valores: T) => Promise<void>
) => {
  const [campos, setCampos] = useState<T>(objetoInicial);
  const [errores, setErrores] = useState<Partial<Record<keyof T, string>>>({});
  const [cargando, setCargando] = useState(false);

  // No se mutan los valores del usuario acá (ni siquiera para "sanitizar"):
  // React ya escapa todo lo que renderiza, y borrar caracteres a la entrada
  // solo corrompe datos legítimos (contraseñas, nombres con apóstrofe, "&", etc.)
  // sin aportar protección XSS real.
  const handleChange = ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = target;
    setCampos((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nuevosErrores = validar(campos);
    const hayErrores = Object.values(nuevosErrores).some(Boolean);
    if (hayErrores) {
      setErrores(nuevosErrores);
      return;
    }
    setCargando(true);
    try {
      await onSubmit(campos);
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Ocurrió un error inesperado. Intenta nuevamente.';
      crearMensaje('error', mensaje);
    } finally {
      setCargando(false);
    }
  };

  return { campos, errores, cargando, handleChange, handleSubmit };
};
