import type { ReactNode } from 'react';

import { Pressable, type PressableProps } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

import {
  type ButtonVariant,
  outlineRippleColors,
  outlineTextClassNames,
  type ButtonAppearance,
  solidVariantClassNames,
  outlineVariantClassNames,
} from './button-appearance';

interface ButtonProps extends Omit<PressableProps, 'android_ripple' | 'style'> {
  children: ReactNode;
  variant?: ButtonVariant;
  appearance?: ButtonAppearance;
}

export function Button({
  children,
  className,
  variant = 'primary',
  appearance = 'solid',
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={cn(
        'items-center justify-center overflow-hidden rounded-8 px-3 py-2 active:scale-[0.98]',
        appearance === 'outline' && 'border',
        appearance === 'solid' && 'shadow-button',
        appearance === 'solid'
          ? solidVariantClassNames[variant]
          : outlineVariantClassNames[variant],
        className,
      )}
      android_ripple={{
        color:
          appearance === 'solid'
            ? 'rgba(255, 255, 255, 0.24)'
            : outlineRippleColors[variant],
      }}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text
          className={cn(
            'font-bold text-[14px] leading-[20px]',
            appearance === 'solid'
              ? 'text-white'
              : outlineTextClassNames[variant],
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
