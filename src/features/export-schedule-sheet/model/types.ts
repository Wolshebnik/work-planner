import type dayjs from 'dayjs';

export interface ExportPeriodOption {
  endDate: dayjs.Dayjs;
  monthKey: string;
  monthLabel: string;
  startDate: dayjs.Dayjs;
  weekLabel: string;
}

export interface CheckPeriodParams {
  endDate: dayjs.Dayjs;
  monthLabel: string;
  startDate: dayjs.Dayjs;
}
