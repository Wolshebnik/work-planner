import {
  type CashierHoursItem,
  cashierHoursItemsSchema,
} from '../model/schema';
import { supabase } from '@/shared/api/supabase';

export async function getCashierHours(
  year: number,
  month: number,
): Promise<CashierHoursItem[]> {
  const { data, error } = await supabase
    .from('employee_monthly_stats')
    .select('employee_id, year, month, cashier_hours')
    .eq('year', year)
    .eq('month', month);

  if (error) {
    throw error;
  }

  return cashierHoursItemsSchema.parse(data ?? []);
}
