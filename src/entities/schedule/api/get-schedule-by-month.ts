import dayjs from 'dayjs';

import {
  type ScheduleEntry,
  scheduleEntriesSchema,
} from '../model/schema';
import { supabase } from '@/shared/api/supabase';

export async function getScheduleByMonth(
  month: dayjs.Dayjs | string,
): Promise<ScheduleEntry[]> {
  const monthDate = typeof month === 'string' ? dayjs(month) : month;
  const startDate = monthDate.startOf('month').format('YYYY-MM-DD');
  const endDate = monthDate.endOf('month').format('YYYY-MM-DD');

  const { data, error } = await supabase
    .from('schedule_entries')
    .select(`
      id,
      employee_id,
      work_date,
      status_id,
      status:statuses (
        id,
        name,
        description,
        schedule_mark,
        excel_mark,
        color,
        is_locked,
        is_system,
        is_active,
        sort_order
      )
    `)
    .gte('work_date', startDate)
    .lte('work_date', endDate)
    .order('work_date', { ascending: true });

  if (error) {
    throw error;
  }

  return scheduleEntriesSchema.parse(data ?? []);
}
