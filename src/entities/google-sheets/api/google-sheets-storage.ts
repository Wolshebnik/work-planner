import AsyncStorage from '@react-native-async-storage/async-storage';

import { type GoogleSheetItem } from '../model/types';

const STORAGE_KEY = '@work_planner_google_sheets';

export async function getGoogleSheets(): Promise<GoogleSheetItem[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    return JSON.parse(json) as GoogleSheetItem[];
  } catch {
    return [];
  }
}

export async function saveGoogleSheets(
  items: GoogleSheetItem[],
): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export async function addGoogleSheet(data: {
  title: string;
  url: string;
}): Promise<GoogleSheetItem> {
  const current = await getGoogleSheets();
  const newItem: GoogleSheetItem = {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
    title: data.title.trim(),
    url: data.url.trim(),
    createdAt: new Date().toISOString(),
  };

  const updated = [newItem, ...current];
  await saveGoogleSheets(updated);
  return newItem;
}

export async function updateGoogleSheet(
  id: string,
  data: {
    title: string;
    url: string;
  },
): Promise<GoogleSheetItem> {
  const current = await getGoogleSheets();
  const index = current.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error('Google Sheet item not found');
  }

  const existing = current[index];
  if (!existing) {
    throw new Error('Google Sheet item not found');
  }

  const updatedItem: GoogleSheetItem = {
    ...existing,
    title: data.title.trim(),
    url: data.url.trim(),
  };

  const updated = [...current];
  updated[index] = updatedItem;

  await saveGoogleSheets(updated);
  return updatedItem;
}

export async function deleteGoogleSheet(id: string): Promise<void> {
  const current = await getGoogleSheets();
  const updated = current.filter((item) => item.id !== id);
  await saveGoogleSheets(updated);
}
