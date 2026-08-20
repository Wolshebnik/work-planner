import { useState } from 'react';

import {
  type GoogleSheetItem,
  useAddGoogleSheet,
  useDeleteGoogleSheet,
  useGoogleSheets,
  useUpdateGoogleSheet,
} from '@/entities/google-sheets';
import type { ConnectGoogleSheetFormValues } from '@/features/connect-google-sheet';
import { showToast } from '@/shared/ui/toast';

export function useGoogleSheetsPage() {
  const { data: sheets = [], isLoading } = useGoogleSheets();
  const addSheetMutation = useAddGoogleSheet();
  const updateSheetMutation = useUpdateGoogleSheet();
  const deleteSheetMutation = useDeleteGoogleSheet();

  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<GoogleSheetItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<GoogleSheetItem | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<GoogleSheetItem | null>(null);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setSelectedSheet(null);
    setIsAdding(true);
  };

  const handleOpenEdit = (item: GoogleSheetItem) => {
    setSelectedSheet(null);
    setIsAdding(false);
    setEditingItem(item);
  };

  const handleOpenDetails = (item: GoogleSheetItem) => {
    setSelectedSheet(item);
  };

  const handleCloseDetails = () => {
    setSelectedSheet(null);
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
    isSheetOpen: isAdding || editingItem !== null,
    editingItem,
    deletingItem,
    selectedSheet,
    isDeleting: deleteSheetMutation.isPending,
    handleOpenAdd,
    handleOpenEdit,
    handleOpenDetails,
    handleCloseDetails,
    handleCloseSheet,
    handleSave,
    setDeletingItem,
    handleDeleteConfirm,
  };
}
