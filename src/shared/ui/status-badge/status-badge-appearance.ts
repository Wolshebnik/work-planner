import { colorVariantClassNames, type ColorVariant } from '@/shared/config/color-variant';

export type BadgeVariant = 'primary' | ColorVariant;
export type BadgeAppearance = 'solid' | 'outline';

export const solidVariantClassNames: Record<BadgeVariant, string> = {
  primary: 'bg-button',
  ...colorVariantClassNames,
};

export const outlineVariantClassNames: Record<BadgeVariant, string> = {
  primary: 'border border-button',
  sky: 'border border-sky',
  purple: 'border border-purple',
  purpleLight: 'border border-purple-light',
  danger: 'border border-danger',
  dangerLight: 'border border-danger-light',
  grey: 'border border-grey',
  maroon: 'border border-maroon',
  success: 'border border-success',
  warning: 'border border-warning',
  blueLight: 'border border-blue-light',
};
