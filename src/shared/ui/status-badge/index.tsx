import type { ReactNode } from 'react';

import { TouchableOpacity, type TouchableOpacityProps } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';
import {
  type BadgeVariant,
  type BadgeAppearance,
  solidVariantClassNames,
  outlineVariantClassNames,
} from './status-badge-appearance';

interface StatusBadgeProps extends TouchableOpacityProps {
  children?: ReactNode;
  variant?: BadgeVariant;
  appearance?: BadgeAppearance;
}

export function StatusBadge({
  children,
  className,
  variant = 'primary',
  appearance = 'solid',
  onPress,
  ...props
}: StatusBadgeProps) {
  const isText = typeof children === 'string' || typeof children === 'number';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={(e) => {
        onPress?.(e);
      }}
      className={cn(
        'h-8.5 w-8.5 items-center justify-center rounded-8 shadow-card',
        appearance === 'solid'
          ? solidVariantClassNames[variant]
          : outlineVariantClassNames[variant],
        className,
      )}
      {...props}
    >
      {isText ? (
        <Text
          className={cn(
            'font-medium text-[14px] leading-[20px]',
            appearance === 'solid' ? 'text-white' : 'text-button',
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
