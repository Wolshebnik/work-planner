import { ScrollView, View } from 'react-native';

import { Header } from '@/shared/ui/header';
import { ScheduleStatusesCard } from '@/shared/ui/schedule-statuses-card';
import { SectionTitle } from '@/shared/ui/section-title';

export function MorePage() {
  return (
    <View className='flex-1'>
      <Header title='Ще' />

      <View className='px-6 mb-1'>
        <SectionTitle text='ГРАФІК' className='font-bold text-[12px] pl-4' />
      </View>

      <ScrollView
        className='flex-1'
        contentContainerClassName='items-center px-4 pb-4'
      >
        <ScheduleStatusesCard className='' />
      </ScrollView>
    </View>
  );
}
