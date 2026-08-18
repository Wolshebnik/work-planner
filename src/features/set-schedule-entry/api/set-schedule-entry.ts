import { supabase } from '@/shared/api/supabase';

export type SetScheduleEntryDto = {
  employeeId: string;
  statusId: string;
  workDate: string;
};

export const setScheduleEntry = async ({
  employeeId,
  workDate,
  statusId,
}: SetScheduleEntryDto): Promise<void> => {
  const { error } = await supabase.from('schedule_entries').upsert(
    {
      employee_id: employeeId,
      work_date: workDate,
      status_id: statusId,
    },
    {
      onConflict: 'employee_id,work_date',
    },
  );

  if (error) {
    throw error;
  }
};
