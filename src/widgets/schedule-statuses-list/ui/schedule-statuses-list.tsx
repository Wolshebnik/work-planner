import { useCallback } from 'react';

import { View } from 'react-native';
import {
  SortableItem,
  type SortableRenderItemProps,
} from 'react-native-reanimated-dnd';

import {
  ArchivedScheduleStatusesCard,
  type ScheduleStatus,
  ScheduleStatusItem,
} from '@/entities/schedule-status';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { SortableList } from '@/shared/ui/sortable-list';
import { Text } from '@/shared/ui/text';

import { type ScheduleStatusesListProps } from '../model/types';
import { useScheduleStatusesList } from '../model/use-schedule-statuses-list';

export const ScheduleStatusesList = ({
  onStatusPress,
  onDeleteStatus,
}: ScheduleStatusesListProps) => {
  const {
    activeStatuses,
    archivedStatusesCount,
    error,
    handleDrop,
    isLoading,
  } = useScheduleStatusesList();

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
          <View className='pb-3 px-4'>
            <ScheduleStatusItem
              title={item.name}
              description={item.description ?? ''}
              status={item.schedule_mark ?? ''}
              color={item.color}
              isLocked={item.is_locked}
              onPress={() => onStatusPress(item)}
              onDelete={() => onDeleteStatus(item)}
            />
          </View>
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

  return (
    <View className='flex-1'>
      <SortableList
        data={activeStatuses}
        itemHeight={78}
        useFlatList={false}
        renderItem={renderItem}
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListFooterComponent={
          archivedStatusesCount > 0 ? (
            <View className='pt-2 pb-6 px-4'>
              <ArchivedScheduleStatusesCard count={archivedStatusesCount} />
            </View>
          ) : null
        }
      />
    </View>
  );
};



