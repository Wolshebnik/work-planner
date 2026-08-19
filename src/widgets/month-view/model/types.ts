import type { Employee } from '@/entities/employee';
import type { ScheduleStatus } from '@/entities/schedule-status';

export interface EmployeeDayInfo {
  employee: Employee;
  status: ScheduleStatus;
}

export interface DayEmployeeStats {
  absent: EmployeeDayInfo[];
  absentCount: number;
  working: EmployeeDayInfo[];
  workingCount: number;
}
