import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { ButtonBase } from '@/shared/ui/button-base';
import { ButtonLoader } from '@/shared/ui/button-loader';
import { InputBase } from '@/shared/ui/input-base';
import { showToast } from '@/shared/ui/toast';

import { type CashFormValues, cashFormSchema } from '../model/schema';

interface CashFormProps {
  initialValues?: CashFormValues;
  onCancel: () => void;
  onSave: (data: CashFormValues) => void | Promise<void>;
}

export function CashForm({ initialValues, onCancel, onSave }: CashFormProps) {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CashFormValues>({
    resolver: zodResolver(cashFormSchema),
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
          onPress={handleSubmit(onSubmit)}
        >
          Відправити
        </ButtonLoader>
      </View>
    </View>
  );
}
