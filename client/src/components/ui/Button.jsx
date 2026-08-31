import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = { primary: 'btn-primary', secondary: 'btn-secondary', danger: 'btn-danger', ghost: 'btn-ghost' };

const Button = ({ children, variant = 'primary', loading = false, className = '', ...props }) => (
  <button className={`${variants[variant] || variants.primary} ${className}`} disabled={loading || props.disabled} {...props}>
    {loading && <Loader2 size={16} className="animate-spin" />}
    {children}
  </button>
);

export default Button;
