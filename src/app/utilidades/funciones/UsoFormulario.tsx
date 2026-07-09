import React, { useState, ChangeEvent } from 'react';

type ValidarFn<T> = (campos: T) => Partial<Record<keyof T, string>>;

export const useFormulario = <T extends object>(
  objetoInicial: T,
  validar: ValidarFn<T>,
  onSubmit: (valores: T) => Promise<void>
) => {
  const [campos, setCampos] = useState<T>(objetoInicial);
  const [errores, setErrores] = useState<Partial<Record<keyof T, string>>>({});
  const [cargando, setCargando] = useState(false);

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = target;
    const sanitized = typeof value === 'string' ? value.replace(/[<>"'&]/g, '') : value;
    setCampos((prev) => ({ ...prev, [name]: sanitized }));
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
    } finally {
      setCargando(false);
    }
  };

  return { campos, errores, cargando, handleChange, handleSubmit };
};
