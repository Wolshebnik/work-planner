import { View } from 'react-native';

import { SectionTitle } from '@/shared/ui/section-title';
import { Text } from '@/shared/ui/text';

export function GoogleSheetsInfoCard() {
  return (
    <>
      <SectionTitle
        text='ІНФОРМАЦІЯ'
        className='font-bold text-[12px] pl-2 mb-2'
      />

      <View className='bg-white rounded-12 border border-border p-4 gap-2 shadow-card'>
        <Text className='font-medium text-[14px] text-primary'>
          Як це працює?
        </Text>
        <Text className='text-[13px] text-grey leading-4.5'>
          Вкажіть посилання на таблицю Google Sheets, з якої потрібно зчитувати
          або в яку передавати графік змін. Переконайтеся, що таблиця доступна
          для вашого Google акаунта.
        </Text>
      </View>
    </>
  );
}
