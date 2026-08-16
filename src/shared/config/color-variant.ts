export const colorVariantClassNames = {
  sky: 'bg-sky',
  purple: 'bg-purple',
  purpleLight: 'bg-purple-light',
  danger: 'bg-danger',
  dangerLight: 'bg-danger-light',
  grey: 'bg-grey',
  maroon: 'bg-maroon',
  success: 'bg-success',
  warning: 'bg-warning',
  blueLight: 'bg-blue-light',
} as const;

export type ColorVariant = keyof typeof colorVariantClassNames;
