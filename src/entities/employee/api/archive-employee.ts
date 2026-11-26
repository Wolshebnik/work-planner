import { supabase } from '@/shared/api/supabase';

import { appendEmployeeArchivePeriod } from '../lib/employee-archive';
import { employeeArchivePeriodsSchema } from '../model/schema';

export async function archiveEmployee(id: string, archiveDate: string) {
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

  if (!employee.is_active) {
    throw new Error('Працівник вже перебуває в архіві.');
  }

  const archivePeriods = employeeArchivePeriodsSchema.parse(
    employee.archive_periods ?? [],
  );
  const { data, error } = await supabase
    .from('employees')
    .update({
      is_active: false,
      archive_periods: appendEmployeeArchivePeriod(archivePeriods, archiveDate),
    })
    .eq('id', id)
    .eq('is_active', true)
    .select('id');

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error(`Не вдалося перевести в архів працівника: запис з id "${id}" не знайдено або змінено паралельно.`);
  }
}
