import { supabase } from '@/shared/api/supabase';

import { closeEmployeeArchivePeriod } from '../lib/employee-archive';
import { employeeArchivePeriodsSchema } from '../model/schema';

export async function restoreEmployee(id: string, restoreDate: string) {
  const { data: employee, error: readError } = await supabase
    .from('employees')
    .select('is_active, archive_periods')
    .eq('id', id)
    .maybeSingle();

  if (readError) {
    throw readError;
  }

  if (!employee) {
    throw new Error(`Працівника з id "${id}" не знайдено або доступ заборонено.`);
  }

  if (employee.is_active) {
    throw new Error('Працівник вже активний.');
  }

  const archivePeriods = employeeArchivePeriodsSchema.parse(
    employee.archive_periods ?? [],
  );
  const { data, error } = await supabase
    .from('employees')
    .update({
      is_active: true,
      archive_periods: closeEmployeeArchivePeriod(archivePeriods, restoreDate),
    })
    .eq('id', id)
    .eq('is_active', false)
    .select('id');

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error(`Не вдалося відновити працівника: запис з id "${id}" не знайдено або змінено паралельно.`);
  }
}
