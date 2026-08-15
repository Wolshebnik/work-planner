export const colorVariantClassNames = {
  success: 'bg-success',
  danger: 'bg-danger',
  warning: 'bg-warning',
  purple: 'bg-purple',
  maroon: 'bg-maroon',
} as const;

export type ColorVariant = keyof typeof colorVariantClassNames;
