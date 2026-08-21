import { useEffect, useState } from 'react';

import { Keyboard, Modal, Pressable, ScrollView, View } from 'react-native';

import { X } from '@/assets/svg';
import { Text } from '@/shared/ui/text';

import { type BottomSheetProps } from './types';

export function BottomSheetTablet({
  children,
  isOpen,
  title,
  onClose,
}: BottomSheetProps) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <View
        className='flex-1 items-center justify-center p-4'
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          paddingBottom: keyboardHeight > 0 ? keyboardHeight + 16 : 16,
        }}
      >
        <Pressable
          accessibilityLabel='Закрити'
          className='absolute inset-0'
          onPress={onClose}
        />
        <View
          className='w-full max-w-[640px] rounded-28 bg-white p-6 shadow-xl'
          style={{
            borderRadius: 28,
            maxHeight: keyboardHeight > 0 ? '70%' : '85%',
          }}
        >
          <View className='mb-4 flex-row items-center justify-between'>
            {title ? (
              <Text
                className='min-w-0 flex-1 font-bold leading-[24px] text-primary text-[18px]'
                numberOfLines={1}
              >
                {title}
              </Text>
            ) : null}

            <Pressable
              accessibilityLabel='Закрити панель'
              accessibilityRole='button'
              className='ml-auto h-8 w-8 shrink-0 items-center justify-center rounded-full active:bg-neutral/10'
              onPress={onClose}
            >
              <X className='text-primary' height={16} width={16} />
            </Pressable>
          </View>

          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
