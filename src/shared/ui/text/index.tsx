import { Text as NativeText, type TextProps } from 'react-native';

import { cn } from '@/shared/lib/cn';

export function Text({ className, ...props }: TextProps) {
  return <NativeText className={cn('font-sans text-base leading-[1.2em]', className)} {...props} />;
}
