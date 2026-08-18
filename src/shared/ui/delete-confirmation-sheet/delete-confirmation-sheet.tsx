import { type ReactNode } from 'react';
import { View } from 'react-native';

import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { ButtonBase } from '@/shared/ui/button-base';
import { ButtonLoader } from '@/shared/ui/button-loader';
import { Text } from '@/shared/ui/text';

export interface DeleteConfirmationSheetProps {
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
      <View className='gap-6'>
        {typeof description === 'string' ? (
          <Text className='text-[16px] text-text text-center'>{description}</Text>
        ) : (
          description
        )}

        <View className='flex-row gap-3 justify-end'>
          <ButtonBase
            variant='primary'
            appearance='outline'
            onPress={onClose}
            disabled={isLoading}
          >
            Скасувати
          </ButtonBase>

          <ButtonLoader
            variant={confirmVariant}
            appearance='solid'
            onPress={onConfirm}
            loading={isLoading}
            className='w-35'
            loaderColor='#fff'
          >
            {confirmText}
          </ButtonLoader>
        </View>
      </View>
    </BottomSheet>
  );
}
