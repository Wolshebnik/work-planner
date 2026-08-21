import { View } from 'react-native';

import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { Text } from '@/shared/ui/text';

import { type CashFormValues } from '../model/schema';
import { CashForm } from './cash-form';

interface CashSheetProps {
  employeeName?: string;
  initialAmount?: string | number;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: CashFormValues) => void | Promise<void>;
}

export function CashSheet({
  isOpen,
  onClose,
  employeeName,
  initialAmount,
  onSave,
}: CashSheetProps) {
  const handleSave = async (data: CashFormValues) => {
    await onSave?.(data);
    onClose();
  };

  return (
    <BottomSheet title='Введення каси' isOpen={isOpen} onClose={onClose}>
      <View className='mb-4'>
        <Text className='text-[14px] leading-5 text-grey mb-5'>
          Вкажіть суму каси працівника для збереження
        </Text>
        {Boolean(employeeName) && (
          <Text className='font-bold text-[16px] text-primary'>
            {employeeName}
          </Text>
        )}
      </View>

      <CashForm
        initialValues={{
          amount: initialAmount !== undefined ? String(initialAmount) : '',
        }}
        onCancel={onClose}
        onSave={handleSave}
      />
    </BottomSheet>
  );
}
