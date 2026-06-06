'use client';

import React from 'react';
import { FieldError } from 'react-hook-form';

interface TextAreaFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  register: any;
  error?: FieldError;
  rows?: number;
  required?: boolean;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  name,
  placeholder,
  register,
  error,
  rows = 4,
  required = false,
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="text-sm font-medium text-foreground"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        {...register(name)}
        className={`
          w-full rounded-xl border bg-card px-4 py-3 text-sm text-foreground
          placeholder:text-muted-foreground
          min-h-[100px] resize-y
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error
            ? 'border-red-400 focus:ring-red-300 focus:border-red-400'
            : 'border-border'
          }
        `}
      />

      {error && (
        <p className="text-xs text-red-500 mt-0.5">{error.message}</p>
      )}
    </div>
  );
};

export default TextAreaField;
