import { supabase } from '@/shared/api/supabase';

export async function archiveEmployee(id: string) {
  const { data, error } = await supabase
    .from('employees')
    .update({ is_active: false })
    .eq('id', id)
    .select();

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error(`Не вдалося перевести в архів працівника: запис з id "${id}" не знайдено або відхилено RLS.`);
  }
}
