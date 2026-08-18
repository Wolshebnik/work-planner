import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { ButtonBase } from '@/shared/ui/button-base';
import { ButtonLoader } from '@/shared/ui/button-loader';
import { InputBase } from '@/shared/ui/input-base';
import { Text } from '@/shared/ui/text';

import {
  type EditEmployeeNameFormData,
  editEmployeeNameSchema,
} from '../model/schema';

interface EditViewProps {
  defaultValues: Partial<EditEmployeeNameFormData>;
  onCancel: () => void;
  onClose: () => void;
  onSave: (data: EditEmployeeNameFormData) => Promise<void>;
}

export function EditView({
  defaultValues,
  onSave,
  onCancel,
  onClose,
}: EditViewProps) {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EditEmployeeNameFormData>({
    resolver: zodResolver(editEmployeeNameSchema),
    defaultValues: {
      lastName: defaultValues?.lastName ?? '',
      firstName: defaultValues?.firstName ?? '',
      middleName: defaultValues?.middleName ?? '',
    },
  });

  const rootErrorMessage =
    typeof errors.root?.server?.message === 'string'
      ? errors.root.server.message
      : undefined;

  async function handleSave(data: EditEmployeeNameFormData) {
    try {
      await onSave(data);
      reset();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Помилка збереження';
      setError('root.server', { type: 'manual', message });
    }
  }

  function handleCancel() {
    reset();
    onCancel();
  }

  return (
    <View className='gap-3'>
      <Controller
        control={control}
        name='lastName'
        render={({ field: { onChange, value } }) => (
          <InputBase
            bottomSheet
            label='Прізвище'
            placeholder='Прізвище'
            className='mb-2'
            required
            value={value}
            onChangeText={onChange}
            error={errors.lastName?.message}
          />
        )}
      />

      <Controller
        control={control}
        name='firstName'
        render={({ field: { onChange, value } }) => (
          <InputBase
            bottomSheet
            label='Ім’я'
            required
            placeholder='Ім’я'
            className='mb-2'
            value={value}
            onChangeText={onChange}
            error={errors.firstName?.message}
          />
        )}
      />

      <Controller
        control={control}
        name='middleName'
        render={({ field: { onChange, value } }) => (
          <InputBase
            bottomSheet
            label='По батькові'
            placeholder='По батькові'
            className='mb-2'
            value={value}
            onChangeText={onChange}
            error={errors.middleName?.message}
          />
        )}
      />

      {rootErrorMessage && (
        <View className='ml-1 my-2'>
          <Text className='text-[12px] text-danger'>{rootErrorMessage}</Text>
        </View>
      )}

      <View className='flex-row gap-3 justify-end'>
        <ButtonBase
          variant='primary'
          appearance='outline'
          className='w-40'
          disabled={isSubmitting}
          onPress={handleCancel}
        >
          Скасувати
        </ButtonBase>

        <ButtonLoader
          variant='primary'
          appearance='solid'
          className='w-45'
          loaderColor='#fff'
          loading={isSubmitting}
          onPress={handleSubmit(handleSave)}
        >
          Зберегти
        </ButtonLoader>
      </View>
    </View>
  );
}
