import type { ReactNode } from 'react';

import {
  TouchableOpacity,
  type TouchableOpacityProps,
  type ViewStyle,
} from 'react-native';

import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

interface HexStatusBadgeProps extends TouchableOpacityProps {
  children?: ReactNode;
  color?: string | null;
}

const DEFAULT_COLOR = '#E1E2E5';

export function HexStatusBadge({
  children,
  className,
  color = DEFAULT_COLOR,
  onPress,
  ...props
}: HexStatusBadgeProps) {
  const isText = typeof children === 'string' || typeof children === 'number';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={(e) => {
        onPress?.(e);
      }}
      style={{ backgroundColor: color } as ViewStyle}
      className={cn(
        'h-8.5 w-8.5 items-center justify-center rounded-8 shadow-card',
        className,
      )}
      {...props}
    >
      {isText ? (
        <Text className='font-medium text-[14px] leading-[20px] text-white'>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
