import { colorVariantClassNames, type ColorVariant } from '@/shared/config/color-variant';

export type ButtonVariant = 'primary' | ColorVariant;
export type ButtonAppearance = 'outline' | 'solid';

export const solidVariantClassNames = {
  primary: 'bg-button',
  ...colorVariantClassNames,
} as const;

export const outlineVariantClassNames = {
  primary: 'border-button',
  success: 'border-success',
  danger: 'border-danger',
  warning: 'border-warning',
  purple: 'border-purple',
  maroon: 'border-maroon',
} as const;

export const outlineTextClassNames = {
  primary: 'text-button',
  success: 'text-success',
  danger: 'text-danger',
  warning: 'text-warning',
  purple: 'text-purple',
  maroon: 'text-maroon',
} as const;

export const outlineRippleColors = {
  primary: 'rgba(0, 101, 143, 0.16)',
  success: 'rgba(24, 185, 120, 0.16)',
  danger: 'rgba(239, 68, 68, 0.16)',
  warning: 'rgba(246, 184, 0, 0.16)',
  purple: 'rgba(124, 77, 219, 0.16)',
  maroon: 'rgba(143, 31, 46, 0.16)',
} as const;
