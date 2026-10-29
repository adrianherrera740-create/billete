import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'danger' | 'ghost';
}

/** Todos los botones de acción de la app usan este componente. */
export function GlassButton({ variant = 'default', className = '', type = 'button', ...rest }: Props) {
  return <button type={type} className={`glass-btn ${variant} ${className}`.trim()} {...rest} />;
}
