import { useRouter } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

import { Table } from '@/assets/svg';
import { ROUTES } from '@/shared/config/routes';
import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

export function GoogleSheetsCard({ className }: { className?: string }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(ROUTES.MORE_GOOGLE_SHEETS)}
      className={cn(
        'border-l-4 border-primary flex-row items-center bg-[#D0E2F3]/50 rounded-12 gap-3 p-4 shadow-card',
        className,
      )}
    >
      <View className='h-10 w-10 items-center justify-center rounded-full bg-primary/20'>
        <Table className='text-primary' height={20} width={20} />
      </View>

      <View className='flex-1 gap-1'>
        <Text className='font-semibold text-[16px] text-primary'>
          Підключення до Google Sheets
        </Text>

        <Text className='text-[14px] text-grey'>
          Синхронізація графіка та таблиць
        </Text>
      </View>
    </TouchableOpacity>
  );
}
