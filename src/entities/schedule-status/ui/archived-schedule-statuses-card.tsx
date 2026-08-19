import { useRouter } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

import { Archive } from '@/assets/svg';
import { ROUTES } from '@/shared/config/routes';
import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

interface ArchivedScheduleStatusesCardProps {
  className?: string;
  count: number;
}

export function ArchivedScheduleStatusesCard({
  count,
  className,
}: ArchivedScheduleStatusesCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(ROUTES.MORE_SCHEDULE_STATUSES_ARCHIVED)}
      className={cn(
        'p-3 bg-[#D0E2F3]/30 rounded-12 border border-border gap-2 shadow-card',
        className,
      )}
    >
      <View className='flex-row items-center justify-between gap-3'>
        <View className='items-center justify-center w-10 h-10 rounded-full bg-[#D0E2F3]'>
          <Archive width={20} height={20} />
        </View>

        <View className='flex-1 flex-col'>
          <View className='flex-row items-center gap-2'>
            <Text className='font-bold text-[18px] text-grey'>Архів</Text>
            <View className='h-5 w-5 items-center justify-center rounded-full bg-primary'>
              <Text className='font-bold text-[8px] text-white'>{count}</Text>
            </View>
          </View>

          <Text className='font-bold text-[12px]'>Архівовані статуси</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
