import type { AvatarColor } from '@/shared/config/avatar-color';

export interface EmployeeMonthSummary {
  employeeId: string;
  monthlyHours: number;
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
  weeklyHours: (string | number)[];
}
