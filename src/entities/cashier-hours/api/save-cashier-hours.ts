import { supabase } from '@/shared/api/supabase';

export async function createCashierHours(
  employeeId: string,
  year: number,
  month: number,
  cashierHours: number,
) {
  const { data, error } = await supabase
    .from('employee_monthly_stats')
    .insert({
      employee_id: employeeId,
      year,
      month,
      cashier_hours: cashierHours,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateCashierHours(
  employeeId: string,
  year: number,
  month: number,
  cashierHours: number,
) {
  const { data, error } = await supabase
    .from('employee_monthly_stats')
    .update({
      cashier_hours: cashierHours,
    })
    .eq('employee_id', employeeId)
    .eq('year', year)
    .eq('month', month)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function saveCashierHours(
  employeeId: string,
  year: number,
  month: number,
  cashierHours: number,
  exists = false,
) {
  if (exists) {
    return updateCashierHours(employeeId, year, month, cashierHours);
  }
  return createCashierHours(employeeId, year, month, cashierHours);
}
