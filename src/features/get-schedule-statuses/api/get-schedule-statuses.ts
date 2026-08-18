import { supabase } from '@/shared/api/supabase';

export interface ScheduleStatus {
  id: string;
  code: string | null;
  name: string;
  description: string | null;
  schedule_mark: string | null;
  excel_mark: string | null;
  color: string | null;
  hours: number | null;
  is_locked: boolean;
  is_system: boolean;
  is_active: boolean;
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