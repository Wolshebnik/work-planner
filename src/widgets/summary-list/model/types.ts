import type { AvatarColor } from '@/shared/config/avatar-color';

export interface EmployeeMonthSummary {
  employeeId: string;
  monthlyHours: number;
  weeklyHours: number[];
}

export interface EmployeeSummaryItem {
  avatarColor?: AvatarColor;
  id: string;
  initials: string;
  monthlyHours: number;
  name: string;
  weeklyHours: number[];
}
