import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  addGoogleSheet,
  deleteGoogleSheet,
  getGoogleSheets,
  updateGoogleSheet,
} from '../api/google-sheets-storage';
import { type GoogleSheetItem } from './types';

export const googleSheetsQueryKey = ['google-sheets'] as const;

export function useGoogleSheets() {
  return useQuery<GoogleSheetItem[]>({
    queryKey: googleSheetsQueryKey,
    queryFn: getGoogleSheets,
  });
}

export function useAddGoogleSheet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addGoogleSheet,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: googleSheetsQueryKey });
    },
  });
}

export function useUpdateGoogleSheet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { title: string; url: string };
    }) => updateGoogleSheet(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: googleSheetsQueryKey });
    },
  });
}

export function useDeleteGoogleSheet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGoogleSheet,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: googleSheetsQueryKey });
    },
  });
}
