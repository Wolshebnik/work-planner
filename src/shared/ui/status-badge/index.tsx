import type { ReactNode } from 'react';

import { Pressable, type PressableProps } from 'react-native';

import { colorVariantClassNames, type ColorVariant } from '@/shared/config/color-variant';
import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

interface StatusBadgeProps extends PressableProps {
  children: ReactNode;
  variant: ColorVariant;
}

export function StatusBadge({ children, className, variant, ...props }: StatusBadgeProps) {
  const isText = typeof children === 'string' || typeof children === 'number';

  return (
    <Pressable
      className={cn(
        'h-[34px] w-[34px] items-center justify-center rounded-8',
        colorVariantClassNames[variant],
        className,
      )}
      {...props}
    >
      {isText ? (
        <Text className='font-medium text-[14px] leading-[20px] text-white'>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
