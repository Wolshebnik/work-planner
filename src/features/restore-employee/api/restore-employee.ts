import { supabase } from '@/shared/api/supabase';

export async function restoreEmployee(id: string) {
  const { error } = await supabase
    .from('employees')
    .update({ is_active: true })
    .eq('id', id);

  if (error) {
    throw error;
  }
}