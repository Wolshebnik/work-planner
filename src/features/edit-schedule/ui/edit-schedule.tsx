import { View } from 'react-native';

import { Lock, Team } from '@/assets/svg';
import { cn } from '@/shared/lib/cn';
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
  isFillingDay?: boolean;
  loadingStatusId?: string | null;
  onClear?: () => void;
  onFillDayForAll?: () => void;
  onSelectStatus?: (status: ScheduleStatus) => void;
}

export function EditSchedule({
  onSelectStatus,
  loadingStatusId,
  isFillingDay = false,
  isClearing = false,
  onClear,
  onFillDayForAll,
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

      <View className='flex-row items-center gap-2'>
        <ButtonLoader
          key={isFillingDay ? 'outline' : 'solid'}
          variant='primary'
          appearance={isFillingDay ? 'outline' : 'solid'}
          className='h-11 min-w-0 flex-1 flex-row gap-2 px-2'
          onPress={onFillDayForAll}
        >
          <Team
            className={cn(
              'h-5 w-5',
              'text-white',
              isFillingDay && 'text-button',
            )}
          />
          <Text
            numberOfLines={1}
            className={cn(
              'text-center text-[12px] font-bold leading-4',
              'text-white',
              isFillingDay && 'text-button',
            )}
          >
            {isFillingDay ? 'Оберіть статус усім' : 'Статус усім'}
          </Text>
        </ButtonLoader>

        <ButtonLoader
          variant='primary'
          appearance='outline'
          className='h-11 min-w-0 flex-1 px-2'
          loading={isClearing}
          onPress={onClear}
        >
          Очистити поле
        </ButtonLoader>
      </View>
    </View>
  );
}
