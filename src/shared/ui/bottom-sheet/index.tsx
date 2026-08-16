import { useRef, useEffect, useCallback, type ReactNode } from 'react';

import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomSheetView,
  BottomSheetModal,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';

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
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const hasPresentedRef = useRef(false);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isOpen) {
      bottomSheetModalRef.current?.present();
      hasPresentedRef.current = true;
      return;
    }

    if (hasPresentedRef.current) {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isOpen]);

  const handleDismiss = useCallback(() => {
    hasPresentedRef.current = false;
    onClose();
  }, [onClose]);

  const handleClose = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior='close'
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      enableDynamicSizing
      backdropComponent={renderBackdrop}
      onDismiss={handleDismiss}
      enablePanDownToClose
      handleIndicatorStyle={{
        backgroundColor: '#c8d5e0',
        width: 48,
        height: 6,
      }}
      backgroundStyle={{
        borderRadius: 28,
        backgroundColor: '#FFFFFF',
      }}
    >
      <BottomSheetView
        className='px-4 pt-2'
        style={{
          paddingBottom: 16 + insets.bottom,
        }}
      >
        <View className='mb-4 flex-row items-center justify-between'>
          <Text
            className='flex-1 font-bold leading-[24px] text-primary text-[18px]'
            numberOfLines={1}
          >
            {title}
          </Text>

          <Pressable
            accessibilityLabel='Закрити панель'
            accessibilityRole='button'
            className='ml-4 h-8 w-8 items-center justify-center rounded-full bg-background active:bg-neutral/10'
            onPress={handleClose}
          >
            <X className='text-primary' height={14} width={14} />
          </Pressable>
        </View>

        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
}
