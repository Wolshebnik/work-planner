import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { ButtonBase } from '@/shared/ui/button-base';
import { ButtonLoader } from '@/shared/ui/button-loader';
import { InputBase } from '@/shared/ui/input-base';
import { showToast } from '@/shared/ui/toast';

import {
  type CashFormValues,
  cashFormResetSchema,
  cashFormSchema,
} from '../model/schema';

interface CashFormProps {
  allowZero?: boolean;
  initialValues?: CashFormValues;
  onCancel: () => void;
  onSave: (data: CashFormValues) => void | Promise<void>;
}

export function CashForm({
  allowZero = false,
  initialValues,
  onCancel,
  onSave,
}: CashFormProps) {
  const {
    control,
    getValues,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CashFormValues>({
    resolver: zodResolver(allowZero ? cashFormResetSchema : cashFormSchema),
    values: initialValues ?? { amount: '' },
  });

  const onSubmit = async (data: CashFormValues) => {
    try {
      await onSave(data);
      showToast({
        text1: 'Касу успішно збережено',
        type: 'success',
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Помилка збереження даних каси';
      setError('amount', { type: 'manual', message });
      showToast({
        text1: 'Помилка збереження каси',
        text2: message,
        type: 'error',
      });
    }
  };

  const handlePress = () => {
    const amount = getValues('amount').trim().replace(',', '.');
    if (!allowZero && amount !== '' && Number(amount) === 0) {
      setError('amount', {
        type: 'manual',
        message: 'Введіть суму більше 0',
      });
      return;
    }
    void handleSubmit(onSubmit)();
  };

  return (
    <View className='gap-4 pb-4'>
      <Controller
        control={control}
        name='amount'
        render={({ field: { onChange, value } }) => (
          <InputBase
            bottomSheet
            label='Сума каси за місяць'
            placeholder='0'
            labelColor='#ffffff'
            required
            value={value}
            onChangeText={onChange}
            error={errors.amount?.message}
            keyboardType='decimal-pad'
          />
        )}
      />

      <View className='flex-row gap-3 justify-end mt-2'>
        <ButtonBase
          variant='primary'
          appearance='outline'
          disabled={isSubmitting}
          onPress={onCancel}
        >
          Скасувати
        </ButtonBase>

        <ButtonLoader
          variant='primary'
          appearance='solid'
          className='w-35'
          loaderColor='#fff'
          loading={isSubmitting}
          onPress={handlePress}
        >
          Відправити
        </ButtonLoader>
      </View>
    </View>
  );
}
