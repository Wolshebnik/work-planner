import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { ArrowLeft } from '@/assets/svg';
import { useGoogleAuth } from '@/entities/google-auth';
import { cn } from '@/shared/lib/cn';
import { ResponsiveContainer } from '@/shared/ui/responsive-container';
import { Text } from '@/shared/ui/text';

interface HeaderProps {
  className?: string;
  onBackPress?: () => void;
  title: string;
  rightAction?: ReactNode;
  showUnauthorizedShadow?: boolean;
}

const SHADOW_STEPS = [
  { height: 1.5, opacity: 0.4 },
  { height: 1.5, opacity: 0.33 },
  { height: 2, opacity: 0.27 },
  { height: 2, opacity: 0.22 },
  { height: 2, opacity: 0.17 },
  { height: 2.5, opacity: 0.13 },
  { height: 2.5, opacity: 0.1 },
  { height: 3, opacity: 0.07 },
  { height: 3, opacity: 0.05 },
  { height: 3.5, opacity: 0.035 },
  { height: 3.5, opacity: 0.023 },
  { height: 4, opacity: 0.015 },
  { height: 4, opacity: 0.008 },
  { height: 4, opacity: 0.004 },
];

export function Header({
  title,
  onBackPress,
  rightAction,
  className,
  showUnauthorizedShadow,
}: HeaderProps) {
  const { user, isLoading } = useGoogleAuth();
  const shouldShowShadow = showUnauthorizedShadow ?? (!user && !isLoading);

  return (
    <View className='relative z-20'>
      <View
        className={cn(
          'h-14 items-center justify-center border-b border-border bg-neutral',
          className,
        )}
      >
        <ResponsiveContainer className='relative h-full flex-row items-center justify-center px-4'>
          {onBackPress ? (
            <Pressable
              accessibilityLabel='Назад'
              accessibilityRole='button'
              className='absolute left-4 items-center justify-center h-11 w-11 rounded-6 active:scale-[1.1]'
              hitSlop={8}
              onPress={onBackPress}
            >
              <ArrowLeft className='text-primary' height={24} width={24} />
            </Pressable>
          ) : null}

          <Text
            adjustsFontSizeToFit
            className='font-bold text-[22px] text-primary'
            minimumFontScale={0.65}
            numberOfLines={1}
          >
            {title}
          </Text>

          {rightAction ? (
            <View className='absolute right-4 items-center justify-center'>
              {rightAction}
            </View>
          ) : null}
        </ResponsiveContainer>
      </View>

      {shouldShowShadow && (
        <View pointerEvents='none' className='absolute top-14 left-0 right-0 z-10'>
          {SHADOW_STEPS.map((step, index) => (
            <View
              key={index}
              style={{
                height: step.height,
                backgroundColor: `rgba(239, 68, 68, ${step.opacity})`,
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}
