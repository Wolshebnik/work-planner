import { supabase } from '@/shared/api/supabase';

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

export const getScheduleStatuses = async (): Promise<ScheduleStatus[]> => {
  const { data, error } = await supabase
    .from('statuses')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
};
