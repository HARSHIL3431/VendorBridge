'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface AuthButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-accent text-white hover:bg-accent/90 shadow-sm hover:shadow-md hover:shadow-accent/20',
  secondary:
    'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md hover:shadow-primary/20',
  outline:
    'border border-border bg-transparent text-foreground hover:bg-muted hover:shadow-sm',
};

const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  type = 'button',
  variant = 'primary',
  loading = false,
  onClick,
  className = '',
  fullWidth = false,
  disabled = false,
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2
        h-11 rounded-xl px-6
        text-sm font-semibold
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2
        active:scale-[0.98]
        disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      )}
      {children}
    </button>
  );
};

export default AuthButton;
