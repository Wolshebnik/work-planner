import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { ButtonBase } from '@/shared/ui/button-base';
import { ButtonLoader } from '@/shared/ui/button-loader';
import { InputBase } from '@/shared/ui/input-base';

import {
  type ConnectGoogleSheetFormValues,
  connectGoogleSheetSchema,
} from '../model/schema';

interface Props {
  initialValues?: ConnectGoogleSheetFormValues | undefined;
  onCancel: () => void;
  onSave: (data: ConnectGoogleSheetFormValues) => void | Promise<void>;
}

export function ConnectGoogleSheetForm({
  initialValues,
  onCancel,
  onSave,
}: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConnectGoogleSheetFormValues>({
    resolver: zodResolver(connectGoogleSheetSchema),
    values: initialValues ?? { title: '', url: '' },
  });

  return (
    <View className='w-full gap-4 pb-2'>
      <Controller
        control={control}
        name='title'
        render={({ field: { onChange, value } }) => (
          <InputBase
            bottomSheet
            label='Назва таблиці'
            placeholder='Наприклад: Графік змін'
            labelColor='#fff'
            required
            value={value}
            onChangeText={onChange}
            error={errors.title?.message}
          />
        )}
      />

      <Controller
        control={control}
        name='url'
        render={({ field: { onChange, value } }) => (
          <InputBase
            bottomSheet
            label='Посилання на Google Таблицю'
            placeholder='https://docs.google.com/spreadsheets/d/...'
            labelColor='#fff'
            required
            value={value}
            onChangeText={onChange}
            error={errors.url?.message}
            autoCapitalize='none'
            autoCorrect={false}
            keyboardType='url'
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
          onPress={handleSubmit(onSave)}
        >
          Відправити
        </ButtonLoader>
      </View>
    </View>
  );
}
