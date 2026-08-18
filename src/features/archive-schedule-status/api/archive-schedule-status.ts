import { supabase } from '@/shared/api/supabase';

export async function archiveScheduleStatus(id: string): Promise<void> {
  const { error } = await supabase
    .from('statuses')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    throw error;
  }
}
