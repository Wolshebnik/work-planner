import type dayjs from 'dayjs';

export interface CalendarDay {
  date: dayjs.Dayjs;
  label: string;
  number: string;
  isToday: boolean;
  isWeekend: boolean;
  isCurrentMonth: boolean;
}
