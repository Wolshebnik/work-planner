import { supabase } from '@/shared/api/supabase';

export type UpdateStatusDto = {
  id: string;
  name?: string;
  description?: string | null;
  scheduleMark?: string | null;
  excelMark?: string | null;
  color?: string | null;
  isLocked?: boolean;
  isActive?: boolean;
  sortOrder?: number;
};

export const updateStatus = async ({
  id,
  name,
  description,
  scheduleMark,
  excelMark,
  color,
  isLocked,
  isActive,
  sortOrder,
}: UpdateStatusDto) => {
  const { data, error } = await supabase
    .from('statuses')
    .update({
      ...(name !== undefined && { name: name.trim() }),
      ...(description !== undefined && {
        description: description?.trim() || null,
      }),
      ...(scheduleMark !== undefined && {
        schedule_mark: scheduleMark?.trim() || null,
      }),
      ...(excelMark !== undefined && {
        excel_mark: excelMark?.trim() || null,
      }),
      ...(color !== undefined && { color }),
      ...(isLocked !== undefined && { is_locked: isLocked }),
      ...(isActive !== undefined && { is_active: isActive }),
      ...(sortOrder !== undefined && { sort_order: sortOrder }),
    })
    .eq('id', id)
    .select();

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error(
      `Не вдалося оновити статус: запис з id "${id}" не знайдено або операцію відхилено правами доступу (RLS).`,
    );
  }
};