import { supabase } from '@/shared/api/supabase';

export type AddScheduleStatusInput = {
  color?: string | null;
  description?: string | null;
  excelMark?: string | null;
  isActive?: boolean;
  isLocked?: boolean;
  name: string;
  scheduleMark?: string | null;
};

export async function addScheduleStatus(input: AddScheduleStatusInput) {
  const { data: lastStatus, error: orderError } = await supabase
    .from('statuses')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (orderError) {
    throw new Error(orderError.message);
  }

  const nextSortOrder = (lastStatus?.sort_order ?? 0) + 1;

  const { error } = await supabase.from('statuses').insert({
    name: input.name.trim(),
    description: input.description?.trim() ?? null,
    schedule_mark: input.scheduleMark?.trim() ?? null,
    excel_mark: input.excelMark?.trim() ?? null,
    color: input.color ?? '#E1E2E5',
    is_locked: input.isLocked ?? false,
    is_active: input.isActive ?? true,
    sort_order: nextSortOrder,
  });

  if (error) {
    throw new Error(error.message);
  }
}
