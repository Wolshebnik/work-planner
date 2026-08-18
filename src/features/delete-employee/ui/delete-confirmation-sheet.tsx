import { ReactNode } from 'react';

import { View } from 'react-native';

import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { ButtonBase } from '@/shared/ui/button-base';
import { ButtonLoader } from '@/shared/ui/button-loader';
import { Text } from '@/shared/ui/text';

interface DeleteConfirmationSheetProps {
  description: ReactNode;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  confirmText?: string;
  confirmVariant?: 'danger' | 'success' | 'primary';
}

export function DeleteConfirmationSheet({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  title,
  description,
  confirmText = 'Видалити',
  confirmVariant = 'danger',
}: DeleteConfirmationSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={title}>
      <View className='gap-4'>
        {typeof description === 'string' ? (
          <Text className='text-[16px] text-text'>{description}</Text>
        ) : (
          description
        )}

        <View className='flex-row gap-3 justify-end'>
          <ButtonBase
            variant='primary'
            appearance='outline'
            className='w-30'
            disabled={isLoading}
            onPress={onClose}
          >
            Скасувати
          </ButtonBase>

          <ButtonLoader
            variant={confirmVariant}
            appearance='solid'
            className='w-30'
            loaderColor='#fff'
            loading={isLoading}
            onPress={onConfirm}
          >
            {confirmText}
          </ButtonLoader>
        </View>
      </View>
    </BottomSheet>
  );
}
