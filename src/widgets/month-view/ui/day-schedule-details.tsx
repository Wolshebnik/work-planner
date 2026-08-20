import type dayjs from 'dayjs';
import { View } from 'react-native';

import type { AvatarColor } from '@/shared/config/avatar-color';
import { getEmployeeAvatarColor } from '@/shared/config/get-avatar-color';
import { Text } from '@/shared/ui/text';

import type { DayEmployeeStats } from '../model/types';
import { EmployeeDayBadge } from './employee-day-badge';

interface DayScheduleDetailsProps {
  colorMap?: Map<string, AvatarColor>;
  dayStats?: DayEmployeeStats;
  selectedDate: dayjs.Dayjs | null;
}

export function DayScheduleDetails({
  dayStats,
  selectedDate,
  colorMap,
}: DayScheduleDetailsProps) {
  const hasData =
    dayStats && (dayStats.working.length > 0 || dayStats.absent.length > 0);

  if (!hasData) {
    return (
      <Text className='py-4 text-center text-grey'>
        На {selectedDate?.format('D MMMM')} наразі немає даних.
      </Text>
    );
  }

  return (
    <View className='gap-4 pb-2'>
      {dayStats.working.length > 0 && (
        <View>
          <Text className='mb-2 font-bold text-[13px] text-grey uppercase tracking-wider'>
            НА РОБОТІ
          </Text>
          <View className='flex-row flex-wrap gap-2'>
            {dayStats.working.map(({ employee, status }) => (
              <EmployeeDayBadge
                key={employee.id}
                employee={employee}
                status={status}
                color={
                  colorMap
                    ? getEmployeeAvatarColor(employee.id, colorMap)
                    : undefined
                }
              />
            ))}
          </View>
        </View>
      )}

      {dayStats.absent.length > 0 && (
        <View>
          <Text className='mb-2 font-bold text-[13px] text-grey uppercase tracking-wider'>
            ВІДСУТНІ
          </Text>
          <View className='flex-row flex-wrap gap-2'>
            {dayStats.absent.map(({ employee, status }) => (
              <EmployeeDayBadge
                key={employee.id}
                employee={employee}
                status={status}
                color={
                  colorMap
                    ? getEmployeeAvatarColor(employee.id, colorMap)
                    : undefined
                }
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
