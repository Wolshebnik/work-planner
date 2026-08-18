import type { ReactNode } from 'react';

import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  type ViewStyle,
} from 'react-native';

import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

export interface HexStatusButtonProps
  extends Omit<PressableProps, 'android_ripple' | 'style'> {
  children?: ReactNode;
  className?: string;
  color?: string | null;
  icon?: ReactNode;
  loading?: boolean;
  style?: ViewStyle;
}

const DEFAULT_COLOR = '#E1E2E5';

export function HexStatusButton({
  children,
  className,
  color,
  icon,
  disabled,
  loading = false,
  style,
  ...props
}: HexStatusButtonProps) {
  const isText = typeof children === 'string' || typeof children === 'number';

  const buttonStyle: ViewStyle = {
    backgroundColor: color ?? DEFAULT_COLOR,
  };

  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={[buttonStyle, style]}
      disabled={isDisabled}
      className={cn(
        'flex-row items-center justify-center gap-2 overflow-hidden rounded-8 px-3 py-2 shadow-button active:scale-[0.98]',
        isDisabled && 'opacity-60',
        className,
      )}
      android_ripple={{
        color: 'rgba(255, 255, 255, 0.24)',
      }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size='small' color='#ffffff' />
      ) : (
        <>
          {icon}
          {isText ? (
            <Text className='font-bold text-[14px] leading-[20px] text-white'>
              {children}
            </Text>
          ) : (
            children
          )}
        </>
      )}
    </Pressable>
  );
}
