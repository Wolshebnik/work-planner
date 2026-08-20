import { supabase } from '@/shared/api/supabase';

export async function restoreEmployee(id: string) {
  const { data, error } = await supabase
    .from('employees')
    .update({ is_active: true })
    .eq('id', id)
    .select();

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error(`Не вдалося відновити працівника: запис з id "${id}" не знайдено або відхилено RLS.`);
  }
}