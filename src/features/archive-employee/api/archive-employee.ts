import { supabase } from '@/shared/api/supabase';

export async function archiveEmployee(id: string) {
  const { error } = await supabase
    .from('employees')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    throw error;
  }
}