import {
  type ScheduleStatus,
  scheduleStatusesSchema,
} from '@/entities/schedule-status';
import { supabase } from '@/shared/api/supabase';

export const getScheduleStatuses = async (): Promise<ScheduleStatus[]> => {
  const { data, error } = await supabase
    .from('statuses')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    throw error;
  }

  return scheduleStatusesSchema.parse(data ?? []);
};
