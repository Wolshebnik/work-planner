import { supabase } from '@/shared/api/supabase';

export type AddEmployeeInput = {
  lastName: string;
  firstName: string;
  patronymic?: string | null;
};

export async function addEmployee(input: AddEmployeeInput) {
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

  const { error } = await supabase.from('employees').insert({
    last_name: input.lastName.trim(),
    first_name: input.firstName.trim(),
    patronymic: input.patronymic?.trim() ?? null,
    is_active: true,
    sort_order: sortOrder,
  });

  if (error) {
    throw error;
  }
}