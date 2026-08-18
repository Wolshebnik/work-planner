import type { ReactNode } from 'react';

import {
  TouchableOpacity,
  type TouchableOpacityProps,
  View,
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
  color,
  onPress,
  style,
  ...props
}: HexStatusBadgeProps) {
  const isText = typeof children === 'string' || typeof children === 'number';

  const badgeStyle: ViewStyle = {
    backgroundColor: color ?? DEFAULT_COLOR,
  };

  const content = isText ? (
    <Text className='text-[14px] font-medium leading-[20px] text-white'>
      {children}
    </Text>
  ) : (
    children
  );

  const badgeClassName = cn(
    'h-8.5 w-8.5 items-center justify-center rounded-8 shadow-card',
    className,
  );

  if (!onPress) {
    return (
      <View style={[badgeStyle, style]} className={badgeClassName}>
        {content}
      </View>
    );
  }

  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.7}
      onPress={onPress}
      style={[badgeStyle, style]}
      className={badgeClassName}
    >
      {content}
    </TouchableOpacity>
  );
}
