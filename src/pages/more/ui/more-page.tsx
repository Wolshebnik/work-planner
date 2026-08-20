import { ScrollView, View } from 'react-native';

import { GoogleSheetsCard } from '@/entities/google-sheets';
import { ScheduleStatusesCard } from '@/entities/schedule-status';
import { Header } from '@/shared/ui/header';
import { SectionTitle } from '@/shared/ui/section-title';

import { GoogleAccountCard } from './google-account-card';

export function MorePage() {
  return (
    <View className='flex-1'>
      <Header title='Ще' />

      <ScrollView
        className='flex-1'
        contentContainerClassName='px-4 pb-4'
      >
        <SectionTitle
          text='АКАУНТ GOOGLE'
          className='font-bold text-[12px] pl-2 mb-2'
        />
        <GoogleAccountCard />

        <SectionTitle
          text='ГРАФІК'
          className='font-bold text-[12px] pl-2 mb-2'
        />
        <ScheduleStatusesCard className='w-full' />

        <SectionTitle
          text='ІНТЕГРАЦІЇ'
          className='font-bold text-[12px] pl-2 mt-5 mb-2'
        />
        <GoogleSheetsCard className='w-full' />
      </ScrollView>
    </View>
  );
}
