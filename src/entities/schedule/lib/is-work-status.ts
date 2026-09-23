import { getWorkHours } from './get-work-hours';

export function isWorkStatus(excelMark: string | null | undefined): boolean {
  return getWorkHours(excelMark) > 0;
}
