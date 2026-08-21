import { ScrollView, View } from 'react-native';

import { GoogleSheetsCard } from '@/entities/google-sheets';
import { ScheduleStatusesCard } from '@/entities/schedule-status';
import { Header } from '@/shared/ui/header';
import { ResponsiveContainer } from '@/shared/ui/responsive-container';
import { SectionTitle } from '@/shared/ui/section-title';

import { GoogleAccountCard } from './google-account-card';

export function MorePage() {
  return (
    <View className='flex-1'>
      <Header title='Ще' className='mb-4' />

      <ScrollView
        className='flex-1'
        contentContainerClassName='px-4'
      >
        <ResponsiveContainer>
          <SectionTitle
            text='АКАУНТ GOOGLE'
            className='font-bold text-[12px] pl-2 mb-2'
          />
          <GoogleAccountCard />

          <SectionTitle
            text='ГРАФІК'
            className='font-bold text-[12px] pl-2 mb-2'
          />
          <ScheduleStatusesCard className='w-full mb-5' />

          <SectionTitle
            text='ІНТЕГРАЦІЇ'
            className='font-bold text-[12px] pl-2 mb-2'
          />
          <GoogleSheetsCard className='w-full mb-4' />
        </ResponsiveContainer>
      </ScrollView>
    </View>
  );
}
