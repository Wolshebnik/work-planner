import { memo, useCallback, useMemo, useState } from 'react';

import type dayjs from 'dayjs';
import { View } from 'react-native';

import { generateCalendarDays } from '@/entities/calendar';
import type { AvatarColor } from '@/shared/config/avatar-color';
import { getEmployeeAvatarColor } from '@/shared/config/get-avatar-color';
import { cn } from '@/shared/lib/cn';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { Text } from '@/shared/ui/text';

import type { DayEmployeeStats } from '../model/types';
import { CalendarGrid } from './calendar-grid';
import { CalendarHeader } from './calendar-header';
import { EmployeeDayBadge } from './employee-day-badge';

interface CalendarProps {
  className?: string;
  colorMap?: Map<string, AvatarColor>;
  isCurrentPage?: boolean;
  startDate: dayjs.Dayjs;
  statsByDate?: Map<string, DayEmployeeStats>;
}

export const Calendar = memo(function Calendar({
  startDate,
  className,
  colorMap,
  statsByDate,
  isCurrentPage = true,
}: CalendarProps) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  const days = useMemo(() => generateCalendarDays(startDate), [startDate]);

  const handleDayPress = useCallback(
    (day: dayjs.Dayjs) => {
      if (!isCurrentPage) return;
      setSelectedDate(day);
      setIsBottomSheetOpen(true);
    },
    [isCurrentPage],
  );

  const selectedDateStr = selectedDate
    ? selectedDate.format('YYYY-MM-DD')
    : null;
  const dayStats = selectedDateStr
    ? statsByDate?.get(selectedDateStr)
    : undefined;
  const formattedDate = selectedDate ? selectedDate.format('dd, D MMMM') : '';
  const bottomSheetTitle = formattedDate
    ? formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
    : 'Деталі зміни';

  const hasData =
    dayStats && (dayStats.working.length > 0 || dayStats.absent.length > 0);

  return (
    <View className={cn('px-4 py-4', className)}>
      <CalendarHeader />
      <CalendarGrid
        days={days}
        selectedDate={selectedDate}
        statsByDate={statsByDate}
        onDayPress={handleDayPress}
      />

      {isCurrentPage && (
        <BottomSheet
          isOpen={isBottomSheetOpen}
          title={bottomSheetTitle}
          onClose={() => {
            setIsBottomSheetOpen(false);
            setSelectedDate(null);
          }}
        >
          {!hasData ? (
            <Text className='py-4 text-center text-grey'>
              На {selectedDate?.format('D MMMM')} наразі немає даних.
            </Text>
          ) : (
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
          )}
        </BottomSheet>
      )}
    </View>
  );
});
