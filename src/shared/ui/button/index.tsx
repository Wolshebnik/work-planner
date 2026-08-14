import type { ReactNode } from 'react';

import { Pressable, type PressableProps } from 'react-native';

import { colorVariantClassNames, type ColorVariant } from '@/shared/config/color-variant';
import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

type ButtonVariant = 'primary' | ColorVariant;
interface ButtonProps extends PressableProps {
  children: ReactNode;
  variant?: ButtonVariant;
}

const variantClassNames = {
  primary: 'bg-button',
  ...colorVariantClassNames,
} as const;

export function Button({
  children,
  className,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={cn(
        'items-center justify-center rounded-6 px-3 py-2',
        variantClassNames[variant],
        className,
      )}
      {...props}
    >
      <Text className='font-bold text-[24px] leading-[30px] text-white'>
        {children}
      </Text>
    </Pressable>
  );
}
