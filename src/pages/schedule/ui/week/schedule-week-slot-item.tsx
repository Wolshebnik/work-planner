import { memo } from 'react';

import type dayjs from 'dayjs';

import type { Employee } from '@/entities/employee';

import { ScheduleWeekContent } from './schedule-week-content';

export interface ScheduleWeekSlotItemProps {
  activeEmployees: Employee[];
  date: dayjs.Dayjs;
  isCurrent: boolean;
  onCellPress: (employeeIndex: number, dayIndex: number) => void;
  selectedCell: {
    dayIndex: number;
    employeeIndex: number;
  } | null;
  selectedDate?: dayjs.Dayjs | null;
}

export const ScheduleWeekSlotItem = memo(
  function ScheduleWeekSlotItem({
    date,
    activeEmployees,
    isCurrent,
    selectedCell,
    selectedDate,
    onCellPress,
  }: ScheduleWeekSlotItemProps) {
    return (
      <ScheduleWeekContent
        date={date}
        activeEmployees={activeEmployees}
        selectedCell={isCurrent ? selectedCell : null}
        selectedDate={isCurrent ? selectedDate : null}
        onCellPress={onCellPress}
      />
    );
  },
  (prev, next) => {
    if (!prev.date.isSame(next.date, 'day')) return false;
    if (prev.activeEmployees !== next.activeEmployees) return false;
    if (prev.isCurrent !== next.isCurrent) return false;
    if (prev.selectedCell !== next.selectedCell) return false;
    if (prev.selectedDate !== next.selectedDate) return false;

    return true;
  },
);
