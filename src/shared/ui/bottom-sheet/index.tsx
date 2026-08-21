import { type ReactNode, useCallback, useEffect, useRef } from 'react';

import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Modal, Pressable, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { X } from '@/assets/svg';
import { Text } from '@/shared/ui/text';

const MAX_SHEET_WIDTH = 640;

interface BottomSheetProps {
  children?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
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
  const { width: windowWidth } = useWindowDimensions();

  const isWide = windowWidth > MAX_SHEET_WIDTH;

  useEffect(() => {
    if (isWide) {
      return;
    }

    if (isOpen) {
      bottomSheetModalRef.current?.present();
      hasPresentedRef.current = true;
      return;
    }

    if (hasPresentedRef.current) {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isOpen, isWide]);

  useEffect(() => {
    const modalRef = bottomSheetModalRef.current;
    return () => {
      if (hasPresentedRef.current) {
        modalRef?.dismiss();
      }
    };
  }, []);

  const handleDismiss = useCallback(() => {
    hasPresentedRef.current = false;
    onClose();
  }, [onClose]);

  const handleClose = useCallback(() => {
    if (isWide) {
      onClose();
      return;
    }
    bottomSheetModalRef.current?.dismiss();
  }, [isWide, onClose]);

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

  if (isWide) {
    return (
      <Modal
        visible={isOpen}
        transparent
        animationType='fade'
        onRequestClose={onClose}
      >
        <View
          className='flex-1 items-center justify-center p-4'
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <Pressable
            accessibilityLabel='Закрити'
            className='absolute inset-0'
            onPress={onClose}
          />
          <View
            className='w-full max-w-[640px] rounded-28 bg-white p-6 shadow-xl'
            style={{ borderRadius: 28 }}
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

            {children}
          </View>
        </View>
      </Modal>
    );
  }

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
        className='px-5'
        style={{
          paddingBottom: insets.bottom,
        }}
      >
        <View className='mb-2 flex-row items-center justify-between'>
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
