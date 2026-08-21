import { type ReactNode, useEffect } from 'react';

import { ScrollView, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { preparePagerMonths } from '@/entities/schedule';
import { ResponsiveContainer } from '@/shared/ui/responsive-container';

import {
  ScheduleSlotProvider,
  useScheduleSlotContext,
} from '../../model/context/schedule-slot-context';
import { ScheduleSlotControls } from '../controls/schedule-slot-controls';
import { ScheduleSlotHeader } from './schedule-slot-header';

function ScheduleSlotLayoutContent({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { currentDate, viewMode } = useScheduleSlotContext();

  useEffect(() => {
    void preparePagerMonths(currentDate, viewMode, queryClient);
  }, [currentDate, viewMode, queryClient]);

  return (
    <View className='flex-1'>
      <ScheduleSlotHeader />

      <ScrollView className='flex-1' contentContainerClassName='pb-6'>
        <ResponsiveContainer>
          <ScheduleSlotControls />
          {children}
        </ResponsiveContainer>
      </ScrollView>
    </View>
  );
}

export function ScheduleSlotLayout({ children }: { children: ReactNode }) {
  return (
    <ScheduleSlotProvider>
      <ScheduleSlotLayoutContent>{children}</ScheduleSlotLayoutContent>
    </ScheduleSlotProvider>
  );
}
