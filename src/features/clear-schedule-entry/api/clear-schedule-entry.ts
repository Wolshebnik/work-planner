import { supabase } from '@/shared/api/supabase';

export type ClearScheduleEntryDto = {
  employeeId: string;
  workDate: string;
};

export const clearScheduleEntry = async ({
  employeeId,
  workDate,
}: ClearScheduleEntryDto): Promise<void> => {
  const { error } = await supabase
    .from('schedule_entries')
    .delete()
    .eq('employee_id', employeeId)
    .eq('work_date', workDate);

  if (error) {
    throw error;
  }
};
