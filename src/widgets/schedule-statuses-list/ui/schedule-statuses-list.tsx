import { ScrollView, View } from 'react-native';

import {
  ArchivedScheduleStatusesCard,
  type ScheduleStatus,
  ScheduleStatusItem,
} from '@/entities/schedule-status';
import { useGetScheduleStatuses } from '@/features/get-schedule-statuses';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { Text } from '@/shared/ui/text';

interface Props {
  onDeleteStatus: (status: ScheduleStatus) => void;
  onStatusPress: (status: ScheduleStatus) => void;
}

export const ScheduleStatusesList = ({
  onStatusPress,
  onDeleteStatus,
}: Props) => {
  const { data: statuses = [], isLoading, error } = useGetScheduleStatuses();

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

  const activeStatuses = statuses.filter((s) => s.is_active);
  const archivedStatusesCount = statuses.length - activeStatuses.length;

  return (
    <ScrollView className='flex-1 mb-5' contentContainerClassName='pb-6'>
      {activeStatuses.map((status) => (
        <ScheduleStatusItem
          key={status.id}
          title={status.name}
          description={status.description ?? ''}
          status={status.schedule_mark ?? ''}
          color={status.color}
          isLocked={status.is_locked}
          onPress={() => onStatusPress(status)}
          onDelete={() => onDeleteStatus(status)}
        />
      ))}

      {archivedStatusesCount > 0 && (
        <ArchivedScheduleStatusesCard count={archivedStatusesCount} />
      )}
    </ScrollView>
  );
};
