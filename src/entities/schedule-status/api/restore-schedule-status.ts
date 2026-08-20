import { supabase } from '@/shared/api/supabase';

export async function restoreScheduleStatus(id: string): Promise<void> {
  const { error } = await supabase
    .from('statuses')
    .update({ is_active: true })
    .eq('id', id);

  if (error) {
    throw error;
  }
}
