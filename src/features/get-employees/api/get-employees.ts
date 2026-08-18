import { type Employee, employeesSchema } from '@/entities/employee';
import { supabase } from '@/shared/api/supabase';

export async function getEmployees(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    throw error;
  }

  return employeesSchema.parse(data ?? []);
}
