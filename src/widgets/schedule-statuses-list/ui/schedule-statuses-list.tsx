import { useCallback, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { RefreshControl, View } from 'react-native';
import {
  SortableItem,
  type SortableRenderItemProps,
} from 'react-native-reanimated-dnd';

import {
  ArchivedScheduleStatusesCard,
  type ScheduleStatus,
  ScheduleStatusItem,
  scheduleStatusesQueryKey,
} from '@/entities/schedule-status';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { ResponsiveContainer } from '@/shared/ui/responsive-container';
import { SortableList } from '@/shared/ui/sortable-list';
import { Text } from '@/shared/ui/text';

import { type ScheduleStatusesListProps } from '../model/types';
import { useScheduleStatusesList } from '../model/use-schedule-statuses-list';

export const ScheduleStatusesList = ({
  onStatusPress,
  onDeleteStatus,
  refreshControl: externalRefreshControl,
  scrollEnabled,
}: ScheduleStatusesListProps) => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const {
    activeStatuses,
    archivedStatusesCount,
    error,
    handleDrop,
    isLoading,
  } = useScheduleStatusesList();

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: scheduleStatusesQueryKey });
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  const renderItem = useCallback(
    (props: SortableRenderItemProps<ScheduleStatus>) => {
      const { item, id, ...rest } = props;
      return (
        <SortableItem
          key={id}
          id={id}
          data={item}
          onDrop={handleDrop}
          {...rest}
        >
          <ResponsiveContainer className='pb-0 px-4'>
            <ScheduleStatusItem
              title={item.name}
              description={item.description ?? ''}
              status={item.schedule_mark ?? ''}
              color={item.color}
              isLocked={item.is_locked}
              onPress={() => onStatusPress(item)}
              onDelete={() => onDeleteStatus(item)}
            />
          </ResponsiveContainer>
        </SortableItem>
      );
    },
    [handleDrop, onDeleteStatus, onStatusPress],
  );

  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center'>
        <CircularProgressLoader size='large' />
      </View>
    );
  }

  if (error) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Text className='text-danger'>Помилка завантаження статусів</Text>
      </View>
    );
  }

  const effectiveRefreshControl =
    externalRefreshControl ?? (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={handleRefresh}
        colors={['#02658B']}
        tintColor='#02658B'
      />
    );

  return (
    <View className='flex-1'>
      <SortableList
        data={activeStatuses}
        itemHeight={66}
        useFlatList={false}
        renderItem={renderItem}
        scrollEnabled={scrollEnabled}
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={effectiveRefreshControl}
        ListFooterComponent={
          archivedStatusesCount > 0 ? (
            <ResponsiveContainer className='pt-2 pb-6 px-4'>
              <ArchivedScheduleStatusesCard count={archivedStatusesCount} />
            </ResponsiveContainer>
          ) : null
        }
      />
    </View>
  );
};



