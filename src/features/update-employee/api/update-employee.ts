import { supabase } from '@/shared/api/supabase';

export type UpdateEmployeeDto = {
  id: string;
  lastName?: string;
  firstName?: string;
  patronymic?: string | null;
  isActive?: boolean;
};

export async function updateEmployee(dto: UpdateEmployeeDto) {
  const { id, ...fields } = dto;

  const { data, error } = await supabase
    .from('employees')
    .update({
      ...(fields.lastName !== undefined && { last_name: fields.lastName.trim() }),
      ...(fields.firstName !== undefined && { first_name: fields.firstName.trim() }),
      ...(fields.patronymic !== undefined && {
        patronymic: fields.patronymic?.trim() ?? null,
      }),
      ...(fields.isActive !== undefined && { is_active: fields.isActive }),
    })
    .eq('id', id)
    .select();

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error(
      `Не вдалося оновити працівника: запис з id "${id}" не знайдено або операцію відхилено правами доступу (RLS).`,
    );
  }
}