import { memo, useMemo } from 'react';

import type dayjs from 'dayjs';
import { View } from 'react-native';

import type { Employee } from '@/entities/employee';
import { useScheduleByWeek } from '@/entities/schedule';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import {
  type DayCell,
  type EmployeeRow,
  ScheduleGrid,
} from '@/widgets/schedule-grid';

interface ScheduleWeekContentProps {
  activeEmployees: Employee[];
  date: dayjs.Dayjs;
  onCellPress: (employeeIndex: number, dayIndex: number) => void;
  selectedCell: { dayIndex: number; employeeIndex: number } | null;
  selectedDate?: dayjs.Dayjs | null;
}

export const ScheduleWeekContent = memo(function ScheduleWeekContent({
  date,
  activeEmployees,
  selectedCell,
  selectedDate,
  onCellPress,
}: ScheduleWeekContentProps) {
  const { data: scheduleEntries = [], isPending } = useScheduleByWeek(date);

  const startOfWeek = useMemo(() => date.startOf('isoWeek'), [date]);

  const weeklyData: EmployeeRow[] = useMemo(() => {
    return activeEmployees.map((employee) => {
      const values: (DayCell | null)[] = [];
      for (let i = 0; i < 7; i += 1) {
        const day = startOfWeek.add(i, 'day');
        const dateStr = day.format('YYYY-MM-DD');

        const entry = scheduleEntries.find(
          (e) => e.employee_id === employee.id && e.work_date === dateStr,
        );

        if (entry) {
          values.push({
            scheduleMark: entry.status.schedule_mark,
            isLocked: entry.status.is_locked,
            color: entry.status.color,
          });
        } else {
          values.push(null);
        }
      }

      return {
        id: employee.id,
        name: employee.last_name,
        values,
      };
    });
  }, [activeEmployees, scheduleEntries, startOfWeek]);

  if (isPending && scheduleEntries.length === 0) {
    return (
      <View className='h-96 items-center justify-center'>
        <CircularProgressLoader size='large' />
      </View>
    );
  }


  return (
    <ScheduleGrid
      className='mb-5'
      startDate={date}
      data={weeklyData}
      selectedCell={selectedCell}
      selectedDate={selectedDate}
      onCellPress={onCellPress}
    />
  );
});
