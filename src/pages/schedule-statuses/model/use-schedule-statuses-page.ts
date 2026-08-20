import { useState } from 'react';

import {
  type ScheduleStatus,
  useAddScheduleStatus,
  useArchiveScheduleStatus,
  useUpdateScheduleStatus,
} from '@/entities/schedule-status';
import type { FormValues } from '@/features/edit-schedule-status';

export function useScheduleStatusesPage() {
  const addStatus = useAddScheduleStatus();
  const updateStatus = useUpdateScheduleStatus();
  const archiveStatus = useArchiveScheduleStatus();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingStatus, setEditingStatus] = useState<FormValues | null>(null);
  const [deletingStatus, setDeletingStatus] = useState<ScheduleStatus | null>(
    null,
  );

  const handleClose = (): void => {
    setEditingId(null);
    setIsAdding(false);
    setEditingStatus(null);
    setDeletingStatus(null);
  };

  const handleOpenAdd = (): void => {
    setEditingId(null);
    setEditingStatus(null);
    setIsAdding(true);
  };

  const handleSave = async (data: FormValues): Promise<void> => {
    const currentEditingId = editingId;
    handleClose();

    if (currentEditingId) {
      updateStatus.mutate({
        id: currentEditingId,
        name: data.name,
        description: data.description,
        scheduleMark: data.scheduleMark,
        excelMark: data.excelMark,
        color: data.color,
        isLocked: data.isLocked,
        isActive: true,
      });
    } else {
      addStatus.mutate({
        name: data.name,
        description: data.description,
        scheduleMark: data.scheduleMark,
        excelMark: data.excelMark,
        color: data.color,
        isLocked: data.isLocked,
        isActive: true,
      });
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (deletingStatus) {
      const statusId = deletingStatus.id;
      handleClose();
      archiveStatus.mutate(statusId);
    } else {
      handleClose();
    }
  };

  const handleStatusPress = (status: ScheduleStatus): void => {
    setEditingId(status.id);
    setIsAdding(false);
    setEditingStatus({
      name: status.name,
      description: status.description ?? '',
      scheduleMark: status.schedule_mark ?? '',
      excelMark: status.excel_mark ?? '',
      color: status.color ?? '#E1E2E5',
      isLocked: status.is_locked ?? false,
    });
  };

  const isSheetOpen = editingId !== null || isAdding;
  const isEditing = editingId !== null;

  return {
    editingId,
    editingStatus,
    deletingStatus,
    setDeletingStatus,
    isSheetOpen,
    isEditing,
    isArchivePending: archiveStatus.isPending,
    handleClose,
    handleOpenAdd,
    handleSave,
    handleDelete,
    handleStatusPress,
  };
}
