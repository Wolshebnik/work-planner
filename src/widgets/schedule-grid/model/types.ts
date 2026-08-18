import type dayjs from 'dayjs';

export interface DayCell {
  color?: string | null;
  isLocked?: boolean;
  scheduleMark?: string | null;
}

export interface EmployeeRow {
  id?: string;
  name: string;
  values: (DayCell | null)[];
}

export interface WeekDay {
  date: dayjs.Dayjs;
  isToday: boolean;
  label: string;
  number: string;
}
