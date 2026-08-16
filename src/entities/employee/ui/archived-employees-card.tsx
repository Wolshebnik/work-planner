import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { Archive } from '@/assets/svg';
import { Text } from '@/shared/ui/text';
import { ROUTES } from '@/shared/config/routes';

interface ArchivedEmployeesCardProps {
  count: number;
  className?: string;
}

export function ArchivedEmployeesCard({
  count,
  className,
}: ArchivedEmployeesCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(ROUTES.TEAM_ARCHIVED)}
      className={`p-3 bg-[#D0E2F3]/30 rounded-12 border border-border gap-2 ${className}`}
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

          <Text className='font-bold text-[12px]'>Архівовані працівники</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
