import type { ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { cn } from '@/shared/lib/cn';

interface ResponsiveContainerProps extends ViewProps {
  children: ReactNode;
  className?: string;
  maxWidthClassName?: string;
}

export function ResponsiveContainer({
  children,
  className,
  maxWidthClassName = 'max-w-[640px]',
  style,
  ...props
}: ResponsiveContainerProps) {
  return (
    <View
      className={cn('w-full self-center', maxWidthClassName, className)}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}
