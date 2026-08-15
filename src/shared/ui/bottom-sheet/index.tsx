import { useState, useEffect, type ReactNode } from 'react';

import { View, Modal, Easing, Animated, Pressable } from 'react-native';

import { X } from '@/assets/svg';
import { Text } from '@/shared/ui/text';

interface BottomSheetProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export function BottomSheet({
  children,
  isOpen,
  title,
  onClose,
}: BottomSheetProps) {
  const [progress] = useState(() => new Animated.Value(0));
  const [backdropOpacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    progress.setValue(0);
    backdropOpacity.setValue(0);

    const transition = Animated.parallel([
      Animated.timing(progress, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0.5,
        duration: 240,
        useNativeDriver: true,
      }),
    ]);

    transition.start();

    return transition.stop;
  }, [backdropOpacity, isOpen, progress]);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(progress, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        onClose();
      }
    });
  };

  return (
    <Modal
      transparent
      visible
      animationType='none'
      onRequestClose={handleClose}
    >
      <View className='justify-end flex-1'>
        <Animated.View
          pointerEvents='none'
          className='absolute inset-0'
          style={{ backgroundColor: '#000', opacity: backdropOpacity }}
        />
        <Pressable
          accessibilityLabel='Закрити панель'
          className='absolute inset-0'
          onPress={handleClose}
        />

        <Animated.View
          className='min-h-40 rounded-t-[28px] border border-border bg-white px-4 pb-8 pt-3'
          style={{
            transform: [
              {
                translateY: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['100%', '0%'],
                }),
              },
            ],
          }}
        >
          <View className='mb-2 h-1.5 w-12 self-center rounded-full' />
          <View className='mb-4 flex-row items-center justify-between'>
            <Text
              className='flex-1 font-bold leading-[24px] text-primary'
              numberOfLines={1}
            >
              {title}
            </Text>
            <Pressable
              accessibilityLabel='Закрити панель'
              accessibilityRole='button'
              className='ml-4 h-11 w-11 items-center justify-center active:scale-[1.1]'
              hitSlop={8}
              onPress={handleClose}
            >
              <X className='text-primary' height={14} width={14} />
            </Pressable>
          </View>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}
