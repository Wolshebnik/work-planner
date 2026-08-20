import { supabase } from '@/shared/api/supabase';

export type ReorderScheduleStatusItem = {
  id: string;
  sort_order: number;
};

export async function reorderScheduleStatuses(
  items: ReorderScheduleStatusItem[],
): Promise<void> {
  const results = await Promise.all(
    items.map(({ id, sort_order }) =>
      supabase
        .from('statuses')
        .update({ sort_order })
        .eq('id', id),
    ),
  );

  const failedResult = results.find((res) => res.error);
  if (failedResult?.error) {
    throw failedResult.error;
  }
}
