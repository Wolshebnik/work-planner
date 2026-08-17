import { colorVariantClassNames, type ColorVariant } from '@/shared/config/color-variant';

export type ButtonVariant = 'primary' | ColorVariant;
export type ButtonAppearance = 'outline' | 'solid';

export const solidVariantClassNames = {
  primary: 'bg-button',
  ...colorVariantClassNames,
} as const;

export const outlineVariantClassNames: Record<ButtonVariant, string> = {
  primary: 'border-button',
  sky: 'border-sky',
  purple: 'border-purple',
  purpleLight: 'border-purple-light',
  danger: 'border-danger',
  dangerLight: 'border-danger-light',
  grey: 'border-grey',
  maroon: 'border-maroon',
  success: 'border-success',
  warning: 'border-warning',
  blueLight: 'border-blue-light',
};

export const outlineTextClassNames: Record<ButtonVariant, string> = {
  primary: 'text-button',
  sky: 'text-sky',
  purple: 'text-purple',
  purpleLight: 'text-purple-light',
  danger: 'text-danger',
  dangerLight: 'text-danger-light',
  grey: 'text-grey',
  maroon: 'text-maroon',
  success: 'text-success',
  warning: 'text-warning',
  blueLight: 'text-blue-light',
};

export const outlineRippleColors: Record<ButtonVariant, string> = {
  primary: 'rgba(0, 101, 143, 0.16)',
  sky: 'rgba(0, 178, 255, 0.16)',
  purple: 'rgba(124, 77, 219, 0.16)',
  purpleLight: 'rgba(124, 77, 219, 0.08)',
  danger: 'rgba(239, 68, 68, 0.16)',
  dangerLight: 'rgba(239, 68, 68, 0.08)',
  grey: 'rgba(128, 128, 128, 0.16)',
  maroon: 'rgba(143, 31, 46, 0.16)',
  success: 'rgba(24, 185, 120, 0.16)',
  warning: 'rgba(246, 184, 0, 0.16)',
  blueLight: 'rgba(0, 178, 255, 0.08)',
};
