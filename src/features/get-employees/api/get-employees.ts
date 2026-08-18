import { supabase } from '@/shared/api/supabase';

export type Employee = {
  created_at: string;
  first_name: string;
  id: string;
  is_active: boolean;
  last_name: string;
  patronymic: string | null;
  sort_order: number;
};

export async function getEmployees(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}
