export interface ScheduleStatus {
  color: string | null;
  description: string | null;
  excel_mark: string | null;
  hours: number | null;
  id: string;
  is_active: boolean;
  is_locked: boolean;
  is_system: boolean;
  name: string;
  schedule_mark: string | null;
  sort_order: number;
}
