import { useState } from 'react';

import {
  type GoogleSheetItem,
  useAddGoogleSheet,
  useDeleteGoogleSheet,
  useGoogleSheets,
  useUpdateGoogleSheet,
} from '@/entities/google-sheets';
import type { ConnectGoogleSheetFormValues } from '@/features/connect-google-sheet';
import { useSendWeekSchedule } from '@/features/send-google-sheet-schedule';
import { useSyncGoogleSheets } from '@/features/sync-google-sheets';
import { showToast } from '@/shared/ui/toast';

export function useGoogleSheetsPage() {
  const { data: sheets = [], isLoading } = useGoogleSheets();
  const addSheetMutation = useAddGoogleSheet();
  const updateSheetMutation = useUpdateGoogleSheet();
  const deleteSheetMutation = useDeleteGoogleSheet();

  const { sync, isSyncing } = useSyncGoogleSheets();
  const { send, isSending } = useSendWeekSchedule();

  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<GoogleSheetItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<GoogleSheetItem | null>(null);

  const targetSheet = sheets[0] ?? null;

  const handleSync = () => sync(targetSheet);
  const handleSend = () => send(targetSheet);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsAdding(true);
  };

  const handleOpenEdit = (item: GoogleSheetItem) => {
    setIsAdding(false);
    setEditingItem(item);
  };

  const handleCloseSheet = () => {
    setIsAdding(false);
    setEditingItem(null);
  };

  const handleSave = async (data: ConnectGoogleSheetFormValues) => {
    if (editingItem) {
      await updateSheetMutation.mutateAsync({
        id: editingItem.id,
        data: { title: data.title, url: data.url },
      });
      showToast({
        type: 'success',
        text1: 'Таблицю оновлено',
      });
    } else {
      await addSheetMutation.mutateAsync({
        title: data.title,
        url: data.url,
      });
      showToast({
        type: 'success',
        text1: 'Google Таблицю додано',
      });
    }
    handleCloseSheet();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    const itemId = deletingItem.id;
    setDeletingItem(null);
    await deleteSheetMutation.mutateAsync(itemId);
    showToast({
      type: 'success',
      text1: 'Таблицю видалено',
    });
  };

  return {
    sheets,
    isLoading,
    isSyncing,
    isSending,
    isSheetOpen: isAdding || editingItem !== null,
    editingItem,
    deletingItem,
    isDeleting: deleteSheetMutation.isPending,
    handleSync,
    handleSend,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseSheet,
    handleSave,
    setDeletingItem,
    handleDeleteConfirm,
  };
}
