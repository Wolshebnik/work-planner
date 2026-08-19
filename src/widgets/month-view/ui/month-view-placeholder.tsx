import dayjs from 'dayjs';
import { View } from 'react-native';
import { Calendar } from './calendar';

export function MonthViewPlaceholder({
  startDate = dayjs(),
  isCurrentPage = true,
}: {
  isCurrentPage?: boolean;
  startDate?: dayjs.Dayjs;
}) {
  return (
    <View className='flex-1'>
      <Calendar startDate={startDate} isCurrentPage={isCurrentPage} />
    </View>
  );
}
