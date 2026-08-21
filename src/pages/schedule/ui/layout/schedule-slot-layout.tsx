import { type ReactNode, useCallback, useEffect, useState } from 'react';

import { RefreshControl, ScrollView, View } from 'react-native';
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
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    void preparePagerMonths(currentDate, viewMode, queryClient);
  }, [currentDate, viewMode, queryClient]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await queryClient.refetchQueries();
      await preparePagerMonths(currentDate, viewMode, queryClient);
    } finally {
      setRefreshing(false);
    }
  }, [currentDate, queryClient, viewMode]);

  return (
    <View className='flex-1 bg-background'>
      <ScrollView
        className='flex-1'
        contentContainerStyle={{ flexGrow: 1 }}
        contentContainerClassName='pb-6'
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#02658B']}
            tintColor='#02658B'
          />
        }
      >
        <ScheduleSlotHeader />

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
