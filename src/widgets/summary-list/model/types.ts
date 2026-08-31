import type { AvatarColor } from '@/shared/config/avatar-color';

export interface EmployeeMonthSummary {
  employeeId: string;
  monthlyHours: number;
  weekLabels: string[];
  weeklyWorkDays: number[];
  weeklyHours: number[];
}

export interface EmployeeSummaryItem {
  avatarColor?: AvatarColor;
  cashTotal?: string | number;
  id: string;
  initials: string;
  monthlyHours: number;
  monthTotal?: string;
  name: string;
  weekLabels: string[];
  weeklyWorkDays: (string | number)[];
  weeklyHours: (string | number)[];
}
