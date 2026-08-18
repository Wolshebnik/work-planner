import type dayjs from 'dayjs';

export interface DayCell {
  isLocked?: boolean;
  short: string;
}
export interface EmployeeValue extends DayCell {
  date: string;
}
export interface EmployeeRow {
  name: string;
  values: DayCell[];
}
export interface EmployeeRow1 {
  id: string;
  name: string;
  values: EmployeeValue[];
}
export interface WeekDay {
  date: dayjs.Dayjs;
  isToday: boolean;
  label: string;
  number: string;
}
