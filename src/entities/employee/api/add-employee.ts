import { supabase } from '@/shared/api/supabase';

import { employeeSchema, type Employee } from '../model/schema';

export type AddEmployeeInput = {
  lastName: string;
  firstName: string;
  patronymic?: string | null;
};

export async function addEmployee(input: AddEmployeeInput): Promise<Employee> {
  const { data: lastEmployee, error: orderError } = await supabase
    .from('employees')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (orderError) {
    throw orderError;
  }

  const sortOrder = (lastEmployee?.sort_order ?? 0) + 10;

  const { data, error } = await supabase
    .from('employees')
    .insert({
      last_name: input.lastName.trim(),
      first_name: input.firstName.trim(),
      patronymic: input.patronymic?.trim() ?? null,
      is_active: true,
      sort_order: sortOrder,
    })
    .select();

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('Не вдалося додати працівника: операцію відхилено базою даних (RLS).');
  }

  return employeeSchema.parse(data[0]);
}
