import { memo, useMemo } from 'react';

import type dayjs from 'dayjs';
import { View } from 'react-native';

import type { Employee } from '@/entities/employee';
import { useScheduleByMonth } from '@/features/get-schedule-by-month';
import type { AvatarColor } from '@/shared/config/avatar-color';
import { getEmployeeAvatarColor } from '@/shared/config/get-avatar-color';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import {
  buildMonthSummaries,
  type EmployeeSummaryItem,
  SummaryList,
} from '@/widgets/summary-list';

interface ScheduleSummaryContentProps {
  activeEmployees: Employee[];
  colorMap: Map<string, AvatarColor>;
  date: dayjs.Dayjs;
}

export const ScheduleSummaryContent = memo(function ScheduleSummaryContent({
  date,
  activeEmployees,
  colorMap,
}: ScheduleSummaryContentProps) {
  const {
    data: scheduleEntries,
    isPending,
    isLoading,
    isFetching,
  } = useScheduleByMonth(date);

  const summaries = useMemo(
    () => buildMonthSummaries(activeEmployees, scheduleEntries ?? [], date),
    [activeEmployees, scheduleEntries, date],
  );

  const summaryEmployees: EmployeeSummaryItem[] = useMemo(() => {
    return summaries.map((summary) => {
      const employee = activeEmployees.find((e) => e.id === summary.employeeId);
      const name = employee
        ? [employee.last_name, employee.first_name]
            .filter(Boolean)
            .join(' ')
        : '';
      const initials = employee
        ? [employee.last_name, employee.first_name]
            .filter(Boolean)
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : '';

      return {
        id: summary.employeeId,
        name,
        initials,
        avatarColor: getEmployeeAvatarColor(summary.employeeId, colorMap),
        weeklyHours: summary.weeklyHours,
        monthlyHours: summary.monthlyHours,
      };
    });
  }, [summaries, activeEmployees, colorMap]);

  const monthLabel = useMemo(() => {
    return (
      date.format('MMMM').charAt(0).toUpperCase() +
      date.format('MMMM').slice(1) +
      ' ' +
      date.format('YYYY')
    );
  }, [date]);

  if (
    isPending ||
    isLoading ||
    !scheduleEntries ||
    (isFetching && scheduleEntries.length === 0)
  ) {
    return (
      <View className='h-96 items-center justify-center'>
        <CircularProgressLoader size='large' />
      </View>
    );
  }


  return (
    <SummaryList
      employees={summaryEmployees}
      monthLabel={monthLabel}
      className='px-4'
    />
  );
});
