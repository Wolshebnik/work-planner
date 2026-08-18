import { useRouter } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

import { Paint } from '@/assets/svg';
import { SHORT_TO_STATUS } from '@/shared/config/employee-status';
import { ROUTES } from '@/shared/config/routes';
import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

export function ScheduleStatusesCard({ className }: { className?: string }) {
  const router = useRouter();
  const statuses = Object.keys(SHORT_TO_STATUS).join(', ');

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(ROUTES.MORE_SCHEDULE_STATUSES)}
      className={cn(
        'border-l-4 border-primary flex-row items-center bg-[#D0E2F3]/50 rounded-12 gap-3 p-4 shadow-card',
        className,
      )}
    >
      <View className='h-10 w-10 items-center justify-center rounded-full bg-primary/20'>
        <Paint className='text-primary' height={20} width={20} />
      </View>

      <View className='flex-1 gap-1'>
        <Text className='font-semibold text-[16px] text-primary'>
          Статуси графіка
        </Text>

        <Text className='text-[14px] text-grey'>{statuses}</Text>
      </View>
    </TouchableOpacity>
  );
}
