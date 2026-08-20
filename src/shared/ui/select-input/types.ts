import type { ReactNode } from 'react';

export interface SelectOption<T = string | number> {
  description?: string;
  disabled?: boolean;
  label: string;
  value: T;
}

export interface SelectInputProps<T = string | number> {
  className?: string;
  dimOnDisable?: boolean;
  disabled?: boolean;
  error?: string;
  label?: string;
  labelColor?: string;
  leftIcon?: ReactNode;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  optionsMaxHeight?: number;
  placeholder?: string;
  required?: boolean;
  value?: T | null;
}
