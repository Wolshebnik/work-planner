import { View } from 'react-native';

import { Lock } from '@/assets/svg';
import {
  type ScheduleStatus,
  useGetScheduleStatuses,
} from '@/entities/schedule-status';
import { ButtonLoader } from '@/shared/ui/button-loader';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { HexStatusButton } from '@/shared/ui/hex-status-button';
import { Text } from '@/shared/ui/text';

interface EditScheduleProps {
  isClearing?: boolean;
  loadingStatusId?: string | null;
  onClear?: () => void;
  onSelectStatus?: (status: ScheduleStatus) => void;
}

export function EditSchedule({
  onSelectStatus,
  loadingStatusId,
  isClearing = false,
  onClear,
}: EditScheduleProps) {
  const { data: statuses = [], isLoading, error } = useGetScheduleStatuses();

  if (isLoading) {
    return (
      <View className='h-32 items-center justify-center'>
        <CircularProgressLoader size='large' />
      </View>
    );
  }

  if (error) {
    return (
      <View className='h-32 items-center justify-center'>
        <Text className='text-danger'>Помилка завантаження статусів</Text>
      </View>
    );
  }

  const activeStatuses = statuses.filter((status) => status.is_active);

  return (
    <View className='gap-4'>
      <View className='flex-row flex-wrap gap-2'>
        {activeStatuses.map((status) => (
          <HexStatusButton
            key={status.id}
            color={status.color}
            className='grow'
            loading={loadingStatusId === status.id}
            icon={
              status.is_locked ? (
                <Lock className='h-4 w-4 text-white' />
              ) : undefined
            }
            onPress={() => onSelectStatus?.(status)}
          >
            {status.name}
          </HexStatusButton>
        ))}
      </View>

      <ButtonLoader
        variant='primary'
        appearance='outline'
        className='w-full py-2.5 mt-3'
        loading={isClearing}
        onPress={onClear}
      >
        Очистити поле
      </ButtonLoader>
    </View>
  );
}
